/**
 * Pest Risk Analyzer
 * Comprehensive pest risk analysis system for agricultural applications
 * Analyzes weather conditions to predict pest risks and provide recommendations
 */

class PestRiskAnalyzer {
    constructor() {
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
     * Analyze weather conditions and return pest risks
     * @param {Object} weatherData - Weather data object
     * @returns {Array} Array of detected pest risks
     */
    analyzePestRisks(weatherData) {
        console.log('PestRiskAnalyzer: Analyzing weather data:', weatherData);
        
        const conditions = this.extractWeatherConditions(weatherData);
        console.log('PestRiskAnalyzer: Extracted conditions:', conditions);
        
        const detectedPests = [];
        
        for (const [pestKey, pestInfo] of Object.entries(this.pestDatabase)) {
            if (this.checkPestConditions(conditions, pestInfo.conditions)) {
                detectedPests.push({
                    key: pestKey,
                    ...pestInfo,
                    conditions: conditions
                });
            }
        }
        
        console.log('PestRiskAnalyzer: Detected pests:', detectedPests);
        return detectedPests;
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
