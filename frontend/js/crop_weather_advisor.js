/**
 * Crop-Specific Weather Advisory Engine
 * Provides crop-specific weather advisories based on current conditions
 */

class CropWeatherAdvisor {
    constructor(weatherContext) {
        this.context = weatherContext;
    }

    /**
     * Get crop-specific advisories for location
     */
    getCropAdvisories(weather, locationContext, forecastData = null) {
        const zone = locationContext.agroclimatic_zone;
        const commonCrops = locationContext.common_crops || [];
        
        if (commonCrops.length === 0) {
            return {
                location: locationContext.location,
                zone: zone,
                message: 'No specific crop data available for this zone',
                advisories: []
            };
        }

        const advisories = [];

        // Analyze each common crop
        for (const crop of commonCrops.slice(0, 6)) { // Limit to top 6 crops
            const advisory = this.analyzeCropConditions(crop, weather, forecastData);
            if (advisory) {
                advisories.push(advisory);
            }
        }

        return {
            location: locationContext.location,
            zone: zone,
            total_crops: commonCrops.length,
            analyzed_crops: advisories.length,
            advisories: advisories,
            season: this.context.getCurrentSeason()
        };
    }

    /**
     * Analyze weather conditions for specific crop
     */
    analyzeCropConditions(crop, weather, forecastData) {
        const tempCheck = this.checkTemperatureSuitability(crop, weather.temp);
        const waterCheck = this.checkWaterRequirements(crop, weather);
        const growthCheck = this.assessGrowthConditions(crop, weather);
        
        // Overall status
        let overall_status = 'suitable';
        let status_icon = '✅';
        
        const issues = [];
        const recommendations = [];

        // Temperature issues
        if (tempCheck.status === 'too_hot') {
            overall_status = 'caution';
            status_icon = '⚠️';
            issues.push(tempCheck.message);
            recommendations.push(...tempCheck.recommendations);
        } else if (tempCheck.status === 'too_cold') {
            overall_status = 'caution';
            status_icon = '⚠️';
            issues.push(tempCheck.message);
            recommendations.push(...tempCheck.recommendations);
        } else if (tempCheck.status === 'extreme') {
            overall_status = 'unsuitable';
            status_icon = '🚨';
            issues.push(tempCheck.message);
            recommendations.push(...tempCheck.recommendations);
        }

        // Water issues
        if (waterCheck.status === 'deficit') {
            if (overall_status === 'suitable') overall_status = 'caution';
            status_icon = '⚠️';
            issues.push(waterCheck.message);
            recommendations.push(...waterCheck.recommendations);
        } else if (waterCheck.status === 'excess') {
            if (overall_status === 'suitable') overall_status = 'caution';
            status_icon = '⚠️';
            issues.push(waterCheck.message);
            recommendations.push(...waterCheck.recommendations);
        }

        // Growth conditions
        if (growthCheck.status === 'poor') {
            if (overall_status === 'suitable') overall_status = 'caution';
            status_icon = '⚠️';
            issues.push(growthCheck.message);
            recommendations.push(...growthCheck.recommendations);
        } else if (growthCheck.status === 'excellent') {
            recommendations.push(growthCheck.message);
        }

        // Pest warnings based on weather
        const pestWarnings = this.checkCropPestRisk(crop, weather);
        if (pestWarnings.length > 0) {
            recommendations.push(...pestWarnings);
        }

        // Seasonal advice
        const seasonalAdvice = this.getSeasonalCropAdvice(crop, weather);
        if (seasonalAdvice) {
            recommendations.push(seasonalAdvice);
        }

        return {
            crop_name: crop.name,
            overall_status: overall_status,
            status_icon: status_icon,
            temperature_status: tempCheck.status,
            water_status: waterCheck.status,
            issues: issues,
            recommendations: recommendations,
            suitable_for_planting: this.checkPlantingSuitability(crop, weather),
            harvest_advisory: this.getHarvestAdvisory(crop, weather, forecastData)
        };
    }

