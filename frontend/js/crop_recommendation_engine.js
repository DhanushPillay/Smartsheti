// Crop Recommendation Engine
class CropRecommendationEngine {
    constructor() {
        this.cropsData = null;
        this.loadCropsData();
    }

    async loadCropsData() {
        try {
            // Try different possible paths for the JSON file
            const possiblePaths = [
                '../../data/json/Maharashtra_crops.json',
                '../data/json/Maharashtra_crops.json',
                './data/json/Maharashtra_crops.json',
                '/data/json/Maharashtra_crops.json'
            ];
            
            let data = null;
            for (const path of possiblePaths) {
                try {
                    const response = await fetch(path);
                    if (response.ok) {
                        data = await response.json();
                        break;
                    }
                } catch (e) {
                    continue;
                }
            }
            
            if (data) {
                this.cropsData = data;
                console.log('Crops data loaded successfully');
            } else {
                throw new Error('Could not load crops data from any path');
            }
        } catch (error) {
            console.error('Error loading crops data:', error);
            // Fallback data if JSON fails to load - using some sample crops from Maharashtra
            this.cropsData = { 
                crops: [
                    {
                        name: "Rice",
                        varieties: ["Basmati", "IR-64", "Swarna", "Sona Masuri", "Kolam"],
                        season: "Kharif",
                        ideal_temperature_c: { min: 22, max: 32 },
                        rainfall_requirement_mm: [1500, 3000],
                        best_soil_types: ["Deep alluvial soil with good water retention", "Clayey loam with pH 5.5-7.0", "Well-drained paddy fields"],
                        agroclimatic_zones: ["Konkan", "Western Ghat", "High Rainfall Vidarbha"],
                        cultivation_tips: "Requires standing water during growing season"
                    },
                    {
                        name: "Wheat",
                        varieties: ["HD-2967", "Lok-1", "MACS-6222", "NIAW-301", "Trimbak"],
                        season: "Rabi",
                        ideal_temperature_c: { min: 10, max: 25 },
                        rainfall_requirement_mm: [300, 800],
                        best_soil_types: ["Well-drained loamy soil with good fertility", "Alluvial soil with pH 6.0-7.5", "Deep clay loam with adequate nitrogen"],
                        agroclimatic_zones: ["Marathwada", "Western Maharashtra"],
                        cultivation_tips: "Requires cool weather during grain filling stage"
                    },
                    {
                        name: "Cotton",
                        varieties: ["Bt Cotton", "PKV-081", "AKH-081", "Suraj", "MECH-162"],
                        season: "Kharif",
                        ideal_temperature_c: { min: 21, max: 35 },
                        rainfall_requirement_mm: [500, 1000],
                        best_soil_types: ["Deep black cotton soil with good water holding capacity", "Well-drained alluvial soil", "Medium to heavy textured soil with pH 6.0-8.0"],
                        agroclimatic_zones: ["Central Vidarbha", "Marathwada", "Scarcity Zone"],
                        cultivation_tips: "Requires long frost-free period and adequate moisture"
                    },
                    {
                        name: "Soybean",
                        varieties: ["JS-335", "MACS-450", "MACS-1407", "Pusa-16", "JS-9305"],
                        season: "Kharif",
                        ideal_temperature_c: { min: 20, max: 30 },
                        rainfall_requirement_mm: [600, 900],
                        best_soil_types: ["Deep black cotton soil with good organic matter", "Well-drained loamy soil with pH 6.0-7.5", "Medium textured soil with adequate calcium"],
                        agroclimatic_zones: ["Assured Rainfall Zone", "Scarcity Zone", "Central Vidarbha"],
                        cultivation_tips: "Nitrogen fixing legume, benefits from rhizobium inoculation"
                    },
                    {
                        name: "Sugarcane",
                        varieties: ["Co-86032", "CoM-0265", "Co-7704", "MS-71/68", "Co-94012"],
                        season: "Annual (12-18 months)",
                        ideal_temperature_c: { min: 20, max: 38 },
                        rainfall_requirement_mm: [1000, 2500],
                        best_soil_types: ["Deep alluvial soil with high organic matter", "Well-drained heavy loam", "Fertile soil with pH 6.0-7.5 and good water retention"],
                        agroclimatic_zones: ["Western Maharashtra", "Konkan"],
                        cultivation_tips: "Requires abundant water and long growing season"
                    },
                    {
                        name: "Onion",
                        varieties: ["Bhima Super", "N-53", "Agrifound Dark Red", "Pusa Red", "Bhima Kiran"],
                        season: "Rabi/Kharif",
                        ideal_temperature_c: { min: 15, max: 30 },
                        rainfall_requirement_mm: [400, 700],
                        best_soil_types: ["Well-drained sandy loam with good organic matter", "Fertile alluvial soil with pH 6.0-7.5", "Medium textured soil with adequate phosphorus"],
                        agroclimatic_zones: ["Western Maharashtra", "Marathwada"],
                        cultivation_tips: "Requires well-drained soil to prevent bulb rot"
                    },
                    {
                        name: "Tomato",
                        varieties: ["Pusa Ruby", "Arka Vikas", "MTECH-1061", "Himsona", "Abhilash"],
                        season: "All Seasons",
                        ideal_temperature_c: { min: 18, max: 30 },
                        rainfall_requirement_mm: [600, 1200],
                        best_soil_types: ["Well-drained loamy soil rich in organic matter", "Sandy loam with pH 6.0-7.0", "Deep fertile soil with good water retention"],
                        agroclimatic_zones: ["Konkan", "Marathwada", "Western Ghats"],
                        cultivation_tips: "Sensitive to waterlogging and extreme temperatures"
                    },
                    {
                        name: "Maize",
                        varieties: ["Ganga-5", "Deccan-103", "HQPM-1", "African Tall", "Composite-4"],
                        season: "Kharif/Rabi",
                        ideal_temperature_c: { min: 20, max: 32 },
                        rainfall_requirement_mm: [500, 800],
                        best_soil_types: ["Well-drained loamy soil with good fertility", "Deep alluvial soil with pH 6.0-7.5", "Sandy loam with adequate organic matter"],
                        agroclimatic_zones: ["Transition Zone I", "Central Maharashtra Plateau"],
                        cultivation_tips: "Requires adequate drainage and balanced nutrition"
                    }
                ]
            };
            console.log('Using fallback crops data');
        }
    }

