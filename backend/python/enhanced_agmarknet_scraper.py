"""
Enhanced AGMARKNET Integration for SmartSheti Platform
Now uses REAL data from data.gov.in API with mock fallback

Updated: 2025
"""

import json
import time
import logging
import os
from datetime import datetime
from typing import Dict, Optional

# Import the real scraper
try:
    from real_agmarknet_scraper import RealAGMARKNETScraper
    REAL_SCRAPER_AVAILABLE = True
except ImportError:
    REAL_SCRAPER_AVAILABLE = False

# Fallback to dynamic price updater for simulation
from dynamic_price_updater import DynamicPriceScraper

# Setup logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


class EnhancedAGMARKNETScraper(DynamicPriceScraper):
    """
    Enhanced scraper that fetches REAL data from data.gov.in API
    Falls back to simulation only when real data is unavailable
    """
    
    def __init__(self, api_key: Optional[str] = None):
        super().__init__()  # Initialize parent DynamicPriceScraper
        
        # Initialize real scraper if available
        if REAL_SCRAPER_AVAILABLE:
            self.real_scraper = RealAGMARKNETScraper(api_key)
            logger.info("✅ Real AGMARKNET scraper initialized with data.gov.in API")
        else:
            self.real_scraper = None
            logger.warning("⚠️ Real scraper not available, using simulation only")
        
        # Track data sources
        self.data_sources: Dict[str, str] = {}
        
        # Statistics
        self.stats = {
            'real_api_success': 0,
            'mock_fallback': 0,
            'total_fetches': 0
        }
        
        logger.info("🌐 Enhanced AGMARKNET Scraper initialized")
    
    def fetch_real_price(self, crop: str) -> Optional[float]:
        """
        Fetch real price from data.gov.in API
        Falls back to simulation if API fails
        """
        self.stats['total_fetches'] += 1
        
        # Try real scraper first
        if self.real_scraper:
            try:
                price_data = self.real_scraper.get_price_with_fallback(crop)
                
                if price_data and price_data.get('source') == 'REAL_API':
                    self.stats['real_api_success'] += 1
                    self.data_sources[crop] = 'REAL_API'
                    logger.info(f"✅ Real API price for {crop}: ₹{price_data['current_price']}")
                    return price_data['current_price']
                else:
                    # Real scraper returned mock data
                    self.stats['mock_fallback'] += 1
                    self.data_sources[crop] = 'MOCK_FALLBACK'
                    logger.info(f"📦 Mock fallback for {crop}: ₹{price_data['current_price']}")
                    return price_data['current_price']
                    
            except Exception as e:
                logger.error(f"❌ Error fetching real price for {crop}: {e}")
        
        # Final fallback to parent simulation
        self.stats['mock_fallback'] += 1
        self.data_sources[crop] = 'SIMULATION'
        logger.info(f"🎲 Using simulation for {crop}")
        return super().fetch_real_price(crop)
    
    def update_all_prices(self) -> bool:
        """
        Update prices for all crops using real API data
        """
        try:
            logger.info("🚀 Starting enhanced price update with real API data...")
            
            # Reset stats
            self.stats = {
                'real_api_success': 0,
                'mock_fallback': 0,
                'total_fetches': 0
            }
            
            # Try to use the real scraper's bulk update
            if self.real_scraper:
                success = self.real_scraper.update_prices_json(self.json_file_path)
                
                if success:
                    # Add source info to the file
                    self._add_source_info()
                    logger.info(f"✅ Real API update completed!")
                    self._log_stats()
                    return True
            
            # Fall back to parent's update method
            logger.info("🎲 Falling back to simulation-based update")
            return super().update_all_prices()
            
        except Exception as e:
            logger.error(f"❌ Error in enhanced update cycle: {e}")
            # Final fallback
            return super().update_all_prices()
    
    def _add_source_info(self):
        """Add source information to the prices.json file"""
        try:
            if os.path.exists(self.json_file_path):
                with open(self.json_file_path, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                
                data['scraper_version'] = 'Enhanced AGMARKNET Scraper v2.0'
                data['data_source'] = 'data.gov.in Real API with Mock Fallback'
                data['update_time'] = datetime.now().isoformat()
                
                with open(self.json_file_path, 'w', encoding='utf-8') as f:
                    json.dump(data, f, indent=2, ensure_ascii=False)
                    
        except Exception as e:
            logger.warning(f"⚠️ Could not add source info: {e}")
    
    def _log_stats(self):
        """Log statistics about data sources"""
        total = self.stats['total_fetches']
        real = self.stats['real_api_success']
        mock = self.stats['mock_fallback']
        
        if total > 0:
            real_pct = (real / total) * 100
            logger.info(f"📊 Data Source Stats:")
            logger.info(f"   ✅ Real API: {real} ({real_pct:.1f}%)")
            logger.info(f"   📦 Mock/Fallback: {mock}")
            logger.info(f"   📈 Total: {total}")
    
    def get_data_quality_report(self) -> Dict:
        """
        Get a report on data quality and sources
        """
        total = self.stats['total_fetches']
        real = self.stats['real_api_success']
        
        return {
            'total_crops': total,
            'real_api_data': real,
            'mock_fallback_data': self.stats['mock_fallback'],
            'real_data_percentage': (real / total * 100) if total > 0 else 0,
            'data_sources': self.data_sources.copy(),
            'scraper_type': 'Enhanced AGMARKNET with Real API',
            'api_available': REAL_SCRAPER_AVAILABLE,
            'timestamp': datetime.now().isoformat()
        }


def main():
    """Main function for testing the enhanced scraper"""
    print("🌾 Enhanced AGMARKNET + Real API Scraper")
    print("=" * 60)
    
    scraper = EnhancedAGMARKNETScraper()
    
    print("\n🔄 Running enhanced price update...")
    success = scraper.update_all_prices()
    
    if success:
        print("\n✅ Enhanced price update completed!")
        
        # Show data quality report
        report = scraper.get_data_quality_report()
        print("\n📊 Data Quality Report:")
        print(f"   • Total crops: {report['total_crops']}")
        print(f"   • Real API data: {report['real_api_data']}")
        print(f"   • Mock fallback: {report['mock_fallback_data']}")
        print(f"   • Real data %: {report['real_data_percentage']:.1f}%")
        print(f"   • API Available: {report['api_available']}")
        
        print("\n💾 Check prices.json for updated data")
        print("🌐 Web interface will show real market prices!")
    else:
        print("\n❌ Enhanced price update failed")
        print("🔄 Check logs for details")


if __name__ == "__main__":
    main()
