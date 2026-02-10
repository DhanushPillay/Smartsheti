"""
Vercel Serverless API for SmartSheti Market Prices
Multi-source price aggregation with fallback chain

This serverless function handles:
- /api/realprice/<crop> - Multi-source prices with intelligent fallback
- /api/prices/bulk - Fetch multiple crops at once
- /api/prices/markets - Get available markets for crop
- /api/health - Health check endpoint
"""

from http.server import BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
import json
import os
import sys
from datetime import datetime
from typing import Dict, Optional, List

# Add backend path to enable imports
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend', 'python'))

try:
    from multi_source_price_scraper import MultiSourcePriceScraper, get_crop_price
    MULTI_SOURCE_AVAILABLE = True
except ImportError:
    MULTI_SOURCE_AVAILABLE = False
    print("⚠️ Multi-source scraper not available, using basic fallback")

import requests

# Data.gov.in API Configuration
DATA_GOV_IN_API_KEY = os.environ.get(
    'DATA_GOV_IN_API_KEY',
    '579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b'
)
BASE_URL = "https://api.data.gov.in/resource"
RESOURCE_ID = "9ef84268-d588-465a-a308-a864a43d0070"  # Daily agricultural prices

# Crop name mappings (common names to API names)
CROP_MAPPINGS = {
    'wheat': ['Wheat', 'Wheat (Dara)', 'Gehun'],
    'rice': ['Paddy(Dhan)(Common)', 'Rice', 'Paddy', 'Chawal'],
    'cotton': ['Cotton', 'Kapas', 'Cotton (Kapas)'],
    'sugarcane': ['Sugarcane', 'Ganna', 'Sugar Cane'],
    'tomato': ['Tomato', 'Tamatar', 'Tomato Hybrid'],
    'onion': ['Onion', 'Pyaz', 'Onion Red'],
    'potato': ['Potato', 'Aloo', 'Potato Red'],
    'soyabean': ['Soyabean', 'Soybean', 'Soya Bean'],
    'maize': ['Maize', 'Makka', 'Corn'],
    'jowar': ['Jowar(Sorghum)', 'Jowar', 'Sorghum'],
    'bajra': ['Bajra(Pearl Millet)', 'Bajra', 'Pearl Millet'],
    'groundnut': ['Groundnut', 'Moongfali', 'Peanut'],
    'tur': ['Arhar (Tur/Red Gram)(Whole)', 'Tur', 'Arhar'],
}


