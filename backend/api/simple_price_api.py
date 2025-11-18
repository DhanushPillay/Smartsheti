#!/usr/bin/env python3
"""
Simple Price API for SmartSheti
Serves current market prices with CORS support
Run: python simple_price_api.py
"""

from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
import json
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Get the correct path to prices.json
BACKEND_DIR = os.path.dirname(os.path.abspath(__file__))
PRICES_FILE = os.path.join(os.path.dirname(BACKEND_DIR), 'prices.json')
DATA_PRICES_FILE = os.path.join(os.path.dirname(os.path.dirname(BACKEND_DIR)), 'data', 'json', 'prices.json')

def get_prices_data():
    """Load price data from available sources"""
    # Try backend/prices.json first
    if os.path.exists(PRICES_FILE):
        with open(PRICES_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    
    # Try data/json/prices.json
    elif os.path.exists(DATA_PRICES_FILE):
        with open(DATA_PRICES_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    
    # Return empty data if no file found
    return {
        'lastUpdated': datetime.now().isoformat(),
        'source': 'No data available',
        'error': 'Price data file not found'
    }

@app.route('/api/prices', methods=['GET'])
def get_all_prices():
    """Get all crop prices"""
    try:
        data = get_prices_data()
        return jsonify(data)
    except Exception as e:
        return jsonify({
            'error': str(e),
            'message': 'Failed to load price data'
        }), 500

@app.route('/api/prices/<crop>', methods=['GET'])
def get_crop_price(crop):
    """Get price for a specific crop"""
    try:
        data = get_prices_data()
        
        # Normalize crop name
        crop_lower = crop.lower()
        
        if crop_lower in data:
            crop_data = data[crop_lower]
            current_price = crop_data['data'][-1] if crop_data.get('data') else None
            
            return jsonify({
                'crop': crop,
                'currentPrice': current_price,
                'unit': crop_data.get('unit', '₹/quintal'),
                'priceHistory': crop_data.get('data', []),
                'labels': crop_data.get('labels', []),
                'state': crop_data.get('state', 'Maharashtra'),
                'lastUpdated': data.get('lastUpdated', datetime.now().isoformat())
            })
        else:
            return jsonify({
                'error': f'Price data not available for {crop}',
                'availableCrops': [k for k in data.keys() if k != 'lastUpdated' and k != 'source']
            }), 404
            
    except Exception as e:
        return jsonify({
            'error': str(e),
            'message': f'Failed to get price for {crop}'
        }), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'SmartSheti Price API',
        'timestamp': datetime.now().isoformat(),
        'pricesFileExists': os.path.exists(PRICES_FILE) or os.path.exists(DATA_PRICES_FILE)
    })

@app.route('/')
def index():
    """API documentation"""
    return jsonify({
        'service': 'SmartSheti Price API',
        'version': '1.0',
        'endpoints': {
            '/api/prices': 'Get all crop prices',
            '/api/prices/<crop>': 'Get price for specific crop (e.g., /api/prices/wheat)',
            '/api/health': 'Health check'
        },
        'availableAPIs': [
            'http://localhost:5000/api/prices',
            'http://localhost:5000/api/prices/wheat',
            'http://localhost:5000/api/prices/rice',
            'http://localhost:5000/api/prices/cotton'
        ]
    })

if __name__ == '__main__':
    print("""
    ╔══════════════════════════════════════════════════════════╗
    ║         SmartSheti Price API Server                      ║
    ║                                                          ║
    ║  🌾 Serving real-time agricultural market prices        ║
    ║                                                          ║
    ║  API Endpoints:                                          ║
    ║  • http://localhost:5000/api/prices                     ║
    ║  • http://localhost:5000/api/prices/<crop>              ║
    ║  • http://localhost:5000/api/health                     ║
    ║                                                          ║
    ║  Press Ctrl+C to stop the server                        ║
    ╚══════════════════════════════════════════════════════════╝
    """)
    
    # Check if price files exist
    if os.path.exists(PRICES_FILE):
        print(f"✅ Found prices file: {PRICES_FILE}")
    elif os.path.exists(DATA_PRICES_FILE):
        print(f"✅ Found prices file: {DATA_PRICES_FILE}")
    else:
        print(f"⚠️  Warning: No prices.json file found!")
        print(f"   Looking in: {PRICES_FILE}")
        print(f"   Or: {DATA_PRICES_FILE}")
    
    print("\n🚀 Starting server on http://localhost:5000\n")
    
    app.run(host='0.0.0.0', port=5000, debug=True)