    /**
     * Check temperature suitability
     */
    checkTemperatureSuitability(crop, currentTemp) {
        if (!crop.ideal_temperature_c) {
            return { status: 'unknown', message: 'Temperature data not available' };
        }

        const min = crop.ideal_temperature_c.min;
        const max = crop.ideal_temperature_c.max;

        if (currentTemp < min - 5) {
            return {
                status: 'extreme',
                message: `Too cold for ${crop.name} (${currentTemp}°C, ideal: ${min}-${max}°C)`,
                recommendations: ['Protect crops from cold damage', 'Consider covering seedlings', 'Delay planting if not yet sown']
            };
        } else if (currentTemp < min) {
            return {
                status: 'too_cold',
                message: `Below optimal temperature for ${crop.name}`,
                recommendations: ['Monitor for slow growth', 'Reduce irrigation', 'Protect from frost']
            };
        } else if (currentTemp > max + 5) {
            return {
                status: 'extreme',
                message: `Too hot for ${crop.name} (${currentTemp}°C, ideal: ${min}-${max}°C)`,
                recommendations: ['Emergency irrigation needed', 'Provide shade if possible', 'Monitor for heat stress']
            };
        } else if (currentTemp > max) {
            return {
                status: 'too_hot',
                message: `Above optimal temperature for ${crop.name}`,
                recommendations: ['Increase irrigation frequency', 'Monitor for heat stress', 'Spray during cooler hours']
            };
        } else {
            return {
                status: 'optimal',
                message: `Ideal temperature for ${crop.name} (${currentTemp}°C)`
            };
        }
    }

    /**
     * Check water requirements
     */
    checkWaterRequirements(crop, weather) {
        const humidity = weather.humidity;
        const rain = weather.rain ? (weather.rain['3h'] || weather.rain['1h'] || 0) : 0;

        // Simple water stress indicator
        if (rain > 25) {
            return {
                status: 'excess',
                message: 'Excessive rainfall - waterlogging risk',
                recommendations: ['Ensure proper drainage', 'Watch for root diseases', 'Delay irrigation']
            };
        } else if (rain > 5) {
            return {
                status: 'adequate',
                message: 'Adequate moisture from rainfall',
                recommendations: ['Monitor soil moisture', 'Reduce irrigation accordingly']
            };
        } else if (humidity < 30 && weather.temp > 35) {
            return {
                status: 'deficit',
                message: 'High water stress conditions',
                recommendations: ['Increase irrigation immediately', 'Mulch to conserve moisture', 'Monitor for wilting']
            };
        } else if (humidity < 45 && weather.temp > 32) {
            return {
                status: 'deficit',
                message: 'Moderate water stress expected',
                recommendations: ['Maintain regular irrigation', 'Monitor soil moisture']
            };
        } else {
            return {
                status: 'normal',
                message: 'Normal water conditions',
                recommendations: ['Continue regular irrigation schedule']
            };
        }
    }

    /**
     * Assess overall growth conditions
     */
    assessGrowthConditions(crop, weather) {
        const temp = weather.temp;
        const humidity = weather.humidity;
        
        // Ideal conditions vary by crop
        let score = 0;
        let factors = [];

        // Temperature scoring
        if (crop.ideal_temperature_c) {
            const min = crop.ideal_temperature_c.min;
            const max = crop.ideal_temperature_c.max;
            const ideal = (min + max) / 2;
            
            if (Math.abs(temp - ideal) <= 2) {
                score += 2;
                factors.push('ideal temperature');
            } else if (temp >= min && temp <= max) {
                score += 1;
            }
        }

        // Humidity scoring (general)
        if (humidity >= 50 && humidity <= 70) {
            score += 1;
            factors.push('good humidity');
        } else if (humidity > 80) {
            score -= 1;
            factors.push('high humidity');
        } else if (humidity < 40) {
            score -= 1;
            factors.push('low humidity');
        }

        if (score >= 2) {
            return {
                status: 'excellent',
                message: `Excellent growth conditions for ${crop.name}: ${factors.join(', ')}`,
                recommendations: ['Optimal time for crop activities', 'Monitor regularly for best results']
            };
        } else if (score >= 0) {
            return {
                status: 'good',
                message: 'Good growth conditions',
                recommendations: []
            };
        } else {
            return {
                status: 'poor',
                message: 'Sub-optimal growth conditions',
                recommendations: ['Extra care needed', 'Monitor crop health closely']
            };
        }
    }

    /**
     * Check crop-specific pest risk based on weather
     */
    checkCropPestRisk(crop, weather) {
        const warnings = [];
        
        if (!crop.common_pests || crop.common_pests.length === 0) {
            return warnings;
        }

        const temp = weather.temp;
        const humidity = weather.humidity;

        // General pest risk conditions
        if (temp > 25 && temp < 35 && humidity > 60) {
            const pests = crop.common_pests.slice(0, 3).join(', ');
            warnings.push(`Weather favorable for ${pests} - monitor closely`);
        }

        if (humidity > 80 || (weather.rain && weather.rain['3h'] > 5)) {
            warnings.push('High moisture increases fungal disease risk - increase scouting');
        }

        if (temp > 35 && humidity < 50) {
            warnings.push('Hot and dry conditions favor spider mites - check undersides of leaves');
        }

        return warnings;
    }

