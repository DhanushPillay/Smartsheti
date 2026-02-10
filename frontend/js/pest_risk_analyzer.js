/**
 * Pest Risk Analyzer
 * Comprehensive pest risk analysis system for agricultural applications
 * Analyzes weather conditions to predict pest risks and provide recommendations
 */

class PestRiskAnalyzer {
    constructor() {
        // Zone-specific pest priorities for Maharashtra
        this.zonePestPriorities = {
            'Vidarbha': {
                'bollworm': 10,
                'whitefly': 8,
                'spiderMites': 6,
                'aphids': 4,
                'leafhopper': 3
            },
            'High Rainfall Vidarbha': {
                'bollworm': 9,
                'stemBorer': 7,
                'whitefly': 6,
                'fungalDiseases': 8,
                'armyworm': 5
            },
            'Marathwada': {
                'shootFly': 10,
                'thrips': 6,
                'bollworm': 5,
                'spiderMites': 4,
                'aphids': 3
            },
            'Konkan': {
                'fungalDiseases': 10,
                'stemBorer': 9,
                'leafhopper': 6,
                'whitefly': 5,
                'armyworm': 4
            },
            'Western Maharashtra': {
                'stemBorer': 9,
                'thrips': 8,
                'aphids': 6,
                'whitefly': 5,
                'fungalDiseases': 7
            },
            'Western Ghat': {
                'fungalDiseases': 9,
                'stemBorer': 7,
                'leafhopper': 6,
                'whitefly': 4
            },
            'Scarcity Zone': {
                'spiderMites': 8,
                'thrips': 7,
                'shootFly': 6,
                'aphids': 4
            },
            'Transition Zone': {
                'bollworm': 7,
                'stemBorer': 6,
                'aphids': 5,
                'whitefly': 5,
                'thrips': 4
            },
            'Assured Rainfall Zone': {
                'stemBorer': 8,
                'bollworm': 7,
                'fungalDiseases': 6,
                'whitefly': 5
            }
        };

        this.pestDatabase = {
            aphids: {
                name: "Aphids",
                icon: "🐛",
                conditions: {
                    temperature: { min: 18, max: 35 },
                    humidity: { min: 50, max: 100 },
                    cloudCover: { min: 30, max: 100 },
                    windSpeed: { min: 0, max: 15 }
                },
                riskLevel: "moderate",
                description: "Small soft-bodied insects that feed on plant sap",
                seasonalActivity: {
                    'Kharif': 5,
                    'Rabi': 10,
                    'Summer': 7
                },
                symptoms: ["Curled leaves", "Stunted growth", "Honeydew on leaves", "Yellowing"],
                affectedCrops: ["Cotton", "Wheat", "Vegetables", "Legumes"],
                prevention: [
                    "Regular field inspection",
                    "Use yellow sticky traps",
                    "Encourage beneficial insects",
                    "Avoid over-fertilization with nitrogen"
                ],
                treatment: [
                    "Spray with insecticidal soap",
                    "Use neem oil",
                    "Apply systemic insecticides if severe",
                    "Remove affected plant parts"
                ]
            },
            whitefly: {
                name: "Whitefly",
                icon: "☁️",
                conditions: {
                    temperature: { min: 20, max: 32 },
                    humidity: { min: 35, max: 100 },
                    cloudCover: { min: 0, max: 100 },
                    windSpeed: { min: 0, max: 10 }
                },
                riskLevel: "high",
                description: "Small white flying insects that damage crops",
                seasonalActivity: {
                    'Kharif': 10,
                    'Rabi': 6,
                    'Summer': 8
                },
                symptoms: ["White flying insects", "Yellowing leaves", "Sooty mold", "Reduced yield"],
                affectedCrops: ["Tomato", "Cotton", "Cabbage", "Beans"],
                prevention: [
                    "Use yellow sticky traps",
                    "Remove weeds around fields",
                    "Plant trap crops",
                    "Use reflective mulch"
                ],
                treatment: [
                    "Apply systemic insecticides",
                    "Use biological control agents",
                    "Spray with horticultural oil",
                    "Remove heavily infested plants"
                ]
            },
            spiderMites: {
                name: "Red Spider Mites",
                icon: "🕷️",
                conditions: {
                    temperature: { min: 25, max: 45 },
                    humidity: { min: 0, max: 60 },
                    cloudCover: { min: 0, max: 40 },
                    windSpeed: { min: 0, max: 20 }
                },
                riskLevel: "high",
                description: "Tiny spider-like pests that thrive in hot, dry conditions",
                seasonalActivity: {
                    'Kharif': 7,
                    'Rabi': 6,
                    'Summer': 10
                },
                symptoms: ["Fine webbing", "Stippled leaves", "Bronze coloration", "Leaf drop"],
                affectedCrops: ["Cotton", "Soybeans", "Corn", "Vegetables"],
                prevention: [
                    "Maintain adequate soil moisture",
                    "Avoid dusty conditions",
                    "Regular misting of plants",
                    "Encourage predatory mites"
                ],
                treatment: [
                    "Apply miticides",
                    "Increase humidity around plants",
                    "Use predatory insects",
                    "Remove affected leaves"
                ]
            },
            stemBorer: {
                name: "Stem Borer",
                icon: "🌾",
                conditions: {
                    temperature: { min: 20, max: 35 },
                    humidity: { min: 60, max: 100 },
                    cloudCover: { min: 40, max: 100 },
                    windSpeed: { min: 0, max: 8 }
                },
                riskLevel: "severe",
                description: "Caterpillars that bore into plant stems",
                seasonalActivity: {
                    'Kharif': 10,
                    'Rabi': 5,
                    'Summer': 4
                },
                symptoms: ["Dead hearts", "Holes in stems", "Wilting", "Broken stems"],
                affectedCrops: ["Rice", "Sugarcane", "Corn", "Sorghum"],
                prevention: [
                    "Use pheromone traps",
                    "Plant resistant varieties",
                    "Proper field sanitation",
                    "Avoid late planting"
                ],
                treatment: [
                    "Apply granular insecticides",
                    "Use egg parasitoids",
                    "Cut and destroy affected stems",
                    "Apply soil treatment"
                ]
            },
            fungalDiseases: {
                name: "Fungal Diseases",
                icon: "🍄",
                conditions: {
                    temperature: { min: 15, max: 30 },
                    humidity: { min: 70, max: 100 },
                    rainfall: { min: 0.5, max: 100 },
                    cloudCover: { min: 50, max: 100 }
                },
                riskLevel: "severe",
                description: "Various fungal infections promoted by wet conditions",
                seasonalActivity: {
                    'Kharif': 10,
                    'Rabi': 7,
                    'Summer': 3
                },
                symptoms: ["Leaf spots", "Wilting", "Rot", "Mold growth"],
                affectedCrops: ["All crops", "Vegetables", "Fruits", "Grains"],
                prevention: [
                    "Improve air circulation",
                    "Avoid overhead watering",
                    "Remove plant debris",
                    "Use resistant varieties"
                ],
                treatment: [
                    "Apply fungicides",
                    "Remove affected parts",
                    "Improve drainage",
                    "Use biological controls"
                ]
            },
            thrips: {
                name: "Thrips",
                icon: "🌬️",
                conditions: {
                    temperature: { min: 24, max: 40 },
                    humidity: { min: 0, max: 65 },
                    windSpeed: { min: 5, max: 25 },
                    cloudCover: { min: 0, max: 50 }
                },
                riskLevel: "moderate",
                description: "Tiny insects that rasp leaf surfaces",
                seasonalActivity: {
                    'Kharif': 6,
                    'Rabi': 10,
                    'Summer': 8
                },
                symptoms: ["Silver streaks on leaves", "Black specks", "Curled leaves", "Stunted growth"],
                affectedCrops: ["Onion", "Cotton", "Vegetables", "Flowers"],
                prevention: [
                    "Use blue sticky traps",
                    "Maintain soil moisture",
                    "Remove weeds",
                    "Use reflective mulch"
                ],
                treatment: [
                    "Apply systemic insecticides",
                    "Use predatory mites",
                    "Spray with neem oil",
                    "Remove affected leaves"
                ]
            },
            leafhopper: {
                name: "Leafhopper",
                icon: "🍃",
                conditions: {
                    temperature: { min: 22, max: 35 },
                    humidity: { min: 40, max: 100 },
                    rainfall: { min: 0.1, max: 50 },
                    cloudCover: { min: 30, max: 100 }
                },
                riskLevel: "moderate",
                description: "Jumping insects that transmit plant diseases",
                seasonalActivity: {
                    'Kharif': 9,
                    'Rabi': 5,
                    'Summer': 6
                },
                symptoms: ["Yellowing leaves", "Stunted growth", "Hopper burn", "Viral symptoms"],
                affectedCrops: ["Rice", "Potato", "Beans", "Vegetables"],
                prevention: [
                    "Use yellow sticky traps",
                    "Remove alternate hosts",
                    "Plant barrier crops",
                    "Use resistant varieties"
                ],
                treatment: [
                    "Apply systemic insecticides",
                    "Use biological controls",
                    "Remove infected plants",
                    "Control weeds"
                ]
            },
            shootFly: {
                name: "Shoot Fly",
                icon: "🐞",
                conditions: {
                    temperature: { min: 24, max: 40 },
                    humidity: { min: 30, max: 70 },
                    rainfall: { min: 0.1, max: 8 },
                    cloudCover: { min: 0, max: 60 }
                },
                riskLevel: "high",
                description: "Small flies whose larvae damage young shoots",
                seasonalActivity: {
                    'Kharif': 10,
                    'Rabi': 8,
                    'Summer': 5
                },
                symptoms: ["Dead hearts", "Wilting shoots", "Stunted growth", "Reduced tillering"],
                affectedCrops: ["Sorghum", "Pearl millet", "Maize", "Rice"],
                prevention: [
                    "Early planting",
                    "Use resistant varieties",
                    "Soil treatment",
                    "Proper field preparation"
                ],
                treatment: [
                    "Apply granular insecticides",
                    "Use seed treatment",
                    "Spray systemic insecticides",
                    "Remove affected plants"
                ]
            },
            bollworm: {
                name: "Bollworm",
                icon: "🧨",
                conditions: {
                    temperature: { min: 20, max: 35 },
                    humidity: { min: 45, max: 100 },
                    cloudCover: { min: 20, max: 100 },
                    windSpeed: { min: 0, max: 15 }
                },
                riskLevel: "severe",
                description: "Caterpillars that damage cotton bolls and other crops",
                seasonalActivity: {
                    'Kharif': 10,
                    'Rabi': 3,
                    'Summer': 5
                },
                symptoms: ["Damaged bolls", "Holes in fruits", "Caterpillars", "Reduced yield"],
                affectedCrops: ["Cotton", "Tomato", "Okra", "Chickpea"],
                prevention: [
                    "Use pheromone traps",
                    "Plant trap crops",
                    "Regular monitoring",
                    "Use Bt cotton varieties"
                ],
                treatment: [
                    "Apply specific insecticides",
                    "Use biological controls",
                    "Hand picking of larvae",
                    "Destroy crop residue"
                ]
            },
            armyworm: {
                name: "Armyworm",
                icon: "🪖",
                conditions: {
                    temperature: { min: 18, max: 35 },
                    humidity: { min: 60, max: 100 },
                    rainfall: { min: 0.1, max: 100 },
                    cloudCover: { min: 50, max: 100 }
                },
                riskLevel: "severe",
                description: "Destructive caterpillars that move in groups",
                seasonalActivity: {
                    'Kharif': 9,
                    'Rabi': 6,
                    'Summer': 4
                },
                symptoms: ["Chewed leaves", "Defoliation", "Cut stems", "Rapid damage"],
                affectedCrops: ["Maize", "Rice", "Wheat", "Vegetables"],
                prevention: [
                    "Regular field scouting",
                    "Use light traps",
                    "Maintain field hygiene",
                    "Plant early varieties"
                ],
                treatment: [
                    "Immediate insecticide application",
                    "Biological control agents",
                    "Trenching around fields",
                    "Destroy egg masses"
                ]
            }
        };
    }

