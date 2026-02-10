/**
 * Water Management and Irrigation Intelligence
 * Provides irrigation scheduling, soil moisture estimation, and water conservation advice
 */

class WaterManagement {
    constructor(weatherContext) {
        this.context = weatherContext;
        
        // Evapotranspiration reference values (mm/day) by temperature
        this.etReferenceRates = {
            cool: 3,      // < 20°C
            moderate: 5,  // 20-30°C
            warm: 7,      // 30-35°C
            hot: 10       // > 35°C
        };

        // Crop water requirement factors (Kc values - approximate)
        this.cropFactors = {
            'Rice': 1.2,
            'Cotton': 0.9,
            'Sugarcane': 1.2,
            'Soybean': 0.8,
            'Wheat': 1.0,
            'Jowar': 0.8,
            'Maize': 0.9,
            'Vegetables': 0.9,
            'Grapes': 0.7,
            'Mango': 0.8,
            'Onion': 0.7,
            'Pomegranate': 0.6
        };

        // Soil water holding capacity (mm per meter of soil)
        this.soilWaterCapacity = {
            'Sandy': 100,
            'Loamy': 150,
            'Clay': 200,
            'Black cotton': 220
        };
    }

    /**
     * Calculate evapotranspiration estimate
     */
    calculateET0(weather) {
        const temp = weather.temp;
        const humidity = weather.humidity;
        const windSpeed = weather.wind_speed || 2;
        
        // Simplified ET0 calculation (Hargreaves method approximation)
        let baseET = 0;
        
        if (temp < 20) {
            baseET = this.etReferenceRates.cool;
        } else if (temp < 30) {
            baseET = this.etReferenceRates.moderate;
        } else if (temp < 35) {
            baseET = this.etReferenceRates.warm;
        } else {
            baseET = this.etReferenceRates.hot;
        }

        // Adjust for humidity
        const humidityFactor = (100 - humidity) / 100;
        baseET *= (0.7 + 0.3 * humidityFactor);

        // Adjust for wind (simplified)
        const windFactor = 1 + (windSpeed - 2) * 0.05;
        baseET *=  Math.max(0.8, Math.min(1.3, windFactor));

        return Math.max(0, baseET);
    }

    /**
     * Get irrigation recommendation
     */
    getIrrigationRecommendation(weather, locationContext, cropName = null, lastIrrigationDays = null) {
        const et0 = this.calculateET0(weather);
        const rainfall = weather.rain ? (weather.rain['3h'] || weather.rain['1h'] || 0) : 0;
        const zone = locationContext.agroclimatic_zone;
        
        // Get crop factor
        let kc = 0.9; // default
        if (cropName && this.cropFactors[cropName]) {
            kc = this.cropFactors[cropName];
        }

        // Crop water requirement (mm/day)
        const cropET = et0 * kc;

        // Determine irrigation need
        let irrigation_needed = 'no';
        let urgency = 'none';
        let amount_mm = 0;
        const recommendations = [];

        // Check recent rainfall
        if (rainfall > 20) {
            irrigation_needed = 'no';
            recommendations.push('Heavy rainfall received - skip irrigation for 2-3 days');
            recommendations.push('Monitor for waterlogging');
        } else if (rainfall > 5) {
            irrigation_needed = 'no';
            recommendations.push('Recent rainfall adequate - defer irrigation');
            amount_mm = Math.max(0, cropET - rainfall);
        } else {
            // No significant rain
            amount_mm = cropET;
            
            if (lastIrrigationDays !== null && lastIrrigationDays > 0) {
                const deficit = cropET * lastIrrigationDays - rainfall;
                
                if (deficit > 50) {
                    irrigation_needed = 'yes';
                    urgency = 'critical';
                    amount_mm = deficit;
                    recommendations.push(`Critical water deficit: ${deficit.toFixed(0)}mm`);
                    recommendations.push('Irrigate immediately');
                } else if (deficit > 25) {
                    irrigation_needed = 'yes';
                    urgency = 'high';
                    amount_mm = deficit;
                    recommendations.push(`High water deficit: ${deficit.toFixed(0)}mm`);
                    recommendations.push('Irrigate within 24 hours');
                } else if (deficit > 10) {
                    irrigation_needed = 'yes';
                    urgency = 'medium';
                    amount_mm = deficit;
                    recommendations.push('Moderate water deficit - irrigation recommended');
                }
            } else {
                // Daily irrigation check
                if (weather.temp > 35 && weather.humidity < 40) {
                    irrigation_needed = 'yes';
                    urgency = 'high';
                    recommendations.push('Hot and dry conditions - increase irrigation frequency');
                } else if (cropET > 7) {
                    irrigation_needed = 'yes';
                    urgency = 'medium';
                    recommendations.push('High evapotranspiration - regular irrigation needed');
                }
            }
        }

        // Zone-specific advice
        const zoneAdvice = this.getZoneWaterAdvice(zone, weather);
        if (zoneAdvice) {
            recommendations.push(zoneAdvice);
        }

        // Method advice
        const methodAdvice = this.getIrrigationMethodAdvice(weather);
        if (methodAdvice) {
            recommendations.push(methodAdvice);
        }

        return {
            et0: et0.toFixed(1),
            crop_et: cropET.toFixed(1),
            rainfall: rainfall.toFixed(1),
            irrigation_needed: irrigation_needed,
            urgency: urgency,
            recommended_amount_mm: amount_mm.toFixed(0),
            recommendations: recommendations,
            best_time: this.getBestIrrigationTime(weather),
            efficiency_tips: this.getEfficiencyTips(zone)
        };
    }

