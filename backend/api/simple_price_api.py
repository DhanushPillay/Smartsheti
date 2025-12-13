#!/usr/bin/env python3
"""
Simple Price API for SmartSheti
Serves current market prices with CORS support
Now uses REAL data from data.gov.in API

Run: python simple_price_api.py

Environment Variables:
    DATA_GOV_IN_API_KEY: Your data.gov.in API key (optional, has default)
"""

from flask import Flask, jsonify, send_from_directory, request
from flask_cors import CORS
import json
import os
import sys
from datetime import datetime
import requests

# Add parent directory to path for imports
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'python'))

# Try to import the real scraper
try:
    from real_agmarknet_scraper import RealAGMARKNETScraper
    REAL_SCRAPER_AVAILABLE = True
except ImportError:
    REAL_SCRAPER_AVAILABLE = False

# Load API key from environment variable (with fallback)
# IMPORTANT: Set DATA_GOV_IN_API_KEY environment variable for production
DATA_GOV_IN_API_KEY = os.environ.get(
    'DATA_GOV_IN_API_KEY', 
    '579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b'  # Default public key (rate limited)
)

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
def get_crop_price(crop: str):
    """Get price for a specific crop"""
    try:
        data = get_prices_data()
        
        # Normalize crop name
        crop_lower = crop.lower()
        
        if crop_lower in data:
            crop_data = data[crop_lower]
            if isinstance(crop_data, dict):
                price_list = crop_data.get('data', [])
                current_price = price_list[-1] if price_list else None
                per_kg = crop_data.get('perKg', current_price / 100 if current_price else None)
                
                return jsonify({
                    'success': True,
                    'crop': crop,
                    'currentPrice': current_price,
                    'current_price': per_kg,  # Per kg for frontend
                    'perKg': per_kg,
                    'unit': crop_data.get('unit', '₹/quintal'),
                    'priceHistory': price_list,
                    'historical_prices': [round(p / 100, 2) for p in price_list],  # Per kg history
                    'labels': crop_data.get('labels', []),
                    'state': crop_data.get('state', 'Maharashtra'),
                    'source': crop_data.get('source', data.get('source', 'AGMARKNET')),
                    'lastUpdated': data.get('lastUpdated', datetime.now().isoformat())
                })
            else:
                return jsonify({
                    'error': f'Unexpected data format for {crop}',
                    'received_type': type(crop_data).__name__
                }), 500
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
        'pricesFileExists': os.path.exists(PRICES_FILE) or os.path.exists(DATA_PRICES_FILE),
        'realScraperAvailable': REAL_SCRAPER_AVAILABLE,
        'apiKeyConfigured': bool(os.environ.get('DATA_GOV_IN_API_KEY'))
    })

@app.route('/api/live-price/<crop>', methods=['GET'])
def get_live_price(crop: str):
    """
    Get LIVE price for a crop using real data.gov.in API
    This endpoint fetches fresh data directly from the government API
    """
    if not REAL_SCRAPER_AVAILABLE:
        return jsonify({
            'success': False,
            'error': 'Real scraper not available',
            'fallback': 'Use /api/realprice/<crop> instead'
        }), 503
    
    try:
        scraper = RealAGMARKNETScraper(DATA_GOV_IN_API_KEY)
        state = request.args.get('state', 'Maharashtra')
        
        price_data = scraper.get_price_with_fallback(crop, state)
        
        return jsonify({
            'success': True,
            'data': price_data,
            'isRealData': price_data.get('source') == 'REAL_API',
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e),
            'crop': crop
        }), 500

