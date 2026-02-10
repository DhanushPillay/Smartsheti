/**
 * Maharashtra Weather Context Manager
 * Provides location intelligence including districts, agroclimatic zones, and crop context
 */

class MaharashtraWeatherContext {
    constructor() {
        this.locations = null;
        this.crops = null;
        this.initialized = false;
        this.agroclimaticZones = {
            "Konkan": {
                description: "Coastal region with high rainfall (2000-3000mm)",
                characteristics: "High humidity, moderate temperatures, monsoon critical",
                typical_crops: ["Rice", "Coconut", "Mango", "Cashew", "Betel nut"],
                climate: "humid_tropical"
            },
            "Western Ghat": {
                description: "Hilly terrain with heavy rainfall (3000-5000mm)",
                characteristics: "Cool temperatures, steep slopes, heavy monsoon",
                typical_crops: ["Rice", "Tea", "Coffee", "Spices", "Fruits"],
                climate: "mountain_tropical"
            },
            "Vidarbha": {
                description: "Cotton belt with moderate rainfall (700-1000mm)",
                characteristics: "Hot summers, moderate winters, rainfall dependent",
                typical_crops: ["Cotton", "Soybean", "Jowar", "Tur", "Oranges"],
                climate: "semi_arid"
            },
            "Marathwada": {
                description: "Drought-prone region with low rainfall (600-800mm)",
                characteristics: "Hot and dry, water scarcity, rainfed agriculture",
                typical_crops: ["Jowar", "Bajra", "Tur", "Cotton", "Sugarcane (irrigated)"],
                climate: "arid_semi_arid"
            },
            "Scarcity Zone": {
                description: "Western Maharashtra scarcity zone (500-700mm)",
                characteristics: "Low rainfall, hot summers, irrigation critical",
                typical_crops: ["Jowar", "Bajra", "Groundnut", "Sunflower"],
                climate: "arid"
            },
            "Western Maharashtra": {
                description: "Sugarcane belt with moderate rainfall (500-1000mm)",
                characteristics: "Black soil, hot climate, irrigation developed",
                typical_crops: ["Sugarcane", "Grapes", "Pomegranate", "Onion", "Cotton"],
                climate: "semi_arid"
            },
            "Transition Zone": {
                description: "Transitional agroclimatic zone",
                characteristics: "Variable rainfall, mixed cropping patterns",
                typical_crops: ["Jowar", "Cotton", "Groundnut", "Chilli"],
                climate: "variable"
            },
            "Assured Rainfall Zone": {
                description: "Regions with reliable rainfall (1000-1500mm)",
                characteristics: "Adequate moisture, diverse cropping",
                typical_crops: ["Soybean", "Rice", "Cotton", "Vegetables"],
                climate: "sub_humid"
            },
            "High Rainfall Vidarbha": {
                description: "Eastern Vidarbha with better rainfall",
                characteristics: "Higher rainfall than western Vidarbha",
                typical_crops: ["Rice", "Soybean", "Cotton", "Vegetables"],
                climate: "semi_humid"
            }
        };

        this.seasons = {
            kharif: {
                name: "Kharif",
                months: [6, 7, 8, 9, 10], // June to October
                description: "Monsoon crop season",
                sowing_period: "June-July",
                harvest_period: "September-October"
            },
            rabi: {
                name: "Rabi",
                months: [11, 12, 1, 2, 3], // November to March
                description: "Winter crop season",
                sowing_period: "October-November",
                harvest_period: "February-March"
            },
            summer: {
                name: "Summer/Zaid",
                months: [4, 5], // April to May
                description: "Summer crop season",
                sowing_period: "March-April",
                harvest_period: "May-June"
            }
        };

        this.districtToZone = {
            // Konkan Division
            "Mumbai City": "Konkan",
            "Mumbai Suburban": "Konkan",
            "Thane": "Konkan",
            "Raigad": "Konkan",
            "Ratnagiri": "Konkan",
            "Sindhudurg": "Konkan",
            "Palghar": "Konkan",
            
            // Nashik Division
            "Nashik": "Western Maharashtra",
            "Dhule": "Scarcity Zone",
            "Jalgaon": "Scarcity Zone",
            "Nandurbar": "Scarcity Zone",
            
            // Pune Division
            "Pune": "Western Maharashtra",
            "Satara": "Western Ghat",
            "Sangli": "Western Maharashtra",
            "Solapur": "Scarcity Zone",
            "Kolhapur": "Western Ghat",
            
            // Aurangabad Division (Marathwada)
            "Aurangabad": "Marathwada",
            "Jalna": "Marathwada",
            "Beed": "Marathwada",
            "Parbhani": "Marathwada",
            "Hingoli": "Marathwada",
            "Nanded": "Marathwada",
            "Latur": "Marathwada",
            "Osmanabad": "Marathwada",
            
            // Amravati Division (Vidarbha)
            "Amravati": "Vidarbha",
            "Akola": "Vidarbha",
            "Yavatmal": "Vidarbha",
            "Buldhana": "Vidarbha",
            "Washim": "Vidarbha",
            
            // Nagpur Division (Vidarbha)
            "Nagpur": "High Rainfall Vidarbha",
            "Wardha": "Vidarbha",
            "Bhandara": "High Rainfall Vidarbha",
            "Gondia": "High Rainfall Vidarbha",
            "Chandrapur": "High Rainfall Vidarbha",
            "Gadchiroli": "High Rainfall Vidarbha"
        };
    }

