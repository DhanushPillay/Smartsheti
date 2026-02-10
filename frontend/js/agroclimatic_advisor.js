/**
 * Agroclimatic Zone Weather Advisor
 * Provides zone-specific weather interpretation and agricultural insights
 */

class AgroclimaticAdvisor {
    constructor(weatherContext) {
        this.context = weatherContext;
        
        // Regional climate normals (approximate monthly averages)
        this.climateNormals = {
            "Konkan": {
                temperature: { annual_avg: 27, summer_max: 33, winter_min: 20 },
                rainfall: { annual: 2500, monsoon_percentage: 90 },
                humidity: { annual_avg: 75 }
            },
            "Western Ghat": {
                temperature: { annual_avg: 24, summer_max: 30, winter_min: 15 },
                rainfall: { annual: 4000, monsoon_percentage: 92 },
                humidity: { annual_avg: 80 }
            },
            "Vidarbha": {
                temperature: { annual_avg: 28, summer_max: 42, winter_min: 12 },
                rainfall: { annual: 850, monsoon_percentage: 85 },
                humidity: { annual_avg: 55 }
            },
            "Marathwada": {
                temperature: { annual_avg: 27, summer_max: 40, winter_min: 10 },
                rainfall: { annual: 700, monsoon_percentage: 80 },
                humidity: { annual_avg: 50 }
            },
            "Scarcity Zone": {
                temperature: { annual_avg: 28, summer_max: 41, winter_min: 11 },
                rainfall: { annual: 600, monsoon_percentage: 75 },
                humidity: { annual_avg: 45 }
            },
            "Western Maharashtra": {
                temperature: { annual_avg: 27, summer_max: 38, winter_min: 13 },
                rainfall: { annual: 750, monsoon_percentage: 78 },
                humidity: { annual_avg: 52 }
            },
            "High Rainfall Vidarbha": {
                temperature: { annual_avg: 27, summer_max: 40, winter_min: 13 },
                rainfall: { annual: 1200, monsoon_percentage: 87 },
                humidity: { annual_avg: 62 }
            }
        };
    }

    /**
     * Interpret weather conditions for specific agroclimatic zone
     */
    interpretWeatherForZone(weather, zone) {
        if (!zone || !this.climateNormals[zone]) {
            return this.getGenericInterpretation(weather);
        }

        const normals = this.climateNormals[zone];
        const zoneInfo = this.context.getZoneInfo(zone);
        const interpretations = [];

        // Temperature analysis
        const tempAnalysis = this.analyzeTemperature(weather.temp, normals.temperature, zone);
        if (tempAnalysis) interpretations.push(tempAnalysis);

        // Humidity analysis
        const humidityAnalysis = this.analyzeHumidity(weather.humidity, normals.humidity, zone);
        if (humidityAnalysis) interpretations.push(humidityAnalysis);

        // Rainfall analysis
        if (weather.rain) {
            const rainAnalysis = this.analyzeRainfall(weather.rain, normals.rainfall, zone);
            if (rainAnalysis) interpretations.push(rainAnalysis);
        }

        // Zone-specific insights
        const zoneInsights = this.getZoneSpecificInsights(weather, zone, zoneInfo);
        interpretations.push(...zoneInsights);

        return {
            zone: zone,
            zone_description: zoneInfo ? zoneInfo.description : '',
            interpretations: interpretations,
            overall_assessment: this.getOverallAssessment(weather, zone)
        };
    }

    /**
     * Analyze temperature relative to zone normals
     */
    analyzeTemperature(temp, normals, zone) {
        const deviation = temp - normals.annual_avg;
        
        if (Math.abs(deviation) < 2) {
            return {
                parameter: 'temperature',
                status: 'normal',
                icon: '🌡️',
                message: `Temperature is normal for ${zone} (${temp}°C vs avg ${normals.annual_avg}°C)`
            };
        } else if (deviation > 0) {
            const severity = deviation > 5 ? 'high' : 'moderate';
            return {
                parameter: 'temperature',
                status: 'above_normal',
                severity: severity,
                icon: '🔥',
                message: `Temperature ${deviation.toFixed(1)}°C above normal for ${zone}`,
                recommendation: this.getHeatAdvisory(deviation, zone)
            };
        } else {
            const severity = Math.abs(deviation) > 5 ? 'high' : 'moderate';
            return {
                parameter: 'temperature',
                status: 'below_normal',
                severity: severity,
                icon: '❄️',
                message: `Temperature ${Math.abs(deviation).toFixed(1)}°C below normal for ${zone}`,
                recommendation: this.getColdAdvisory(Math.abs(deviation), zone)
            };
        }
    }