    // Soil type compatibility mapping
    getSoilCompatibility(cropSoilTypes, userSoilType) {
        const soilMappings = {
            'black-cotton': ['black cotton soil', 'medium to deep black cotton soil', 'deep black cotton soil', 'well-drained black soil'],
            'red-lateritic': ['red lateritic soil', 'well-drained red lateritic soil', 'lateritic soil'],
            'alluvial': ['alluvial soil', 'deep alluvial soil', 'fertile alluvial soil', 'well-drained alluvial soil'],
            'sandy-loam': ['sandy loam', 'well-drained sandy loam', 'sandy loam soil', 'light textured soil'],
            'clay-loam': ['clay loam', 'clayey loam', 'deep clay loam'],
            'well-drained-loamy': ['well-drained loamy soil', 'loamy soil', 'deep loamy soil'],
            'deep-loamy': ['deep loamy soil', 'deep fertile soil', 'deep soil'],
            'forest-loam': ['forest loam', 'forest loam soil', 'rich organic soil'],
            'coastal-sandy': ['coastal alluvial soil', 'sandy soil', 'red coastal soil']
        };

        const userSoilKeywords = soilMappings[userSoilType] || [];
        
        return cropSoilTypes.some(soilType => {
            const lowerSoilType = soilType.toLowerCase();
            return userSoilKeywords.some(keyword => 
                lowerSoilType.includes(keyword.toLowerCase())
            );
        });
    }

    // Irrigation compatibility check
    getIrrigationCompatibility(crop, irrigationType) {
        const rainfallReq = crop.rainfall_requirement_mm;
        const minRainfall = rainfallReq[0];
        
        switch (irrigationType) {
            case 'rain-fed':
                return minRainfall <= 800; // Suitable for low to medium rainfall crops
            case 'drip':
            case 'sprinkler':
                return true; // Modern irrigation suitable for most crops
            case 'flood':
                return crop.name.toLowerCase().includes('rice') || minRainfall > 1000;
            case 'furrow':
            case 'canal':
            case 'well':
                return minRainfall <= 1500; // Good for medium water requirement crops
            default:
                return true;
        }
    }

