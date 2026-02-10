"""
Simple Price Prediction Module
Uses moving averages to predict next week's prices
"""

from typing import List, Dict, Tuple
from statistics import mean
import math


class SimplePricePredictor:
    """Simple moving average-based price prediction"""
    
    def __init__(self):
        self.confidence_threshold = 0.7  # 70% confidence for predictions
        
    def predict_next_week(self, historical_prices: List[float]) -> Dict:
        """
        Predict next week's price based on historical trend
        
        Args:
            historical_prices: List of prices (oldest to newest)
            
        Returns:
            Dict with predicted_price, confidence, trend_direction, min_price, max_price
        """
        
        if len(historical_prices) < 3:
            return {
                'predicted_price': historical_prices[-1] if historical_prices else 0,
                'confidence': 0,
                'trend_direction': 'unknown',
                'min_price': 0,
                'max_price': 0,
                'error': 'Insufficient historical data'
            }
        
        # Calculate moving averages
        short_term_avg = mean(historical_prices[-3:])  # Last 3 weeks
        long_term_avg = mean(historical_prices)  # All weeks
        
        # Calculate trend
        trend = self._calculate_trend(historical_prices)
        
        # Calculate volatility (standard deviation)
        volatility = self._calculate_volatility(historical_prices)
        
        # Predict next price using weighted average with trend
        current_price = historical_prices[-1]
        
        # Weight recent data more heavily
        weights = [0.2, 0.3, 0.5]  # For last 3 weeks
        weighted_recent = sum(p * w for p, w in zip(historical_prices[-3:], weights))
        
        # Apply trend
        predicted = weighted_recent + (trend * current_price * 0.1)
        
        # Bound prediction to reasonable range
        min_bound = current_price * 0.85  # Max 15% decrease
        max_bound = current_price * 1.15  # Max 15% increase
        predicted = max(min_bound, min(max_bound, predicted))
        
        # Calculate prediction range
        margin = volatility * 0.5  # Half volatility as margin
        min_price = max(0, predicted - margin)
        max_price = predicted + margin
        
        # Determine confidence based on volatility
        confidence = self._calculate_confidence(volatility, len(historical_prices))
        
        # Determine trend direction
        if trend > 0.02:
            direction = 'upward'
        elif trend < -0.02:
            direction = 'downward'
        else:
            direction = 'stable'
        
        return {
            'predicted_price': round(predicted, 2),
            'confidence': round(confidence * 100, 1),
            'trend_direction': direction,
            'min_price': round(min_price, 2),
            'max_price': round(max_price, 2),
            'volatility': round(volatility, 2),
            'trend_strength': abs(trend)
        }
    
    def _calculate_trend(self, prices: List[float]) -> float:
        """Calculate price trend using linear regression slope"""
        
        n = len(prices)
        if n < 2:
            return 0.0
        
        # Simple linear regression
        x_mean = (n - 1) / 2
        y_mean = mean(prices)
        
        numerator = sum((i - x_mean) * (prices[i] - y_mean) for i in range(n))
        denominator = sum((i - x_mean) ** 2 for i in range(n))
        
        if denominator == 0:
            return 0.0
        
        slope = numerator / denominator
        
        # Normalize slope relative to price
        normalized_slope = slope / y_mean if y_mean > 0 else 0
        
        return normalized_slope
    
    def _calculate_volatility(self, prices: List[float]) -> float:
        """Calculate price volatility (standard deviation)"""
        
        if len(prices) < 2:
            return 0.0
        
        avg = mean(prices)
        variance = sum((p - avg) ** 2 for p in prices) / len(prices)
        std_dev = math.sqrt(variance)
        
        return std_dev
    
    def _calculate_confidence(self, volatility: float, data_points: int) -> float:
        """
        Calculate prediction confidence based on volatility and data availability
        
        Lower volatility = higher confidence
        More data points = higher confidence
        """
        
        # Volatility factor (0-1, where 0 = high volatility, 1 = low volatility)
        max_volatility = 100  # Assume max volatility is 100
        volatility_factor = max(0, 1 - (volatility / max_volatility))
        
        # Data points factor (0-1, where more data = higher confidence)
        data_factor = min(1.0, data_points / 12)  # 12 weeks = full confidence
        
        # Combined confidence (weighted average)
        confidence = (volatility_factor * 0.7) + (data_factor * 0.3)
        
        return max(0.0, min(1.0, confidence))
    
    def analyze_seasonal_pattern(self, prices: List[float], weeks: int = 8) -> Dict:
        """
        Analyze if there's a seasonal pattern in price data
        
        Returns:
            Dict with seasonal_factor, pattern_detected, description
        """
        
        if len(prices) < weeks:
            return {
                'seasonal_factor': 1.0,
                'pattern_detected': False,
                'description': 'Insufficient data for seasonal analysis'
            }
        
        # Check for repeating patterns (simple autocorrelation)
        recent = prices[-weeks:]
        
        # Calculate if prices are trending in same direction consistently
        changes = [recent[i+1] - recent[i] for i in range(len(recent)-1)]
        positive_changes = sum(1 for c in changes if c > 0)
        
        if positive_changes > len(changes) * 0.7:
            return {
                'seasonal_factor': 1.05,
                'pattern_detected': True,
                'description': 'Strong upward seasonal trend detected'
            }
        elif positive_changes < len(changes) * 0.3:
            return {
                'seasonal_factor': 0.95,
                'pattern_detected': True,
                'description': 'Strong downward seasonal trend detected'
            }
        else:
            return {
                'seasonal_factor': 1.0,
                'pattern_detected': False,
                'description': 'No clear seasonal pattern'
            }


# Convenience function
def predict_crop_price(historical_prices: List[float]) -> Dict:
    """Quick function to get price prediction"""
    predictor = SimplePricePredictor()
    return predictor.predict_next_week(historical_prices)


# CLI testing
if __name__ == '__main__':
    # Test with sample data
    test_data = [
        {
            'crop': 'Wheat',
            'prices': [24, 23.5, 24.2, 25.1, 24.8, 25.3, 25.7, 26.2]
        },
        {
            'crop': 'Rice',
            'prices': [32, 31, 33, 32.5, 34, 33.8, 32.9, 33.2]
        },
        {
            'crop': 'Tomato (volatile)',
            'prices': [30, 45, 28, 50, 35, 48, 32, 42]
        }
    ]
    
    predictor = SimplePricePredictor()
    
    print("=" * 70)
    print("Simple Price Predictor - Test Mode")
    print("=" * 70)
    
    for test in test_data:
        crop = test['crop']
        prices = test['prices']
        
        print(f"\n{'=' * 70}")
        print(f"Crop: {crop}")
        print(f"Historical Prices (8 weeks): {prices}")
        print('-' * 70)
        
        prediction = predictor.predict_next_week(prices)
        
        print(f"\n📊 Prediction for next week:")
        print(f"   Expected Price: ₹{prediction['predicted_price']}/kg")
        print(f"   Price Range: ₹{prediction['min_price']} - ₹{prediction['max_price']}/kg")
        print(f"   Confidence: {prediction['confidence']}%")
        print(f"   Trend: {prediction['trend_direction']}")
        print(f"   Volatility: ₹{prediction['volatility']}/kg")
        
        # Seasonal analysis
        seasonal = predictor.analyze_seasonal_pattern(prices)
        print(f"\n🌾 Seasonal Analysis:")
        print(f"   Pattern Detected: {seasonal['pattern_detected']}")
        print(f"   {seasonal['description']}")
    
    print(f"\n{'=' * 70}")
    print("✅ Testing Complete!")
    print('=' * 70)
