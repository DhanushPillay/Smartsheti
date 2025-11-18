/**
 * Market Data Manager - Handles dynamic market data loading and display
 * Integrates with Python scraper output for real-time market information
 */

class MarketDataManager {
    constructor() {
        this.dataCache = new Map();
        this.lastUpdateTime = null;
        this.updateInterval = 5 * 60 * 1000; // 5 minutes
        this.isLoading = false;
        this.selectedCrop = 'wheat';
        this.selectedState = 'Maharashtra';
        this.selectedMarket = 'Pune APMC';
    }

    /**
     * Initialize the market data manager
     */
    async init() {
        console.log('📊 Initializing Market Data Manager...');
        
        // Try to load fresh data, fallback to mock data if scraper data not available
        await this.loadMarketData();
        
        // Set up filter event listeners
        this.setupFilters();
        
        // Set up auto-refresh
        this.setupAutoRefresh();
        
        // Update the UI with loaded data
        this.updateMarketDisplay();
        
        console.log('✅ Market Data Manager initialized successfully');
    }

    /**
     * Load market data from JSON files or API
     */
    async loadMarketData() {
        this.isLoading = true;
        this.showLoadingIndicator();

        try {
            // Try to load real scraped data first
            const marketData = await this.fetchMarketData();
            const priceData = await this.fetchPriceData();
            const summaryData = await this.fetchSummaryData();

            if (marketData) {
                this.dataCache.set('market_data', marketData);
                this.dataCache.set('price_data', priceData);
                this.dataCache.set('summary_data', summaryData);
                this.lastUpdateTime = new Date();
                
                console.log('📈 Market data loaded from scraper');
            } else {
                // Fallback to enhanced mock data
                this.generateEnhancedMockData();
                console.log('📝 Using enhanced mock data');
            }
        } catch (error) {
            console.error('❌ Error loading market data:', error);
            this.generateEnhancedMockData();
        } finally {
            this.isLoading = false;
            this.hideLoadingIndicator();
        }
    }

    /**
     * Set up filter event listeners
     */
    setupFilters() {
        this.setupCropSearchField();
        this.setupStateFilter();
        this.setupMarketFilter();
    }