    /**
     * Analyze weather conditions and return pest risks with location-aware filtering
     * @param {Object} weatherData - Weather data object
     * @param {Object} locationContext - Location context from MaharashtraWeatherContext (optional)
     * @returns {Array} Array of detected pest risks with relevance scores
     */
    analyzePestRisks(weatherData, locationContext = null) {
        console.log('PestRiskAnalyzer: Analyzing weather data:', weatherData);
        console.log('PestRiskAnalyzer: Location context:', locationContext);
        
        const conditions = this.extractWeatherConditions(weatherData);
        console.log('PestRiskAnalyzer: Extracted conditions:', conditions);
        
        const detectedPests = [];
        
        for (const [pestKey, pestInfo] of Object.entries(this.pestDatabase)) {
            if (this.checkPestConditions(conditions, pestInfo.conditions)) {
                // Calculate multi-factor relevance score if location context is available
                let relevanceScore = 50; // Default score for backward compatibility
                let scoringDetails = null;
                
                if (locationContext) {
                    const scoring = this.calculatePestRelevance(
                        pestKey,
                        pestInfo,
                        conditions,
                        locationContext
                    );
                    relevanceScore = scoring.totalScore;
                    scoringDetails = scoring.details;
                }
                
                detectedPests.push({
                    key: pestKey,
                    ...pestInfo,
                    conditions: conditions,
                    relevanceScore: relevanceScore,
                    scoringDetails: scoringDetails,
                    alertLevel: this.getAlertLevel(relevanceScore)
                });
            }
        }
        
        // Sort by relevance score (highest first)
        detectedPests.sort((a, b) => b.relevanceScore - a.relevanceScore);
        
        console.log('PestRiskAnalyzer: Detected pests with scores:', detectedPests);
        return detectedPests;
    }

