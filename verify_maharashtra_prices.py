"""
Maharashtra Price Verification Tool
Compare our scraped prices with Google/manual verification

This helps identify discrepancies and validate data accuracy
"""

import sys
import os
from datetime import datetime

# Add backend path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend', 'python'))

try:
    from multi_source_price_scraper import MultiSourcePriceScraper
    SCRAPER_AVAILABLE = True
except ImportError:
    SCRAPER_AVAILABLE = False
    print("⚠️ Scraper not available")

def verify_price(crop_name: str):
    """Verify price for a specific crop with detailed breakdown"""
    
    if not SCRAPER_AVAILABLE:
        print("❌ Cannot verify without scraper")
        return
    
    print("=" * 70)
    print(f"MAHARASHTRA PRICE VERIFICATION: {crop_name.upper()}")
    print("=" * 70)
    
    scraper = MultiSourcePriceScraper()
    result = scraper.get_price(crop_name, 'Maharashtra')
    
    print(f"\n📊 OUR PRICE DATA:")
    print(f"   Crop: {result['crop']}")
    print(f"   Price: ₹{result['price']}/kg")
    print(f"   Source: {result.get('data_source', 'Unknown')}")
    print(f"   Market: {result.get('market', 'Unknown')}")
    print(f"   Confidence: {result.get('confidence', 0)}%")
    print(f"   Timestamp: {result.get('timestamp', 'Unknown')}")
    print(f"   Is Fallback: {result.get('is_fallback', False)}")
    
    # Show unit conversion for verification
    if 'markets' in result and result['markets']:
        print(f"\n📍 MARKET BREAKDOWN (Maharashtra):")
        for i, market in enumerate(result['markets'][:5], 1):
            print(f"   {i}. {market['name']}: ₹{market['price']}/kg")
    
    # Calculate quintal price for comparison
    price_per_quintal = result['price'] * 100
    print(f"\n💰 PRICE CONVERSIONS:")
    print(f"   Per Kg: ₹{result['price']}")
    print(f"   Per Quintal (100kg): ₹{price_per_quintal:.2f}")
    print(f"   Per Ton (1000kg): ₹{result['price'] * 1000:.2f}")
    
    # Guidance for manual verification
    print(f"\n🔍 HOW TO VERIFY ON GOOGLE:")
    print(f"   1. Search: '{crop_name} price today maharashtra'")
    print(f"   2. Look for: 'APMC price' or 'mandi price'")
    print(f"   3. Check unit: Quintal (100kg) or Kg")
    print(f"   4. Compare with our ₹{result['price']}/kg (₹{price_per_quintal:.0f}/quintal)")
    
    print(f"\n⚠️ IMPORTANT NOTES:")
    print(f"   • We show WHOLESALE APMC prices (market prices)")
    print(f"   • Google may show RETAIL prices (shops/consumers)")
    print(f"   • Retail is usually 20-40% higher than wholesale")
    print(f"   • Prices vary by market, variety, and grade")
    print(f"   • Our data is for MODAL (average) price")
    
    if result.get('is_fallback'):
        print(f"\n⚠️ WARNING: Using fallback MSP data!")
        print(f"   Live market data unavailable, showing government MSP estimate")
        print(f"   Actual market prices may differ significantly")
    
    print(f"\n🌐 RECOMMENDED VERIFICATION SOURCES:")
    print(f"   • https://agmarknet.gov.in - Official AgMarkNet")
    print(f"   • https://enam.gov.in - National Agriculture Market")
    print(f"   • https://farmer.gov.in - Farmer Portal")
    print(f"   • Local APMC website for your district")
    
    print("\n" + "=" * 70)
    
    # Interactive comparison
    print(f"\n❓ What price did you find on Google for {crop_name}?")
    print(f"   Enter the price you found (or press Enter to skip):")
    
    try:
        user_input = input("   ₹ ").strip()
        if user_input:
            try:
                google_price = float(user_input)
                our_price = result['price']
                
                # Ask for unit
                print(f"\n   Is that price per Kg or per Quintal?")
                print(f"   Enter 'kg' or 'quintal':")
                unit = input("   ").strip().lower()
                
                if 'quintal' in unit or 'q' == unit:
                    google_price = google_price / 100  # Convert to kg
                    print(f"   (Converted to ₹{google_price}/kg)")
                
                diff = google_price - our_price
                diff_percent = (diff / our_price) * 100
                
                print(f"\n📊 COMPARISON:")
                print(f"   Google Price: ₹{google_price}/kg")
                print(f"   Our Price: ₹{our_price}/kg")
                print(f"   Difference: ₹{abs(diff):.2f}/kg ({abs(diff_percent):.1f}%)")
                
                if abs(diff_percent) < 5:
                    print(f"   ✅ MATCH: Prices match within 5% tolerance")
                elif abs(diff_percent) < 15:
                    print(f"   ⚠️ CLOSE: Prices within 15% (acceptable variation)")
                else:
                    print(f"   ❌ MISMATCH: Significant difference!")
                    if google_price > our_price:
                        print(f"   → Google shows higher (possibly retail price)")
                    else:
                        print(f"   → Google shows lower (check date/source)")
                
            except ValueError:
                print(f"   Invalid price format")
    except EOFError:
        pass
    
    print("\n" + "=" * 70)

if __name__ == '__main__':
    # Get UTF-8 encoding for Windows
    if sys.platform == 'win32':
        try:
            sys.stdout.reconfigure(encoding='utf-8')
        except:
            pass
    
    if len(sys.argv) > 1:
        crop = sys.argv[1]
    else:
        print("📝 Enter crop name to verify (e.g., wheat, rice, tomato):")
        crop = input("   Crop: ").strip()
    
    if crop:
        verify_price(crop)
    else:
        print("❌ No crop specified")
        print("\nUsage: python verify_maharashtra_prices.py <crop_name>")
        print("Example: python verify_maharashtra_prices.py wheat")
