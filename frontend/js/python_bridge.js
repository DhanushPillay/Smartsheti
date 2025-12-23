/**
 * SmartSheti Python Bridge
 * Connects HTML frontend with Python price chart generator via backend API
 */

class PythonPriceChartBridge {
    constructor() {
        this.apiBaseUrl = '/api';
        this.cache = new Map();
        this.cacheTimeout = 5 * 60 * 1000; // 5 minutes cache
        this.backendAvailable = false;
        this.checkBackendAvailability();
    }

    /**
     * Check if backend API is available
     */
    async checkBackendAvailability() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/health`, {
                method: 'GET',
                timeout: 5000
            });

            if (response.ok) {
                this.backendAvailable = true;
                console.log('✅ Python backend API is available');
            } else {
                this.backendAvailable = false;
                console.log('⚠️ Python backend API not responding, using simulation mode');
            }
        } catch (error) {
            this.backendAvailable = false;
            console.log('⚠️ Python backend API not available, using simulation mode');
        }
    }

    /**
     * Execute Python script and get price data
     */
    async fetchPriceData(crop, state, market) {
        const cacheKey = `${crop}-${state}-${market}`;

        // Check cache first
        if (this.cache.has(cacheKey)) {
            const cached = this.cache.get(cacheKey);
            if (Date.now() - cached.timestamp < this.cacheTimeout) {
                console.log(`📋 Using cached data for ${crop}`);
                return cached.data;
            }
        }

        try {
            let response;

            if (this.backendAvailable) {
                console.log(`🐍 Fetching data from Python backend for ${crop} in ${state}, ${market}`);
                response = await this.fetchFromBackend(crop, state, market);
            } else {
                console.log(`🔄 Backend unavailable, using simulation for ${crop} in ${state}, ${market}`);
                response = await this.simulatePythonCall(crop, state, market);
            }

            // Cache the result
            this.cache.set(cacheKey, {
                data: response,
                timestamp: Date.now()
            });

            return response;

        } catch (error) {
            console.error('❌ Error fetching price data:', error);

            // Fallback to simulation if backend fails
            console.log('🔄 Falling back to simulation mode');
            const fallbackResponse = await this.simulatePythonCall(crop, state, market);

            this.cache.set(cacheKey, {
                data: fallbackResponse,
                timestamp: Date.now()
            });

            return fallbackResponse;
        }
    }

    /**
     * Fetch data from Python backend API
     */
    async fetchFromBackend(crop, state, market) {
        const params = new URLSearchParams({
            crop: crop,
            state: state,
            market: market
        });

        const response = await fetch(`${this.apiBaseUrl}/price-data?${params}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            timeout: 10000
        });

        if (!response.ok) {
            throw new Error(`Backend API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        if (!data.success) {
            throw new Error(`Backend error: ${data.error}`);
        }

        console.log('✅ Data successfully fetched from Python backend');
        return data;
    }

    /**
     * Simulate Python script execution (for browser environment)
     * In production, this would make an API call to a backend service
     */
    async simulatePythonCall(crop, state, market) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

        // Base prices for different crops
        const basePrices = {
            'wheat': 2500, 'rice': 3200, 'cotton': 5800, 'sugarcane': 280,
            'tomato': 2800, 'onion': 1800, 'potato': 1200, 'mango': 4500,
            'banana': 1500, 'apple': 8000
        };

        // Market multipliers
        const marketMultipliers = {
            'Mumbai APMC': 1.1,
            'Pune APMC': 1.0,
            'Nashik APMC': 0.95,
            'Nagpur APMC': 1.05,
            'Aurangabad APMC': 1.08
        };

        // Volatility factors
        const volatilityMap = {
            'tomato': 0.25, 'onion': 0.20, 'potato': 0.15, 'rice': 0.10,
            'wheat': 0.08, 'cotton': 0.12, 'sugarcane': 0.06, 'mango': 0.18,
            'banana': 0.12, 'apple': 0.14
        };

        // Calculate current price
        const basePrice = basePrices[crop.toLowerCase()] || 2500;
        const marketMultiplier = marketMultipliers[market] || 1.0;
        const volatility = volatilityMap[crop.toLowerCase()] || 0.12;

        // Add realistic market variation
        const variation = (Math.random() - 0.5) * volatility * 2;
        const currentPrice = Math.round(basePrice * marketMultiplier * (1 + variation));

        // Generate historical prices
        const historicalPrices = this.generateHistoricalPrices(currentPrice, crop, 8);

        // Calculate change percentage
        const previousPrice = historicalPrices[historicalPrices.length - 2];
        const changePercent = ((currentPrice - previousPrice) / previousPrice) * 100;
        const changeStr = `${changePercent >= 0 ? '+' : ''}${changePercent.toFixed(1)}%`;

        // Generate market comparison data
        const marketComparison = this.generateMarketComparison(crop, state, basePrices[crop.toLowerCase()] || 2500);

        // Determine trend
        const firstPrice = historicalPrices[0];
        const priceDiff = currentPrice - firstPrice;
        let trend = 'stable';
        if (priceDiff > currentPrice * 0.05) trend = 'increasing';
        else if (priceDiff < -currentPrice * 0.05) trend = 'decreasing';

        return {
            success: true,
            crop: crop,
            state: state,
            market: market,
            current_price: currentPrice,
            change_percentage: changeStr,
            trend: trend,
            historical_prices: historicalPrices,
            chart_data: {
                min_price: Math.min(...historicalPrices),
                max_price: Math.max(...historicalPrices),
                volatility: volatility
            },
            market_comparison: marketComparison,
            timestamp: new Date().toISOString(),
            source: 'PYTHON_SIMULATION'
        };
    }

    /**
     * Generate realistic historical price data
     */
    generateHistoricalPrices(currentPrice, crop, weeks) {
        const volatilityMap = {
            'tomato': 0.25, 'onion': 0.20, 'potato': 0.15, 'rice': 0.10,
            'wheat': 0.08, 'cotton': 0.12, 'sugarcane': 0.06, 'mango': 0.18,
            'banana': 0.12, 'apple': 0.14
        };

        const trendMap = {
            'tomato': 0.05, 'onion': -0.03, 'potato': 0.02, 'rice': 0.04,
            'wheat': 0.06, 'cotton': -0.02, 'sugarcane': 0.03, 'mango': 0.08,
            'banana': 0.01, 'apple': 0.025
        };

        const volatility = volatilityMap[crop.toLowerCase()] || 0.12;
        const trend = trendMap[crop.toLowerCase()] || 0.02;

        const prices = [];

        for (let i = weeks - 1; i >= 0; i--) {
            if (i === 0) {
                prices.push(currentPrice);
            } else {
                // Apply reverse trend
                const trendEffect = trend * i * currentPrice;

                // Add random volatility using Box-Muller transform for normal distribution
                const u1 = Math.random();
                const u2 = Math.random();
                const randomNormal = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
                const volatilityEffect = randomNormal * volatility * currentPrice * 0.5;

                // Add seasonal patterns
                const seasonalEffect = Math.sin(i * 0.5) * (volatility * 0.3 * currentPrice);

                let historicalPrice = currentPrice - trendEffect + volatilityEffect + seasonalEffect;

                // Ensure reasonable bounds
                const minBound = currentPrice * 0.6;
                const maxBound = currentPrice * 1.4;
                historicalPrice = Math.max(minBound, Math.min(maxBound, historicalPrice));

                prices.push(Math.round(historicalPrice));
            }
        }

        return prices;
    }

    /**
     * Generate market comparison data
     */
    generateMarketComparison(crop, state, basePrice) {
        const markets = ['Mumbai APMC', 'Pune APMC', 'Nashik APMC', 'Nagpur APMC', 'Aurangabad APMC'];
        const marketMultipliers = {
            'Mumbai APMC': 1.1, 'Pune APMC': 1.0, 'Nashik APMC': 0.95,
            'Nagpur APMC': 1.05, 'Aurangabad APMC': 1.08
        };

        return markets.map(market => {
            const multiplier = marketMultipliers[market] || 1.0;
            const variation = (Math.random() - 0.5) * 0.1; // ±5% variation
            const price = Math.round(basePrice * multiplier * (1 + variation));

            // Generate realistic change percentage
            const changePercent = (Math.random() - 0.4) * 10; // Bias towards positive
            const changeStr = `${changePercent >= 0 ? '+' : ''}${changePercent.toFixed(0)}%`;

            return {
                market: market,
                price: price,
                change: changeStr
            };
        });
    }

    /**
     * Get cached data keys
     */
    getCachedKeys() {
        return Array.from(this.cache.keys());
    }

    /**
     * Clear cache
     */
    clearCache() {
        this.cache.clear();
        console.log('🗑️ Cache cleared');
    }
}

// Make it available globally
window.PythonPriceChartBridge = PythonPriceChartBridge;