    /**
     * Get zone-specific water management advice
     */
    getZoneWaterAdvice(zone, weather) {
        const droughtProneZones = ['Marathwada', 'Scarcity Zone', 'Vidarbha'];
        
        if (droughtProneZones.includes(zone)) {
            if (weather.rain && weather.rain['3h'] > 5) {
                return `${zone}: Maximize rainwater harvesting - every drop counts`;
            } else if (weather.temp > 35) {
                return `${zone} drought-prone area: Critical water conservation needed`;
            }
        } else if (zone === 'Konkan') {
            if (weather.humidity > 80) {
                return 'Konkan coastal area: Monitor for waterlogging, ensure drainage';
            }
        }
        
        return null;
    }

    /**
     * Get irrigation method advice
     */
    getIrrigationMethodAdvice(weather) {
        if (weather.wind_speed > 10) {
            return 'Strong winds: Drip irrigation preferred over sprinkler';
        } else if (weather.temp > 38) {
            return 'High temperature: Irrigate early morning or late evening to reduce evaporation';
        } else if (weather.humidity > 85) {
            return 'High humidity: Reduce irrigation frequency to prevent fungal issues';
        }
        
        return null;
    }

    /**
     * Get best irrigation time
     */
    getBestIrrigationTime(weather) {
        if (weather.temp > 35) {
            return 'Early morning (5-7 AM) or late evening (after 6 PM)';
        } else if (weather.temp > 30) {
            return 'Early morning (6-8 AM) or evening (5-7 PM)';
        } else {
            return 'Morning (7-9 AM) preferred';
        }
    }

    /**
     * Get water efficiency tips
     */
    getEfficiencyTips(zone) {
        const generalTips = [
            'Use mulching to reduce evaporation',
            'Check for and repair leaks',
            'Irrigate based on soil moisture, not schedule'
        ];

        const droughtProneZones = ['Marathwada', 'Scarcity Zone', 'Vidarbha'];
        
        if (droughtProneZones.includes(zone)) {
            return [
                'Adopt drip irrigation for water savings',
                'Practice deficit irrigation for drought-tolerant crops',
                'Construct farm ponds for rainwater storage',
                ...generalTips
            ];
        }

        return generalTips;
    }