    /**
     * Analyze humidity relative to zone normals
     */
    analyzeHumidity(humidity, normals, zone) {
        const deviation = humidity - normals.annual_avg;
        
        if (Math.abs(deviation) < 10) {
            return {
                parameter: 'humidity',
                status: 'normal',
                icon: '💧',
                message: `Humidity normal for ${zone} (${humidity}%)`
            };
        } else if (deviation > 0) {
            return {
                parameter: 'humidity',
                status: 'high',
                icon: '💦',
                message: `High humidity (${humidity}%) for ${zone}`,
                recommendation: 'Monitor for fungal diseases. Avoid spraying. Ensure proper ventilation.'
            };
        } else {
            return {
                parameter: 'humidity',
                status: 'low',
                icon: '🌵',
                message: `Low humidity (${humidity}%) for ${zone}`,
                recommendation: 'Increase irrigation frequency. Monitor for heat stress and spider mites.'
            };
        }
    }

    /**
     * Analyze rainfall
     */
    analyzeRainfall(rain, normals, zone) {
        const rainMm = rain['3h'] || rain['1h'] || 0;
        
        if (rainMm === 0) return null;

        let severity = 'light';
        let message = '';
        let recommendation = '';

        if (rainMm < 2.5) {
            severity = 'light';
            message = `Light rainfall (${rainMm.toFixed(1)}mm) in ${zone}`;
            recommendation = 'Good for soil moisture. Monitor field conditions.';
        } else if (rainMm < 7.5) {
            severity = 'moderate';
            message = `Moderate rainfall (${rainMm.toFixed(1)}mm) in ${zone}`;
            recommendation = 'Delay field operations. Check drainage systems.';
        } else if (rainMm < 15) {
            severity = 'heavy';
            message = `Heavy rainfall (${rainMm.toFixed(1)}mm) in ${zone}`;
            recommendation = 'Avoid field operations. Check for waterlogging. Ensure crop protection.';
        } else {
            severity = 'very_heavy';
            message = `Very heavy rainfall (${rainMm.toFixed(1)}mm) in ${zone}`;
            recommendation = 'ALERT: Risk of flooding. Protect crops. Check drainage urgently.';
        }

        // Zone-specific rainfall context
        if (zone === 'Konkan' && severity !== 'very_heavy') {
            recommendation += ' Normal for coastal region.';
        } else if ((zone === 'Marathwada' || zone === 'Scarcity Zone') && rainMm > 5) {
            recommendation += ' Significant for this drought-prone zone - conserve water.';
        }

        return {
            parameter: 'rainfall',
            status: severity,
            icon: severity === 'very_heavy' ? '⚠️🌧️' : '🌧️',
            message: message,
            recommendation: recommendation
        };
    }