    async initialize() {
        if (this.initialized) return;

        try {
            // Load Maharashtra crops data
            const cropsResponse = await fetch('/data/json/Maharashtra_crops.json');
            const cropsData = await cropsResponse.json();
            this.crops = cropsData.crops || [];

            // Use the global maharashtraLocations if available
            if (window.maharashtraLocations) {
                this.locations = window.maharashtraLocations;
            }

            this.initialized = true;
            console.log('Maharashtra Weather Context initialized:', {
                crops: this.crops.length,
                locations: Object.keys(this.locations || {}).length
            });
        } catch (error) {
            console.error('Error initializing Maharashtra context:', error);
            this.crops = [];
            this.locations = {};
        }
    }

    /**
     * Get comprehensive location context
     */
    getLocationContext(locationName) {
        if (!this.initialized) {
            console.warn('Context not initialized');
            return null;
        }

        let location = null;
        let district = null;

        // Try to find location in maharashtra locations
        if (this.locations) {
            const key = locationName.toLowerCase();
            location = this.locations[key];
            
            if (location) {
                district = location.district;
            }
        }

        // If no district found, try to extract from name or use default
        if (!district) {
            // Check if location name contains a known district
            for (const districtName of Object.keys(this.districtToZone)) {
                if (locationName.toLowerCase().includes(districtName.toLowerCase())) {
                    district = districtName;
                    break;
                }
            }
        }

        const zone = district ? this.districtToZone[district] : null;
        const zoneInfo = zone ? this.agroclimaticZones[zone] : null;

        // Get crops for this zone
        const commonCrops = this.getCropsForZone(zone);

        return {
            location: locationName,
            district: district || 'Unknown',
            agroclimatic_zone: zone || 'Unknown',
            zone_info: zoneInfo,
            common_crops: commonCrops,
            coordinates: location ? { lat: location.lat, lng: location.lng } : null,
            location_type: location ? location.type : 'unknown'
        };
    }

    /**
     * Get crops suitable for a specific agroclimatic zone
     */
    getCropsForZone(zone) {
        if (!zone || !this.crops) return [];

        return this.crops.filter(crop => {
            return crop.agroclimatic_zones && 
                   crop.agroclimatic_zones.includes(zone);
        });
    }

    /**
     * Get crops for a specific district
     */
    getCropsForDistrict(district) {
        const zone = this.districtToZone[district];
        return this.getCropsForZone(zone);
    }

    /**
     * Get current season based on date
     */
    getCurrentSeason(date = new Date()) {
        const month = date.getMonth() + 1; // JavaScript months are 0-indexed

        for (const [key, season] of Object.entries(this.seasons)) {
            if (season.months.includes(month)) {
                return {
                    key: key,
                    ...season,
                    is_monsoon: key === 'kharif',
                    current_month: month
                };
            }
        }

        return null;
    }

