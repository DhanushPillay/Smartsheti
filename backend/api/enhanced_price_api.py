#!/usr/bin/env python3
"""
Enhanced Price Update API with AGMARKNET Integration
Flask API for triggering price updates using real AGMARKNET data + simulation
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import logging
import threading
import time
from datetime import datetime
import os

# Import both scrapers
import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'python'))

from dynamic_price_updater import DynamicPriceScraper
try:
    from enhanced_agmarknet_scraper import EnhancedAGMARKNETScraper
    ENHANCED_SCRAPER_AVAILABLE = True
except ImportError:
    ENHANCED_SCRAPER_AVAILABLE = False

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Setup logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Initialize scraper (prefer enhanced version if available)
if ENHANCED_SCRAPER_AVAILABLE:
    scraper = EnhancedAGMARKNETScraper()
    logger.info("🌐 Using Enhanced AGMARKNET Scraper")
    scraper_type = "Enhanced AGMARKNET + Simulation"
else:
    scraper = DynamicPriceScraper()
    logger.info("🎲 Using Standard Dynamic Scraper")
    scraper_type = "Standard Dynamic Simulation"

# Global variables for auto-update
auto_update_thread = None
auto_update_running = False

@app.route('/api/update-prices', methods=['POST'])
def update_prices():
    """Manually trigger price updates with AGMARKNET integration"""
    try:
        data = request.get_json() if request.is_json else {}
        crop = data.get('crop') if data else None
        
        logger.info(f"🔄 Manual price update requested (crop: {crop or 'all'})")
        
        if crop:
            # Update specific crop
            current_data = scraper.load_current_data()
            success = scraper.update_crop_price(current_data, crop)
            if success:
                scraper.save_data(current_data)
                return jsonify({
                    'success': True,
                    'message': f'{crop.title()} price updated successfully',
                    'scraper_type': scraper_type,
                    'timestamp': datetime.now().isoformat()
                })
            else:
                return jsonify({
                    'success': False,
                    'message': f'Failed to update {crop} price'
                }), 500
        else:
            # Update all crops
            success = scraper.update_all_prices()
            if success:
                return jsonify({
                    'success': True,
                    'message': 'All crop prices updated',
                    'scraper_type': scraper_type,
                    'agmarknet_enabled': ENHANCED_SCRAPER_AVAILABLE,
                    'timestamp': datetime.now().isoformat()
                })
            else:
                return jsonify({
                    'success': False,
                    'message': 'Failed to update prices'
                }), 500
                
    except Exception as e:
        logger.error(f"❌ Error updating prices: {e}")
        return jsonify({
            'success': False,
            'message': f'Error: {str(e)}'
        }), 500

@app.route('/api/prices', methods=['GET'])
def get_prices():
    """Get current price data"""
    try:
        if os.path.exists('prices.json'):
            with open('prices.json', 'r') as f:
                data = f.read()
                return data, 200, {'Content-Type': 'application/json'}
        else:
            return jsonify({
                'error': 'Price data not found'
            }), 404
            
    except Exception as e:
        logger.error(f"❌ Error getting prices: {e}")
        return jsonify({
            'error': f'Failed to load prices: {str(e)}'
        }), 500

@app.route('/api/status', methods=['GET'])
def get_status():
    """Get API and scraper status"""
    try:
        # Check if prices.json exists and get last update time
        last_updated = None
        if os.path.exists('prices.json'):
            import json
            with open('prices.json', 'r') as f:
                data = json.load(f)
                last_updated = data.get('lastUpdated')
        
        return jsonify({
            'status': 'running',
            'scraper_type': scraper_type,
            'agmarknet_enabled': ENHANCED_SCRAPER_AVAILABLE,
            'auto_update_running': auto_update_running,
            'last_updated': last_updated,
            'prices_file_exists': os.path.exists('prices.json'),
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        logger.error(f"❌ Error getting status: {e}")
        return jsonify({
            'error': f'Failed to get status: {str(e)}'
        }), 500

@app.route('/api/start-auto-update', methods=['POST'])
def start_auto_update():
    """Start automatic price updates"""
    global auto_update_thread, auto_update_running
    
    try:
        if auto_update_running:
            return jsonify({
                'success': False,
                'message': 'Auto-update is already running'
            })
        
        data = request.get_json() if request.is_json else {}
        interval = data.get('interval', 300)  # Default 5 minutes
        
        logger.info(f"🔄 Starting auto-update with {interval}s interval")
        
        auto_update_running = True
        auto_update_thread = threading.Thread(
            target=auto_update_worker,
            args=(interval,),
            daemon=True
        )
        auto_update_thread.start()
        
        return jsonify({
            'success': True,
            'message': f'Auto-update started with {interval}s interval',
            'scraper_type': scraper_type
        })
        
    except Exception as e:
        logger.error(f"❌ Error starting auto-update: {e}")
        return jsonify({
            'success': False,
            'message': f'Error: {str(e)}'
        }), 500

@app.route('/api/stop-auto-update', methods=['POST'])
def stop_auto_update():
    """Stop automatic price updates"""
    global auto_update_running
    
    try:
        if not auto_update_running:
            return jsonify({
                'success': False,
                'message': 'Auto-update is not running'
            })
        
        logger.info("⏹️ Stopping auto-update")
        auto_update_running = False
        
        return jsonify({
            'success': True,
            'message': 'Auto-update stopped'
        })
        
    except Exception as e:
        logger.error(f"❌ Error stopping auto-update: {e}")
        return jsonify({
            'success': False,
            'message': f'Error: {str(e)}'
        }), 500

def auto_update_worker(interval):
    """Worker function for automatic updates"""
    global auto_update_running
    
    logger.info(f"⚡ Auto-update worker started (interval: {interval}s)")
    
    while auto_update_running:
        try:
            logger.info("🔄 Auto-update: Updating prices...")
            success = scraper.update_all_prices()
            
            if success:
                logger.info("✅ Auto-update: Prices updated successfully")
            else:
                logger.error("❌ Auto-update: Price update failed")
                
        except Exception as e:
            logger.error(f"❌ Auto-update error: {e}")
        
        # Wait for the specified interval
        for _ in range(interval):
            if not auto_update_running:
                break
            time.sleep(1)
    
    logger.info("⏹️ Auto-update worker stopped")

@app.route('/api/test-agmarknet', methods=['GET'])
def test_agmarknet():
    """Test AGMARKNET connectivity"""
    try:
        if not ENHANCED_SCRAPER_AVAILABLE:
            return jsonify({
                'success': False,
                'message': 'Enhanced AGMARKNET scraper not available'
            })
        
        # Test connection
        connected = scraper.test_agmarknet_connection()
        
        return jsonify({
            'success': True,
            'agmarknet_connected': connected,
            'message': 'AGMARKNET accessible' if connected else 'AGMARKNET not accessible',
            'fallback': 'Using simulation mode' if not connected else 'Real data available'
        })
        
    except Exception as e:
        logger.error(f"❌ Error testing AGMARKNET: {e}")
        return jsonify({
            'success': False,
            'message': f'Error: {str(e)}'
        }), 500

if __name__ == '__main__':
    print("🚀 Starting Enhanced Price Updater API...")
    print("📡 Available at: http://localhost:5001")
    print(f"🌐 Scraper type: {scraper_type}")
    print("🔄 Endpoints:")
    print("   POST /api/update-prices - Manual price update")
    print("   GET  /api/prices - Get current prices")
    print("   GET  /api/status - API status")
    print("   POST /api/start-auto-update - Start auto updates")
    print("   POST /api/stop-auto-update - Stop auto updates")
    print("   GET  /api/test-agmarknet - Test AGMARKNET connection")
    
    app.run(host='0.0.0.0', port=5001, debug=True)
