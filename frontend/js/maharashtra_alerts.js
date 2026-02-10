/**
 * Maharashtra Regional Weather Alert System
 * Provides drought, flood, heatwave, and farming-specific alerts
 */

class MaharashtraAlerts {
    constructor(weatherContext) {
        this.context = weatherContext;
        
        // Alert thresholds
        this.thresholds = {
            heatwave: {
                moderate: 40,
                severe: 43,
                extreme: 45
            },
            cold_wave: {
                moderate: 10,
                severe: 5
            },
            heavy_rain: {
                moderate: 15,  // mm in 3 hours
                heavy: 30,
                very_heavy: 50,
                extreme: 100
            },
            drought: {
                rainfall_deficit: 60, // percentage below normal
                severe_deficit: 80
            },
            flood_risk: {
                konkan_threshold: 50,  // mm in 3 hours for coastal areas
                general_threshold: 70
            },
            wind: {
                strong: 10,   // m/s
                very_strong: 15,
                damaging: 20
            },
            humidity: {
                very_low: 20,
                very_high: 90
            }
        };
    }

    /**
     * Generate all relevant alerts for current weather
     */
    generateAlerts(weather, locationContext, forecastData = null) {
        const alerts = [];

        // Temperature-based alerts
        alerts.push(...this.checkTemperatureAlerts(weather, locationContext));

        // Rainfall-based alerts
        if (weather.rain) {
            alerts.push(...this.checkRainfallAlerts(weather, locationContext));
        }

        // Drought alerts
        alerts.push(...this.checkDroughtAlerts(weather, locationContext, forecastData));

        // Wind alerts
        if (weather.wind_speed) {
            alerts.push(...this.checkWindAlerts(weather, locationContext));
        }

        // Humidity alerts
        alerts.push(...this.checkHumidityAlerts(weather, locationContext));

        // Seasonal alerts
        alerts.push(...this.checkSeasonalAlerts(weather, locationContext));

        // Zone-specific alerts
        alerts.push(...this.checkZoneSpecificAlerts(weather, locationContext));

        // Sort by priority
        return this.prioritizeAlerts(alerts);
    }

    /**
     * Check temperature-related alerts
     */
    checkTemperatureAlerts(weather, locationContext) {
        const alerts = [];
        const temp = weather.temp;
        const zone = locationContext.agroclimatic_zone;

        // Heatwave alerts
        if (temp >= this.thresholds.heatwave.extreme) {
            alerts.push({
                type: 'heatwave',
                severity: 'critical',
                priority: 1,
                icon: '🔥',
                title: 'EXTREME HEATWAVE',
                message: `Extreme heat at ${temp}°C - Dangerous for crops and livestock`,
                recommendations: [
                    'Avoid all field operations during midday (11 AM - 4 PM)',
                    'Emergency irrigation for all crops',
                    'Provide shade and water for livestock',
                    'Monitor for heat stress symptoms',
                    'Check vulnerable crops hourly'
                ],
                affected_zones: ['All zones - Critical'],
                duration_estimate: 'Monitor for next 24-48 hours'
            });
        } else if (temp >= this.thresholds.heatwave.severe) {
            alerts.push({
                type: 'heatwave',
                severity: 'high',
                priority: 2,
                icon: '🌡️',
                title: 'Severe Heatwave',
                message: `Severe heat at ${temp}°C`,
                recommendations: [
                    'Increase irrigation frequency by 50%',
                    'Work only during early morning and evening',
                    'Protect sensitive crops with shade nets',
                    'Monitor crop water stress'
                ],
                affected_zones: zone ? [zone] : ['General']
            });
        } else if (temp >= this.thresholds.heatwave.moderate) {
            alerts.push({
                type: 'heatwave',
                severity: 'moderate',
                priority: 3,
                icon: '☀️',
                title: 'Moderate Heatwave',
                message: `High temperature ${temp}°C`,
                recommendations: [
                    'Increase irrigation',
                    'Avoid spraying during hot hours',
                    'Monitor for spider mites and heat stress'
                ],
                affected_zones: zone ? [zone] : ['General']
            });
        }

        // Cold wave alerts
        if (temp <= this.thresholds.cold_wave.severe) {
            alerts.push({
                type: 'cold_wave',
                severity: 'high',
                priority: 2,
                icon: '❄️',
                title: 'Severe Cold Wave',
                message: `Extremely low temperature ${temp}°C`,
                recommendations: [
                    'Protect vegetables and seedlings',
                    'Delay irrigation if frost risk',
                    'Cover sensitive crops',
                    'Protect livestock from cold'
                ],
                affected_zones: zone ? [zone] : ['General']
            });
        } else if (temp <= this.thresholds.cold_wave.moderate) {
            alerts.push({
                type: 'cold_wave',
                severity: 'moderate',
                priority: 3,
                icon: '🌡️',
                title: 'Cold Wave',
                message: `Low temperature ${temp}°C`,
                recommendations: [
                    'Monitor for frost damage',
                    'Protect sensitive crops',
                    'Adjust irrigation schedule'
                ],
                affected_zones: zone ? [zone] : ['General']
            });
        }

        return alerts;
    }

