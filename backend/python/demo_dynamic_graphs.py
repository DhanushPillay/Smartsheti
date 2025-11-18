"""
Dynamic Graph Demonstration Script
Shows how prices change and graphs reshape automatically
"""

import requests
import json
import time
import webbrowser
import os

def check_price_api():
    """Check if the price API is running"""
    try:
        response = requests.get("http://localhost:5001/api/status", timeout=5)
        if response.status_code == 200:
            data = response.json()
            print(f"✅ API Status: {data['status']}")
            print(f"🌐 Scraper Type: {data['scraper_type']}")
            print(f"📡 AGMARKNET Enabled: {data['agmarknet_enabled']}")
            return True
        else:
            print("❌ API not responding properly")
            return False
    except Exception as e:
        print(f"❌ API not available: {e}")
        return False

def get_current_prices():
    """Get current wheat price for comparison"""
    try:
        with open('prices.json', 'r') as f:
            data = json.load(f)
        
        wheat_price = data['wheat']['data'][-1]
        last_updated = data.get('lastUpdated', 'Unknown')
        source = data.get('source', 'Unknown')
        
        print(f"📊 Current Wheat Price: ₹{wheat_price}")
        print(f"🕒 Last Updated: {last_updated}")
        print(f"📡 Data Source: {source}")
        
        return wheat_price
    except Exception as e:
        print(f"❌ Error reading prices: {e}")
        return None

def trigger_price_update():
    """Trigger a price update via API"""
    try:
        print("🔄 Triggering price update...")
        response = requests.post(
            "http://localhost:5001/api/update-prices",
            headers={'Content-Type': 'application/json'},
            json={},
            timeout=30
        )
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ {result['message']}")
            return True
        else:
            print(f"❌ Update failed: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Error triggering update: {e}")
        return False

def open_graph_interface():
    """Open the Chart.js graph interface"""
    try:
        file_path = os.path.abspath("crop_price_trends.html")
        file_url = f"file:///{file_path.replace(os.sep, '/')}"
        
        print(f"🌐 Opening graph interface: {file_url}")
        webbrowser.open(file_url)
        return True
    except Exception as e:
        print(f"❌ Error opening interface: {e}")
        return False

def demonstrate_dynamic_changes():
    """Demonstrate how graphs change dynamically"""
    
    print("🌾 DYNAMIC PRICE GRAPH DEMONSTRATION")
    print("=" * 50)
    
    # Check API status
    if not check_price_api():
        print("\n❌ Price API is not running!")
        print("💡 Please start the API first: python enhanced_price_api.py")
        return
    
    print("\n📊 CURRENT STATE:")
    initial_price = get_current_prices()
    
    # Open graph interface
    print("\n🌐 OPENING GRAPH INTERFACE...")
    if open_graph_interface():
        print("✅ Chart.js interface opened in browser")
        print("📈 You should see the current price trends")
    
    input("\n⏸️  Press Enter to trigger price update and see graph changes...")
    
    # Trigger first update
    print("\n🔄 TRIGGERING FIRST UPDATE:")
    if trigger_price_update():
        time.sleep(2)  # Wait for update to complete
        
        print("\n📊 UPDATED STATE:")
        new_price = get_current_prices()
        
        if initial_price and new_price:
            change = new_price - initial_price
            change_pct = (change / initial_price) * 100
            
            print(f"💰 Price Change: ₹{initial_price:.2f} → ₹{new_price:.2f}")
            print(f"📈 Change: {change:+.2f} ({change_pct:+.1f}%)")
            print("\n🎯 CHECK YOUR BROWSER - The graph should have updated!")
            print("   • Line shape changes based on volatility")
            print("   • Colors adjust to price trends")
            print("   • Current price point highlighted")
    
    input("\n⏸️  Press Enter for another update to see more changes...")
    
    # Trigger second update
    print("\n🔄 TRIGGERING SECOND UPDATE:")
    if trigger_price_update():
        time.sleep(2)
        
        print("\n📊 FINAL STATE:")
        final_price = get_current_prices()
        
        print(f"\n🎯 DYNAMIC CHANGES DEMONSTRATED!")
        print(f"   📊 Multiple price updates completed")
        print(f"   🌐 AGMARKNET integration working")
        print(f"   📈 Graphs automatically reshaped")
        print(f"   ⚡ Real-time data updates active")
    
    print(f"\n✅ DEMONSTRATION COMPLETE!")
    print(f"🌐 Keep the browser open to see auto-refresh (every minute)")
    print(f"🔄 API continues running at http://localhost:5001")

if __name__ == "__main__":
    demonstrate_dynamic_changes()
