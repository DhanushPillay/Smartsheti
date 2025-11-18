"""
Enhanced AGMARKNET Integration for SmartSheti Platform
Combines real AGMARKNET data with our dynamic pricing system
"""

import requests
import json
import time
import logging
from datetime import datetime, timedelta
import re
from bs4 import BeautifulSoup
import random
from dynamic_price_updater import DynamicPriceScraper

# Setup logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class EnhancedAGMARKNETScraper(DynamicPriceScraper):
    """Enhanced scraper that tries to fetch real AGMARKNET data first, then falls back to simulation"""
    
    def __init__(self):
        super().__init__()  # Initialize parent DynamicPriceScraper
        
        self.agmarknet_base_url = "https://agmarknet.gov.in"
        self.agmarknet_session = requests.Session()
        self.agmarknet_session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
        })
        
        # Mapping our crops to AGMARKNET commodity names
        self.agmarknet_crop_mapping = {
            'wheat': ['Wheat', 'Wheat (Dara)', 'Wheat Common'],
            'cotton': ['Cotton', 'Cotton (Kapas)', 'Cotton Seed'],
            'rice': ['Paddy(Dhan)(Common)', 'Rice', 'Paddy Dhan'],
            'soyabean': ['Soyabean', 'Soya Bean', 'Soybean'],
            'sugarcane': ['Sugarcane', 'Sugar Cane'],
            'tomato': ['Tomato', 'Tomato Hybrid', 'Tomato Local'],
            'onion': ['Onion', 'Onion Big', 'Onion Medium'],
            'potato': ['Potato', 'Potato Red', 'Potato White']
        }
        
        logger.info("🌐 Enhanced AGMARKNET Scraper initialized")

    def test_agmarknet_connection(self):
        """Test if AGMARKNET is accessible"""
        try:
            logger.info("🔍 Testing AGMARKNET connection...")
            response = self.agmarknet_session.get(f"{self.agmarknet_base_url}", timeout=10)
            
            if response.status_code == 200:
                logger.info("✅ AGMARKNET connection successful")
                return True
            else:
                logger.warning(f"⚠️ AGMARKNET returned status {response.status_code}")
                return False
                
        except Exception as e:
            logger.warning(f"⚠️ AGMARKNET connection failed: {e}")
            return False

    def scrape_agmarknet_price(self, crop):
        """Attempt to scrape real price from AGMARKNET"""
        try:
            crop_variants = self.agmarknet_crop_mapping.get(crop, [crop])
            
            for variant in crop_variants:
                try:
                    logger.info(f"🌐 Searching AGMARKNET for {variant}...")
                    
                    # Try different AGMARKNET endpoints
                    search_urls = [
                        f"{self.agmarknet_base_url}/SearchCommodity.aspx",
                        f"{self.agmarknet_base_url}/PriceTrendDashboard/PriceTrend.aspx"
                    ]
                    
                    for url in search_urls:
                        response = self.agmarknet_session.get(url, timeout=15)
                        if response.status_code == 200:
                            soup = BeautifulSoup(response.text, 'html.parser')
                            
                            # Look for price data in the page
                            price = self.extract_price_from_agmarknet_page(soup, variant)
                            if price:
                                logger.info(f"✅ Found AGMARKNET price for {crop}: ₹{price}")
                                return price
                    
                    # Small delay between requests
                    time.sleep(1)
                    
                except Exception as e:
                    logger.debug(f"Failed to fetch {variant}: {e}")
                    continue
            
            return None
            
        except Exception as e:
            logger.error(f"❌ Error scraping AGMARKNET for {crop}: {e}")
            return None

    def extract_price_from_agmarknet_page(self, soup, commodity):
        """Extract price data from AGMARKNET HTML"""
        try:
            # Get all text content
            page_text = soup.get_text()
            
            # Look for commodity name followed by price patterns
            commodity_pattern = re.escape(commodity.lower())
            
            # Search for price patterns near commodity mentions
            price_patterns = [
                rf'{commodity_pattern}.*?₹\s*(\d+(?:,\d+)*(?:\.\d+)?)',
                rf'{commodity_pattern}.*?rs\.?\s*(\d+(?:,\d+)*(?:\.\d+)?)',
                rf'₹\s*(\d+(?:,\d+)*(?:\.\d+)?).*?{commodity_pattern}',
                rf'(\d+(?:,\d+)*(?:\.\d+)?)\s*(?:₹|rs|inr).*?{commodity_pattern}'
            ]
            
            for pattern in price_patterns:
                matches = re.findall(pattern, page_text.lower(), re.IGNORECASE | re.DOTALL)
                if matches:
                    for match in matches:
                        try:
                            price_str = match.replace(',', '').strip()
                            price = float(price_str)
                            
                            # Validate reasonable price range for agricultural commodities
                            if 50 <= price <= 50000:
                                return price
                        except (ValueError, TypeError):
                            continue
            
            # If no specific patterns found, look for any reasonable prices in tables
            tables = soup.find_all('table')
            for table in tables:
                if commodity.lower() in table.get_text().lower():
                    cells = table.find_all(['td', 'th'])
                    for cell in cells:
                        cell_text = cell.get_text().strip()
                        price_match = re.search(r'(\d+(?:,\d+)*(?:\.\d+)?)', cell_text)
                        if price_match:
                            try:
                                price = float(price_match.group(1).replace(',', ''))
                                if 50 <= price <= 50000:
                                    return price
                            except (ValueError, TypeError):
                                continue
            
            return None
            
        except Exception as e:
            logger.debug(f"Error extracting price from AGMARKNET page: {e}")
            return None

    def fetch_real_price(self, crop):
        """Enhanced price fetching with AGMARKNET integration"""
        try:
            # First try to get real data from AGMARKNET
            if hasattr(self, '_agmarknet_available') and self._agmarknet_available:
                agmarknet_price = self.scrape_agmarknet_price(crop)
                if agmarknet_price:
                    logger.info(f"🌐 Using AGMARKNET price for {crop}: ₹{agmarknet_price}")
                    return agmarknet_price
            
            # Fall back to enhanced simulation (from parent class)
            logger.info(f"🎲 Using enhanced simulation for {crop}")
            return super().fetch_real_price(crop)
            
        except Exception as e:
            logger.error(f"❌ Error in fetch_real_price for {crop}: {e}")
            # Final fallback to parent simulation
            return super().fetch_real_price(crop)

    def update_all_prices(self):
        """Enhanced update with AGMARKNET integration"""
        try:
            logger.info("🚀 Starting enhanced price update cycle...")
            
            # Test AGMARKNET availability
            self._agmarknet_available = self.test_agmarknet_connection()
            
            if self._agmarknet_available:
                logger.info("🌐 AGMARKNET available - attempting to fetch real data")
            else:
                logger.info("🎲 AGMARKNET unavailable - using enhanced simulation")
            
            # Update source information
            if self._agmarknet_available:
                self.data_source = "AGMARKNET + Enhanced Simulation"
            else:
                self.data_source = "Enhanced Market Simulation"
            
            # Use parent class update logic with enhanced price fetching
            return super().update_all_prices()
            
        except Exception as e:
            logger.error(f"❌ Error in enhanced update cycle: {e}")
            return False

def main():
    """Main function for testing the enhanced scraper"""
    print("🌾 Enhanced AGMARKNET + SmartSheti Price Scraper")
    print("=" * 60)
    
    scraper = EnhancedAGMARKNETScraper()
    
    print("\n🔄 Running enhanced price update...")
    success = scraper.update_all_prices()
    
    if success:
        print("\n✅ Enhanced price update completed!")
        print("📊 Data source: AGMARKNET + Market Simulation")
        print("💾 Check prices.json for updated data")
        print("🌐 Web interface will show dynamic graph changes")
    else:
        print("\n❌ Enhanced price update failed")
        print("🔄 Check logs for details")

if __name__ == "__main__":
    main()