    /**
     * Check rainfall-related alerts
     */
    checkRainfallAlerts(weather, locationContext) {
        const alerts = [];
        const rainMm = weather.rain['3h'] || weather.rain['1h'] || 0;
        const zone = locationContext.agroclimatic_zone;

        // Extreme rainfall
        if (rainMm >= this.thresholds.heavy_rain.extreme) {
            alerts.push({
                type: 'extreme_rainfall',
                severity: 'critical',
                priority: 1,
                icon: '⚠️',
                title: 'EXTREME RAINFALL ALERT',
                message: `Extremely heavy rainfall: ${rainMm.toFixed(1)}mm`,
                recommendations: [
                    'FLOOD RISK HIGH - Evacuate low-lying areas if needed',
                    'Protect crops from waterlogging',
                    'Clear drainage channels immediately',
                    'Avoid all field operations',
                    'Secure farm equipment and animals'
                ],
                affected_zones: zone ? [zone] : ['General'],
                special_concern: zone === 'Konkan' ? 'Coastal flooding risk' : 'Waterlogging risk'
            });
        } else if (rainMm >= this.thresholds.heavy_rain.very_heavy) {
            alerts.push({
                type: 'heavy_rainfall',
                severity: 'high',
                priority: 2,
                icon: '🌧️',
                title: 'Very Heavy Rainfall',
                message: `Very heavy rainfall: ${rainMm.toFixed(1)}mm`,
                recommendations: [
                    'Monitor for waterlogging',
                    'Ensure drainage systems working',
                    'Postpone field operations',
                    'Protect harvested crops from moisture'
                ],
                affected_zones: zone ? [zone] : ['General']
            });
        } else if (rainMm >= this.thresholds.heavy_rain.heavy) {
            // Special for Konkan
            if (zone === 'Konkan' && rainMm >= this.thresholds.flood_risk.konkan_threshold) {
                alerts.push({
                    type: 'flood_risk',
                    severity: 'high',
                    priority: 2,
                    icon: '🌊',
                    title: 'Flood Risk - Konkan',
                    message: `Heavy rainfall in coastal region: ${rainMm.toFixed(1)}mm`,
                    recommendations: [
                        'Monitor coastal flooding',
                        'Check low-lying agricultural areas',
                        'Protect rice fields from excessive water',
                        'Ensure drainage in coconut plantations'
                    ],
                    affected_zones: ['Konkan coastal areas']
                });
            } else {
                alerts.push({
                    type: 'heavy_rainfall',
                    severity: 'moderate',
                    priority: 3,
                    icon: '🌧️',
                    title: 'Heavy Rainfall',
                    message: `Heavy rainfall: ${rainMm.toFixed(1)}mm`,
                    recommendations: [
                        'Delay field operations',
                        'Monitor soil moisture',
                        'Check drainage systems'
                    ],
                    affected_zones: zone ? [zone] : ['General']
                });
            }
        }

        return alerts;
    }