    // Land size suitability
    getLandSizeSuitability(crop, landSize) {
        const size = parseFloat(landSize);
        if (isNaN(size)) return { suitable: true, recommendation: '' };

        // Perennial crops need more space and investment
        if (crop.season === 'Perennial') {
            if (size < 0.5) {
                return { suitable: false, recommendation: 'Consider smaller crops for limited space' };
            } else if (size < 2) {
                return { suitable: true, recommendation: 'Good for small-scale orcharding' };
            } else {
                return { suitable: true, recommendation: 'Excellent for commercial cultivation' };
            }
        }

        // Annual crops
        if (size < 0.25) {
            return { suitable: true, recommendation: 'Suitable for kitchen garden/small farming' };
        } else if (size < 1) {
            return { suitable: true, recommendation: 'Good for subsistence farming' };
        } else if (size < 5) {
            return { suitable: true, recommendation: 'Suitable for small commercial farming' };
        } else {
            return { suitable: true, recommendation: 'Excellent for large-scale commercial farming' };
        }
    }

    // Get season-based recommendations
    getCurrentSeasonRecommendation() {
        const month = new Date().getMonth() + 1;
        
        if (month >= 6 && month <= 10) {
            return 'Kharif'; // Monsoon season
        } else if (month >= 11 || month <= 3) {
            return 'Rabi'; // Winter season
        } else {
            return 'Summer'; // Summer season
        }
    }

    // Score crops based on suitability
    scoreCrop(crop, userSoilType, irrigationType, landSize) {
        let score = 0;
        let reasons = [];

        // Soil compatibility (40% weight)
        if (this.getSoilCompatibility(crop.best_soil_types, userSoilType)) {
            score += 40;
            reasons.push('Excellent soil compatibility');
        } else {
            reasons.push('Moderate soil compatibility');
        }

        // Irrigation compatibility (30% weight)
        if (this.getIrrigationCompatibility(crop, irrigationType)) {
            score += 30;
            reasons.push('Suitable for your irrigation method');
        } else {
            score += 10;
            reasons.push('May need irrigation adjustments');
        }

        // Seasonal suitability (20% weight)
        const currentSeason = this.getCurrentSeasonRecommendation();
        if (crop.season === currentSeason || crop.season === 'All Seasons' || crop.season === 'Perennial') {
            score += 20;
            reasons.push('Perfect seasonal timing');
        } else if (crop.season.includes(currentSeason)) {
            score += 15;
            reasons.push('Good seasonal match');
        } else {
            score += 5;
            reasons.push('Consider for next season');
        }

        // Land size suitability (10% weight)
        const landSuitability = this.getLandSizeSuitability(crop, landSize);
        if (landSuitability.suitable) {
            score += 10;
            if (landSuitability.recommendation) {
                reasons.push(landSuitability.recommendation);
            }
        }

        return { score, reasons };
    }

    // Get crop recommendations
    getRecommendations(location, soilType, landSize, irrigationType) {
        if (!this.cropsData || !this.cropsData.crops) {
            return [];
        }

        const recommendations = this.cropsData.crops.map(crop => {
            const { score, reasons } = this.scoreCrop(crop, soilType, irrigationType, landSize);
            
            return {
                ...crop,
                score,
                reasons,
                suitabilityRating: this.getSuitabilityRating(score)
            };
        });

        // Sort by score and return top recommendations
        return recommendations
            .sort((a, b) => b.score - a.score)
            .slice(0, 8); // Return top 8 recommendations
    }

    getSuitabilityRating(score) {
        if (score >= 85) return 'Excellent';
        if (score >= 70) return 'Very Good';
        if (score >= 55) return 'Good';
        if (score >= 40) return 'Fair';
        return 'Consider Alternatives';
    }

