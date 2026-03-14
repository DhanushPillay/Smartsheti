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
DATA_DIR = os.path.join(os.path.dirname(__file__), '..', 'data', 'json')
CACHED_PRICES_FILE = os.path.join(DATA_DIR, 'prices.json')

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

CROP_ALIASES = {
    'soybean': ['soybean', 'soyabean'],
    'soyabean': ['soyabean', 'soybean'],
    'chili': ['chili', 'chilli'],
    'chilli': ['chilli', 'chili'],
}


def get_crop_lookup_keys(crop: str) -> List[str]:
    crop_key = crop.strip().lower()
    keys = [crop_key]
    for alias in CROP_ALIASES.get(crop_key, []):
        if alias not in keys:
            keys.append(alias)
    return keys


def safe_float(value, default: float = 0.0) -> float:
    try:
        return float(value)
    except (TypeError, ValueError):
        return default


def clamp_history(history: List[float], current_price: float, desired_points: int = 8) -> List[float]:
    normalized = [round(safe_float(price), 2) for price in history if safe_float(price) > 0]

    if not normalized and current_price > 0:
        normalized = generate_historical_trend(current_price, desired_points)

    if normalized and len(normalized) < desired_points:
        seed_price = normalized[-1]
        generated = generate_historical_trend(seed_price, desired_points)
        normalized = generated[:desired_points - len(normalized)] + normalized

    if not normalized:
        normalized = [round(current_price, 2)] * desired_points

    return [round(price, 2) for price in normalized[-desired_points:]]


def build_market_comparison_from_price(base_price: float) -> List[Dict]:
    if base_price <= 0:
        return []

    market_defaults = [
        ('Pune APMC', 1.00),
        ('Mumbai APMC', 1.08),
        ('Nashik APMC', 0.97),
        ('Nagpur APMC', 1.03),
        ('Aurangabad APMC', 0.99),
    ]
    comparison = []

    for market_name, multiplier in market_defaults:
        market_price = round(base_price * multiplier, 2)
        change = ((market_price - base_price) / base_price) * 100 if base_price else 0
        comparison.append({
            'market': market_name,
            'price': market_price,
            'change': f"{'+' if change >= 0 else ''}{change:.1f}%"
        })

    return comparison


def normalize_market_rows(markets: Optional[List[Dict]], current_price: float) -> List[Dict]:
    normalized = []
    seen = set()

    for market in markets or []:
        market_name = (
            market.get('market')
            or market.get('name')
            or market.get('district')
            or 'Unknown Market'
        )
        market_key = market_name.strip().lower()
        if market_key in seen:
            continue

        price = safe_float(
            market.get('price', market.get('price_per_kg', market.get('modal_price', current_price))),
            current_price
        )
        if price <= 0:
            continue

        change_value = market.get('change')
        if isinstance(change_value, str) and change_value:
            change_text = change_value
        else:
            min_price = safe_float(market.get('min_price'), price)
            max_price = safe_float(market.get('max_price'), price)
            baseline = price or current_price or 1
            change_pct = ((max_price - min_price) / baseline) * 100 if baseline else 0
            change_text = f"{'+' if change_pct >= 0 else ''}{change_pct:.1f}%"

        normalized.append({
            'market': market_name,
            'price': round(price, 2),
            'change': change_text
        })
        seen.add(market_key)

    if not normalized and current_price > 0:
        normalized = build_market_comparison_from_price(current_price)

    return normalized[:5]