    /**
     * Calculate pest relevance using multi-factor scoring
     * Total Score = Weather(25) + Crop(30) + Season(25) + Zone(20)
     * @param {string} pestKey - Pest database key
     * @param {Object} pestInfo - Pest information object
     * @param {Object} conditions - Current weather conditions
     * @param {Object} locationContext - Location context
     * @returns {Object} Scoring details and total score
     */
    calculatePestRelevance(pestKey, pestInfo, conditions, locationContext) {
        const scoring = {
            weatherScore: 0,
            cropScore: 0,
            seasonScore: 0,
            zoneScore: 0,
            totalScore: 0,
            details: {}
        };

        // 1. Weather Suitability Score (0-25 points)
        scoring.weatherScore = this.calculateWeatherScore(conditions, pestInfo.conditions);
        scoring.details.weather = `${scoring.weatherScore}/25 - Conditions favor pest`;

        // 2. Crop Relevance Score (0-30 points)
        if (locationContext.zoneCrops && locationContext.zoneCrops.length > 0) {
            scoring.cropScore = this.calculateCropScore(pestInfo.affectedCrops, locationContext.zoneCrops);
            scoring.details.crop = `${scoring.cropScore}/30 - ${locationContext.zoneCrops.length} crops at risk`;
        } else {
            scoring.cropScore = 15; // Neutral score if no crop data
            scoring.details.crop = `${scoring.cropScore}/30 - Default (no crop data)`;
        }

        // 3. Seasonal Timing Score (0-25 points)
        if (locationContext.currentSeason && pestInfo.seasonalActivity) {
            const seasonKey = locationContext.currentSeason.key;
            const seasonalActivity = pestInfo.seasonalActivity[seasonKey] || 5;
            scoring.seasonScore = (seasonalActivity / 10) * 25;
            scoring.details.season = `${scoring.seasonScore}/25 - ${seasonKey} season activity`;
        } else {
            scoring.seasonScore = 12.5; // Neutral score
            scoring.details.season = `${scoring.seasonScore}/25 - Default`;
        }

        // 4. Regional Prevalence Score (0-20 points)
        if (locationContext.zone && this.zonePestPriorities[locationContext.zone]) {
            const zonePriority = this.zonePestPriorities[locationContext.zone][pestKey] || 0;
            scoring.zoneScore = (zonePriority / 10) * 20;
            scoring.details.zone = `${scoring.zoneScore}/20 - ${locationContext.zone} priority`;
        } else {
            scoring.zoneScore = 10; // Neutral score
            scoring.details.zone = `${scoring.zoneScore}/20 - Default`;
        }

        // Calculate total
        scoring.totalScore = Math.round(
            scoring.weatherScore + scoring.cropScore + scoring.seasonScore + scoring.zoneScore
        );

        return scoring;
    }

