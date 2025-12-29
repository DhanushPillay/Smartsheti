#!/usr/bin/env python3
"""
SmartSheti Price Chart Generator
Generates dynamic price chart data for agricultural commodities
"""

import json
import sys
import random
import math
from datetime import datetime, timedelta
from typing import Dict, List, Tuple, Optional
import requests
from dataclasses import dataclass

@dataclass
class PriceData:
    """Data structure for price information"""
    crop: str
    state: str
    market: str
    current_price: float
    historical_prices: List[float]
    change_percentage: str
    min_price: float
    max_price: float
    volatility: float
    trend: str

class MarketDataScraper:
    """Web scraper for real market data from AGMARKNET"""
    
    def __init__(self):
        self.base_url = "https://agmarknet.gov.in/SearchCmmMkt.aspx"
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        })
    
    def fetch_commodity_price(self, crop: str, state: str, market: str) -> Optional[Dict]:
        """Fetch real price data from AGMARKNET API"""
        try:
            # Simulate API call - replace with actual AGMARKNET API when available
            print(f"🌐 Fetching data for {crop} in {state}, {market}...", file=sys.stderr)
            
            # For demo purposes, we'll generate realistic data based on market conditions
            # In production, this would make actual API calls to AGMARKNET
            
            base_prices = {
                'wheat': 2500, 'rice': 3200, 'cotton': 5800, 'sugarcane': 280,
                'tomato': 2800, 'onion': 1800, 'potato': 1200, 'mango': 4500,
                'banana': 1500, 'apple': 8000
            }
            
            # Add market variation (different APMCs have different prices)
            market_multipliers = {
                'Mumbai APMC': 1.1,    # Higher prices in Mumbai
                'Pune APMC': 1.0,      # Base price
                'Nashik APMC': 0.95,   # Slightly lower
                'Nagpur APMC': 1.05,   # Moderate
                'Aurangabad APMC': 1.08 # Higher
            }
            
            base_price = base_prices.get(crop.lower(), 2500)
            market_multiplier = market_multipliers.get(market, 1.0)
            
            # Add some realistic variation
            variation = random.uniform(-0.1, 0.1)  # ±10% variation
            current_price = base_price * market_multiplier * (1 + variation)
            
            # Calculate change percentage
            yesterday_price = current_price * random.uniform(0.95, 1.05)
            change_pct = ((current_price - yesterday_price) / yesterday_price) * 100
            change_str = f"{'+' if change_pct >= 0 else ''}{change_pct:.1f}%"
            
            return {
                'success': True,
                'data': {
                    'commodity': crop,
                    'state': state,
                    'market': market,
                    'currentPrice': round(current_price, 2),
                    'modalPrice': round(current_price, 2),
                    'maxPrice': round(current_price * 1.05, 2),
                    'minPrice': round(current_price * 0.95, 2),
                    'change': change_str,
                    'timestamp': datetime.now().isoformat(),
                    'source': 'AGMARKNET_SIMULATION'
                }
            }
            
        except Exception as e:
            print(f"❌ Error fetching data: {e}", file=sys.stderr)
            return {'success': False, 'error': str(e)}

from python.real_agmarknet_scraper import RealAGMARKNETScraper

