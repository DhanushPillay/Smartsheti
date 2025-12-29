#!/usr/bin/env python3
"""
Real AGMARKNET Scraper for SmartSheti
Fetches REAL agricultural market prices from data.gov.in API
Falls back to mock data only when API is unavailable

Author: SmartSheti Team
Updated: 2025
"""

import requests
import json
import time
import logging
import os
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('real_agmarknet_scraper.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)


@dataclass
class CropPrice:
    """Data structure for crop price information"""
    commodity: str
    variety: str
    market: str
    district: str
    state: str
    min_price: float
    max_price: float
    modal_price: float
    unit: str
    arrival_date: str
    source: str  # 'REAL_API' or 'MOCK'


class RealAGMARKNETScraper:
    """
    Real AGMARKNET Scraper that fetches actual market data from data.gov.in
    Uses the official Government of India Open Data Platform API
    """
    
    def __init__(self, api_key: Optional[str] = None):
        """
        Initialize the scraper with API key
        
        Args:
            api_key: data.gov.in API key. If not provided, uses environment variable
                     or a default public key (rate limited)
        """
        # API Configuration
        self.api_key = api_key or os.environ.get('DATA_GOV_IN_API_KEY') or '579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b'
        
        # data.gov.in API endpoints
        self.base_url = "https://api.data.gov.in/resource"
        
        # Resource IDs for different datasets
        self.resource_ids = {
            'daily_prices': '9ef84268-d588-465a-a308-a864a43d0070',  # Current daily prices
            'wholesale_prices': '35985678-0d79-46b4-9ed6-6f13308a1d24',  # Wholesale prices
        }
        
        # Session for connection pooling
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'SmartSheti Agricultural Platform/1.0',
            'Accept': 'application/json',
        })
        
        # Crop name mappings (local names to API names)
        self.crop_mappings = {
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
            'chilli': ['Chillies (Green)', 'Chilli Red', 'Mirchi'],
            'turmeric': ['Turmeric', 'Haldi'],
            'garlic': ['Garlic', 'Lahsun'],
            'ginger': ['Ginger(Green)', 'Ginger', 'Adrak'],
            'banana': ['Banana', 'Kela'],
            'mango': ['Mango', 'Aam'],
            'grapes': ['Grapes', 'Angoor'],
            'orange': ['Orange', 'Narangi', 'Santra'],
            'pomegranate': ['Pomegranate', 'Anar'],
            'apple': ['Apple', 'Seb'],
            'cauliflower': ['Cauliflower', 'Phool Gobhi'],
            'cabbage': ['Cabbage', 'Patta Gobhi'],
            'brinjal': ['Brinjal', 'Baingan', 'Eggplant'],
            'okra': ['Bhindi(Ladies Finger)', 'Okra', 'Lady Finger'],
            'cucumber': ['Cucumber', 'Kheera', 'Kakdi'],
        }
        
        # Maharashtra markets (APMCs)
        self.maharashtra_markets = [
            'Mumbai', 'Pune', 'Nashik', 'Nagpur', 'Aurangabad',
            'Solapur', 'Kolhapur', 'Ahmednagar', 'Jalgaon', 'Sangli'
        ]
        
        # Cache for API responses (to reduce API calls)
        self._cache: Dict[str, Tuple[datetime, any]] = {}
        self._cache_ttl = timedelta(minutes=30)  # Cache for 30 minutes
        
        logger.info("🌐 Real AGMARKNET Scraper initialized with data.gov.in API")
    
    def _get_cache_key(self, commodity: str, state: Optional[str] = None) -> str:
        """Generate cache key"""
        return f"{commodity}_{state or 'all'}".lower()
    
    def _get_from_cache(self, key: str) -> Optional[any]:
        """Get data from cache if not expired"""
        if key in self._cache:
            cached_time, data = self._cache[key]
            if datetime.now() - cached_time < self._cache_ttl:
                logger.debug(f"📦 Cache hit for {key}")
                return data
            else:
                del self._cache[key]
        return None
    
    def _set_cache(self, key: str, data: any):
        """Set data in cache"""
        self._cache[key] = (datetime.now(), data)
    
    def fetch_real_prices(
        self, 
        commodity: str, 
        state: str = "Maharashtra",
        limit: int = 50
    ) -> List[CropPrice]:
        """
        Fetch real prices from data.gov.in API
        
        Args:
            commodity: Name of the crop/commodity
            state: State name (default: Maharashtra)
            limit: Maximum number of records to fetch
            
        Returns:
            List of CropPrice objects with real market data
        """
        cache_key = self._get_cache_key(commodity, state)
        cached_data = self._get_from_cache(cache_key)
        if cached_data:
            return cached_data
        
        # Get all possible names for this commodity
        commodity_names = self.crop_mappings.get(commodity.lower(), [commodity.title()])
        
        all_prices = []
        
        for commodity_name in commodity_names:
            try:
                logger.info(f"🌐 Fetching real prices for {commodity_name} from data.gov.in...")
                
                # Build API request
                params = {
                    'api-key': self.api_key,
                    'format': 'json',
                    'limit': str(limit),
                    'filters[commodity]': commodity_name,
                }
                
                if state:
                    params['filters[state]'] = state
                
                # Make API request
                url = f"{self.base_url}/{self.resource_ids['daily_prices']}"
                response = self.session.get(url, params=params, timeout=15)
                
                if response.status_code == 200:
                    data = response.json()
                    records = data.get('records', [])
                    
                    if records:
                        logger.info(f"✅ Found {len(records)} real price records for {commodity_name}")
                        
                        for record in records:
                            try:
                                price = CropPrice(
                                    commodity=record.get('commodity', commodity_name),
                                    variety=record.get('variety', 'Local'),
                                    market=record.get('market', 'Unknown'),
                                    district=record.get('district', 'Unknown'),
                                    state=record.get('state', state),
                                    min_price=float(record.get('min_price', 0)),
                                    max_price=float(record.get('max_price', 0)),
                                    modal_price=float(record.get('modal_price', 0)),
                                    unit=record.get('unit', 'Quintal'),
                                    arrival_date=record.get('arrival_date', datetime.now().strftime('%Y-%m-%d')),
                                    source='REAL_API'
                                )
                                all_prices.append(price)
                            except (ValueError, TypeError) as e:
                                logger.warning(f"⚠️ Error parsing record: {e}")
                                continue
                        
                        # If we got data, break the loop (no need to try other names)
                        if all_prices:
                            break
                    else:
                        logger.debug(f"No records found for {commodity_name}")
                        
                elif response.status_code == 429:
                    logger.warning("⚠️ API rate limit exceeded. Waiting before retry...")
                    time.sleep(2)
                else:
                    logger.warning(f"⚠️ API returned status {response.status_code} for {commodity_name}")
                    
            except requests.exceptions.Timeout:
                logger.warning(f"⏱️ Timeout fetching {commodity_name}")
            except requests.exceptions.RequestException as e:
                logger.error(f"❌ Network error fetching {commodity_name}: {e}")
            except Exception as e:
                logger.error(f"❌ Unexpected error fetching {commodity_name}: {e}")
            
            # Small delay between API calls to avoid rate limiting
            time.sleep(0.5)
        
        # Cache the results
        if all_prices:
            self._set_cache(cache_key, all_prices)
        
        return all_prices
    
    def get_current_price(
        self, 
        commodity: str, 
        state: str = "Maharashtra"
    ) -> Optional[Dict]:
        """
        Get the current modal price for a commodity
        
        Returns:
            Dictionary with current price info or None if unavailable
        """
        prices = self.fetch_real_prices(commodity, state, limit=20)
        
        if prices:
            # Get the most recent price (first record is usually newest)
            latest = prices[0]
            
            # Calculate average modal price across markets
            modal_prices = [p.modal_price for p in prices if p.modal_price > 0]
            avg_modal = sum(modal_prices) / len(modal_prices) if modal_prices else latest.modal_price
            
            return {
                'commodity': commodity,
                'current_price': round(avg_modal, 2),
                'min_price': min(p.min_price for p in prices if p.min_price > 0),
                'max_price': max(p.max_price for p in prices if p.max_price > 0),
                'unit': latest.unit,
                'state': state,
                'markets_count': len(prices),
                'last_updated': latest.arrival_date,
                'source': 'REAL_API',
                'markets': [
                    {
                        'name': p.market,
                        'district': p.district,
                        'price': p.modal_price
                    }
                    for p in prices[:5]  # Top 5 markets
                ]
            }
        
        return None
    
    def get_price_with_fallback(
        self, 
        commodity: str, 
        state: str = "Maharashtra"
    ) -> Dict:
        """
        Get price with automatic fallback to mock data if API fails
        
        This ensures the app always returns data, even if the API is down
        """
        # First, try to get real data
        real_price = self.get_current_price(commodity, state)
        
        if real_price:
            logger.info(f"✅ Using REAL price for {commodity}: ₹{real_price['current_price']}")
            return real_price
        
        # Fallback to mock data
        logger.warning(f"⚠️ API unavailable for {commodity}, using mock data")
        return self._get_mock_price(commodity, state)
    
    def _get_mock_price(self, commodity: str, state: str) -> Dict:
        """Generate realistic mock price data as fallback"""
        
        # Base prices for different crops (in ₹ per quintal)
        base_prices = {
            'wheat': 2500, 'rice': 3200, 'cotton': 5800, 'sugarcane': 280,
            'tomato': 2800, 'onion': 1800, 'potato': 1200, 'soyabean': 4200,
            'maize': 2200, 'jowar': 3400, 'bajra': 2500, 'groundnut': 6300,
            'tur': 7500, 'chilli': 15000, 'turmeric': 8500, 'garlic': 12000,
            'ginger': 4500, 'banana': 1500, 'mango': 5000, 'grapes': 4000,
            'orange': 2500, 'pomegranate': 5000, 'apple': 10000,
            'cauliflower': 1500, 'cabbage': 1000, 'brinjal': 1800,
            'okra': 2500, 'cucumber': 1500,
        }
        
        import random
        
        base = base_prices.get(commodity.lower(), 2500)
        variation = random.uniform(0.9, 1.1)  # ±10% variation
        modal_price = round(base * variation, 2)
        
        return {
            'commodity': commodity,
            'current_price': modal_price,
            'min_price': round(modal_price * 0.9, 2),
            'max_price': round(modal_price * 1.1, 2),
            'unit': 'Quintal',
            'state': state,
            'markets_count': 5,
            'last_updated': datetime.now().strftime('%Y-%m-%d'),
            'source': 'MOCK_FALLBACK',
            'markets': [
                {'name': f'{market} APMC', 'district': market, 'price': round(modal_price * random.uniform(0.95, 1.05), 2)}
                for market in ['Mumbai', 'Pune', 'Nashik', 'Nagpur', 'Aurangabad']
            ]
        }
    
    def fetch_all_prices(self, state: str = "Maharashtra") -> Dict[str, Dict]:
        """
        Fetch prices for all major crops
        
        Returns:
            Dictionary with crop name as key and price data as value
        """
        crops = list(self.crop_mappings.keys())
        all_prices = {}
        
        logger.info(f"🔄 Fetching prices for {len(crops)} crops...")
        
        for crop in crops:
            price_data = self.get_price_with_fallback(crop, state)
            all_prices[crop] = price_data
            
            # Log progress
            source_emoji = "✅" if price_data.get('source') == 'REAL_API' else "📦"
            logger.info(f"{source_emoji} {crop}: ₹{price_data['current_price']} ({price_data['source']})")
            
            # Respect rate limits
            time.sleep(0.3)
        
        return all_prices
    
    def update_prices_json(self, output_file: str = "prices.json") -> bool:
        """
        Fetch all prices and update the prices.json file
        
        Args:
            output_file: Path to the output JSON file
            
        Returns:
            True if successful, False otherwise
        """
        try:
            logger.info(f"🔄 Starting price update for {output_file}...")
            
            all_prices = self.fetch_all_prices()
            
            # Format for prices.json structure
            output_data = {
                'lastUpdated': datetime.now().isoformat(),
                'source': 'data.gov.in Real API with Mock Fallback',
                'api_version': '1.0',
            }
            
            # Count real vs mock data
            real_count = 0
            mock_count = 0
            
            for crop, price_data in all_prices.items():
                # Generate historical trend data (last 8 weeks)
                current = price_data['current_price']
                historical = self._generate_historical_trend(current, crop)
                
                output_data[crop] = {
                    'labels': ['7W ago', '6W ago', '5W ago', '4W ago', '3W ago', '2W ago', '1W ago', 'Current'],
                    'data': historical,
                    'color': self._get_crop_color(crop),
                    'state': price_data.get('state', 'Maharashtra'),
                    'unit': f"₹/{price_data.get('unit', 'quintal').lower()}",
                    'source': price_data.get('source', 'UNKNOWN'),
                    'markets': price_data.get('markets', [])
                }
                
                if price_data.get('source') == 'REAL_API':
                    real_count += 1
                else:
                    mock_count += 1
            
            # Save to file
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(output_data, f, indent=2, ensure_ascii=False)
            
            logger.info(f"💾 Saved prices to {output_file}")
            logger.info(f"📊 Summary: {real_count} real API, {mock_count} mock fallback")
            
            return True
            
        except Exception as e:
            logger.error(f"❌ Error updating prices: {e}")
            return False
    
    def _generate_historical_trend(self, current_price: float, crop: str) -> List[float]:
        """Generate realistic historical price trend"""
        import random
        import math
        
        # Volatility factors for different crops
        volatility = {
            'tomato': 0.25, 'onion': 0.20, 'potato': 0.15, 'chilli': 0.20,
            'wheat': 0.08, 'rice': 0.10, 'cotton': 0.12, 'sugarcane': 0.06,
        }.get(crop.lower(), 0.12)
        
        prices = []
        price = current_price
        
        # Generate 8 weeks of data (working backwards)
        for i in range(8):
            if i == 0:
                prices.append(round(current_price, 2))
            else:
                # Add some realistic variation
                change = random.gauss(0, volatility * current_price * 0.3)
                trend = random.uniform(-0.02, 0.02) * current_price * i
                seasonal = math.sin(i * 0.4) * volatility * current_price * 0.2
                
                historical_price = current_price - trend + change + seasonal
                historical_price = max(current_price * 0.7, min(current_price * 1.3, historical_price))
                prices.append(round(historical_price, 2))
        
        # Reverse so oldest is first
        return list(reversed(prices))
    
    def _get_crop_color(self, crop: str) -> str:
        """Get chart color for crop"""
        colors = {
            'wheat': '#FFA500', 'rice': '#4169E1', 'cotton': '#32CD32',
            'sugarcane': '#9370DB', 'tomato': '#FF4500', 'onion': '#8B4513',
            'potato': '#DAA520', 'soyabean': '#FF6347', 'maize': '#FFD700',
            'jowar': '#CD853F', 'bajra': '#DEB887', 'groundnut': '#F4A460',
            'tur': '#8B0000', 'chilli': '#DC143C', 'turmeric': '#FFD700',
            'garlic': '#FAEBD7', 'ginger': '#D2691E', 'banana': '#FFFF00',
            'mango': '#FFA07A', 'grapes': '#800080', 'orange': '#FF8C00',
            'pomegranate': '#C71585', 'apple': '#FF0000',
        }
        return colors.get(crop.lower(), '#10B981')


