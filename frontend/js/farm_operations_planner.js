/**
 * 7-Day Agricultural Operations Planner
 * Analyzes forecast to recommend optimal timing for farm activities
 */

class FarmOperationsPlanner {
    constructor() {
        // Activity requirements (ideal weather conditions)
        this.activityRequirements = {
            plowing: {
                name: 'Field Plowing/Tilling',
                icon: '🚜',
                ideal_conditions: {
                    rain: 0,  // No rain
                    max_wind: 15,
                    soil_moisture: 'moderate'  // Not too wet, not too dry
                },
                description: 'Land preparation and plowing'
            },
            sowing: {
                name: 'Sowing/Planting',
                icon: '🌱',
                ideal_conditions: {
                    rain: { min: 0, max: 5 },  // Light rain okay
                    max_wind: 12,
                    soil_moisture: 'adequate'
                },
                description: 'Planting seeds or seedlings'
            },
            spraying: {
                name: 'Pesticide/Fertilizer Spraying',
                icon: '💧',
                ideal_conditions: {
                    rain: 0,  // No rain for at least 6 hours
                    max_wind: 8,  // Low wind critical
                    max_temp: 32,  // Not too hot
                    min_humidity: 40,
                    max_humidity: 80,
                    time_of_day: 'early_morning_or_evening'
                },
                description: 'Applying pesticides or liquid fertilizers'
            },
            irrigation: {
                name: 'Irrigation',
                icon: '💦',
                ideal_conditions: {
                    rain: 0,
                    max_temp: 40
                },
                description: 'Watering crops'
            },
            fertilizing: {
                name: 'Fertilizer Application',
                icon: '🌿',
                ideal_conditions: {
                    rain: { min: 0, max: 2 },  // Dry or very light rain
                    max_wind: 15,
                    soil_moisture: 'moderate'
                },
                description: 'Applying solid fertilizers'
            },
            harvesting: {
                name: 'Harvesting',
                icon: '🌾',
                ideal_conditions: {
                    rain: 0,  // No rain
                    max_humidity: 70,  // Lower humidity for grain crops
                    max_wind: 20
                },
                description: 'Harvesting crops'
            },
            weeding: {
                name: 'Weeding',
                icon: '🌱',
                ideal_conditions: {
                    rain: 0,
                    max_temp: 38,
                    max_wind: 15
                },
                description: 'Manual or mechanical weeding'
            },
            pruning: {
                name: 'Pruning',
                icon: '✂️',
                ideal_conditions: {
                    rain: 0,
                    max_humidity: 75
                },
                description: 'Pruning trees and vines'
            }
        };
    }

    /**
     * Analyze 7-day forecast for all farm operations
     */
    analyzeForecast(forecastData) {
        if (!forecastData || forecastData.length === 0) {
            return { error: 'No forecast data available' };
        }

        // Group forecast by day
        const dailyForecasts = this.groupForecastByDay(forecastData);
        
        // Analyze each activity
        const recommendations = {};
        for (const [activityKey, activityInfo] of Object.entries(this.activityRequirements)) {
            recommendations[activityKey] = this.analyzeActivitySuitability(
                activityKey,
                activityInfo,
                dailyForecasts
            );
        }

        // Create daily summary
        const dailySummary = this.createDailySummary(dailyForecasts, recommendations);

        return {
            daily_summary: dailySummary,
            activity_recommendations: recommendations,
            best_days: this.getBestDaysForActivities(recommendations),
            warnings: this.getOperationWarnings(dailyForecasts)
        };
    }