@app.route('/api/update-prices', methods=['POST'])
def update_prices():
    """
    Trigger a price update using real AGMARKNET data
    This will fetch fresh data from data.gov.in and update prices.json
    """
    if not REAL_SCRAPER_AVAILABLE:
        return jsonify({
            'success': False,
            'error': 'Real scraper not available'
        }), 503
    
    try:
        scraper = RealAGMARKNETScraper(DATA_GOV_IN_API_KEY)
        success = scraper.update_prices_json(PRICES_FILE)
        
        return jsonify({
            'success': success,
            'message': 'Prices updated with real data from data.gov.in' if success else 'Update failed',
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/api/realprice/<crop>', methods=['GET'])
def real_price_proxy(crop: str):
    """Proxy to fetch real prices from data.gov.in (avoids CORS in browser)"""
    # Use API key from environment variable (secure) or request param
    api_key = request.args.get('api_key') or DATA_GOV_IN_API_KEY
    state = request.args.get('state')  # optional
    limit = request.args.get('limit', '30')

    # Government dataset resource id for agri market prices
    resource_id = '9ef84268-d588-465a-a308-a864a43d0070'

    # Normalize crop name for query
    commodity = crop.strip()
    commodity_title = commodity.title()

    base_url = 'https://api.data.gov.in/resource/' + resource_id

    def build_params(commodity_value: str):
        params: dict[str, str] = {
            'api-key': api_key,
            'format': 'json',
            'limit': limit,
            'filters[commodity]': commodity_value
        }
        if state:
            params['filters[state]'] = state
        return params

    def fetch(params: dict[str, str]):
        try:
            r = requests.get(base_url, params=params, timeout=10)
            return r.status_code, r.json() if r.headers.get('Content-Type','').startswith('application/json') else {'error':'Non-JSON response', 'raw': r.text}
        except Exception as e:
            return 599, {'error': str(e)}

    # Try title-cased commodity first
    status_code, data = fetch(build_params(commodity_title))

    # Fallback: try lower-case commodity if no records
    if (status_code == 200 and not data.get('records')):
        status_code, data = fetch(build_params(commodity.lower()))

    # Fallback: try upper-case commodity if still empty
    if (status_code == 200 and not data.get('records')):
        status_code, data = fetch(build_params(commodity.upper()))

    if status_code != 200:
        return jsonify({
            'success': False,
            'error': data.get('error', 'Failed to fetch'),
            'status_code': status_code,
            'crop': crop,
            'state': state,
            'source': 'data.gov.in'
        }), 502

    records = data.get('records', [])
    if not records:
        return jsonify({
            'success': False,
            'message': 'No records found',
            'crop': crop,
            'state': state,
            'source': 'data.gov.in'
        })

    # Extract per-kg prices from modal_price
    historical_prices = []
    markets = []
    for rec in records:
        modal_raw = rec.get('modal_price')
        unit = (rec.get('unit') or '').lower()
        try:
            modal_val = float(modal_raw)
        except (TypeError, ValueError):
            continue
        # Convert unit to kg
        if 'quintal' in unit:
            per_kg = modal_val / 100.0
        elif 'ton' in unit:
            per_kg = modal_val / 1000.0
        else:
            per_kg = modal_val  # assume already per kg
        per_kg_rounded = round(per_kg, 2)
        historical_prices.append(per_kg_rounded)
        markets.append({
            'market': rec.get('market'),
            'district': rec.get('district'),
            'state': rec.get('state'),
            'price_per_kg': per_kg_rounded,
            'arrival_date': rec.get('arrival_date')
        })

    if not historical_prices:
        return jsonify({
            'success': False,
            'message': 'No valid price entries',
            'crop': crop,
            'state': state,
            'source': 'data.gov.in'
        })

    current_price = historical_prices[0]
    # Build a simplified market comparison (top 5 distinct markets)
    market_comparison = []
    seen = set()
    for m in markets:
        name = m.get('market') or m.get('district') or 'Unknown'
        if name not in seen:
            market_comparison.append({'name': name, 'price': m['price_per_kg']})
            seen.add(name)
        if len(market_comparison) == 5:
            break
    # Ensure exactly 5 entries
    while len(market_comparison) < 5:
        market_comparison.append({'name': f'Market {len(market_comparison)+1}', 'price': current_price})

    return jsonify({
        'success': True,
        'crop': crop.lower(),
        'source': 'DATA_GOV_IN',
        'unit': '₹/kg',
        'current_price': round(current_price, 2),
        'historical_prices': historical_prices[:8],  # first 8 recent entries
        'market_comparison': market_comparison,
        'record_count': len(records),
        'state_filter': state,
        'timestamp': datetime.now().isoformat()
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