    /**
     * Estimate soil moisture level
     */
    estimateSoilMoisture(weather, recentRainfall = [], soilType = 'Loamy') {
        // Simple soil moisture estimation
        const capacity = this.soilWaterCapacity[soilType] || 150;
        
        // Calculate water balance
        let moisture = capacity * 0.5; // Start at 50% capacity
        
        // Add rainfall
        const totalRain = recentRainfall.reduce((sum, rain) => sum + rain, 0);
        moisture += totalRain * 0.7; // 70% infiltration efficiency
        
        // Subtract evapotranspiration
        const et0 = this.calculateET0(weather);
        moisture -= et0 * 3; // Last 3 days approximation
        
        // Calculate percentage
        const moisturePercent = Math.max(0, Math.min(100, (moisture / capacity) * 100));
        
        let status = 'adequate';
        let icon = '💧';
        let advice = '';
        
        if (moisturePercent < 30) {
            status = 'low';
            icon = '🌵';
            advice = 'Soil moisture low - irrigation needed soon';
        } else if (moisturePercent < 50) {
            status = 'moderate';
            icon = '💦';
            advice = 'Soil moisture moderate - monitor regularly';
        } else if (moisturePercent > 90) {
            status = 'high';
            icon = '💦';
            advice = 'Soil moisture high - ensure drainage';
        } else {
            status = 'adequate';
            icon = '💧';
            advice = 'Soil moisture adequate';
        }

        return {
            percentage: moisturePercent.toFixed(0),
            status: status,
            icon: icon,
            advice: advice,
            soil_type: soilType
        };
    }

    /**
     * Get water conservation advisory
     */
    getConservationAdvisory(weather, locationContext, seasonalCalendar) {
        const zone = locationContext.agroclimatic_zone;
        const advisories = [];
        const droughtProneZones = ['Marathwada', 'Scarcity Zone', 'Vidarbha'];

        // General water conservation
        advisories.push({
            category: 'General',
            icon: '💧',
            tips: [
                'Monitor soil moisture instead of fixed schedules',
                'Repair all leaks in irrigation systems',
                'Use mulching to retain soil moisture'
            ]
        });

        // Drought-prone area specific
        if (droughtProneZones.includes(zone)) {
            advisories.push({
                category: `${zone} - Water Scarcity Zone`,
                icon: '🌵',
                priority: 'high',
                tips: [
                    'Prioritize drip irrigation systems',
                    'Construct water harvesting structures',
                    'Choose drought-resistant crop varieties',
                    'Practice deficit irrigation techniques',
                    'Community water sharing during scarcity'
                ]
            });
        }

        // Monsoon season
        if (seasonalCalendar && seasonalCalendar.current_season && 
            seasonalCalendar.current_season.is_monsoon) {
            advisories.push({
                category: 'Monsoon Water Management',
                icon: '🌧️',
                tips: [
                    'Maximize rainwater harvesting',
                    'Construct/maintain farm ponds',
                    'Recharge groundwater through percolation tanks',
                    'Store water for post-monsoon period'
                ]
            });
        }

        // Current weather based
        if (weather.rain && weather.rain['3h'] > 10) {
            advisories.push({
                category: 'Current Rainfall Opportunity',
                icon: '⚡',
                tips: [
                    'Collect and store rainwater immediately',
                    'Direct water to storage structures',
                    'Use this opportunity to reduce groundwater use'
                ]
            });
        } else if (weather.temp > 38 && weather.humidity < 40) {
            advisories.push({
                category: 'Hot Weather Conservation',
                icon: '🔥',
                priority: 'high',
                tips: [
                    'Irrigate only during cool hours',
                    'Increase mulch coverage',
                    'Reduce water loss from evaporation',
                    'Consider partial shade for sensitive crops'
                ]
            });
        }

        // Modern techniques
        advisories.push({
            category: 'Advanced Techniques',
            icon: '🚀',
            tips: [
                'Install soil moisture sensors for precision irrigation',
                'Use weather-based irrigation scheduling',
                'Adopt fertigation for water and nutrient efficiency',
                'Practice alternate wetting and drying (AWD) for rice'
            ]
        });

        return {
            zone: zone,
            is_drought_prone: droughtProneZones.includes(zone),
            advisories: advisories,
            water_stress_level: this.assessWaterStress(weather, zone)
        };
    }