    /**
     * Group forecast data by day
     */
    groupForecastByDay(forecastData) {
        const dailyData = [];
        const processed = new Set();

        for (const forecast of forecastData) {
            const date = new Date(forecast.dt * 1000);
            const dateKey = date.toISOString().split('T')[0];

            if (processed.has(dateKey)) continue;
            processed.add(dateKey);

            // Get all forecasts for this day
            const dayForecasts = forecastData.filter(f => {
                const fDate = new Date(f.dt * 1000);
                return fDate.toISOString().split('T')[0] === dateKey;
            });

            // Calculate daily statistics
            const temps = dayForecasts.map(f => f.main.temp);
            const humidities = dayForecasts.map(f => f.main.humidity);
            const winds = dayForecasts.map(f => f.wind.speed);
            const rains = dayForecasts.map(f => (f.rain ? (f.rain['3h'] || f.rain['1h'] || 0) : 0));
            
            dailyData.push({
                date: date,
                date_key: dateKey,
                day_name: date.toLocaleDateString('en-US', { weekday: 'long' }),
                day_short: date.toLocaleDateString('en-US', { weekday: 'short' }),
                temp_max: Math.max(...temps),
                temp_min: Math.min(...temps),
                temp_avg: temps.reduce((a, b) => a + b, 0) / temps.length,
                humidity_avg: humidities.reduce((a, b) => a + b, 0) / humidities.length,
                humidity_max: Math.max(...humidities),
                wind_speed_max: Math.max(...winds),
                wind_speed_avg: winds.reduce((a, b) => a + b, 0) / winds.length,
                total_rain: rains.reduce((a, b) => a + b, 0),
                has_rain: rains.some(r => r > 1),
                weather_main: dayForecasts[0].weather[0].main,
                hourly_forecasts: dayForecasts
            });

            if (dailyData.length >= 7) break;
        }

        return dailyData;
    }

    /**
     * Analyze suitability of a specific activity across days
     */
    analyzeActivitySuitability(activityKey, activityInfo, dailyForecasts) {
        const suitability = [];

        for (let i = 0; i < dailyForecasts.length; i++) {
            const day = dailyForecasts[i];
            const score = this.calculateActivityScore(activityKey, activityInfo, day);
            
            suitability.push({
                day_number: i + 1,
                date: day.date,
                day_name: day.day_short,
                score: score.score,
                rating: score.rating,
                reasons: score.reasons,
                warnings: score.warnings,
                best_time: score.best_time
            });
        }

        return {
            activity: activityInfo.name,
            icon: activityInfo.icon,
            description: activityInfo.description,
            daily_suitability: suitability,
            recommended_days: suitability
                .filter(d => d.rating === 'excellent' || d.rating === 'good')
                .map(d => ({ day: d.day_number, day_name: d.day_name, score: d.score }))
        };
    }

    /**
     * Calculate score for activity on specific day
     */
    calculateActivityScore(activityKey, activityInfo, dayData) {
        let score = 100;
        const reasons = [];
        const warnings = [];
        const conditions = activityInfo.ideal_conditions;

        // Check rain
        if (typeof conditions.rain === 'number') {
            if (dayData.has_rain && conditions.rain === 0) {
                score -= 50;
                warnings.push(`Rain expected (${dayData.total_rain.toFixed(1)}mm)`);
            } else if (!dayData.has_rain && conditions.rain === 0) {
                score += 10;
                reasons.push('No rain expected');
            }
        } else if (typeof conditions.rain === 'object') {
            if (dayData.total_rain > conditions.rain.max) {
                score -= 30;
                warnings.push(`Too much rain (${dayData.total_rain.toFixed(1)}mm)`);
            }
        }

        // Check wind
        if (conditions.max_wind) {
            if (dayData.wind_speed_max > conditions.max_wind) {
                const excess = dayData.wind_speed_max - conditions.max_wind;
                score -= Math.min(excess * 5, 40);
                warnings.push(`Strong winds (${dayData.wind_speed_max.toFixed(1)} m/s)`);
            } else {
                reasons.push('Calm winds');
            }
        }

        // Check temperature
        if (conditions.max_temp && dayData.temp_max > conditions.max_temp) {
            score -= 20;
            warnings.push(`Too hot (${dayData.temp_max.toFixed(1)}°C)`);
        } else if (conditions.max_temp) {
            reasons.push('Good temperature');
        }

        // Check humidity
        if (conditions.max_humidity && dayData.humidity_max > conditions.max_humidity) {
            score -= 15;
            warnings.push(`High humidity (${dayData.humidity_max.toFixed(0)}%)`);
        } else if (conditions.min_humidity && dayData.humidity_avg < conditions.min_humidity) {
            score -= 15;
            warnings.push(`Low humidity (${dayData.humidity_avg.toFixed(0)}%)`);
        }

        // Special handling for spraying - most critical
        if (activityKey === 'spraying') {
            if (dayData.has_rain || dayData.wind_speed_max > 8) {
                score = Math.min(score, 30);  // Cap at poor rating
            }
        }

        // Determine rating
        let rating;
        if (score >= 80) {
            rating = 'excellent';
        } else if (score >= 60) {
            rating = 'good';
        } else if (score >= 40) {
            rating = 'fair';
        } else {
            rating = 'poor';
        }

        // Best time of day
        let best_time = 'anytime';
        if (activityKey === 'spraying') {
            best_time = 'Early morning (6-9 AM) or evening (4-6 PM)';
        } else if (dayData.temp_max > 35) {
            best_time = 'Early morning or late evening to avoid heat';
        }

        return {
            score: Math.max(0, Math.min(100, score)),
            rating: rating,
            reasons: reasons,
            warnings: warnings,
            best_time: best_time
        };
    }