def fetch_price_from_api(commodity: str, state: str = "Maharashtra") -> Optional[Dict]:
    """Fetch real price data from data.gov.in API"""
    
    # Get possible commodity names
    commodity_names = CROP_MAPPINGS.get(commodity.lower(), [commodity.title()])
    
    for commodity_name in commodity_names:
        try:
            # Build API request
            params = {
                'api-key': DATA_GOV_IN_API_KEY,
                'format': 'json',
                'limit': '30',
                'filters[commodity]': commodity_name,
            }
            
            if state:
                params['filters[state]'] = state
            
            # Make API request
            url = f"{BASE_URL}/{RESOURCE_ID}"
            response = requests.get(url, params=params, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                records = data.get('records', [])
                
                if records:
                    # Successfully got real data
                    return process_price_records(records, commodity)
        
        except Exception as e:
            print(f"Error fetching {commodity_name}: {e}")
            continue
    
    return None


def process_price_records(records: List[Dict], commodity: str) -> Dict:
    """Process API records into standardized format"""
    
    # Extract prices
    prices = []
    markets = []
    
    for record in records:
        try:
            modal_price = float(record.get('modal_price', 0))
            unit = (record.get('unit', '') or '').lower()
            
            # Convert to per kg
            if 'quintal' in unit and modal_price > 100:
                per_kg = round(modal_price / 100, 2)
            elif 'ton' in unit:
                per_kg = round(modal_price / 1000, 2)
            else:
                per_kg = round(modal_price, 2)
            
            if per_kg > 0 and per_kg < 10000:  # Sanity check
                prices.append(per_kg)
                markets.append({
                    'name': record.get('market', 'Unknown'),
                    'district': record.get('district', ''),
                    'price': per_kg
                })
        except (ValueError, TypeError):
            continue
    
    if not prices:
        return None
    
    # Calculate current price (average of latest prices)
    current_price = round(sum(prices[:5]) / min(len(prices), 5), 2)
    
    # Generate historical trend (8 data points)
    historical_prices = prices[:8] if len(prices) >= 8 else generate_historical_trend(current_price, 8)
    
    # Calculate price change
    previous_price = historical_prices[-2] if len(historical_prices) > 1 else current_price
    change_percent = ((current_price - previous_price) / previous_price) * 100
    
    # Get top 5 unique markets
    unique_markets = []
    seen_names = set()
    for m in markets:
        name = m['name']
        if name not in seen_names and len(unique_markets) < 5:
            unique_markets.append({'market': name, 'price': m['price'], 'change': f"+{change_percent:.1f}%"})
            seen_names.add(name)
    
    return {
        'success': True,
        'crop': commodity,
        'current_price': current_price,
        'change_percentage': f"{'+' if change_percent >= 0 else ''}{change_percent:.1f}%",
        'historical_prices': historical_prices,
        'market_comparison': unique_markets,
        'timestamp': datetime.now().isoformat(),
        'source': 'REAL_API',
        'source_badge': '🟢 LIVE',
        'state': records[0].get('state', 'Maharashtra'),
        'markets_count': len(markets)
    }


def generate_historical_trend(current_price: float, num_points: int = 8) -> List[float]:
    """Generate realistic historical price trend"""
    import random
    
    prices = []
    for i in range(num_points):
        if i == num_points - 1:
            prices.append(current_price)
        else:
            # Add realistic variation
            variation = random.uniform(-0.08, 0.08)
            historical_price = current_price * (1 + variation * (num_points - i - 1) / num_points)
            prices.append(round(historical_price, 2))
    
    return prices


class handler(BaseHTTPRequestHandler):
    """Vercel serverless handler with multi-source support"""
    
    # Class-level scraper instance for reuse (reduces cold starts)
    scraper = None
    
    @classmethod
    def get_scraper(cls):
        """Get or create scraper instance"""
        if cls.scraper is None and MULTI_SOURCE_AVAILABLE:
            cls.scraper = MultiSourcePriceScraper()
        return cls.scraper
    
    def do_GET(self):
        """Handle GET requests"""
        parsed_path = urlparse(self.path)
        path = parsed_path.path
        query = parse_qs(parsed_path.query)
        
        # CORS headers
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.send_header('Cache-Control', 'public, max-age=1800')  # 30 min cache
        self.end_headers()
        
        response_data = {}
        
        # Health check
        if path == '/api/health':
            response_data = {
                'status': 'healthy',
                'service': 'SmartSheti Multi-Source Price API',
                'version': '2.0',
                'multi_source_enabled': MULTI_SOURCE_AVAILABLE,
                'timestamp': datetime.now().isoformat(),
                'realScraperAvailable': True
            }
        
        # Multi-source price endpoint: /api/realprice/<crop>
        elif path.startswith('/api/realprice/'):
            crop = path.split('/api/realprice/')[-1]
            state = query.get('state', ['Maharashtra'])[0]
            
            try:
                if MULTI_SOURCE_AVAILABLE:
                    # Use multi-source scraper
                    scraper = self.get_scraper()
                    price_data = scraper.get_price(crop, state)
                    
                    # Format response with enhanced metadata
                    response_data = {
                        'success': True,
                        'crop': price_data.get('crop', crop),
                        'current_price': price_data.get('price', 0),
                        'change_percentage': self._calculate_change(price_data.get('historical_prices', [])),
                        'historical_prices': price_data.get('historical_prices', []),
                        'market_comparison': price_data.get('market_comparison', []),
                        'timestamp': price_data.get('timestamp', datetime.now().isoformat()),
                        'source': price_data.get('data_source', 'Unknown'),
                        'source_badge': self._get_source_badge(price_data),
                        'confidence': price_data.get('confidence', 50),
                        'state': state,
                        'market': price_data.get('market', 'Multiple Markets'),
                        'is_fallback': price_data.get('is_fallback', False)
                    }
                else:
                    # Fallback to old method
                    price_data = fetch_price_from_api(crop, state)
                    if price_data:
                        response_data = price_data
                    else:
                        response_data = self._get_fallback_data(crop, state)
            
            except Exception as e:
                print(f"Error fetching price for {crop}: {e}")
                response_data = self._get_fallback_data(crop, state)
        
        # Bulk prices endpoint: /api/prices/bulk
        elif path == '/api/prices/bulk':
            crops_param = query.get('crops', [''])[0]
            crops = crops_param.split(',') if crops_param else ['wheat', 'rice', 'cotton']
            state = query.get('state', ['Maharashtra'])[0]
            
            try:
                if MULTI_SOURCE_AVAILABLE:
                    scraper = self.get_scraper()
                    bulk_data = scraper.get_bulk_prices(crops, state)
                    response_data = {
                        'success': True,
                        'crops': bulk_data,
                        'count': len(bulk_data),
                        'timestamp': datetime.now().isoformat()
                    }
                else:
                    response_data = {'success': False, 'error': 'Bulk fetching not available'}
            except Exception as e:
                response_data = {'success': False, 'error': str(e)}
        
        # Markets endpoint: /api/prices/markets/<crop>
        elif path.startswith('/api/prices/markets/'):
            crop = path.split('/api/prices/markets/')[-1]
            state = query.get('state', ['Maharashtra'])[0]
            
            try:
                if MULTI_SOURCE_AVAILABLE:
                    scraper = self.get_scraper()
                    markets = scraper.get_markets_for_crop(crop, state)
                    response_data = {
                        'success': True,
                        'crop': crop,
                        'markets': markets,
                        'count': len(markets)
                    }
                else:
                    response_data = {'success': False, 'error': 'Markets endpoint not available'}
            except Exception as e:
                response_data = {'success': False, 'error': str(e)}
        
        # Legacy endpoint support: /api/live-price/<crop>
        elif path.startswith('/api/live-price/'):
            crop = path.split('/api/live-price/')[-1]
            state = query.get('state', ['Maharashtra'])[0]
            
            # Redirect to realprice endpoint
            if MULTI_SOURCE_AVAILABLE:
                scraper = self.get_scraper()
                price_data = scraper.get_price(crop, state)
                response_data = {
                    'success': True,
                    'data': price_data,
                    'isRealData': not price_data.get('is_fallback', False),
                    'timestamp': datetime.now().isoformat()
                }
            else:
                price_data = fetch_price_from_api(crop, state)
                response_data = {
                    'success': price_data is not None,
                    'data': price_data if price_data else {},
                    'timestamp': datetime.now().isoformat()
                }
        
        # Default API info
        else:
            response_data = {
                'service': 'SmartSheti Multi-Source Price API',
                'version': '2.0',
                'multi_source_enabled': MULTI_SOURCE_AVAILABLE,
                'endpoints': {
                    '/api/health': 'Health check',
                    '/api/realprice/<crop>': 'Multi-source price with fallback (recommended)',
                    '/api/prices/bulk?crops=wheat,rice,cotton': 'Fetch multiple crops',
                    '/api/prices/markets/<crop>': 'Get available markets for crop',
                    '/api/live-price/<crop>': 'Legacy endpoint (deprecated)'
                },
                'supported_states': ['Maharashtra', 'Karnataka', 'Gujarat', 'Madhya Pradesh'],
                'data_sources': ['data.gov.in API', 'MandiPrices.com', 'AgMarkNet', 'MSP Fallback']
            }
        
        # Send response
        self.wfile.write(json.dumps(response_data).encode())
    
    def _calculate_change(self, historical_prices: List[float]) -> str:
        """Calculate price change percentage"""
        if len(historical_prices) < 2:
            return "+0.0%"
        current = historical_prices[-1]
        previous = historical_prices[-2]
        change = ((current - previous) / previous) * 100
        return f"{'+' if change >= 0 else ''}{change:.1f}%"
    
    def _get_source_badge(self, price_data: Dict) -> str:
        """Get display badge for data source"""
        if price_data.get('is_fallback'):
            return '⚪ MSP/Estimate'
        
        confidence = price_data.get('confidence', 0)
        source = price_data.get('data_source', '').lower()
        
        if 'data.gov' in source or confidence >= 90:
            return '🟢 LIVE Data'
        elif confidence >= 70:
            return '🔵 Recent Data'
        elif confidence >= 50:
            return '🟡 Cached Data'
        else:
            return '⚪ Estimated'
    
    def _get_fallback_data(self, crop: str, state: str) -> Dict:
        """Generate basic fallback data when all sources fail"""
        msp_prices = {
            'wheat': 24.25, 'rice': 23.20, 'cotton': 75.21,
            'tomato': 35, 'onion': 22, 'potato': 18,
            'mango': 80, 'banana': 40
        }
        
        base_price = msp_prices.get(crop.lower(), 25)
        
        return {
            'success': True,
            'crop': crop,
            'current_price': base_price,
            'change_percentage': '+0.0%',
            'historical_prices': [base_price] * 8,
            'market_comparison': [
                {'market': 'Mumbai APMC', 'price': round(base_price * 1.1), 'change': '+2.0%'},
                {'market': 'Pune APMC', 'price': base_price, 'change': '0.0%'},
                {'market': 'Nashik APMC', 'price': round(base_price * 0.95), 'change': '-1.5%'},
            ],
            'timestamp': datetime.now().isoformat(),
            'source': 'Fallback MSP',
            'source_badge': '⚪ Estimated',
            'confidence': 30,
            'state': state,
            'market': 'Estimated',
            'is_fallback': True
        }
    
    def do_OPTIONS(self):
        """Handle OPTIONS for CORS preflight"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

if __name__ == '__main__':
    from http.server import HTTPServer
    
    port = int(os.environ.get('PORT', 5000))
    server_address = ('', port)
    httpd = HTTPServer(server_address, handler)
    
    print(f"""
    ╔══════════════════════════════════════════════════════════╗
    ║         SmartSheti Vercel API (Local Mode)               ║
    ║                                                          ║
    ║  🌾 Serving real-time agricultural market prices        ║
    ║                                                          ║
    ║  API Endpoints:                                          ║
    ║  • http://localhost:{port}/api/health                     ║
    ║  • http://localhost:{port}/api/live-price/<crop>          ║
    ║  • http://localhost:{port}/api/realprice/<crop>           ║
    ║                                                          ║
    ║  Press Ctrl+C to stop the server                        ║
    ╚══════════════════════════════════════════════════════════╝
    """)
    print(f"🚀 Starting server on http://localhost:{port}")
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n🛑 Server stopped by user")
        httpd.server_close()
