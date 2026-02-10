#!/usr/bin/env python3
"""
Price Data Consolidator
Merges all price sources into single authoritative prices.json
"""

import json
import sys
import os
from datetime import datetime
from pathlib import Path

# Add backend path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend', 'python'))

try:
    from multi_source_price_scraper import MultiSourcePriceScraper
    SCRAPER_AVAILABLE = True
except ImportError:
    SCRAPER_AVAILABLE = False
    print("⚠️  Multi-source scraper not available")

# Paths
BASE_DIR = Path(__file__).parent
DATA_DIR = BASE_DIR / 'data' / 'json'
BACKEND_DIR = BASE_DIR / 'backend'

# Priority crops to fetch
PRIORITY_CROPS = [
    'wheat', 'rice', 'cotton', 'sugarcane', 'soybean',
    'tomato', 'onion', 'potato', 'maize', 'jowar',
    'bajra', 'tur', 'groundnut', 'banana', 'mango'
]

def consolidate_prices():
    """Fetch and consolidate prices from multi-source scraper"""
    
    print("=" * 60)
    print("SmartSheti Price Data Consolidator")
    print("=" * 60)
    
    if not SCRAPER_AVAILABLE:
        print("❌ Cannot consolidate without scraper. Install dependencies first.")
        return False
    
    # Initialize scraper
    scraper = MultiSourcePriceScraper()
    
    consolidated = {}
    successful = 0
    failed = 0
    
    print(f"\n📊 Fetching prices for {len(PRIORITY_CROPS)} crops...")
    print("-" * 60)
    
    for crop in PRIORITY_CROPS:
        try:
            print(f"Fetching {crop}...", end=" ")
            price_data = scraper.get_price(crop, 'Maharashtra')
            
            if price_data and price_data.get('price', 0) > 0:
                # Store in consolidated format
                consolidated[crop] = {
                    'crop': crop,
                    'price': price_data['price'],
                    'unit': 'kg',
                    'historical_prices': price_data.get('historical_prices', []),
                    'market': price_data.get('market', 'Unknown'),
                    'state': 'Maharashtra',
                    'source': price_data.get('data_source', 'Unknown'),
                    'confidence': price_data.get('confidence', 0),
                    'timestamp': price_data.get('timestamp', datetime.now().isoformat()),
                    'is_fallback': price_data.get('is_fallback', False),
                    'market_comparison': price_data.get('market_comparison', [])
                }
                
                print(f"✅ ₹{price_data['price']}/kg from {price_data.get('data_source', 'Unknown')}")
                successful += 1
            else:
                print(f"❌ No data")
                failed += 1
                
        except Exception as e:
            print(f"❌ Error: {str(e)}")
            failed += 1
    
    # Save consolidated prices
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    prices_file = DATA_DIR / 'prices.json'
    
    with open(prices_file, 'w', encoding='utf-8') as f:
        json.dump(consolidated, f, indent=2, ensure_ascii=False)
    
    print("\n" + "=" * 60)
    print(f"✅ Consolidation complete!")
    print(f"   Successful: {successful}/{len(PRIORITY_CROPS)}")
    print(f"   Failed: {failed}/{len(PRIORITY_CROPS)}")
    print(f"   Saved to: {prices_file}")
    print("=" * 60)
    
    # Remove old backend/prices.json (deprecated)
    old_backend_file = BACKEND_DIR / 'prices.json'
    if old_backend_file.exists():
        old_backend_file.unlink()
        print(f"🗑️  Removed deprecated {old_backend_file}")
    
    return True

if __name__ == '__main__':
    success = consolidate_prices()
    sys.exit(0 if success else 1)