    /**
     * Check drought-related alerts
     */
    checkDroughtAlerts(weather, locationContext, forecastData) {
        const alerts = [];
        const zone = locationContext.agroclimatic_zone;
        const month = new Date().getMonth() + 1;

        // Drought-prone zones during critical periods
        const droughtProneZones = ['Marathwada', 'Scarcity Zone', 'Vidarbha'];
        
        if (droughtProneZones.includes(zone)) {
            // During monsoon season (July-September)
            if (month >= 7 && month <= 9) {
                const rainMm = weather.rain ? (weather.rain['3h'] || weather.rain['1h'] || 0) : 0;
                
                if (rainMm < 2 && weather.humidity < 50) {
                    alerts.push({
                        type: 'drought_risk',
                        severity: 'high',
                        priority: 2,
                        icon: '🌵',
                        title: `Drought Risk - ${zone}`,
                        message: 'Dry spell during critical monsoon period',
                        recommendations: [
                            'Activate drought mitigation measures',
                            'Prioritize irrigation for critical crops',
                            'Monitor soil moisture daily',
                            'Consider water-saving techniques',
                            'Mulching to conserve moisture'
                        ],
                        affected_zones: [zone],
                        special_concern: 'Critical for Kharif crops'
                    });
                }
            }

            // High temperature + low humidity = drought stress
            if (weather.temp > 38 && weather.humidity < 40 && month >= 3 && month <= 6) {
                alerts.push({
                    type: 'drought_stress',
                    severity: 'high',
                    priority: 2,
                    icon: '🌡️',
                    title: 'Drought Stress Conditions',
                    message: `Hot and dry conditions in ${zone}`,
                    recommendations: [
                        'Emergency irrigation required',
                        'Monitor crop wilting',
                        'Check water sources',
                        'Implement water conservation'
                    ],
                    affected_zones: [zone]
                });
            }
        }

        return alerts;
    }

    /**
     * Check wind-related alerts
     */
    checkWindAlerts(weather, locationContext) {
        const alerts = [];
        const windSpeed = weather.wind_speed;

        if (windSpeed >= this.thresholds.wind.damaging) {
            alerts.push({
                type: 'strong_wind',
                severity: 'high',
                priority: 2,
                icon: '💨',
                title: 'Damaging Winds',
                message: `Very strong winds: ${windSpeed.toFixed(1)} m/s`,
                recommendations: [
                    'Secure all loose items and equipment',
                    'Protect tall crops (sugarcane, banana)',
                    'Delay spraying operations',
                    'Check crop staking and support'
                ],
                affected_zones: locationContext.agroclimatic_zone ? [locationContext.agroclimatic_zone] : ['General']
            });
        } else if (windSpeed >= this.thresholds.wind.very_strong) {
            alerts.push({
                type: 'strong_wind',
                severity: 'moderate',
                priority: 3,
                icon: '🌬️',
                title: 'Strong Winds',
                message: `Strong winds: ${windSpeed.toFixed(1)} m/s`,
                recommendations: [
                    'Delay pesticide spraying',
                    'Monitor tall crops',
                    'Secure farm equipment'
                ],
                affected_zones: locationContext.agroclimatic_zone ? [locationContext.agroclimatic_zone] : ['General']
            });
        }

        return alerts;
    }

    /**
     * Check humidity-related alerts
     */
    checkHumidityAlerts(weather, locationContext) {
        const alerts = [];
        const humidity = weather.humidity;

        if (humidity >= this.thresholds.humidity.very_high) {
            alerts.push({
                type: 'high_humidity',
                severity: 'moderate',
                priority: 3,
                icon: '💧',
                title: 'Very High Humidity',
                message: `High humidity: ${humidity}%`,
                recommendations: [
                    'Fungal disease risk - monitor crops',
                    'Avoid pesticide spraying',
                    'Ensure proper ventilation in protected cultivation',
                    'Watch for leaf diseases'
                ],
                affected_zones: locationContext.agroclimatic_zone ? [locationContext.agroclimatic_zone] : ['General']
            });
        } else if (humidity <= this.thresholds.humidity.very_low) {
            alerts.push({
                type: 'low_humidity',
                severity: 'moderate',
                priority: 3,
                icon: '🌵',
                title: 'Very Low Humidity',
                message: `Low humidity: ${humidity}%`,
                recommendations: [
                    'Increase irrigation frequency',
                    'Monitor for spider mites',
                    'Watch for heat stress in crops',
                    'Consider mulching'
                ],
                affected_zones: locationContext.agroclimatic_zone ? [locationContext.agroclimatic_zone] : ['General']
            });
        }

        return alerts;
    }

