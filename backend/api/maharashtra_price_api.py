"""
Maharashtra Market Price API
Uses AgMarkNet for accurate Maharashtra APMC prices

Direct integration for frontend
"""

from flask import Flask, jsonify, request
from flask_cors import CORS
import sys
import os
from datetime import datetime
import logging

# Add backend path
backend_path = os.path.join(os.path.dirname(__file__), '..', 'backend', 'python')
sys.path.insert(0, backend_path)

try:
    from agmarknet_scraper import AgMarkNetScraper
    scraper = AgMarkNetScraper()
    SCRAPER_AVAILABLE = True
except ImportError:
    SCRAPER_AVAILABLE = False

app = Flask(__name__)
CORS(app)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.route('/api/maharashtra/price/<crop>', methods=['GET'])
def get_maharashtra_price(crop):
    """Get real Maharashtra APMC price"""
    
    if not SCRAPER_AVAILABLE:
        return jsonify({
            'error': 'Scraper not available',
            'crop': crop,
            'price': 25,
            'is_fallback': True
        }), 503
    
    try:
        result = scraper.get_current_prices(crop, 'Maharashtra')
        
        if not result:
            return jsonify({
                'error': 'No data found',
                'crop': crop,
                'is_fallback': True
            }), 404
        
        # Calculate price change (simulated - would need historical data)
        current_price = result['price']
        prev_price = current_price * 0.95  # Assume 5% increase for demo
        change_percent = round(((current_price - prev_price) / prev_price) * 100, 1)
        
        response = {
            'crop': crop,
            'current_price': current_price,
            'unit': 'kg',
            'change_percentage': f"+{change_percent}%" if change_percent > 0 else f"{change_percent}%",
            'market': result.get('market', 'Maharashtra APMC'),
            'state': 'Maharashtra',
            'source_badge': '🟢 LIVE' if result.get('confidence', 0) >= 90 else '🔵 RECENT',
            'confidence': result.get('confidence', 80),
            'is_fallback': result.get('is_fallback', False),
            'data_source': result.get('data_source', 'AgMarkNet'),
            'timestamp': result.get('timestamp', datetime.now().isoformat()),
            
            # Market breakdown
            'markets': result.get('markets', [])[:10],
            
            # Historical data (simplified)
            'historical_prices': [
                {'date': (datetime.now().strftime('%Y-%m-%d')), 'price': current_price}
            ],
            
            # Price conversions for verification
            'price_conversions': {
                'per_kg': current_price,
                'per_quintal': current_price * 100,
                'per_ton': current_price * 1000
            }
        }
        
        return jsonify(response)
        
    except Exception as e:
        logger.error(f"Error fetching {crop}: {e}")
        return jsonify({
            'error': str(e),
            'crop': crop,
            'is_fallback': True
        }), 500

@app.route('/api/maharashtra/prices/bulk', methods=['POST'])
def get_bulk_prices():
    """Get prices for multiple crops"""
    
    if not SCRAPER_AVAILABLE:
        return jsonify({'error': 'Scraper not available'}), 503
    
    data = request.get_json()
    crops = data.get('crops', [])
    
    if not crops:
        return jsonify({'error': 'No crops specified'}), 400
    
    results = {}
    
    for crop in crops:
        try:
            price_data = scraper.get_current_prices(crop, 'Maharashtra')
            if price_data:
                results[crop] = {
                    'price': price_data['price'],
                    'market': price_data.get('market', 'Maharashtra'),
                    'confidence': price_data.get('confidence', 80),
                    'source': price_data.get('data_source', 'AgMarkNet')
                }
        except Exception as e:
            logger.error(f"Error fetching {crop}: {e}")
            results[crop] = {'error': str(e)}
    
    return jsonify(results)

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy' if SCRAPER_AVAILABLE else 'degraded',
        'scraper_available': SCRAPER_AVAILABLE,
        'timestamp': datetime.now().isoformat()
    })

if __name__ == '__main__':
    print("\n" + "="*70)
    print("🌾 Maharashtra Market Price API")
    print("="*70)
    print(f"Status: {'✅ Ready' if SCRAPER_AVAILABLE else '❌ Scraper unavailable'}")
    print("Endpoints:")
    print("  - GET  /api/maharashtra/price/<crop>")
    print("  - POST /api/maharashtra/prices/bulk")
    print("  - GET  /api/health")
    print("="*70 + "\n")
    
    app.run(host='0.0.0.0', port=5001, debug=True)