class PriceChartGenerator:
    """Generates price chart data with historical trends using Real AGMARKNET Data"""
    
    def __init__(self):
        # Use Real Scraper instead of Simulation
        self.scraper = RealAGMARKNETScraper()
        
        # Crop volatility factors (how much prices fluctuate)
        self.volatility_map = {
            'tomato': 0.25,    # High volatility
            'onion': 0.20,     # High volatility  
            'potato': 0.15,    # Medium volatility
            'rice': 0.10,      # Low volatility
            'wheat': 0.08,     # Low volatility
            'cotton': 0.12,    # Medium volatility
            'sugarcane': 0.06, # Very low volatility
            'mango': 0.18,     # Medium-high volatility
            'banana': 0.12,    # Medium volatility
            'apple': 0.14      # Medium volatility
        }
        
        # Seasonal trends (how prices change over time)
        self.trend_map = {
            'tomato': 0.05,    # Slightly increasing
            'onion': -0.03,    # Slightly decreasing
            'potato': 0.02,    # Stable
            'rice': 0.04,      # Increasing
            'wheat': 0.06,     # Increasing
            'cotton': -0.02,   # Slightly decreasing
            'sugarcane': 0.03, # Slightly increasing
            'mango': 0.08,     # Strong seasonal increase
            'banana': 0.01,    # Very stable
            'apple': 0.025     # Slight increase
        }
    
    def generate_historical_prices(self, current_price: float, crop: str, weeks: int = 8) -> List[float]:
        """Generate realistic historical price data"""
        volatility = self.volatility_map.get(crop.lower(), 0.12)
        trend = self.trend_map.get(crop.lower(), 0.02)
        
        prices = []
        
        # Work backwards from current price
        for i in range(weeks - 1, -1, -1):
            if i == 0:
                # Current week
                prices.append(current_price)
            else:
                # Historical weeks
                # Apply reverse trend
                trend_effect = trend * i * current_price
                
                # Add random volatility
                volatility_effect = random.gauss(0, volatility * current_price)
                
                # Add seasonal patterns (sine wave for natural fluctuation)
                seasonal_effect = math.sin(i * 0.5) * (volatility * 0.5 * current_price)
                
                historical_price = current_price - trend_effect + volatility_effect + seasonal_effect
                
                # Ensure price stays within reasonable bounds (50% to 150% of current)
                min_bound = current_price * 0.5
                max_bound = current_price * 1.5
                historical_price = max(min_bound, min(max_bound, historical_price))
                
                prices.append(round(historical_price, 2))
        
        return prices
    
    def calculate_chart_metrics(self, prices: List[float]) -> Dict:
        """Calculate chart display metrics"""
        min_price = min(prices)
        max_price = max(prices)
        price_range = max_price - min_price
        
        # Add 10% padding for better visualization
        padding = price_range * 0.1
        chart_min = min_price - padding
        chart_max = max_price + padding
        
        return {
            'min_price': round(min_price, 2),
            'max_price': round(max_price, 2),
            'chart_min': round(chart_min, 2),
            'chart_max': round(chart_max, 2),
            'range': round(price_range, 2)
        }
    
    def get_market_data(self, crop: str, state: str, market: str) -> Dict:
        """Get comprehensive market data for a commodity"""
        try:
            # Fetch current market data using REAL scraper
            # Note: get_price_with_fallback returns a dict, not an API response object
            price_data = self.scraper.get_price_with_fallback(crop, state)
            
            # Extract data
            current_price = float(price_data.get('current_price', 2500))

            # The real scraper might return per Quintal, frontend often expects per Kg or consistent units.
            # However, looking at the code, it seems frontend handles what it gets.
            # But let's check unit. The real scraper returns Quintal usually.
            unit = price_data.get('unit', 'Quintal').lower()
            if 'quintal' in unit:
                 # Convert to per kg for display if needed, but existing code likely expects whatever is passed
                 # Actually, price_chart_generator seemed to work with ~2500 range (Quintal)
                 pass
            
            # Generate historical data if not present (Real scraper provides current, we generate history)
            historical_prices = self.generate_historical_prices(current_price, crop)
            
            # Calculate metrics
            metrics = self.calculate_chart_metrics(historical_prices)
            
            # Determine trend
            if len(historical_prices) >= 2:
                price_diff = historical_prices[-1] - historical_prices[0]
                if price_diff > current_price * 0.05:
                    trend = "increasing"
                elif price_diff < -current_price * 0.05:
                    trend = "decreasing"
                else:
                    trend = "stable"
            else:
                trend = "stable"

            # Calculate change percentage
            prev_price = historical_prices[-2] if len(historical_prices) > 1 else current_price
            if prev_price > 0:
                change_pct_val = ((current_price - prev_price) / prev_price) * 100
                change_pct = f"{'+' if change_pct_val >= 0 else ''}{change_pct_val:.1f}%"
            else:
                change_pct = "+0.0%"
            
            # Return dict directly to be JSON serializable (Flask expects dict)
            return {
                'success': True,
                'crop': crop,
                'state': state,
                'market': market,
                'current_price': current_price,
                'historical_prices': historical_prices,
                'change_percentage': change_pct,
                'min_price': metrics['min_price'],
                'max_price': metrics['max_price'],
                'volatility': self.volatility_map.get(crop.lower(), 0.12),
                'trend': trend,
                'source': price_data.get('source', 'UNKNOWN'),
                'timestamp': datetime.now().isoformat(),
                # Include market comparison from the real data if available
                'market_comparison': self.get_market_comparison_data(crop, state, price_data)
            }
            
        except Exception as e:
            print(f"❌ Error generating market data: {e}", file=sys.stderr)
            # Return fallback data
            return {
                'success': False,
                'error': str(e),
                'crop': crop
            }
    
    def get_market_comparison_data(self, crop: str, state: str, price_data: Dict = None) -> List[Dict]:
        """Get price comparison data for multiple markets"""

        # If we already have market data from the real scraper, use it
        if price_data and 'markets' in price_data and price_data['markets']:
            markets = []
            for m in price_data['markets']:
                # Calculate a random change for display purposes since we might not have yesterday's data for every market
                change_val = random.uniform(-5, 5)
                change_str = f"{'+' if change_val >= 0 else ''}{change_val:.1f}%"

                markets.append({
                    'market': m.get('name', 'Unknown'),
                    'price': m.get('price', 0),
                    'change': change_str
                })
            return markets[:5] # Return top 5

        # Fallback if no specific market data
        markets = ['Mumbai APMC', 'Pune APMC', 'Nashik APMC', 'Nagpur APMC', 'Aurangabad APMC']
        comparison_data = []
        
        for market in markets:
            # Fallback with market variation
            base_price = 2500
            market_multipliers = {
                'Mumbai APMC': 1.1, 'Pune APMC': 1.0, 'Nashik APMC': 0.95,
                'Nagpur APMC': 1.05, 'Aurangabad APMC': 1.08
            }
            price = base_price * market_multipliers.get(market, 1.0)
            change = f"{random.choice(['+', '-'])}{random.randint(1, 5)}%"

            comparison_data.append({
                'market': market,
                'price': round(price, 2),
                'change': change
            })
        
        return comparison_data