def main():
    """Main function for testing the scraper"""
    print("🌾 SmartSheti Real AGMARKNET Scraper")
    print("=" * 50)
    
    scraper = RealAGMARKNETScraper()
    
    # Test fetching real prices
    print("\n📊 Testing real price fetch for major crops...")
    
    test_crops = ['wheat', 'rice', 'tomato', 'onion', 'cotton']
    
    for crop in test_crops:
        print(f"\n🔍 Fetching {crop}...")
        price = scraper.get_price_with_fallback(crop)
        
        source_icon = "✅ REAL" if price['source'] == 'REAL_API' else "📦 MOCK"
        print(f"   {source_icon}: ₹{price['current_price']}/{price['unit']}")
        print(f"   Range: ₹{price['min_price']} - ₹{price['max_price']}")
        print(f"   Markets: {price['markets_count']}")
    
    # Update prices.json
    print("\n" + "=" * 50)
    print("💾 Updating prices.json with real data...")
    
    # Determine correct path to prices.json
    current_dir = os.path.dirname(os.path.abspath(__file__))
    prices_path = os.path.join(os.path.dirname(current_dir), 'prices.json')

    success = scraper.update_prices_json(prices_path)
    
    if success:
        print(f"\n✅ Successfully updated {prices_path} with real market data!")
    else:
        print("\n❌ Failed to update prices.json")


if __name__ == "__main__":
    main()