def resolve_market_selection(requested_market: str, market_rows: List[Dict], current_price: float, historical_prices: List[float]) -> Dict:
    requested_market = (requested_market or '').strip()
    if not requested_market:
        resolved_market = market_rows[0]['market'] if market_rows else 'Multiple Markets'
        return {
            'market': resolved_market,
            'current_price': round(current_price, 2),
            'historical_prices': historical_prices,
            'market_requested': '',
            'market_matched': bool(market_rows)
        }

    requested_key = requested_market.lower()
    selected_market = None

    for market_row in market_rows:
        market_name = market_row['market']
        market_key = market_name.lower()
        if market_key == requested_key or requested_key in market_key or market_key in requested_key:
            selected_market = market_row
            break

    if selected_market:
        selected_price = round(safe_float(selected_market.get('price'), current_price), 2)
        delta = selected_price - current_price
        adjusted_history = [round(price + delta, 2) for price in historical_prices] if historical_prices else [selected_price] * 8
        return {
            'market': selected_market['market'],
            'current_price': selected_price,
            'historical_prices': adjusted_history,
            'market_requested': requested_market,
            'market_matched': True
        }

    resolved_market = market_rows[0]['market'] if market_rows else requested_market
    return {
        'market': resolved_market,
        'current_price': round(current_price, 2),
        'historical_prices': historical_prices,
        'market_requested': requested_market,
        'market_matched': False
    }