    /**
     * Get seasonal advice for crop
     */
    getSeasonalCropAdvice(crop, weather) {
        const season = this.context.getCurrentSeason();
        if (!season || !crop.season) return null;

        const cropSeasons = crop.season.toLowerCase();
        const currentSeason = season.key;

        if (cropSeasons.includes(currentSeason)) {
            const month = new Date().getMonth() + 1;
            
            // Sowing period
            if ((currentSeason === 'kharif' && (month === 6 || month === 7)) ||
                (currentSeason === 'rabi' && (month === 11 || month === 12))) {
                return `Now is the ${season.name} sowing period for ${crop.name}`;
            }
            
            // Growth period
            if ((currentSeason === 'kharif' && (month === 8 || month === 9)) ||
                (currentSeason === 'rabi' && (month === 12 || month === 1 || month === 2))) {
                return `${crop.name} in active growth stage - maintain regular care`;
            }
            
            // Harvest period
            if ((currentSeason === 'kharif' && month === 10) ||
                (currentSeason === 'rabi' && (month === 3 || month === 4))) {
                return `Prepare for ${crop.name} harvest`;
            }
        } else if (!cropSeasons.includes('perennial')) {
            return `Not the season for ${crop.name} (${crop.season} crop)`;
        }

        return null;
    }

    /**
     * Check planting suitability
     */
    checkPlantingSuitability(crop, weather) {
        const season = this.context.getCurrentSeason();
        const month = new Date().getMonth() + 1;
        
        if (!season || !crop.season) {
            return { suitable: false, reason: 'Season information not available' };
        }

        const cropSeasons = crop.season.toLowerCase();
        
        // Check if it's the right season
        if (!cropSeasons.includes(season.key) && !cropSeasons.includes('perennial')) {
            return { 
                suitable: false, 
                reason: `${crop.name} is a ${crop.season} crop, not suitable for ${season.name} season` 
            };
        }

        // Check if it's the sowing window
        const isSowingTime = 
            (season.key === 'kharif' && (month === 6 || month === 7)) ||
            (season.key === 'rabi' && (month === 11 || month === 12)) ||
            (season.key === 'summer' && (month === 3 || month === 4));

        if (!isSowingTime) {
            return { 
                suitable: false, 
                reason: 'Outside normal sowing window for this season' 
            };
        }

        // Check temperature
        if (crop.ideal_temperature_c) {
            const temp = weather.temp;
            if (temp < crop.ideal_temperature_c.min - 3 || temp > crop.ideal_temperature_c.max + 3) {
                return { 
                    suitable: false, 
                    reason: `Temperature ${temp}°C outside safe range for planting` 
                };
            }
        }

        return { 
            suitable: true, 
            reason: `Good time for ${crop.name} planting` 
        };
    }

    /**
     * Get harvest advisory
     */
    getHarvestAdvisory(crop, weather, forecastData) {
        const season = this.context.getCurrentSeason();
        const month = new Date().getMonth() + 1;
        
        if (!season || !crop.season) return null;

        const cropSeasons = crop.season.toLowerCase();
        
        // Check if it's harvest time
        const isHarvestTime = 
            (cropSeasons.includes('kharif') && (month === 10 || month === 11)) ||
            (cropSeasons.includes('rabi') && (month === 3 || month === 4));

        if (!isHarvestTime) return null;

        const advisory = {
            crop: crop.name,
            season: season.name,
            recommendations: []
        };

        // Check current weather
        if (weather.rain && weather.rain['3h'] > 2) {
            advisory.recommendations.push('Delay harvesting due to current rainfall');
            advisory.urgency = 'wait';
        } else if (weather.humidity > 75) {
            advisory.recommendations.push('High humidity - ensure proper drying after harvest');
            advisory.urgency = 'proceed_with_caution';
        } else {
            advisory.recommendations.push('Weather suitable for harvesting');
            advisory.urgency = 'favorable';
        }

        // Check forecast if available
        if (forecastData && Array.isArray(forecastData)) {
            const nextDaysRain = forecastData.slice(0, 3).some(day => 
                day.rain && (day.rain['3h'] > 5 || day.rain['1h'] > 5)
            );
            
            if (nextDaysRain) {
                advisory.recommendations.push('Rain predicted in next 3 days - expedite harvesting if crop is ready');
                advisory.urgency = 'urgent';
            }
        }

        return advisory.recommendations.length > 0 ? advisory : null;
    }

    /**
     * Get top priority crop advisories
     */
    getTopPriorities(advisories) {
        if (!advisories || advisories.length === 0) return [];

        return advisories
            .filter(a => a.overall_status !== 'suitable' || a.suitable_for_planting.suitable)
            .slice(0, 3);
    }
}

// Make available globally
window.CropWeatherAdvisor = CropWeatherAdvisor;
