"""
Vercel Cron Job - Automated Price Updates
Runs hourly to fetch and cache latest market prices

Configured in vercel.json:
  "crons": [{
    "path": "/api/cron/update-prices",
    "schedule": "0 * * * *"
  }]
"""

from http.server import BaseHTTPRequestHandler
import json
import os
import sys
from datetime import datetime
from pathlib import Path

# Add backend path for imports
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..', 'backend', 'python'))

try:
    from multi_source_price_scraper import MultiSourcePriceScraper
    SCRAPER_AVAILABLE = True
except ImportError:
    SCRAPER_AVAILABLE = False

# Top Maharashtra crops to update
PRIORITY_CROPS = [
    'wheat', 'rice', 'cotton', 'sugarcane', 'soybean',
    'tomato', 'onion', 'potato', 'mango', 'banana',
    'jowar', 'bajra', 'tur', 'maize', 'groundnut',
    'pomegranate', 'grapes', 'orange', 'chilli', 'turmeric'
]


class handler(BaseHTTPRequestHandler):
    """Cron job handler for automated price updates"""
    
    def do_GET(self):
        """Execute price update job"""
        
        # Security: Verify this is from Vercel cron
        auth_bearer = self.headers.get('Authorization', '')
        cron_secret = os.environ.get('CRON_SECRET', '')
        
        # In production, verify authorization
        # if cron_secret and f'Bearer {cron_secret}' != auth_bearer:
        #     self.send_response(401)
        #     self.end_headers()
        #     self.wfile.write(json.dumps({'error': 'Unauthorized'}).encode())
        #     return
        
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        
        if not SCRAPER_AVAILABLE:
            response = {
                'success': False,
                'error': 'Scraper not available',
                'timestamp': datetime.now().isoformat()
            }
            self.wfile.write(json.dumps(response).encode())
            return
        
        try:
            # Initialize scraper
            scraper = MultiSourcePriceScraper()
            
            # Fetch prices for all priority crops
            results = {}
            successful = 0
            failed = 0
            
            for crop in PRIORITY_CROPS:
                try:
                    price_data = scraper.get_price(crop, 'Maharashtra')
                    
                    if price_data and price_data.get('price', 0) > 0:
                        results[crop] = {
                            'price': price_data['price'],
                            'source': price_data.get('data_source', 'Unknown'),
                            'confidence': price_data.get('confidence', 0),
                            'timestamp': price_data.get('timestamp'),
                            'is_fallback': price_data.get('is_fallback', False)
                        }
                        successful += 1
                    else:
                        results[crop] = {'error': 'No data'}
                        failed += 1
                        
                except Exception as e:
                    results[crop] = {'error': str(e)}
                    failed += 1
            
            # Save results to JSON file
            data_dir = Path(__file__).parent.parent.parent / 'data' / 'json'
            data_dir.mkdir(parents=True, exist_ok=True)
            
            prices_file = data_dir / 'prices.json'
            
            # Load existing data or create new
            if prices_file.exists():
                with open(prices_file, 'r', encoding='utf-8') as f:
                    all_prices = json.load(f)
            else:
                all_prices = {}
            
            # Update with new prices
            update_timestamp = datetime.now().isoformat()
            
            for crop, data in results.items():
                if 'error' not in data:
                    all_prices[crop] = {
                        **data,
                        'last_updated': update_timestamp,
                        'last_update_job': 'cron'
                    }
            
            # Save updated prices
            with open(prices_file, 'w', encoding='utf-8') as f:
                json.dump(all_prices, f, indent=2, ensure_ascii=False)
            
            # Log to file
            log_dir = Path(__file__).parent.parent.parent / 'logs'
            log_dir.mkdir(parents=True, exist_ok=True)
            
            log_file = log_dir / 'price_updates.log'
            with open(log_file, 'a', encoding='utf-8') as f:
                log_entry = {
                    'timestamp': update_timestamp,
                    'successful': successful,
                    'failed': failed,
                    'total': len(PRIORITY_CROPS),
                    'success_rate': f"{(successful/len(PRIORITY_CROPS)*100):.1f}%"
                }
                f.write(json.dumps(log_entry) + '\n')
            
            # Response
            response = {
                'success': True,
                'message': 'Price update completed',
                'stats': {
                    'total_crops': len(PRIORITY_CROPS),
                    'successful': successful,
                    'failed': failed,
                    'success_rate': f"{(successful/len(PRIORITY_CROPS)*100):.1f}%"
                },
                'timestamp': update_timestamp,
                'results': results
            }
            
            self.wfile.write(json.dumps(response, indent=2).encode())
            
        except Exception as e:
            response = {
                'success': False,
                'error': str(e),
                'timestamp': datetime.now().isoformat()
            }
            self.wfile.write(json.dumps(response).encode())


if __name__ == '__main__':
    # For local testing
    print("🔄 Running price update job locally...")
    
    from http.server import HTTPServer
    
    server = HTTPServer(('localhost', 5001), handler)
    
    print("Triggering update job...")
    
    # Simulate a single request
    import urllib.request
    try:
        response = urllib.request.urlopen('http://localhost:5001/')
        result = json.loads(response.read().decode())
        print(json.dumps(result, indent=2))
    except Exception as e:
        print(f"Error: {e}")