    /**
     * Calculate weather suitability score
     * @param {Object} current - Current conditions
     * @param {Object} requirements - Pest requirements
     * @returns {number} Score 0-25
     */
    calculateWeatherScore(current, requirements) {
        let matchCount = 0;
        let totalConditions = Object.keys(requirements).length;

        for (const [condition, range] of Object.entries(requirements)) {
            const value = current[condition];
            if (value >= range.min && value <= range.max) {
                // Calculate how optimal the condition is (closer to middle of range = higher score)
                const midpoint = (range.min + range.max) / 2;
                const rangeSize = range.max - range.min;
                const deviation = Math.abs(value - midpoint);
                const optimality = 1 - (deviation / (rangeSize / 2));
                matchCount += Math.max(0, optimality);
            }
        }

        return Math.round((matchCount / totalConditions) * 25);
    }

    /**
     * Calculate crop relevance score
     * @param {Array} affectedCrops - Crops affected by pest
     * @param {Array} zoneCrops - Crops grown in zone
     * @returns {number} Score 0-30
     */
    calculateCropScore(affectedCrops, zoneCrops) {
        if (!affectedCrops || !zoneCrops || zoneCrops.length === 0) {
            return 15; // Neutral score
        }

        // Count how many zone crops are affected
        const zoneCropNames = zoneCrops.map(c => c.name || c);
        const matchedCrops = affectedCrops.filter(crop => 
            zoneCropNames.some(zoneCrop => 
                zoneCrop.toLowerCase().includes(crop.toLowerCase()) ||
                crop.toLowerCase().includes(zoneCrop.toLowerCase())
            )
        );

        if (matchedCrops.length === 0) return 5; // Low relevance
        if (matchedCrops.length === 1) return 20; // Moderate relevance
        return 30; // High relevance - multiple crops affected
    }

