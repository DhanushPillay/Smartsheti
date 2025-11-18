#!/usr/bin/env python3
"""
Web interface for Dynamic Price Updates
Provides HTTP endpoints to trigger price updates
"""

from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import os
import threading
import time
from dynamic_price_updater import DynamicPriceScraper
import logging

app = Flask(__name__)
CORS(app)

# Global scraper instance
scraper = DynamicPriceScraper()
update_thread = None

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.route('/api/update-prices', methods=['POST'])
def update_prices():
    """Manually trigger price updates"""
    try:
        crop = request.json.get('crop') if request.json else None
        
        if crop:
            # Update specific crop
            data = scraper.load_current_data()
            success = scraper.update_crop_price(data, crop)
            if success:
                scraper.save_data(data)
                return jsonify({
                    'success': True,
                    'message': f'Successfully updated {crop} prices',
                    'crop': crop
                })
            else:
                return jsonify({
                    'success': False,
                    'message': f'Failed to update {crop} prices'
                }), 500
        else:
            # Update all crops
            success = scraper.update_all_prices()
            return jsonify({
                'success': success,
                'message': 'All crop prices updated' if success else 'Some price updates failed'
            })
            
    except Exception as e:
        logger.error(f"Error updating prices: {e}")
        return jsonify({
            'success': False,
            'message': f'Error: {str(e)}'
        }), 500

@app.route('/api/start-auto-update', methods=['POST'])
def start_auto_update():
    """Start automatic price updates"""
    global update_thread
    
    try:
        interval = request.json.get('interval', 5) if request.json else 5
        
        if update_thread and update_thread.is_alive():
            return jsonify({
                'success': False,
                'message': 'Auto-update is already running'
            })
        
        update_thread = scraper.start_continuous_updates(interval)
        
        return jsonify({
            'success': True,
            'message': f'Auto-update started with {interval} minute interval'
        })
        
    except Exception as e:
        logger.error(f"Error starting auto-update: {e}")
        return jsonify({
            'success': False,
            'message': f'Error: {str(e)}'
        }), 500

@app.route('/api/prices', methods=['GET'])
def get_prices():
    """Get current price data"""
    try:
        if os.path.exists('prices.json'):
            with open('prices.json', 'r', encoding='utf-8') as f:
                data = json.load(f)
            return jsonify(data)
        else:
            return jsonify({
                'success': False,
                'message': 'Price data not found'
            }), 404
            
    except Exception as e:
        logger.error(f"Error getting prices: {e}")
        return jsonify({
            'success': False,
            'message': f'Error: {str(e)}'
        }), 500

@app.route('/api/status', methods=['GET'])
def get_status():
    """Get system status"""
    global update_thread
    
    return jsonify({
        'auto_update_running': update_thread and update_thread.is_alive(),
        'prices_file_exists': os.path.exists('prices.json'),
        'last_updated': get_last_updated_time(),
        'available_crops': list(scraper.base_prices.keys())
    })

def get_last_updated_time():
    """Get last updated timestamp from prices.json"""
    try:
        if os.path.exists('prices.json'):
            with open('prices.json', 'r', encoding='utf-8') as f:
                data = json.load(f)
            return data.get('lastUpdated', 'Unknown')
    except:
        pass
    return 'Unknown'

@app.route('/', methods=['GET'])
def index():
    """Root endpoint with API documentation"""
    return jsonify({
        'service': 'Dynamic Price Updater API',
        'version': '1.0.0',
        'endpoints': {
            '/api/update-prices': 'POST - Trigger manual price update',
            '/api/start-auto-update': 'POST - Start automatic updates',
            '/api/prices': 'GET - Get current price data',
            '/api/status': 'GET - Get system status'
        },
        'usage': {
            'manual_update_all': 'POST /api/update-prices',
            'manual_update_crop': 'POST /api/update-prices {"crop": "wheat"}',
            'start_auto_update': 'POST /api/start-auto-update {"interval": 5}'
        }
    })

if __name__ == '__main__':
    print("🚀 Starting Dynamic Price Updater API...")
    print("📡 Available at: http://localhost:5001")
    print("🔄 Use POST /api/update-prices to trigger updates")
    print("⚡ Use POST /api/start-auto-update to enable continuous updates")
    
    app.run(
        host='0.0.0.0',
        port=5001,
        debug=True,
        threaded=True
    )