    // Get profitability estimate with real market data
    async getProfitabilityEstimate(crop, landSize) {
        const size = parseFloat(landSize) || 1;
        
        // Try to get real market prices, fallback to estimates
        const marketData = await this.getMarketPrices(crop.name);
        
        // Real market data for Maharashtra (updated periodically)
        const profitabilityMap = {
            'Cotton': { yield: 1500, cost: 40000, msp: 6080 }, // MSP per quintal
            'Soybean': { yield: 1200, cost: 25000, msp: 4892 }, // MSP per quintal
            'Sugarcane': { yield: 40000, cost: 60000, msp: 340 }, // MSP per quintal
            'Wheat': { yield: 2000, cost: 30000, msp: 2275 }, // MSP per quintal
            'Rice': { yield: 2500, cost: 35000, msp: 2183 }, // MSP per quintal (common)
            'Onion': { yield: 15000, cost: 45000, marketPrice: 12 }, // Current market price per kg
            'Tomato': { yield: 20000, cost: 50000, marketPrice: 8 }, // Seasonal variation
            'Grapes': { yield: 8000, cost: 150000, marketPrice: 80 }, // Export quality
            'Banana': { yield: 25000, cost: 80000, marketPrice: 15 },
            'Orange': { yield: 12000, cost: 100000, marketPrice: 25 },
            'Jowar (Sorghum)': { yield: 1800, cost: 28000, msp: 3225 },
            'Maize': { yield: 2200, cost: 32000, msp: 2090 }
        };

        const cropData = profitabilityMap[crop.name] || { yield: 1500, cost: 35000, marketPrice: 30 };
        
        // Use MSP (Minimum Support Price) if available, otherwise market price
        let pricePerKg;
        if (cropData.msp) {
            pricePerKg = cropData.msp / 100; // Convert quintal to kg
        } else {
            pricePerKg = marketData?.currentPrice || cropData.marketPrice || 30;
        }
        
        // Apply seasonal and market factors
        const seasonalFactor = this.getSeasonalPriceFactor(crop.name);
        const adjustedPrice = pricePerKg * seasonalFactor;
        
        const revenue = cropData.yield * size * adjustedPrice;
        const totalCost = cropData.cost * size;
        const profit = revenue - totalCost;
        const profitMargin = revenue > 0 ? ((profit / revenue) * 100).toFixed(1) : 0;

        return {
            estimatedYield: `${(cropData.yield * size).toLocaleString()} kg`,
            estimatedRevenue: `₹${revenue.toLocaleString()}`,
            estimatedCost: `₹${totalCost.toLocaleString()}`,
            estimatedProfit: `₹${profit.toLocaleString()}`,
            profitMargin: `${profitMargin}%`,
            profitability: profit > 0 ? (profitMargin > 20 ? 'High' : profitMargin > 10 ? 'Medium' : 'Low') : 'Loss Risk',
            priceSource: cropData.msp ? 'MSP (Government)' : 'Market Rate',
            pricePerKg: `₹${adjustedPrice.toFixed(2)}/kg`,
            lastUpdated: marketData?.lastUpdated || 'Static estimate'
        };
    }
    
    // Get seasonal price factors for crops
    getSeasonalPriceFactor(cropName) {
        const month = new Date().getMonth() + 1; // 1-12
        
        const seasonalFactors = {
            'Cotton': month >= 10 && month <= 2 ? 1.1 : 0.95, // Higher during harvest
            'Soybean': month >= 9 && month <= 11 ? 1.05 : 1.0,
            'Rice': month >= 11 && month <= 1 ? 1.08 : 0.98,
            'Wheat': month >= 3 && month <= 5 ? 1.12 : 0.95,
            'Onion': month >= 3 && month <= 6 ? 1.3 : month >= 11 ? 1.2 : 1.0, // Seasonal shortage
            'Tomato': month >= 11 && month <= 2 ? 1.25 : month >= 6 && month <= 8 ? 0.8 : 1.0
        };
        
        return seasonalFactors[cropName] || 1.0;
    }
    
    // Attempt to get real market prices (placeholder for API integration)
    async getMarketPrices(cropName) {
        try {
            // This would integrate with APMC/AgMarkNet API in production
            // For now, return null to use MSP/estimates
            
            // Example of what real integration would look like:
            /*
            const response = await fetch(`https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=YOUR_KEY&format=json&filters[commodity]=${cropName}`);
            if (response.ok) {
                const data = await response.json();
                return {
                    currentPrice: data.records[0]?.modal_price,
                    lastUpdated: data.records[0]?.arrival_date
                };
            }
            */
            
            return null; // Use fallback data
        } catch (error) {
            console.log('Market data fetch failed, using estimates:', error);
            return null;
        }
    }
}

// Global instance
window.cropRecommendationEngine = new CropRecommendationEngine();