    /**
     * Get seasonal context including relevant crops
     */
    getSeasonalContext(date = new Date(), zone = null) {
        const season = this.getCurrentSeason(date);
        if (!season) return null;

        // Get crops for this season
        let seasonalCrops = this.crops.filter(crop => {
            if (!crop.season) return false;
            const cropSeasons = crop.season.toLowerCase();
            return cropSeasons.includes(season.key) || 
                   cropSeasons.includes('perennial') ||
                   cropSeasons.includes('all');
        });

        // Filter by zone if provided
        if (zone && this.agroclimaticZones[zone]) {
            seasonalCrops = seasonalCrops.filter(crop => {
                return crop.agroclimatic_zones && 
                       crop.agroclimatic_zones.includes(zone);
            });
        }

        return {
            season: season,
            crops: seasonalCrops,
            activities: this.getSeasonalActivities(season.key, date)
        };
    }

    /**
     * Get recommended agricultural activities for current time
     */
    getSeasonalActivities(seasonKey, date) {
        const month = date.getMonth() + 1;
        const activities = [];

        if (seasonKey === 'kharif') {
            if (month === 6 || month === 7) {
                activities.push({
                    type: 'sowing',
                    priority: 'high',
                    description: 'Kharif sowing season - prepare fields and sow monsoon crops',
                    crops: ['Rice', 'Cotton', 'Soybean', 'Jowar']
                });
                activities.push({
                    type: 'monsoon_prep',
                    priority: 'high',
                    description: 'Monsoon preparation - check drainage, repair bunds',
                    crops: []
                });
            } else if (month === 8 || month === 9) {
                activities.push({
                    type: 'crop_care',
                    priority: 'medium',
                    description: 'Monitor crops, apply fertilizers, pest management',
                    crops: ['Rice', 'Cotton', 'Soybean']
                });
            } else if (month === 10) {
                activities.push({
                    type: 'harvest_prep',
                    priority: 'high',
                    description: 'Prepare for Kharif harvest',
                    crops: ['Soybean', 'Cotton', 'Rice']
                });
            }
        } else if (seasonKey === 'rabi') {
            if (month === 11) {
                activities.push({
                    type: 'sowing',
                    priority: 'high',
                    description: 'Rabi sowing season - sow winter crops',
                    crops: ['Wheat', 'Gram', 'Jowar']
                });
            } else if (month === 12 || month === 1 || month === 2) {
                activities.push({
                    type: 'crop_care',
                    priority: 'medium',
                    description: 'Irrigation and fertilizer management for Rabi crops',
                    crops: ['Wheat', 'Gram']
                });
            } else if (month === 3) {
                activities.push({
                    type: 'harvest',
                    priority: 'high',
                    description: 'Rabi harvest season',
                    crops: ['Wheat', 'Gram', 'Jowar']
                });
            }
        } else if (seasonKey === 'summer') {
            if (month === 4 || month === 5) {
                activities.push({
                    type: 'land_prep',
                    priority: 'medium',
                    description: 'Summer land preparation for Kharif season',
                    crops: []
                });
                activities.push({
                    type: 'irrigation',
                    priority: 'high',
                    description: 'Manage irrigation for summer crops (if grown)',
                    crops: ['Vegetables', 'Fodder']
                });
            }
        }

        return activities;
    }

    /**
     * Search locations with autocomplete
     */
    searchLocations(query, limit = 10) {
        if (!this.locations || !query) return [];

        query = query.toLowerCase();
        const results = [];

        for (const [name, data] of Object.entries(this.locations)) {
            if (name.includes(query)) {
                results.push({
                    name: name,
                    display_name: this.formatLocationName(name),
                    district: data.district,
                    type: data.type,
                    lat: data.lat,
                    lng: data.lng
                });
            }

            if (results.length >= limit) break;
        }

        return results;
    }

    /**
     * Format location name for display
     */
    formatLocationName(name) {
        return name.split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    /**
     * Get zone information
     */
    getZoneInfo(zone) {
        return this.agroclimaticZones[zone] || null;
    }

    /**
     * Check if location is in Maharashtra
     */
    isInMaharashtra(locationName) {
        if (!this.locations) return false;
        return locationName.toLowerCase() in this.locations;
    }
}

// Create global instance
window.MaharashtraWeatherContext = MaharashtraWeatherContext;
