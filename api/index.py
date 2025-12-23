from flask import Flask, jsonify, request
from flask_cors import CORS
import os
import sys
import json
import logging
from datetime import datetime
import requests

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Add backend directories to sys.path
current_dir = os.path.dirname(os.path.abspath(__file__))
backend_dir = os.path.join(os.path.dirname(current_dir), 'backend')
python_dir = os.path.join(backend_dir, 'python')
sys.path.append(backend_dir)
sys.path.append(python_dir)

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Environment variables
DATA_GOV_IN_API_KEY = os.environ.get(
    'DATA_GOV_IN_API_KEY', 
    '579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b'
)

# Import functionalities
try:
    from python.simple_price_api import PriceChartGenerator
    price_generator = PriceChartGenerator()
    logger.info("✅ PriceChartGenerator initialized")
except ImportError as e:
    logger.error(f"❌ Failed to import PriceChartGenerator: {e}")
    # Try alternate import path
    try:
        from price_chart_generator import PriceChartGenerator
        price_generator = PriceChartGenerator()
        logger.info("✅ PriceChartGenerator initialized (fallback path)")
    except ImportError as e2:
        logger.error(f"❌ Failed to import PriceChartGenerator (fallback): {e2}")
        price_generator = None

try:
    from api.translation_api import TranslationService
    translator = TranslationService()
    logger.info("✅ TranslationService initialized")
except ImportError as e:
    logger.error(f"❌ Failed to import TranslationService: {e}")
    translator = None

try:
    from real_agmarknet_scraper import RealAGMARKNETScraper
    REAL_SCRAPER_AVAILABLE = True
    logger.info("✅ RealAGMARKNETScraper initialized")
except ImportError as e:
    logger.error(f"❌ Failed to import RealAGMARKNETScraper: {e}")
    REAL_SCRAPER_AVAILABLE = False

# Helper functions for Price API
PRICES_FILE = os.path.join(backend_dir, 'prices.json')
DATA_PRICES_FILE = os.path.join(os.path.dirname(backend_dir), 'data', 'json', 'prices.json')