    /**
     * Create daily summary of recommended activities
     */
    createDailySummary(dailyForecasts, recommendations) {
        const summary = [];

        for (let i = 0; i < dailyForecasts.length; i++) {
            const day = dailyForecasts[i];
            const goodActivities = [];
            const avoidActivities = [];

            // Check each activity for this day
            for (const [activityKey, activityData] of Object.entries(recommendations)) {
                const daySuitability = activityData.daily_suitability[i];
                
                if (daySuitability.rating === 'excellent' || daySuitability.rating === 'good') {
                    goodActivities.push({
                        name: activityData.activity,
                        icon: activityData.icon,
                        rating: daySuitability.rating
                    });
                } else if (daySuitability.rating === 'poor') {
                    avoidActivities.push({
                        name: activityData.activity,
                        icon: activityData.icon,
                        reason: daySuitability.warnings.join(', ')
                    });
                }
            }

            summary.push({
                day_number: i + 1,
                date: day.date,
                day_name: day.day_name,
                weather: day.weather_main,
                temp_range: `${day.temp_min.toFixed(0)}-${day.temp_max.toFixed(0)}°C`,
                rainfall: day.total_rain.toFixed(1) + 'mm',
                recommended_activities: goodActivities,
                avoid_activities: avoidActivities
            });
        }

        return summary;
    }

    /**
     * Get best days for each activity
     */
    getBestDaysForActivities(recommendations) {
        const bestDays = {};

        for (const [activityKey, activityData] of Object.entries(recommendations)) {
            const sortedDays = [...activityData.daily_suitability]
                .sort((a, b) => b.score - a.score);

            const bestDay = sortedDays[0];
            
            if (bestDay.rating !== 'poor') {
                bestDays[activityKey] = {
                    activity: activityData.activity,
                    icon: activityData.icon,
                    best_day: bestDay.day_number,
                    day_name: bestDay.day_name,
                    rating: bestDay.rating,
                    score: bestDay.score,
                    best_time: bestDay.best_time
                };
            }
        }

        return bestDays;
    }

    /**
     * Get operation warnings for planning
     */
    getOperationWarnings(dailyForecasts) {
        const warnings = [];

        // Check for consecutive rain days
        let rainStreak = 0;
        for (const day of dailyForecasts) {
            if (day.has_rain) {
                rainStreak++;
            } else {
                if (rainStreak >= 3) {
                    warnings.push({
                        type: 'prolonged_rain',
                        severity: 'high',
                        message: `${rainStreak} consecutive rainy days expected - plan operations accordingly`,
                        icon: '⚠️'
                    });
                }
                rainStreak = 0;
            }
        }

        // Check for extreme heat
        const hotDays = dailyForecasts.filter(d => d.temp_max > 40);
        if (hotDays.length > 0) {
            warnings.push({
                type: 'extreme_heat',
                severity: 'high',
                message: `${hotDays.length} day(s) with extreme heat (>40°C) - limit field work`,
                icon: '🔥'
            });
        }

        // Check for strong winds
        const windyDays = dailyForecasts.filter(d => d.wind_speed_max > 15);
        if (windyDays.length > 0) {
            warnings.push({
                type: 'strong_winds',
                severity: 'moderate',
                message: `${windyDays.length} day(s) with strong winds - avoid spraying operations`,
                icon: '💨'
            });
        }

        // Check for good work weather
        const goodDays = dailyForecasts.filter(d => 
            !d.has_rain && d.temp_max < 38 && d.wind_speed_max < 12
        );
        if (goodDays.length >= 3) {
            warnings.push({
                type: 'good_conditions',
                severity: 'info',
                message: `${goodDays.length} day(s) with excellent field conditions - plan major operations`,
                icon: '✅'
            });
        }

        return warnings;
    }
}

// Make available globally
window.FarmOperationsPlanner = FarmOperationsPlanner;