    /**
     * Get zone-specific insights based on weather conditions
     */
    getZoneSpecificInsights(weather, zone, zoneInfo) {
        const insights = [];
        const season = this.context.getCurrentSeason();

        // Konkan-specific
        if (zone === 'Konkan') {
            if (weather.humidity > 80) {
                insights.push({
                    parameter: 'zone_specific',
                    icon: '🌊',
                    message: 'Coastal high humidity typical for Konkan',
                    recommendation: 'Increase fungicide vigilance for crops like rice and coconut'
                });
            }
            if (season && season.key === 'kharif' && (!weather.rain || weather.rain['3h'] < 1)) {
                insights.push({
                    parameter: 'zone_specific',
                    icon: '⚠️',
                    status: 'concern',
                    message: 'Low rainfall during monsoon season in Konkan',
                    recommendation: 'Monitor monsoon progress. May need irrigation backup.'
                });
            }
        }

        // Vidarbha-specific
        if (zone === 'Vidarbha' || zone === 'High Rainfall Vidarbha') {
            if (weather.temp > 40 && season && season.key === 'summer') {
                insights.push({
                    parameter: 'zone_specific',
                    icon: '🔥',
                    status: 'warning',
                    message: 'Extreme heat in Vidarbha cotton belt',
                    recommendation: 'Ensure adequate irrigation for cotton. Watch for heat stress.'
                });
            }
            if (season && season.key === 'kharif' && weather.rain) {
                insights.push({
                    parameter: 'zone_specific',
                    icon: '🌱',
                    message: 'Monsoon rains beneficial for Vidarbha soybean and cotton',
                    recommendation: 'Optimal conditions for Kharif crops. Monitor for pests.'
                });
            }
        }

        // Marathwada-specific
        if (zone === 'Marathwada') {
            if (weather.rain && weather.rain['3h'] > 2) {
                insights.push({
                    parameter: 'zone_specific',
                    icon: '💧',
                    status: 'opportunity',
                    message: 'Valuable rainfall in drought-prone Marathwada',
                    recommendation: 'Maximize water harvesting. Prepare for sowing if monsoon.'
                });
            }
            if (weather.temp > 38 && weather.humidity < 40) {
                insights.push({
                    parameter: 'zone_specific',
                    icon: '🌵',
                    status: 'warning',
                    message: 'Hot and dry conditions in Marathwada',
                    recommendation: 'Critical irrigation needed. Monitor crop stress closely.'
                });
            }
        }

        // Scarcity Zone-specific
        if (zone === 'Scarcity Zone') {
            if (weather.rain && weather.rain['3h'] > 1) {
                insights.push({
                    parameter: 'zone_specific',
                    icon: '🎯',
                    status: 'opportunity',
                    message: 'Every drop counts in Scarcity Zone',
                    recommendation: 'Implement water conservation measures immediately.'
                });
            }
        }

        // Western Maharashtra (Sugarcane belt)
        if (zone === 'Western Maharashtra') {
            if (weather.temp > 35 && season && season.key !== 'summer') {
                insights.push({
                    parameter: 'zone_specific',
                    icon: '🌾',
                    message: 'Warm conditions in sugarcane belt',
                    recommendation: 'Ensure adequate irrigation for sugarcane and grapes.'
                });
            }
        }

        return insights;
    }

    /**
     * Get heat advisory
     */
    getHeatAdvisory(deviation, zone) {
        if (deviation > 8) {
            return 'EXTREME HEAT: Avoid field work during midday. Increase irrigation. Monitor livestock.';
        } else if (deviation > 5) {
            return 'High heat: Increase irrigation frequency. Protect sensitive crops. Work during cooler hours.';
        } else {
            return 'Moderate warmth: Maintain regular irrigation schedule. Monitor crop water stress.';
        }
    }

    /**
     * Get cold advisory
     */
    getColdAdvisory(deviation, zone) {
        if (deviation > 8) {
            return 'COLD WAVE: Protect sensitive crops. Delay irrigation. Cover young plants.';
        } else if (deviation > 5) {
            return 'Unusually cold: Monitor for frost risk. Protect vegetables and flowers.';
        } else {
            return 'Cooler than normal: Adjust irrigation. Monitor crop development.';
        }
    }

    /**
     * Get overall assessment
     */
    getOverallAssessment(weather, zone) {
        const season = this.context.getCurrentSeason();
        const normals = this.climateNormals[zone];
        
        if (!normals) return 'Weather conditions recorded';

        let assessment = '';
        const conditions = [];

        // Temperature assessment
        const tempDev = weather.temp - normals.temperature.annual_avg;
        if (Math.abs(tempDev) > 5) {
            conditions.push(tempDev > 0 ? 'warmer than normal' : 'cooler than normal');
        } else {
            conditions.push('normal temperature');
        }

        // Humidity assessment
        const humDev = weather.humidity - normals.humidity.annual_avg;
        if (Math.abs(humDev) > 15) {
            conditions.push(humDev > 0 ? 'high humidity' : 'low humidity');
        }

        // Rainfall
        if (weather.rain && (weather.rain['3h'] > 2.5 || weather.rain['1h'] > 2.5)) {
            conditions.push('rainfall');
        }

        assessment = `${zone} experiencing ${conditions.join(', ')}`;
        
        if (season) {
            assessment += `. ${season.description} (${season.name}) season`;
        }

        return assessment;
    }

    /**
     * Get generic interpretation when zone is unknown
     */
    getGenericInterpretation(weather) {
        return {
            zone: 'Unknown',
            zone_description: 'Location outside known agroclimatic zones',
            interpretations: [{
                parameter: 'general',
                icon: '🌍',
                message: `Temperature: ${weather.temp}°C, Humidity: ${weather.humidity}%`,
                recommendation: 'Enable location services for zone-specific advice'
            }],
            overall_assessment: 'General weather conditions recorded'
        };
    }
}

// Make available globally
window.AgroclimaticAdvisor = AgroclimaticAdvisor;
