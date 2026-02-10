"""
AgMarkNet Direct Scraper - Gets real Maharashtra APMC prices
Uses the official AgMarkNet API and web data
"""

import requests
from bs4 import BeautifulSoup
from datetime import datetime, timedelta
import logging
from typing import Dict, List, Optional
import json

logger = logging.getLogger(__name__)

class AgMarkNetScraper:
    """Official AgMarkNet scraper for Maharashtra prices"""
    
    def __init__(self):
        self.base_url = "https://agmarknet.gov.in"
        self.api_url = "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070"
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': 'application/json'
        })
        
        # Maharashtra markets
        self.maharashtra_markets = {
            'Mumbai': 'mumbai',
            'Pune': 'pune',
            'Nagpur': 'nagpur',
            'Nashik': 'nashik',
            'Aurangabad': 'aurangabad',
            'Solapur': 'solapur',
            'Kolhapur': 'kolhapur',
            'Amravati': 'amravati',
            'Ahmednagar': 'ahmednagar'
        }
        
        # Crop name mappings for AgMarkNet
        self.crop_mappings = {
            'wheat': ['Wheat', 'Gehu', 'Gahu'],
            'rice': ['Rice', 'Paddy', 'Dhan'],
            'onion': ['Onion', 'Kanda', 'Pyaz'],
            'tomato': ['Tomato', 'Tamatar'],
            'potato': ['Potato', 'Batata', 'Aloo'],
            'cotton': ['Cotton', 'Kapas'],
            'sugarcane': ['Sugarcane', 'Oos'],
            'soybean': ['Soybean', 'Soya'],
            'maize': ['Maize', 'Makka'],
            'jowar': ['Jowar', 'Sorghum'],
            'bajra': ['Bajra', 'Pearl Millet'],
            'gram': ['Gram', 'Chana'],
            'groundnut': ['Groundnut', 'Peanut', 'Shengdana'],
            'turmeric': ['Turmeric', 'Haldi'],
            'chilli': ['Chilli', 'Chili', 'Mirchi']
        }
    
    def get_current_prices(self, crop: str, state: str = 'Maharashtra') -> Optional[Dict]:
        """Get current price from AgMarkNet for Maharashtra"""
        
        crop_lower = crop.lower()
        crop_names = self.crop_mappings.get(crop_lower, [crop.capitalize()])
        
        all_prices = []
        all_markets = []
        
        for commodity_name in crop_names:
            # Try data.gov.in API first (reliable source)
            api_data = self._fetch_from_api(commodity_name, state)
            if api_data:
                all_prices.extend(api_data['prices'])
                all_markets.extend(api_data['markets'])
        
        if not all_prices:
            logger.warning(f"⚠️ No AgMarkNet data found for {crop} in {state}")
            return None
        
        # Calculate modal price from top markets
        avg_price = round(sum(all_prices[:10]) / min(len(all_prices), 10))
        
        return {
            'crop': crop,
            'price': avg_price,
            'unit': 'kg',
            'market': all_markets[0]['name'] if all_markets else 'Maharashtra APMC',
            'state': state,
            'markets': all_markets[:15],  # Top 15 markets
            'timestamp': datetime.now().isoformat(),
            'confidence': 95,  # High confidence for AgMarkNet official data
            'data_source': 'AgMarkNet',
            'is_fallback': False,
            'source_type': 'api'
        }
    
    def _fetch_from_api(self, commodity: str, state: str) -> Optional[Dict]:
        """Fetch from data.gov.in AgMarkNet API"""
        try:
            # Updated API endpoint with proper parameters
            params = {
                'api-key': '579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b',
                'format': 'json',
                'offset': 0,
                'limit': 100
            }
            
            # Add filters
            url = f"{self.api_url}?api-key={params['api-key']}&format=json&limit=100"
            url += f"&filters[commodity]={commodity}"
            url += f"&filters[state]={state}"
            
            # Get data from last 7 days
            today = datetime.now()
            date_str = today.strftime('%d/%m/%Y')
            url += f"&filters[arrival_date]={date_str}"
            
            logger.info(f"🌐 Fetching {commodity} from AgMarkNet API...")
            
            response = self.session.get(url, timeout=15)
            
            if response.status_code != 200:
                logger.warning(f"⚠️ AgMarkNet API returned {response.status_code}")
                # Try yesterday's date
                yesterday = (today - timedelta(days=1)).strftime('%d/%m/%Y')
                url_yesterday = url.replace(date_str, yesterday)
                response = self.session.get(url_yesterday, timeout=15)
                
                if response.status_code != 200:
                    return None
            
            data = response.json()
            records = data.get('records', [])
            
            if not records:
                logger.warning(f"⚠️ No records for {commodity}")
                return None
            
            logger.info(f"✅ Found {len(records)} records from AgMarkNet")
            
            prices = []
            markets = []
            
            for record in records:
                try:
                    modal_price = float(str(record.get('modal_price', '0')).replace(',', ''))
                    if modal_price <= 0:
                        continue
                    
                    # Check unit and convert
                    unit = str(record.get('unit', 'quintal')).lower()
                    price_per_kg = self._convert_to_kg(modal_price, unit)
                    
                    if 1 <= price_per_kg <= 1000:  # Sanity check
                        prices.append(price_per_kg)
                        markets.append({
                            'name': record.get('market', 'Unknown'),
                            'price': price_per_kg,
                            'district': record.get('district', ''),
                            'min_price': self._convert_to_kg(
                                float(str(record.get('min_price', modal_price)).replace(',', '')), 
                                unit
                            ),
                            'max_price': self._convert_to_kg(
                                float(str(record.get('max_price', modal_price)).replace(',', '')), 
                                unit
                            ),
                            'date': record.get('arrival_date', date_str)
                        })
                except (ValueError, TypeError) as e:
                    logger.debug(f"Skipping invalid record: {e}")
                    continue
            
            if prices:
                return {
                    'prices': prices,
                    'markets': sorted(markets, key=lambda x: x['price'], reverse=True)
                }
            
            return None
            
        except requests.RequestException as e:
            logger.error(f"❌ AgMarkNet API error: {e}")
            return None
        except Exception as e:
            logger.error(f"❌ Unexpected error in AgMarkNet fetch: {e}")
            return None
    
    def _convert_to_kg(self, price: float, unit: str) -> float:
        """Convert price to per kg"""
        unit_lower = unit.lower()
        
        if 'quintal' in unit_lower or 'qtl' in unit_lower:
            return round(price / 100, 2)
        elif 'ton' in unit_lower or 'tonne' in unit_lower:
            return round(price / 1000, 2)
        else:
            # Assume kg
            return round(price, 2)
    
    def get_bulk_prices(self, crops: List[str], state: str = 'Maharashtra') -> Dict[str, Dict]:
        """Get prices for multiple crops"""
        results = {}
        
        for crop in crops:
            price_data = self.get_current_prices(crop, state)
            if price_data:
                results[crop.lower()] = price_data
        
        return results