    /**
     * Get alert level based on relevance score
     * @param {number} score - Relevance score 0-100
     * @returns {string} Alert level
     */
    getAlertLevel(score) {
        if (score >= 80) return 'CRITICAL';
        if (score >= 60) return 'HIGH';
        if (score >= 40) return 'MODERATE';
        return 'LOW';
    }

    /**
     * Extract weather conditions from weather data
     * @param {Object} weatherData - Raw weather data
     * @returns {Object} Processed weather conditions
     */
    extractWeatherConditions(weatherData) {
        return {
            temperature: weatherData.main?.temp || 25,
            humidity: weatherData.main?.humidity || 50,
            rainfall: weatherData.rain?.['1h'] || weatherData.rain?.['3h'] || 0,
            cloudCover: weatherData.clouds?.all || 0,
            windSpeed: weatherData.wind?.speed || 0,
            pressure: weatherData.main?.pressure || 1013
        };
    }

    /**
     * Check if weather conditions match pest requirements
     * @param {Object} currentConditions - Current weather conditions
     * @param {Object} pestConditions - Pest condition requirements
     * @returns {boolean} True if conditions favor the pest
     */
    checkPestConditions(currentConditions, pestConditions) {
        for (const [condition, range] of Object.entries(pestConditions)) {
            const currentValue = currentConditions[condition];
            if (currentValue < range.min || currentValue > range.max) {
                return false;
            }
        }
        return true;
    }

