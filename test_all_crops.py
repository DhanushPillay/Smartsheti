"""Test Maharashtra prices for all major crops"""
import sys
sys.path.insert(0, 'backend/python')

from agmarknet_scraper import AgMarkNetScraper

# Setup UTF-8 for Windows
if sys.platform == 'win32':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except:
        pass

scraper = AgMarkNetScraper()

# Comprehensive crop list for Maharashtra
crops = {
    'Cereals': ['wheat', 'rice', 'maize', 'jowar', 'bajra'],
    'Pulses': ['gram', 'tur', 'moong', 'urad', 'masoor'],
    'Oilseeds': ['groundnut', 'soybean', 'sunflower', 'safflower'],
    'Commercial': ['cotton', 'sugarcane', 'turmeric', 'chilli'],
    'Vegetables': ['tomato', 'onion', 'potato', 'cabbage', 'cauliflower', 'brinjal', 'okra', 'cucumber'],
    'Fruits': ['banana', 'mango', 'orange', 'pomegranate', 'grapes', 'apple', 'papaya']
}

print('\n' + '='*80)
print('🌾 COMPREHENSIVE MAHARASHTRA APMC PRICE TEST')
print('='*80)

total_success = 0
total_tested = 0

for category, crop_list in crops.items():
    print(f'\n📊 {category.upper()}:')
    print('-' * 80)
    
    for crop in crop_list:
        total_tested += 1
        try:
            result = scraper.get_current_prices(crop, 'Maharashtra')
            if result:
                price_kg = result['price']
                price_quintal = price_kg * 100
                market = result.get('market', 'Maharashtra')
                confidence = result.get('confidence', 0)
                
                # Show different markets if available
                markets_info = ""
                if 'markets' in result and len(result['markets']) > 1:
                    markets_info = f" ({len(result['markets'])} markets)"
                
                print(f'  ✅ {crop.capitalize():15} ₹{price_kg:6.2f}/kg  (₹{price_quintal:7,.0f}/qtl)  {market}{markets_info}')
                total_success += 1
            else:
                print(f'  ⚠️  {crop.capitalize():15} No data available from AgMarkNet today')
        except Exception as e:
            print(f'  ❌ {crop.capitalize():15} Error: {str(e)[:50]}')

print('\n' + '='*80)
print(f'📈 SUMMARY:')
print(f'   Total Crops Tested: {total_tested}')
print(f'   Successfully Fetched: {total_success}')
print(f'   Success Rate: {(total_success/total_tested)*100:.1f}%')
print('='*80)

print('\n💡 NOTES:')
print('  • ✅ = Live data available from AgMarkNet')
print('  • ⚠️  = No arrivals today (crop not traded today in Maharashtra APMCs)')
print('  • Prices are WHOLESALE APMC prices (what farmers receive)')
print('  • Retail shop prices are typically 25-40% higher')
print('  • qtl = quintal = 100 kg')
print('')
print('🔍 TO VERIFY ON GOOGLE:')
print('  Search: "<crop> price maharashtra APMC today"')
print('  Example: "tomato price maharashtra APMC today"')
print('  Look for price per quintal, divide by 100 to get price per kg')
print('='*80 + '\n')