# Test function
if __name__ == '__main__':
    import sys
    
    # Setup UTF-8 encoding for Windows
    if sys.platform == 'win32':
        try:
            sys.stdout.reconfigure(encoding='utf-8')
        except:
            pass
    
    logging.basicConfig(level=logging.INFO)
    
    scraper = AgMarkNetScraper()
    
    test_crop = sys.argv[1] if len(sys.argv) > 1 else 'wheat'
    
    print(f"\n{'='*70}")
    print(f"Testing AgMarkNet Scraper: {test_crop.upper()}")
    print(f"{'='*70}\n")
    
    result = scraper.get_current_prices(test_crop)
    
    if result:
        print(f"✅ SUCCESS!")
        print(f"\n📊 Price Data:")
        print(f"   Crop: {result['crop']}")
        print(f"   Price: ₹{result['price']}/kg")
        print(f"   Market: {result['market']}")
        print(f"   Confidence: {result['confidence']}%")
        print(f"   Source: {result['data_source']}")
        
        if 'markets' in result and result['markets']:
            print(f"\n📍 Top Markets:")
            for i, market in enumerate(result['markets'][:5], 1):
                print(f"   {i}. {market['name']}: ₹{market['price']}/kg")
    else:
        print(f"❌ No data found")
    
    print(f"\n{'='*70}\n")