    /**
     * Set up crop search field with autocomplete
     */
    setupCropSearchField() {
        const cropSelect = document.getElementById('cropSelect');
        if (!cropSelect) return;

        // Replace select with input field
        const searchContainer = document.createElement('div');
        searchContainer.className = 'relative';
        
        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.id = 'cropSearchInput';
        searchInput.className = 'w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent';
        searchInput.placeholder = 'Type crop name (e.g., rice, tomato, mango)...';
        searchInput.autocomplete = 'off';
        
        const suggestionsList = document.createElement('div');
        suggestionsList.id = 'cropSuggestions';
        suggestionsList.className = 'absolute z-50 w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-60 overflow-y-auto shadow-lg hidden';
        
        searchContainer.appendChild(searchInput);
        searchContainer.appendChild(suggestionsList);
        
        // Replace the select element
        cropSelect.parentNode.replaceChild(searchContainer, cropSelect);
        
        // Set up event listeners
        searchInput.addEventListener('input', (e) => this.handleCropSearch(e.target.value));
        searchInput.addEventListener('focus', () => this.showAllCropSuggestions());
        
        // Use a flag to prevent blur from hiding suggestions when clicking
        let isClickingOnSuggestion = false;
        
        searchInput.addEventListener('blur', () => {
            // Only hide if not clicking on a suggestion
            if (!isClickingOnSuggestion) {
                setTimeout(() => this.hideCropSuggestions(), 150);
            }
        });
        
        // Set the flag when mousedown on suggestions container
        suggestionsList.addEventListener('mousedown', () => {
            isClickingOnSuggestion = true;
        });
        
        // Reset the flag after a short delay
        suggestionsList.addEventListener('mouseup', () => {
            setTimeout(() => {
                isClickingOnSuggestion = false;
            }, 10);
        });
        
        // Add Enter key support
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.handleEnterKey();
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                this.navigateSuggestions('down');
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                this.navigateSuggestions('up');
            } else if (e.key === 'Escape') {
                this.hideCropSuggestions();
                searchInput.blur();
            }
        });
        
        // Set default value
        searchInput.value = this.capitalizeFirst(this.selectedCrop);
    }

    /**
     * Handle crop search input
     */
    handleCropSearch(query) {
        const suggestions = this.getCropSuggestions(query);
        this.displayCropSuggestions(suggestions);
    }

    /**
     * Get crop suggestions based on query
     */
    getCropSuggestions(query) {
        const allCrops = [
            // Cereals
            'wheat', 'wheat (durum)', 'rice', 'rice (basmati)', 'maize',
            // Cash Crops  
            'cotton', 'sugarcane',
            // Vegetables
            'tomato', 'tomato (hybrid)', 'onion', 'onion (white)', 'potato', 'cauliflower',
            'cabbage', 'carrot', 'beetroot', 'green chilli', 'brinjal', 'okra', 'spinach',
            // Fruits
            'mango', 'mango (kesar)', 'banana', 'banana (grand naine)', 'apple', 'orange',
            'grapes', 'pomegranate', 'papaya', 'watermelon', 'guava',
            // Pulses
            'chickpea', 'pigeon pea', 'black gram', 'green gram'
        ];

        if (!query.trim()) {
            return allCrops;
        }

        const queryLower = query.toLowerCase();
        const exactMatches = allCrops.filter(crop => crop.toLowerCase().startsWith(queryLower));
        const partialMatches = allCrops.filter(crop => 
            crop.toLowerCase().includes(queryLower) && !crop.toLowerCase().startsWith(queryLower)
        );

        return [...exactMatches, ...partialMatches].slice(0, 10); // Limit to 10 suggestions
    }

    /**
     * Display crop suggestions
     */
    displayCropSuggestions(suggestions) {
        const suggestionsList = document.getElementById('cropSuggestions');
        if (!suggestionsList) return;

        suggestionsList.innerHTML = '';

        if (suggestions.length === 0) {
            suggestionsList.classList.add('hidden');
            return;
        }

        suggestions.forEach(crop => {
            const item = document.createElement('div');
            item.className = 'px-4 py-2 hover:bg-green-50 cursor-pointer border-b border-gray-100 last:border-b-0';
            item.dataset.cropName = crop; // Add data attribute for easier access
            
            const cropData = this.getCropBaseData(crop);
            item.innerHTML = `
                <div class="flex justify-between items-center">
                    <div>
                        <div class="font-medium text-gray-900">${this.capitalizeFirst(crop)}</div>
                        <div class="text-sm text-gray-500">${cropData.variety} • ${cropData.demand_level} Demand</div>
                    </div>
                    <div class="text-right">
                        <div class="text-sm font-semibold text-green-600">₹${cropData.modal_price}</div>
                        <div class="text-xs text-gray-400">/quintal</div>
                    </div>
                </div>
            `;
            
            // Use mousedown for reliable click detection
            item.addEventListener('mousedown', (e) => {
                e.preventDefault(); // Prevent blur
                e.stopPropagation();
                console.log('🖱️ Mousedown on suggestion:', crop);
                this.selectCrop(crop);
            });
            
            // Backup click handler
            item.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('🖱️ Click on suggestion:', crop);
                this.selectCrop(crop);
            });
            
            // Add hover effect for keyboard navigation
            item.addEventListener('mouseenter', () => {
                // Remove highlight from other items
                suggestionsList.querySelectorAll('.highlighted').forEach(el => {
                    el.classList.remove('highlighted', 'bg-green-50');
                });
                item.classList.add('highlighted', 'bg-green-50');
            });
            
            item.addEventListener('mouseleave', () => {
                item.classList.remove('highlighted', 'bg-green-50');
            });
            
            suggestionsList.appendChild(item);
        });

        suggestionsList.classList.remove('hidden');
    }

    /**
     * Show all crop suggestions
     */
    showAllCropSuggestions() {
        const input = document.getElementById('cropSearchInput');
        if (input) {
            this.handleCropSearch(input.value);
        }
    }

    /**
     * Handle Enter key press
     */
    handleEnterKey() {
        const input = document.getElementById('cropSearchInput');
        const suggestionsList = document.getElementById('cropSuggestions');
        
        if (!input || !suggestionsList) return;
        
        // Check if there's a highlighted suggestion
        const highlighted = suggestionsList.querySelector('.highlighted');
        if (highlighted) {
            const cropName = highlighted.dataset.cropName;
            this.selectCrop(cropName);
            return;
        }
        
        // If no highlight, try to find exact match or first suggestion
        const inputValue = input.value.trim().toLowerCase();
        const suggestions = this.getCropSuggestions(inputValue);
        
        if (suggestions.length > 0) {
            // Look for exact match first
            const exactMatch = suggestions.find(crop => 
                crop.toLowerCase() === inputValue || 
                this.capitalizeFirst(crop).toLowerCase() === inputValue
            );
            
            if (exactMatch) {
                this.selectCrop(exactMatch);
            } else {
                // Use first suggestion
                this.selectCrop(suggestions[0]);
            }
        }
    }

    /**
     * Navigate through suggestions with arrow keys
     */
    navigateSuggestions(direction) {
        const suggestionsList = document.getElementById('cropSuggestions');
        if (!suggestionsList || suggestionsList.classList.contains('hidden')) return;
        
        const items = suggestionsList.querySelectorAll('[data-crop-name]');
        if (items.length === 0) return;
        
        const currentHighlighted = suggestionsList.querySelector('.highlighted');
        let newIndex = 0;
        
        if (currentHighlighted) {
            const currentIndex = Array.from(items).indexOf(currentHighlighted);
            if (direction === 'down') {
                newIndex = (currentIndex + 1) % items.length;
            } else {
                newIndex = currentIndex - 1 < 0 ? items.length - 1 : currentIndex - 1;
            }
            currentHighlighted.classList.remove('highlighted', 'bg-green-50');
        }
        
        const newHighlighted = items[newIndex];
        newHighlighted.classList.add('highlighted', 'bg-green-50');
        
        // Scroll into view if needed
        newHighlighted.scrollIntoView({ block: 'nearest' });
    }

    /**
     * Hide crop suggestions
     */
    hideCropSuggestions() {
        const suggestionsList = document.getElementById('cropSuggestions');
        if (suggestionsList) {
            suggestionsList.classList.add('hidden');
            // Clear any highlights
            suggestionsList.querySelectorAll('.highlighted').forEach(el => {
                el.classList.remove('highlighted', 'bg-green-50');
            });
        }
    }

    /**
     * Select a crop from suggestions
     */
    selectCrop(crop) {
        console.log('🌾 Selecting crop:', crop);
        this.selectedCrop = crop;
        
        const input = document.getElementById('cropSearchInput');
        if (input) {
            input.value = this.capitalizeFirst(crop);
            console.log('✏️ Updated search input to:', input.value);
        }
        
        this.hideCropSuggestions();
        
        // Force regenerate data if needed
        if (!this.dataCache.has('market_data')) {
            console.log('📊 Regenerating market data...');
            this.generateEnhancedMockData();
        }
        
        // Force update the display immediately
        console.log('🔄 Starting display update for:', this.selectedCrop);
        
        // Update the market display with new crop data
        this.updateMarketDisplay();
        
        console.log('✅ Crop selection complete for:', crop);
    }

    /**
     * Set up state filter
     */
    setupStateFilter() {
        const stateSelect = document.getElementById('stateSelect');
        if (stateSelect) {
            stateSelect.addEventListener('change', (e) => {
                this.selectedState = e.target.value;
                this.updateMarketOptions();
                this.updateMarketDisplay();
                console.log('🗺️ State changed to:', this.selectedState);
            });
        }
    }

    /**
     * Set up market filter
     */
    setupMarketFilter() {
        const marketSelect = document.getElementById('marketSelect');
        if (marketSelect) {
            marketSelect.addEventListener('change', (e) => {
                this.selectedMarket = e.target.value;
                this.updateMarketDisplay();
                console.log('🏪 Market changed to:', this.selectedMarket);
            });
        }
    }

    /**
     * Update market options based on selected state
     */
    updateMarketOptions() {
        const marketSelect = document.getElementById('marketSelect');
        if (!marketSelect) return;

        const marketsByState = {
            'Maharashtra': ['Mumbai APMC', 'Pune APMC', 'Nashik APMC', 'Nagpur APMC', 'Aurangabad APMC'],
            'Gujarat': ['Ahmedabad APMC', 'Surat APMC', 'Vadodara APMC', 'Rajkot APMC'],
            'Punjab': ['Ludhiana APMC', 'Amritsar APMC', 'Jalandhar APMC', 'Patiala APMC'],
            'Haryana': ['Karnal APMC', 'Panipat APMC', 'Hisar APMC', 'Rohtak APMC']
        };

        const markets = marketsByState[this.selectedState] || marketsByState['Maharashtra'];
        
        // Clear existing options except the first one
        marketSelect.innerHTML = '<option data-translate="selectMarket">Select Market</option>';
        
        // Add new market options
        markets.forEach(market => {
            const option = document.createElement('option');
            option.value = market;
            option.textContent = market;
            marketSelect.appendChild(option);
        });

        // Select first market by default
        if (markets.length > 0) {
            this.selectedMarket = markets[0];
            marketSelect.value = this.selectedMarket;
        }
    }
    async fetchMarketData() {
        try {
            const response = await fetch('./market_data.json');
            if (response.ok) {
                return await response.json();
            }
        } catch (error) {
            console.log('📁 market_data.json not found, using mock data');
        }
        return null;
    }

    /**
     * Fetch price trend data
     */
    async fetchPriceData() {
        try {
            const response = await fetch('./wheat_price_trends.json');
            if (response.ok) {
                return await response.json();
            }
        } catch (error) {
            console.log('📁 wheat_price_trends.json not found, generating mock trends');
        }
        return this.generateMockPriceTrends();
    }

    /**
     * Fetch market summary data
     */
    async fetchSummaryData() {
        try {
            const response = await fetch('./market_summary.json');
            if (response.ok) {
                return await response.json();
            }
        } catch (error) {
            console.log('📁 market_summary.json not found, generating mock summary');
        }
        return this.generateMockSummary();
    }

    /**
     * Generate enhanced mock data for demonstration
     */
    generateEnhancedMockData() {
        const crops = [
            // Cereals
            'wheat', 'wheat (durum)', 'rice', 'rice (basmati)', 'maize',
            // Cash Crops
            'cotton', 'sugarcane',
            // Vegetables
            'tomato', 'tomato (hybrid)', 'onion', 'onion (white)', 'potato', 'cauliflower', 
            'cabbage', 'carrot', 'beetroot', 'green chilli', 'brinjal', 'okra', 'spinach',
            // Fruits
            'mango', 'mango (kesar)', 'banana', 'banana (grand naine)', 'apple', 'orange', 
            'grapes', 'pomegranate', 'papaya', 'watermelon', 'guava',
            // Pulses
            'chickpea', 'pigeon pea', 'black gram', 'green gram'
        ];
        
        const markets = ['Mumbai APMC', 'Pune APMC', 'Nashik APMC', 'Nagpur APMC', 'Aurangabad APMC'];
        
        const mockMarketData = [];
        
        crops.forEach(crop => {
            markets.forEach((market, marketIndex) => {
                const baseData = this.getCropBaseData(crop);
                const marketMultiplier = this.getMarketMultiplier(market);
                const marketTrend = this.getMarketTrend(crop, marketIndex);
                
                mockMarketData.push({
                    commodity: crop,
                    variety: baseData.variety,
                    grade: baseData.grade,
                    min_price: Math.round(baseData.min_price * marketMultiplier),
                    max_price: Math.round(baseData.max_price * marketMultiplier),
                    modal_price: Math.round(baseData.modal_price * marketMultiplier),
                    unit: "Quintal",
                    arrivals: baseData.arrivals + (marketIndex * 10), // Fixed variation based on market index instead of random
                    market: market,
                    district: market.split(' ')[0],
                    state: "Maharashtra",
                    date: new Date().toISOString().split('T')[0],
                    trend: marketTrend,
                    demand_level: baseData.demand_level
                });
            });
        });

        this.dataCache.set('market_data', mockMarketData);
        this.dataCache.set('price_data', this.generateMockPriceTrends());
        this.dataCache.set('summary_data', this.generateMockSummary());
        this.lastUpdateTime = new Date();
    }

    /**
     * Get base data for each crop
     */
    getCropBaseData(crop) {
        const cropData = {
            // Cereals
            'wheat': { min_price: 2300, max_price: 2700, modal_price: 2500, variety: "Local", grade: "FAQ", arrivals: 450, trend: "+5%", demand_level: "High" },
            'wheat (durum)': { min_price: 2500, max_price: 2900, modal_price: 2700, variety: "Durum", grade: "FAQ", arrivals: 380, trend: "+6%", demand_level: "High" },
            'rice': { min_price: 3100, max_price: 3600, modal_price: 3350, variety: "Common", grade: "FAQ", arrivals: 320, trend: "+2%", demand_level: "Medium" },
            'rice (basmati)': { min_price: 4500, max_price: 5200, modal_price: 4850, variety: "Basmati", grade: "Grade A", arrivals: 200, trend: "+8%", demand_level: "Very High" },
            'maize': { min_price: 1800, max_price: 2200, modal_price: 2000, variety: "Yellow", grade: "FAQ", arrivals: 600, trend: "+3%", demand_level: "Medium" },
            
            // Cash Crops
            'cotton': { min_price: 5800, max_price: 6200, modal_price: 6000, variety: "Local", grade: "Grade I", arrivals: 280, trend: "+7%", demand_level: "Very High" },
            'sugarcane': { min_price: 280, max_price: 320, modal_price: 300, variety: "Local", grade: "Grade I", arrivals: 520, trend: "+3%", demand_level: "Medium" },
            
            // Vegetables
            'tomato': { min_price: 800, max_price: 1200, modal_price: 1000, variety: "Local", grade: "Grade I", arrivals: 380, trend: "+8%", demand_level: "Very High" },
            'tomato (hybrid)': { min_price: 1200, max_price: 1600, modal_price: 1400, variety: "Hybrid", grade: "Grade A", arrivals: 250, trend: "+12%", demand_level: "Very High" },
            'onion': { min_price: 1500, max_price: 1900, modal_price: 1700, variety: "Red", grade: "Grade I", arrivals: 450, trend: "+5%", demand_level: "High" },
            'onion (white)': { min_price: 1600, max_price: 2000, modal_price: 1800, variety: "White", grade: "Grade I", arrivals: 300, trend: "+7%", demand_level: "High" },
            'potato': { min_price: 900, max_price: 1300, modal_price: 1100, variety: "Local", grade: "Grade I", arrivals: 800, trend: "+2%", demand_level: "Medium" },
            'cauliflower': { min_price: 600, max_price: 1000, modal_price: 800, variety: "Local", grade: "Grade I", arrivals: 350, trend: "+4%", demand_level: "Medium" },
            'cabbage': { min_price: 400, max_price: 800, modal_price: 600, variety: "Green", grade: "Grade I", arrivals: 400, trend: "+3%", demand_level: "Medium" },
            'carrot': { min_price: 1200, max_price: 1600, modal_price: 1400, variety: "Red", grade: "Grade I", arrivals: 200, trend: "+6%", demand_level: "High" },
            'beetroot': { min_price: 800, max_price: 1200, modal_price: 1000, variety: "Local", grade: "Grade I", arrivals: 180, trend: "+5%", demand_level: "Medium" },
            'green chilli': { min_price: 2000, max_price: 3000, modal_price: 2500, variety: "Local", grade: "Grade I", arrivals: 150, trend: "+15%", demand_level: "Very High" },
            'brinjal': { min_price: 800, max_price: 1400, modal_price: 1100, variety: "Purple", grade: "Grade I", arrivals: 300, trend: "+8%", demand_level: "High" },
            'okra': { min_price: 1500, max_price: 2200, modal_price: 1850, variety: "Green", grade: "Grade I", arrivals: 250, trend: "+10%", demand_level: "High" },
            'spinach': { min_price: 600, max_price: 1000, modal_price: 800, variety: "Local", grade: "Grade I", arrivals: 180, trend: "+4%", demand_level: "Medium" },
            
            // Fruits
            'mango': { min_price: 4000, max_price: 6000, modal_price: 5000, variety: "Alphonso", grade: "Grade A", arrivals: 120, trend: "+20%", demand_level: "Very High" },
            'mango (kesar)': { min_price: 3500, max_price: 5000, modal_price: 4250, variety: "Kesar", grade: "Grade A", arrivals: 100, trend: "+18%", demand_level: "Very High" },
            'banana': { min_price: 1200, max_price: 1800, modal_price: 1500, variety: "Robusta", grade: "Grade I", arrivals: 400, trend: "+6%", demand_level: "High" },
            'banana (grand naine)': { min_price: 1500, max_price: 2200, modal_price: 1850, variety: "Grand Naine", grade: "Grade A", arrivals: 300, trend: "+8%", demand_level: "High" },
            'apple': { min_price: 8000, max_price: 12000, modal_price: 10000, variety: "Royal Delicious", grade: "Grade A", arrivals: 80, trend: "+12%", demand_level: "Very High" },
            'orange': { min_price: 2000, max_price: 3000, modal_price: 2500, variety: "Nagpur", grade: "Grade I", arrivals: 200, trend: "+7%", demand_level: "High" },
            'grapes': { min_price: 3000, max_price: 4500, modal_price: 3750, variety: "Thompson", grade: "Grade A", arrivals: 150, trend: "+10%", demand_level: "Very High" },
            'pomegranate': { min_price: 4000, max_price: 6000, modal_price: 5000, variety: "Bhagwa", grade: "Grade A", arrivals: 100, trend: "+14%", demand_level: "Very High" },
            'papaya': { min_price: 800, max_price: 1400, modal_price: 1100, variety: "Red Lady", grade: "Grade I", arrivals: 250, trend: "+5%", demand_level: "Medium" },
            'watermelon': { min_price: 400, max_price: 800, modal_price: 600, variety: "Sugar Baby", grade: "Grade I", arrivals: 500, trend: "+3%", demand_level: "Medium" },
            'guava': { min_price: 1500, max_price: 2200, modal_price: 1850, variety: "Allahabad", grade: "Grade I", arrivals: 180, trend: "+8%", demand_level: "High" },
            
            // Pulses
            'chickpea': { min_price: 4500, max_price: 5200, modal_price: 4850, variety: "Desi", grade: "FAQ", arrivals: 200, trend: "+4%", demand_level: "High" },
            'pigeon pea': { min_price: 5000, max_price: 5800, modal_price: 5400, variety: "Local", grade: "FAQ", arrivals: 150, trend: "+6%", demand_level: "High" },
            'black gram': { min_price: 6000, max_price: 7000, modal_price: 6500, variety: "Local", grade: "FAQ", arrivals: 120, trend: "+5%", demand_level: "High" },
            'green gram': { min_price: 5500, max_price: 6500, modal_price: 6000, variety: "Local", grade: "FAQ", arrivals: 100, trend: "+7%", demand_level: "High" }
        };
        
        return cropData[crop] || cropData.wheat;
    }

    /**
     * Get market price multiplier
     */
    getMarketMultiplier(market) {
        const multipliers = {
            "Mumbai APMC": 1.1,
            "Pune APMC": 1.0,
            "Nashik APMC": 0.95,
            "Nagpur APMC": 1.05,
            "Aurangabad APMC": 1.08
        };
        return multipliers[market] || 1.0;
    }

    /**
     * Get market-specific trend for crop
     */
    getMarketTrend(crop, marketIndex) {
        // Generate dynamic trends based on crop characteristics
        const baseVariations = {
            // Cereals - stable trends
            'wheat': ["+5%", "+2%", "-1%", "+4%", "+5%"],
            'wheat (durum)': ["+6%", "+3%", "0%", "+5%", "+6%"],
            'rice': ["+3%", "+1%", "-2%", "+2%", "+4%"],
            'rice (basmati)': ["+10%", "+6%", "+3%", "+8%", "+12%"],
            'maize': ["+4%", "+2%", "-1%", "+3%", "+5%"],
            
            // Cash crops - moderate volatility
            'cotton': ["+8%", "+6%", "+3%", "+7%", "+9%"],
            'sugarcane': ["+4%", "+3%", "+1%", "+5%", "+6%"],
            
            // Vegetables - high volatility
            'tomato': ["+12%", "+8%", "+5%", "+10%", "+15%"],
            'tomato (hybrid)': ["+15%", "+10%", "+7%", "+12%", "+18%"],
            'onion': ["+7%", "+4%", "+1%", "+6%", "+9%"],
            'onion (white)': ["+8%", "+5%", "+2%", "+7%", "+10%"],
            'potato': ["+3%", "+1%", "-1%", "+2%", "+4%"],
            'cauliflower': ["+6%", "+3%", "0%", "+4%", "+7%"],
            'cabbage': ["+4%", "+2%", "-1%", "+3%", "+5%"],
            'carrot': ["+8%", "+5%", "+2%", "+6%", "+9%"],
            'beetroot': ["+6%", "+4%", "+1%", "+5%", "+7%"],
            'green chilli': ["+20%", "+15%", "+10%", "+18%", "+25%"],
            'brinjal': ["+10%", "+6%", "+3%", "+8%", "+12%"],
            'okra': ["+12%", "+8%", "+5%", "+10%", "+15%"],
            'spinach': ["+5%", "+3%", "0%", "+4%", "+6%"],
            
            // Fruits - premium pricing
            'mango': ["+25%", "+18%", "+12%", "+22%", "+30%"],
            'mango (kesar)': ["+22%", "+16%", "+10%", "+20%", "+28%"],
            'banana': ["+8%", "+5%", "+2%", "+6%", "+10%"],
            'banana (grand naine)': ["+10%", "+7%", "+4%", "+8%", "+12%"],
            'apple': ["+15%", "+10%", "+6%", "+12%", "+18%"],
            'orange': ["+9%", "+6%", "+3%", "+7%", "+11%"],
            'grapes': ["+12%", "+8%", "+5%", "+10%", "+15%"],
            'pomegranate': ["+18%", "+12%", "+8%", "+15%", "+22%"],
            'papaya': ["+6%", "+4%", "+1%", "+5%", "+7%"],
            'watermelon': ["+4%", "+2%", "0%", "+3%", "+5%"],
            'guava': ["+10%", "+7%", "+4%", "+8%", "+12%"],
            
            // Pulses - steady demand
            'chickpea': ["+6%", "+3%", "+1%", "+4%", "+7%"],
            'pigeon pea': ["+8%", "+5%", "+2%", "+6%", "+9%"],
            'black gram': ["+7%", "+4%", "+2%", "+5%", "+8%"],
            'green gram': ["+9%", "+6%", "+3%", "+7%", "+10%"]
        };
        
        const variations = baseVariations[crop] || ["+2%", "+1%", "0%", "+1%", "+3%"];
        return variations[marketIndex] || "+2%";
    }

    /**
     * Capitalize first letter
     */
    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    /**
     * Get filtered data based on current selections
     */
    getFilteredData() {
        const marketData = this.dataCache.get('market_data') || [];
        console.log('🔍 Filtering data for crop:', this.selectedCrop, 'from', marketData.length, 'total items');
        
        const filtered = marketData.filter(item => {
            const matchesCrop = item.commodity === this.selectedCrop;
            const matchesMarket = !this.selectedMarket || this.selectedMarket === 'Select Market' || item.market === this.selectedMarket;
            if (matchesCrop) {
                console.log('✅ Found matching crop data:', item.commodity, 'at', item.market);
            }
            return matchesCrop && matchesMarket;
        });
        
        console.log('📊 Filtered results:', filtered.length, 'items');
        return filtered;
    }

    /**
     * Get current crop data for the selected filters
     */
    getCurrentCropData() {
        const filteredData = this.getFilteredData();
        const selectedMarketData = filteredData.find(item => item.market === this.selectedMarket) || filteredData[0];
        
        if (!selectedMarketData) {
            // Fallback to base data if no filtered data found
            const baseData = this.getCropBaseData(this.selectedCrop);
            return {
                commodity: this.selectedCrop,
                modal_price: baseData.modal_price,
                trend: baseData.trend,
                demand_level: baseData.demand_level,
                market: this.selectedMarket
            };
        }
        
        return selectedMarketData;
    }

    /**
     * Generate mock price trends for specific crop
     */
    generatePriceTrendsForCrop(crop) {
        const trends = [];
        const baseData = this.getCropBaseData(crop);
        const basePrice = baseData.modal_price;
        
        for (let i = 0; i < 7; i++) {
            const date = new Date();
            date.setDate(date.getDate() - (6 - i));
            
            const priceVariation = (-50 + (i * 20)) + (i * 15); // Fixed variation pattern instead of random
            const price = basePrice + priceVariation;
            
            trends.push({
                date: date.toISOString().split('T')[0],
                price: Math.round(price),
                commodity: this.capitalizeFirst(crop),
                week: `${i + 1}W`
            });
        }
        
        return trends;
    }

    /**
     * Generate summary for specific crop
     */
    generateSummaryForCrop(crop) {
        const baseData = this.getCropBaseData(crop);
        
        return {
            selected_crop: crop,
            demand_level: baseData.demand_level,
            average_price: baseData.modal_price,
            trend: baseData.trend,
            last_updated: new Date().toISOString()
        };
    }
    generateMockPriceTrends() {
        const trends = [];
        const basePrice = 2500;
        
        for (let i = 0; i < 7; i++) {
            const date = new Date();
            date.setDate(date.getDate() - (6 - i));
            
            const priceVariation = (-50 + (i * 20)) + (i * 15); // Fixed variation pattern instead of random
            const price = basePrice + priceVariation;
            
            trends.push({
                date: date.toISOString().split('T')[0],
                price: Math.round(price),
                commodity: "Wheat",
                week: `${i + 1}W`
            });
        }
        
        return trends;
    }

    /**
     * Generate mock summary data
     */
    generateMockSummary() {
        return {
            total_commodities: 5,
            markets_covered: 5,
            average_prices: {
                "Wheat": 2500,
                "Rice": 3350,
                "Tomato": 1000,
                "Onion": 1650,
                "Potato": 1000
            },
            high_demand_items: [
                { commodity: "Tomato", average_price: 1000, trend: "+8%", demand_level: "Very High" },
                { commodity: "Wheat", average_price: 2500, trend: "+5%", demand_level: "High" },
                { commodity: "Onion", average_price: 1650, trend: "+3%", demand_level: "High" }
            ],
            last_updated: new Date().toISOString()
        };
    }

    /**
     * Update the market demand page with fresh data
     */
    updateMarketDisplay() {
        console.log('🔄 Updating market display for crop:', this.selectedCrop);
        console.log('🔍 Current state - State:', this.selectedState, 'Market:', this.selectedMarket);
        
        const currentCropData = this.getCurrentCropData();
        const filteredData = this.getFilteredData();
        const priceData = this.generatePriceTrendsForCrop(this.selectedCrop);
        const summaryData = this.generateSummaryForCrop(this.selectedCrop);

        console.log('📊 Current crop data:', currentCropData);
        console.log('📈 Filtered data count:', filteredData.length);
        console.log('📉 Price data points:', priceData.length);

        if (currentCropData) {
            console.log('🔧 Updating UI components...');
            this.updatePriceTrendCard(currentCropData, priceData);
            this.updateMandiComparison(filteredData);
            this.updateDemandIndicator(currentCropData);
            this.updateTopDemandedItems(summaryData);
            this.updateLastUpdatedTime();
            console.log('✅ UI update complete');
        } else {
            console.warn('⚠️ No current crop data found for:', this.selectedCrop);
        }
    }

    /**
     * Update the price trend card
     */
    updatePriceTrendCard(cropData, priceData) {
        console.log('📊 Updating price trend card for:', cropData.commodity);
        const priceTrendCard = document.querySelector('.price-chart');
        if (!priceTrendCard || !cropData) {
            console.warn('⚠️ Price chart element not found or no crop data');
            return;
        }

        // Update crop name in the title
        const cropNameElement = priceTrendCard.querySelector('span[data-translate="wheat"]');
        if (cropNameElement) {
            cropNameElement.textContent = this.capitalizeFirst(cropData.commodity);
            cropNameElement.setAttribute('data-translate', cropData.commodity.toLowerCase());
            console.log('✏️ Updated crop name in title to:', cropNameElement.textContent);
        }

        // Update current price
        const priceElement = priceTrendCard.querySelector('.text-4xl');
        if (priceElement) {
            const quintalText = priceElement.querySelector('[data-translate="quintal"]');
            const quintalTranslation = quintalText ? quintalText.textContent : 'quintal';
            priceElement.innerHTML = `₹${cropData.modal_price.toLocaleString()}/<span data-translate="quintal">${quintalTranslation}</span>`;
            console.log('💰 Updated price to:', `₹${cropData.modal_price.toLocaleString()}`);
        }

        // Update trend percentage
        const trendElement = priceTrendCard.querySelector('.text-green-600, .text-red-600');
        if (trendElement) {
            trendElement.textContent = cropData.trend;
            trendElement.className = cropData.trend.startsWith('+') ? 
                'text-sm text-green-600 font-semibold' : 
                'text-sm text-red-600 font-semibold';
        }

        // Update chart bars with price data
        if (priceData && priceData.length > 0) {
            this.updatePriceChart(priceData);
        }
    }

    /**
     * Update the price chart visualization
     */
    updatePriceChart(priceData) {
        const chartContainer = document.querySelector('.flex.justify-between.items-end.h-32');
        if (!chartContainer) return;

        const bars = chartContainer.children;
        const minPrice = Math.min(...priceData.map(d => d.price));
        const maxPrice = Math.max(...priceData.map(d => d.price));
        const priceRange = maxPrice - minPrice;

        for (let i = 0; i < Math.min(bars.length, priceData.length); i++) {
            const bar = bars[i];
            const priceData_i = priceData[i];
            const normalizedHeight = priceRange > 0 ? 
                ((priceData_i.price - minPrice) / priceRange) * 80 + 20 : 50;
            
            const barElement = bar.querySelector('.bg-green-300');
            if (barElement) {
                barElement.style.height = `${normalizedHeight}px`;
                barElement.title = `Week ${i + 1}: ₹${priceData_i.price}`;
            }
        }
    }

    /**
     * Update mandi comparison table
     */
    updateMandiComparison(marketData) {
        console.log('🏪 Updating mandi comparison...');
        const comparisonSection = document.querySelector('.market-card .space-y-2');
        if (!comparisonSection) {
            console.warn('⚠️ Mandi comparison section not found');
            return;
        }

        // Get all market data for the selected crop
        const allMarketData = this.dataCache.get('market_data') || [];
        const cropMarketData = allMarketData.filter(item => 
            item.commodity === this.selectedCrop
        );

        console.log('📊 Found', cropMarketData.length, 'market entries for', this.selectedCrop);

        if (cropMarketData.length === 0) {
            console.warn('⚠️ No market data found for crop:', this.selectedCrop);
            return;
        }

        // Clear existing content
        comparisonSection.innerHTML = '';
        console.log('🧹 Cleared existing mandi data');

        // Create rows for each market
        cropMarketData.forEach((item, index) => {
            console.log(`📍 Adding market ${index + 1}:`, item.market, '- ₹' + item.modal_price);
            const row = document.createElement('div');
            row.className = 'flex justify-between items-center py-1';
            
            const marketCell = document.createElement('div');
            marketCell.className = 'text-left';
            marketCell.textContent = item.market;
            
            const priceCell = document.createElement('div');
            priceCell.className = 'text-center';
            priceCell.innerHTML = `₹${item.modal_price.toLocaleString()}/<span data-translate="quintal">quintal</span>`;
            
            const trendCell = document.createElement('div');
            trendCell.className = item.trend.startsWith('+') ? 
                'text-right text-green-600' : 
                'text-right text-red-600';
            trendCell.textContent = item.trend;
            
            row.appendChild(marketCell);
            row.appendChild(priceCell);
            row.appendChild(trendCell);
            
            comparisonSection.appendChild(row);
        });
        
        console.log('✅ Mandi comparison updated with', cropMarketData.length, 'entries');
    }

    /**
     * Update demand indicator
     */
    updateDemandIndicator(cropData) {
        if (!cropData) return;

        const demandCard = document.querySelector('.demand-card');
        if (!demandCard) return;

        const demandLevel = cropData.demand_level || 'Medium';

        const demandElement = demandCard.querySelector('.text-2xl');
        if (demandElement) {
            demandElement.textContent = `${demandLevel} Demand`;
            
            // Update color based on demand level
            demandElement.className = demandLevel.includes('Very High') ? 
                'text-2xl font-bold text-red-600' :
                demandLevel.includes('High') ? 
                'text-2xl font-bold text-green-700' :
                demandLevel.includes('Medium') ?
                'text-2xl font-bold text-yellow-600' :
                'text-2xl font-bold text-blue-600';
        }

        // Update current demand text to show selected crop
        const currentDemandElement = demandCard.querySelector('.text-gray-600');
        if (currentDemandElement) {
            currentDemandElement.textContent = `Current Demand for ${this.capitalizeFirst(cropData.commodity)}`;
        }
    }

    /**
     * Update top demanded items section
     */
    updateTopDemandedItems(summaryData) {
        if (!summaryData || !summaryData.high_demand_items) return;

        const itemsGrid = document.querySelector('.grid.grid-cols-2.sm\\:grid-cols-3.md\\:grid-cols-5');
        if (!itemsGrid) return;

        const cards = itemsGrid.children;
        const demandItems = summaryData.high_demand_items.slice(0, 5); // Top 5

        for (let i = 0; i < Math.min(cards.length, demandItems.length); i++) {
            const card = cards[i];
            const item = demandItems[i];
            
            const nameElement = card.querySelector('.font-semibold');
            const demandElement = card.querySelector('.text-sm.text-gray-500');
            
            if (nameElement && demandElement) {
                nameElement.setAttribute('data-translate', item.commodity.toLowerCase());
                nameElement.textContent = item.commodity;
                
                demandElement.setAttribute('data-translate', this.getDemandTranslationKey(item.demand_level));
                demandElement.textContent = item.demand_level;
                
                // Update demand level color
                demandElement.className = item.demand_level === 'Very High' ?
                    'text-sm text-red-600' :
                    item.demand_level === 'High' ?
                    'text-sm text-green-600' :
                    'text-sm text-gray-500';
            }
        }
    }

    /**
     * Get translation key for demand level
     */
    getDemandTranslationKey(demandLevel) {
        switch (demandLevel) {
            case 'Very High': return 'veryHigh';
            case 'High': return 'high';
            case 'Medium': return 'medium';
            case 'Low': return 'low';
            default: return 'medium';
        }
    }

    /**
     * Update last updated time display
     */
    updateLastUpdatedTime() {
        if (!this.lastUpdateTime) return;

        // Add or update a last updated indicator
        let updateIndicator = document.querySelector('.last-updated-indicator');
        if (!updateIndicator) {
            updateIndicator = document.createElement('div');
            updateIndicator.className = 'last-updated-indicator text-xs text-gray-500 text-right mt-2';
            
            const mainContainer = document.querySelector('.container.mx-auto.px-4.py-8');
            if (mainContainer) {
                mainContainer.appendChild(updateIndicator);
            }
        }

        const timeString = this.lastUpdateTime.toLocaleTimeString();
        updateIndicator.innerHTML = `📊 Last updated: ${timeString} | <span class="text-green-600">Live Data</span>`;
    }

    /**
     * Show loading indicator
     */
    showLoadingIndicator() {
        const indicator = document.querySelector('.loading-indicator') || this.createLoadingIndicator();
        indicator.style.display = 'block';
    }

    /**
     * Hide loading indicator
     */
    hideLoadingIndicator() {
        const indicator = document.querySelector('.loading-indicator');
        if (indicator) {
            indicator.style.display = 'none';
        }
    }

    /**
     * Create loading indicator element
     */
    createLoadingIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'loading-indicator fixed top-20 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
        indicator.innerHTML = '📊 Updating market data...';
        indicator.style.display = 'none';
        document.body.appendChild(indicator);
        return indicator;
    }

    /**
     * Set up auto-refresh functionality
     */
    setupAutoRefresh() {
        setInterval(async () => {
            if (!this.isLoading) {
                console.log('🔄 Auto-refreshing market data...');
                await this.loadMarketData();
                this.updateMarketDisplay();
            }
        }, this.updateInterval);
    }

    /**
     * Force refresh data
     */
    async forceRefresh() {
        console.log('🔄 Force refreshing market data...');
        await this.loadMarketData();
        this.updateMarketDisplay();
    }
}

// Initialize market data manager when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Starting Market Data Manager...');
    
    // Wait for translations to be available
    if (typeof translatePage === 'function') {
        translatePage();
    }
    
    // Initialize market data manager
    window.marketDataManager = new MarketDataManager();
    await window.marketDataManager.init();
    
    // Add refresh button to header
    addRefreshButton();
});

/**
 * Add a refresh button to manually update data
 */
function addRefreshButton() {
    const headerActions = document.querySelector('.action-buttons');
    if (!headerActions) return;

    const refreshButton = document.createElement('button');
    refreshButton.className = 'text-gray-600 hover:text-green-600 p-2 rounded-lg transition-all duration-300';
    refreshButton.innerHTML = '<span class="material-icons">refresh</span>';
    refreshButton.title = 'Refresh Market Data';
    
    refreshButton.addEventListener('click', async () => {
        if (window.marketDataManager) {
            await window.marketDataManager.forceRefresh();
            
            // Show success feedback
            refreshButton.innerHTML = '<span class="material-icons text-green-600">check_circle</span>';
            setTimeout(() => {
                refreshButton.innerHTML = '<span class="material-icons">refresh</span>';
            }, 2000);
        }
    });

    headerActions.insertBefore(refreshButton, headerActions.children[1]);
}