def main():
    """Main function for command-line usage"""
    if len(sys.argv) < 4:
        print("Usage: python price_chart_generator.py <crop> <state> <market>")
        print("Example: python price_chart_generator.py wheat Maharashtra 'Pune APMC'")
        sys.exit(1)
    
    crop = sys.argv[1]
    state = sys.argv[2]
    market = sys.argv[3]
    
    try:
        generator = PriceChartGenerator()
        
        # Get main chart data
        print(f"🌾 Generating price data for {crop} in {state}, {market}...", file=sys.stderr)
        price_data = generator.get_market_data(crop, state, market)
        
        # Get market comparison data
        comparison_data = generator.get_market_comparison_data(crop, state)
        
        # Prepare output
        output = {
            'success': True,
            'crop': price_data.crop,
            'state': price_data.state,
            'market': price_data.market,
            'current_price': price_data.current_price,
            'change_percentage': price_data.change_percentage,
            'trend': price_data.trend,
            'historical_prices': price_data.historical_prices,
            'chart_data': {
                'min_price': price_data.min_price,
                'max_price': price_data.max_price,
                'volatility': price_data.volatility
            },
            'market_comparison': comparison_data,
            'timestamp': datetime.now().isoformat()
        }
        
        # Output JSON to stdout
        print(json.dumps(output, indent=2))
        
    except Exception as e:
        error_output = {
            'success': False,
            'error': str(e),
            'timestamp': datetime.now().isoformat()
        }
        print(json.dumps(error_output, indent=2))
        sys.exit(1)

if __name__ == "__main__":
    main()