    /**
     * Get seasonal alerts
     */
    checkSeasonalAlerts(weather, locationContext) {
        const alerts = [];
        const month = new Date().getMonth() + 1;
        const season = this.context.getCurrentSeason();

        // Unseasonal rain during harvest
        if ((month === 3 || month === 4 || month === 10) && weather.rain) {
            const rainMm = weather.rain['3h'] || weather.rain['1h'] || 0;
            if (rainMm > 5) {
                alerts.push({
                    type: 'unseasonal_rain',
                    severity: 'high',
                    priority: 2,
                    icon: '⚠️',
                    title: 'Unseasonal Rainfall',
                    message: `Unseasonal rain during harvest period: ${rainMm.toFixed(1)}mm`,
                    recommendations: [
                        'Expedite harvesting of ready crops',
                        'Protect harvested produce from moisture',
                        'Ensure proper storage',
                        'Monitor for post-harvest fungal issues'
                    ],
                    affected_zones: locationContext.agroclimatic_zone ? [locationContext.agroclimatic_zone] : ['General'],
                    special_concern: 'Risk to standing/harvested crops'
                });
            }
        }

        return alerts;
    }

    /**
     * Zone-specific alerts
     */
    checkZoneSpecificAlerts(weather, locationContext) {
        const alerts = [];
        const zone = locationContext.agroclimatic_zone;

        // Konkan specific - Coastal concerns
        if (zone === 'Konkan' && weather.wind_speed > 12) {
            alerts.push({
                type: 'coastal_wind',
                severity: 'moderate',
                priority: 3,
                icon: '🌊',
                title: 'Coastal Wind Advisory',
                message: 'Strong coastal winds',
                recommendations: [
                    'Protect coconut and arecanut palms',
                    'Secure thatched structures',
                    'Monitor coastal areas'
                ],
                affected_zones: ['Konkan coastal areas']
            });
        }

        // Vidarbha - Cotton specific
        if ((zone === 'Vidarbha' || zone === 'High Rainfall Vidarbha') && weather.temp > 40) {
            alerts.push({
                type: 'cotton_heat',
                severity: 'moderate',
                priority: 3,
                icon: '🌡️',
                title: 'Heat Stress - Cotton Belt',
                message: 'High temperatures in cotton-growing areas',
                recommendations: [
                    'Ensure adequate irrigation for cotton',
                    'Monitor for bollworm during warm periods',
                    'Watch for heat-induced boll shedding'
                ],
                affected_zones: [zone]
            });
        }

        // Western Maharashtra - Sugarcane belt
        if (zone === 'Western Maharashtra' && weather.temp > 38 && weather.humidity < 40) {
            alerts.push({
                type: 'sugarcane_stress',
                severity: 'moderate',
                priority: 3,
                icon: '🌾',
                title: 'Sugarcane Water Stress',
                message: 'Hot and dry conditions in sugarcane belt',
                recommendations: [
                    'Increase irrigation for sugarcane',
                    'Monitor grape vineyards for heat stress',
                    'Check drip irrigation systems'
                ],
                affected_zones: [zone]
            });
        }

        return alerts;
    }

    /**
     * Prioritize and sort alerts
     */
    prioritizeAlerts(alerts) {
        // Remove duplicates based on type
        const unique = alerts.filter((alert, index, self) => 
            index === self.findIndex(a => a.type === alert.type)
        );

        // Sort by priority (lower number = higher priority)
        return unique.sort((a, b) => (a.priority || 99) - (b.priority || 99));
    }
}

// Make available globally
window.MaharashtraAlerts = MaharashtraAlerts;