def get_prices_data():
    """Load price data from available sources"""
    if os.path.exists(PRICES_FILE):
        with open(PRICES_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    elif os.path.exists(DATA_PRICES_FILE):
        with open(DATA_PRICES_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    return {
        'lastUpdated': datetime.now().isoformat(),
        'source': 'No data available',
        'error': 'Price data file not found'
    }

# --- Routes ---

@app.route('/api/price-data', methods=['GET'])
def get_price_data():
    """Endpoint to get price data for charts"""
    if not price_generator:
        return jsonify({'success': False, 'error': 'Price service unavailable'}), 503
        
    try:
        crop = request.args.get('crop', 'wheat')
        state = request.args.get('state', 'Maharashtra')
        market = request.args.get('market', 'Pune APMC')
        
        logger.info(f"Price request: {crop}, {state}, {market}")
        data = price_generator.get_market_data(crop, state, market)
        
        if isinstance(data, dict):
            return jsonify(data)
        else:
            return jsonify({'success': False, 'error': 'Invalid data format'}), 500
            
    except Exception as e:
        logger.error(f"Price API error: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/translate', methods=['POST'])
def translate():
    """Endpoint to translate text"""
    if not translator:
        return jsonify({'success': False, 'error': 'Translation service unavailable'}), 503
        
    try:
        data = request.json
        text = data.get('text', '')
        source = data.get('source', 'en')
        target = data.get('target', 'hi')
        
        if not text:
            return jsonify({'success': False, 'error': 'Text is required'}), 400
            
        translated = translator.translate_text(text, source_lang=source, target_lang=target)
        
        return jsonify({
            'success': True,
            'original': text,
            'translated': translated,
            'source': source,
            'target': target
        })
    except Exception as e:
        logger.error(f"Translation API error: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/prices', methods=['GET'])
def get_all_prices():
    """Get all crop prices"""
    try:
        data = get_prices_data()
        return jsonify(data)
    except Exception as e:
        return jsonify({'error': str(e), 'message': 'Failed to load price data'}), 500

@app.route('/api/prices/<crop>', methods=['GET'])
def get_crop_price(crop: str):
    """Get price for a specific crop"""
    try:
        data = get_prices_data()
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
                    'current_price': per_kg,
                    'perKg': per_kg,
                    'unit': crop_data.get('unit', '₹/quintal'),
                    'priceHistory': price_list,
                    'historical_prices': [round(p / 100, 2) for p in price_list],
                    'labels': crop_data.get('labels', []),
                    'state': crop_data.get('state', 'Maharashtra'),
                    'source': crop_data.get('source', data.get('source', 'AGMARKNET')),
                    'lastUpdated': data.get('lastUpdated', datetime.now().isoformat())
                })
            else:
                return jsonify({'error': f'Unexpected data format for {crop}'}), 500
        else:
            return jsonify({'error': f'Price data not available for {crop}'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/realprice/<crop>', methods=['GET'])
def real_price_proxy(crop: str):
    """Proxy to fetch real prices from data.gov.in"""
    api_key = request.args.get('api_key') or DATA_GOV_IN_API_KEY
    state = request.args.get('state')
    limit = request.args.get('limit', '30')
    resource_id = '9ef84268-d588-465a-a308-a864a43d0070'
    base_url = 'https://api.data.gov.in/resource/' + resource_id

    def build_params(commodity_value):
        p = {'api-key': api_key, 'format': 'json', 'limit': limit, 'filters[commodity]': commodity_value}
        if state: p['filters[state]'] = state
        return p

    def fetch(params):
        try:
            r = requests.get(base_url, params=params, timeout=10)
            return r.status_code, r.json() if r.headers.get('Content-Type','').startswith('application/json') else {'error':'Non-JSON'}
        except Exception as e:
            return 599, {'error': str(e)}

    status, data = fetch(build_params(crop.title()))
    if status == 200 and not data.get('records'):
        status, data = fetch(build_params(crop.lower()))
    
    if status != 200 or not data.get('records'):
         return jsonify({'success': False, 'message': 'No records found or API error', 'error': data.get('error')}), status if status != 200 else 404

    records = data.get('records', [])
    historical_prices = []
    markets = []
    
    for rec in records:
        try:
            val = float(rec.get('modal_price'))
            unit = (rec.get('unit') or '').lower()
            if 'quintal' in unit: val /= 100.0
            elif 'ton' in unit: val /= 1000.0
            historical_prices.append(round(val, 2))
            markets.append({'market': rec.get('market'), 'price': round(val, 2)})
        except: continue

    if not historical_prices:
        return jsonify({'success': False, 'message': 'No valid prices'}), 404
        
    current = historical_prices[0]
    return jsonify({
        'success': True,
        'crop': crop.lower(),
        'current_price': current,
        'historical_prices': historical_prices[:8],
        'market_comparison': markets[:5],
        'source': 'DATA_GOV_IN',
        'timestamp': datetime.now().isoformat()
    })

@app.route('/api/live-price/<crop>', methods=['GET'])
def get_live_price(crop: str):
    """Get LIVE price using RealAGMARKNETScraper"""
    if not REAL_SCRAPER_AVAILABLE:
        return jsonify({'success': False, 'error': 'Real scraper not available'}), 503
    
    try:
        scraper = RealAGMARKNETScraper(DATA_GOV_IN_API_KEY)
        state = request.args.get('state', 'Maharashtra')
        price_data = scraper.get_price_with_fallback(crop, state)
        return jsonify({'success': True, 'data': price_data, 'isRealData': price_data.get('source') == 'REAL_API'})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'healthy',
        'service': 'SmartSheti Unified Vercel API',
        'realScraperAvailable': REAL_SCRAPER_AVAILABLE,
        'components': {
            'price_api': price_generator is not None,
            'translation_api': translator is not None
        }
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