    /**
     * Generate comprehensive pest risk report
     * @param {Object} weatherData - Weather data
     * @param {string} language - Language for translations (default: 'en')
     * @returns {Object} Comprehensive pest risk report
     */
    generatePestRiskReport(weatherData, language = 'en') {
        const detectedPests = this.analyzePestRisks(weatherData);
        const conditions = this.extractWeatherConditions(weatherData);
        
        return {
            timestamp: new Date().toISOString(),
            weatherConditions: conditions,
            totalPestsDetected: detectedPests.length,
            riskLevel: this.calculateOverallRiskLevel(detectedPests),
            detectedPests: detectedPests,
            recommendations: this.generateRecommendations(detectedPests, language),
            preventiveMeasures: this.generatePreventiveMeasures(detectedPests, language),
            monitoringAdvice: this.generateMonitoringAdvice(detectedPests, language)
        };
    }

    /**
     * Calculate overall risk level
     * @param {Array} detectedPests - Array of detected pests
     * @returns {string} Overall risk level
     */
    calculateOverallRiskLevel(detectedPests) {
        if (detectedPests.length === 0) return 'low';
        
        const severePests = detectedPests.filter(pest => pest.riskLevel === 'severe');
        const highPests = detectedPests.filter(pest => pest.riskLevel === 'high');
        
        if (severePests.length > 0) return 'severe';
        if (highPests.length > 1) return 'high';
        if (highPests.length > 0 || detectedPests.length > 2) return 'moderate';
        return 'low';
    }

    /**
     * Generate specific recommendations based on detected pests
     * @param {Array} detectedPests - Array of detected pests
     * @param {string} language - Language for recommendations
     * @returns {Array} Array of recommendations
     */
    generateRecommendations(detectedPests, language = 'en') {
        const recommendations = new Set();
        
        detectedPests.forEach(pest => {
            pest.treatment.forEach(treatment => {
                recommendations.add(`${pest.icon} ${pest.name}: ${treatment}`);
            });
        });
        
        return Array.from(recommendations);
    }

    /**
     * Generate preventive measures
     * @param {Array} detectedPests - Array of detected pests
     * @param {string} language - Language for measures
     * @returns {Array} Array of preventive measures
     */
    generatePreventiveMeasures(detectedPests, language = 'en') {
        const measures = new Set();
        
        detectedPests.forEach(pest => {
            pest.prevention.forEach(prevention => {
                measures.add(`${pest.icon} ${prevention}`);
            });
        });
        
        // Add general measures
        measures.add("🔍 Conduct daily field inspections");
        measures.add("📊 Keep detailed records of pest sightings");
        measures.add("🌡️ Monitor weather conditions regularly");
        measures.add("☎️ Contact agricultural extension officer if needed");
        
        return Array.from(measures);
    }

    /**
     * Generate monitoring advice
     * @param {Array} detectedPests - Array of detected pests
     * @param {string} language - Language for advice
     * @returns {Object} Monitoring advice object
     */
    generateMonitoringAdvice(detectedPests, language = 'en') {
        if (detectedPests.length === 0) {
            return {
                frequency: "Weekly monitoring is sufficient",
                focus: "General crop health assessment",
                urgency: "low"
            };
        }
        
        const severePests = detectedPests.filter(pest => pest.riskLevel === 'severe');
        
        if (severePests.length > 0) {
            return {
                frequency: "Daily monitoring required",
                focus: `Focus on ${severePests.map(p => p.name).join(', ')}`,
                urgency: "high",
                immediateAction: "Consider immediate treatment"
            };
        }
        
        return {
            frequency: "Monitor every 2-3 days",
            focus: `Watch for ${detectedPests.map(p => p.name).join(', ')}`,
            urgency: "moderate"
        };
    }

    /**
     * Get pest information by name
     * @param {string} pestName - Name of the pest
     * @returns {Object|null} Pest information object
     */
    getPestInfo(pestName) {
        const pestKey = Object.keys(this.pestDatabase).find(key => 
            this.pestDatabase[key].name.toLowerCase() === pestName.toLowerCase()
        );
        return pestKey ? this.pestDatabase[pestKey] : null;
    }

    /**
     * Get all supported pests
     * @returns {Array} Array of all pest names
     */
    getAllPests() {
        return Object.values(this.pestDatabase).map(pest => pest.name);
    }
}

// Export for use in other files
if (typeof window !== 'undefined') {
    window.PestRiskAnalyzer = PestRiskAnalyzer;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = PestRiskAnalyzer;
}