def load_cached_prices() -> Dict:
    if not os.path.exists(CACHED_PRICES_FILE):
        return {}

    try:
        with open(CACHED_PRICES_FILE, 'r', encoding='utf-8') as file_handle:
            return json.load(file_handle)
    except (OSError, json.JSONDecodeError):
        return {}


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

    def _canonicalize_price_data(
        self,
        crop: str,
        state: str,
        requested_market: str,
        price_data: Optional[Dict],
        data_origin: str,
        default_source: str = 'Unknown'
    ) -> Optional[Dict]:
        if not price_data:
            return None

        history = price_data.get('historical_prices', [])
        base_price = safe_float(price_data.get('current_price', price_data.get('price', 0)))
        if 'data' in price_data and isinstance(price_data.get('data'), list):
            price_series = [safe_float(value) for value in price_data.get('data', []) if safe_float(value) > 0]
            unit = (price_data.get('unit') or '').lower()
            if 'quintal' in unit:
                history = [round(value / 100, 2) for value in price_series]
            else:
                history = [round(value, 2) for value in price_series]
            if history:
                base_price = history[-1]

        if base_price <= 0 and history:
            base_price = round(history[-1], 2)

        if base_price <= 0:
            return None

        historical_prices = clamp_history(history, base_price)
        current_price = round(base_price, 2)
        market_rows = normalize_market_rows(
            price_data.get('market_comparison', price_data.get('markets')),
            current_price
        )
        market_resolution = resolve_market_selection(
            requested_market,
            market_rows,
            current_price,
            historical_prices
        )

        current_price = market_resolution['current_price']
        historical_prices = clamp_history(market_resolution['historical_prices'], current_price)
        change_percentage = self._calculate_change(historical_prices)
        source = price_data.get('source', price_data.get('data_source', default_source))
        confidence = int(round(safe_float(price_data.get('confidence', 0), 0)))
        is_estimate = bool(price_data.get('is_estimate', False)) or data_origin == 'estimate'
        is_fallback = bool(price_data.get('is_fallback', False)) or data_origin in ('cached', 'estimate')

        canonical = {
            'success': True,
            'crop': price_data.get('crop', crop).lower(),
            'current_price': round(current_price, 2),
            'change_percentage': change_percentage,
            'historical_prices': historical_prices,
            'market_comparison': market_rows,
            'timestamp': price_data.get('timestamp', price_data.get('last_updated', datetime.now().isoformat())),
            'source': source,
            'confidence': confidence,
            'state': price_data.get('state', state),
            'market': market_resolution['market'],
            'market_requested': market_resolution['market_requested'],
            'market_matched': market_resolution['market_matched'],
            'is_fallback': is_fallback,
            'is_estimate': is_estimate,
            'data_origin': data_origin,
        }
        canonical['source_badge'] = self._get_source_badge(canonical)
        return canonical

    def _get_cached_price_data(self, crop: str, state: str, requested_market: str) -> Optional[Dict]:
        cached_prices = load_cached_prices()
        if not cached_prices:
            return None

        crop_entry = None
        for crop_key in get_crop_lookup_keys(crop):
            if crop_key in cached_prices:
                crop_entry = cached_prices[crop_key]
                break

        if not isinstance(crop_entry, dict):
            return None

        cached_payload = {
            **crop_entry,
            'crop': crop,
            'state': crop_entry.get('state', state),
            'source': crop_entry.get('source', cached_prices.get('source', 'Cached Price Data')),
            'timestamp': crop_entry.get('timestamp', crop_entry.get('last_updated', cached_prices.get('lastUpdated', datetime.now().isoformat()))),
            'is_fallback': True,
            'is_estimate': bool(crop_entry.get('is_estimate', False)),
        }

        return self._canonicalize_price_data(
            crop,
            state,
            requested_market,
            cached_payload,
            data_origin='cached',
            default_source='Cached Price Data'
        )
    
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
            requested_market = query.get('market', [''])[0]
            
            try:
                if MULTI_SOURCE_AVAILABLE:
                    # Use multi-source scraper without estimate fallback so cached real data stays preferred.
                    scraper = self.get_scraper()
                    price_data = scraper.get_price(crop, state, use_fallback=False)
                    response_data = self._canonicalize_price_data(
                        crop,
                        state,
                        requested_market,
                        price_data,
                        data_origin='live',
                        default_source='Multi-source scraper'
                    )

                if not response_data:
                    price_data = fetch_price_from_api(crop, state)
                    response_data = self._canonicalize_price_data(
                        crop,
                        state,
                        requested_market,
                        price_data,
                        data_origin='live',
                        default_source='data.gov.in'
                    )

                if not response_data:
                    response_data = self._get_cached_price_data(crop, state, requested_market)

                if not response_data:
                    response_data = self._get_fallback_data(crop, state, requested_market)
            
            except Exception as e:
                print(f"Error fetching price for {crop}: {e}")
                response_data = self._get_cached_price_data(crop, state, requested_market)
                if not response_data:
                    response_data = self._get_fallback_data(crop, state, requested_market)
        
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
        if price_data.get('is_estimate'):
            return '⚪ MSP/Estimate'

        if price_data.get('data_origin') == 'cached':
            return '🔵 Cached Real Data'
        
        confidence = price_data.get('confidence', 0)
        source = price_data.get('source', price_data.get('data_source', '')).lower()
        
        if 'data.gov' in source or confidence >= 90:
            return '🟢 LIVE Data'
        elif confidence >= 70:
            return '🔵 Recent Data'
        elif confidence >= 50:
            return '🟡 Cached Data'
        else:
            return '⚪ Estimated'
    
    def _get_fallback_data(self, crop: str, state: str, requested_market: str = '') -> Dict:
        """Generate basic fallback data when all sources fail"""
        msp_prices = {
            'wheat': 24.25, 'rice': 23.20, 'cotton': 75.21,
            'tomato': 35, 'onion': 22, 'potato': 18,
            'mango': 80, 'banana': 40
        }
        
        base_price = msp_prices.get(crop.lower(), 25)
        historical_prices = clamp_history([], base_price)
        market_comparison = build_market_comparison_from_price(base_price)
        market_resolution = resolve_market_selection(requested_market, market_comparison, base_price, historical_prices)
        
        return {
            'success': True,
            'crop': crop,
            'current_price': market_resolution['current_price'],
            'change_percentage': self._calculate_change(market_resolution['historical_prices']),
            'historical_prices': market_resolution['historical_prices'],
            'market_comparison': market_comparison,
            'timestamp': datetime.now().isoformat(),
            'source': 'Fallback MSP',
            'source_badge': '⚪ Estimated',
            'confidence': 30,
            'state': state,
            'market': market_resolution['market'],
            'market_requested': requested_market,
            'market_matched': market_resolution['market_matched'],
            'is_fallback': True,
            'is_estimate': True,
            'data_origin': 'estimate'
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