    /**
     * Assess current water stress level
     */
    assessWaterStress(weather, zone) {
        const et0 = this.calculateET0(weather);
        const rainfall = weather.rain ? (weather.rain['3h'] || 0) : 0;
        const droughtProneZones = ['Marathwada', 'Scarcity Zone', 'Vidarbha'];

        let stress = 'low';
        let message = 'Low water stress';
        let icon = '✅';

        if (et0 > 8 && rainfall < 2) {
            stress = 'high';
            message = 'High evapotranspiration, low rainfall - high water stress';
            icon = '🚨';
        } else if (et0 > 6 && rainfall < 5) {
            stress = 'moderate';
            message = 'Moderate water stress - monitor irrigation';
            icon = '⚠️';
        }

        // Adjust for drought-prone zones
        if (droughtProneZones.includes(zone) && stress === 'moderate') {
            stress = 'high';
            icon = '⚠️';
        }

        return {
            level: stress,
            message: message,
            icon: icon,
            et0: et0.toFixed(1),
            rainfall: rainfall.toFixed(1)
        };
    }

    /**
     * Get 7-day water management forecast
     */
    getWaterForecast(forecastData, cropName = null) {
        if (!forecastData || forecastData.length === 0) {
            return null;
        }

        const daily = [];
        const processed = new Set();

        for (const forecast of forecastData) {
            const date = new Date(forecast.dt * 1000);
            const dateKey = date.toISOString().split('T')[0];

            if (processed.has(dateKey) || daily.length >= 7) continue;
            processed.add(dateKey);

            const weather = {
                temp: forecast.main.temp,
                humidity: forecast.main.humidity,
                wind_speed: forecast.wind.speed,
                rain: forecast.rain
            };

            const et0 = this.calculateET0(weather);
            const kc = cropName && this.cropFactors[cropName] ? this.cropFactors[cropName] : 0.9;
            const cropET = et0 * kc;
            const rainfall = forecast.rain ? (forecast.rain['3h'] || forecast.rain['1h'] || 0) : 0;

            const waterBalance = rainfall - cropET;

            daily.push({
                date: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
                et0: et0.toFixed(1),
                crop_water_need: cropET.toFixed(1),
                expected_rain: rainfall.toFixed(1),
                water_balance: waterBalance.toFixed(1),
                irrigation_likely: waterBalance < -5,
                status: waterBalance > 5 ? 'surplus' : waterBalance < -5 ? 'deficit' : 'balanced'
            });
        }

        return {
            crop: cropName || 'General',
            forecast: daily,
            summary: this.summarizeWaterForecast(daily)
        };
    }

    /**
     * Summarize 7-day water forecast
     */
    summarizeWaterForecast(dailyForecast) {
        const irrigationDays = dailyForecast.filter(d => d.irrigation_likely).length;
        const rainyDays = dailyForecast.filter(d => parseFloat(d.expected_rain) > 2).length;
        const totalRain = dailyForecast.reduce((sum, d) => sum + parseFloat(d.expected_rain), 0);
        const totalET = dailyForecast.reduce((sum, d) => sum + parseFloat(d.crop_water_need), 0);

        let summary = '';
        let recommendation = '';

        if (rainyDays >= 3) {
            summary = `${rainyDays} rainy days expected - total ${totalRain.toFixed(0)}mm`;
            recommendation = 'Reduced irrigation needed. Monitor for waterlogging.';
        } else if (rainyDays > 0) {
            summary = `${rainyDays} rainy days with ${totalRain.toFixed(0)}mm total`;
            recommendation = 'Supplement with irrigation on dry days.';
        } else {
            summary = 'No significant rainfall expected';
            recommendation = `Regular irrigation needed - approximately ${totalET.toFixed(0)}mm total for week.`;
        }

        return {
            summary: summary,
            recommendation: recommendation,
            irrigation_days_needed: irrigationDays,
            rainy_days: rainyDays,
            total_rainfall_mm: totalRain.toFixed(1),
            total_et_mm: totalET.toFixed(1)
        };
    }
}

// Make available globally
window.WaterManagement = WaterManagement;
