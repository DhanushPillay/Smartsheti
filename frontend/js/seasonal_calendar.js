/**
 * Seasonal Agricultural Calendar System
 * Provides monsoon tracking, crop calendars, and seasonal guidance
 */

class SeasonalCalendar {
    constructor(weatherContext) {
        this.context = weatherContext;
        
        // Monsoon phases
        this.monsoonPhases = {
            pre_monsoon: { months: [5, 6], name: 'Pre-Monsoon', description: 'Prepare for monsoon arrival' },
            onset: { months: [6], name: 'Monsoon Onset', description: 'Southwest monsoon arrives' },
            active: { months: [7, 8], name: 'Active Monsoon', description: 'Peak rainfall period' },
            withdrawal: { months: [9, 10], name: 'Monsoon Withdrawal', description: 'Monsoon receding' },
            post_monsoon: { months: [10, 11], name: 'Post-Monsoon', description: 'Transition to winter' }
        };

        // Maharashtra monsoon normals (approximate)
        this.monsoonNormals = {
            onset_date: { month: 6, day: 10 },
            withdrawal_date: { month: 10, day: 15 },
            total_rainfall: 2200, // mm for state average
            peak_months: [7, 8]
        };
    }

    /**
     * Get current monsoon status
     */
    getMonsoonStatus(date = new Date(), rainfallData = null) {
        const month = date.getMonth() + 1;
        const day = date.getDate();

        let phase = null;
        for (const [key, phaseInfo] of Object.entries(this.monsoonPhases)) {
            if (phaseInfo.months.includes(month)) {
                phase = { key, ...phaseInfo };
                break;
            }
        }

        if (!phase) {
            return {
                is_monsoon_season: false,
                phase: 'non_monsoon',
                message: 'Outside monsoon season',
                icon: '☀️'
            };
        }

        const status = {
            is_monsoon_season: true,
            phase: phase.key,
            phase_name: phase.name,
            phase_description: phase.description,
            current_date: { month, day },
            onset_expected: this.monsoonNormals.onset_date,
            withdrawal_expected: this.monsoonNormals.withdrawal_date,
            icon: this.getMonsoonIcon(phase.key)
        };

        // Add rainfall adequacy if data provided
        if (rainfallData && rainfallData.amount_mm !== undefined) {
            status.rainfall_status = this.assessRainfallAdequacy(rainfallData.amount_mm, month);
        }

        // Add monsoon alerts
        status.alerts = this.getMonsoonAlerts(month, day, rainfallData);

        return status;
    }

    /**
     * Get monsoon icon based on phase
     */
    getMonsoonIcon(phase) {
        const icons = {
            pre_monsoon: '🌤️',
            onset: '🌧️',
            active: '⛈️',
            withdrawal: '🌦️',
            post_monsoon: '🌥️'
        };
        return icons[phase] || '☁️';
    }

    /**
     * Assess rainfall adequacy
     */
    assessRainfallAdequacy(actualRainfall, month) {
        // Approximate monthly normal rainfall percentages for Maharashtra
        const monthlyNormals = {
            6: 500,   // June
            7: 700,   // July
            8: 600,   // August
            9: 300,   // September
            10: 100   // October
        };

        const expected = monthlyNormals[month] || 0;
        if (expected === 0) {
            return { status: 'not_applicable', message: 'Not a typical monsoon month' };
        }

        const percentage = (actualRainfall / expected) * 100;

        if (percentage > 120) {
            return {
                status: 'excess',
                percentage: percentage.toFixed(0),
                icon: '⚠️',
                message: `Excess rainfall (${percentage.toFixed(0)}% of normal)`,
                concern: 'Risk of flooding and waterlogging'
            };
        } else if (percentage >= 80) {
            return {
                status: 'adequate',
                percentage: percentage.toFixed(0),
                icon: '✅',
                message: `Adequate rainfall (${percentage.toFixed(0)}% of normal)`,
                concern: 'Good for Kharif crops'
            };
        } else if (percentage >= 60) {
            return {
                status: 'deficient',
                percentage: percentage.toFixed(0),
                icon: '⚠️',
                message: `Below normal rainfall (${percentage.toFixed(0)}% of normal)`,
                concern: 'Monitor crop water stress'
            };
        } else {
            return {
                status: 'severely_deficient',
                percentage: percentage.toFixed(0),
                icon: '🚨',
                message: `Severely deficient rainfall (${percentage.toFixed(0)}% of normal)`,
                concern: 'Drought conditions - irrigation critical'
            };
        }
    }

    /**
     * Get monsoon-related alerts
     */
    getMonsoonAlerts(month, day, rainfallData) {
        const alerts = [];

        // Pre-monsoon preparation
        if (month === 5 || (month === 6 && day < 10)) {
            alerts.push({
                type: 'preparation',
                priority: 'high',
                icon: '📋',
                message: 'Monsoon arrives soon - Prepare fields',
                actions: ['Clear drainage channels', 'Repair farm bunds', 'Purchase seeds and fertilizers']
            });
        }

        // Onset alert
        if (month === 6 && day >= 5 && day <= 15) {
            alerts.push({
                type: 'onset',
                priority: 'high',
                icon: '🌧️',
                message: 'Monsoon onset period for Maharashtra',
                actions: ['Ready for Kharif sowing', 'Monitor rainfall', 'Prepare seedbeds']
            });
        }

        // Peak monsoon
        if (month === 7 || month === 8) {
            alerts.push({
                type: 'peak',
                priority: 'medium',
                icon: '⛈️',
                message: 'Peak monsoon period',
                actions: ['Monitor waterlogging', 'Ensure drainage', 'Watch for pest outbreaks']
            });
        }

        // Withdrawal
        if (month === 10) {
            alerts.push({
                type: 'withdrawal',
                priority: 'medium',
                icon: '🌾',
                message: 'Monsoon withdrawing - Prepare for harvest',
                actions: ['Plan Kharif harvest', 'Prepare for Rabi sowing', 'Check storage facilities']
            });
        }

        // Rainfall-based alerts
        if (rainfallData && rainfallData.recent_total !== undefined) {
            if (rainfallData.recent_total > 200 && (month >= 6 && month <= 9)) {
                alerts.push({
                    type: 'heavy_rain',
                    priority: 'high',
                    icon: '⚠️',
                    message: 'Heavy rainfall recorded',
                    actions: ['Check for waterlogging', 'Ensure crop protection', 'Monitor flood risk']
                });
            } else if (rainfallData.recent_total < 20 && (month >= 7 && month <= 8)) {
                alerts.push({
                    type: 'dry_spell',
                    priority: 'high',
                    icon: '🌵',
                    message: 'Dry spell during monsoon',
                    actions: ['Arrange supplemental irrigation', 'Monitor crop stress', 'Check soil moisture']
                });
            }
        }

        return alerts;
    }

    /**
     * Get Kharif season calendar
     */
    getKharifCalendar(date = new Date(), zone = null) {
        const month = date.getMonth() + 1;
        
        const activities = [];

        // Preparation (May-June)
        if (month === 5 || month === 6) {
            activities.push({
                period: 'preparation',
                month: 'May-June',
                priority: 'high',
                tasks: [
                    'Plough fields and prepare seedbeds',
                    'Apply basal fertilizers',
                    'Repair irrigation channels',
                    'Purchase quality seeds',
                    'Clean farm equipment'
                ]
            });
        }

        // Sowing (June-July)
        if (month === 6 || month === 7) {
            const crops = zone ? this.context.getCropsForZone(zone).filter(c => 
                c.season && c.season.toLowerCase().includes('kharif')
            ) : [];

            activities.push({
                period: 'sowing',
                month: 'June-July',
                priority: 'critical',
                tasks: [
                    'Sow Kharif crops after good monsoon rain',
                    'Ensure proper spacing and depth',
                    'Apply seed treatment',
                    'Monitor germination'
                ],
                recommended_crops: crops.length > 0 ? crops.slice(0, 5).map(c => c.name) : 
                    ['Rice', 'Cotton', 'Soybean', 'Jowar', 'Maize']
            });
        }

        // Growth stage (July-September)
        if (month >= 7 && month <= 9) {
            activities.push({
                period: 'growth_stage',
                month: 'July-September',
                priority: 'high',
                tasks: [
                    'Apply top dressing fertilizers',
                    'Weed management',
                    'Pest and disease monitoring',
                    'Irrigation if needed',
                    'Monitor crop growth'
                ]
            });
        }

        // Harvest (September-October)
        if (month >= 9 && month <= 11) {
            activities.push({
                period: 'harvest',
                month: 'September-November',
                priority: 'critical',
                tasks: [
                    'Harvest mature crops',
                    'Proper drying and storage',
                    'Clean and prepare fields for Rabi',
                    'Market planning',
                    'Residue management'
                ]
            });
        }

        return {
            season: 'Kharif',
            current_month: month,
            activities: activities,
            overall_status: this.getKharifStatus(month)
        };
    }

    /**
     * Get Rabi season calendar
     */
    getRabiCalendar(date = new Date(), zone = null) {
        const month = date.getMonth() + 1;
        
        const activities = [];

        // Preparation (October)
        if (month === 10) {
            activities.push({
                period: 'preparation',
                month: 'October',
                priority: 'high',
                tasks: [
                    'Complete Kharif harvest',
                    'Prepare fields for Rabi',
                    'Plan irrigation schedule',
                    'Soil testing',
                    'Purchase seeds and fertilizers'
                ]
            });
        }

        // Sowing (November-December)
        if (month === 11 || month === 12) {
            const crops = zone ? this.context.getCropsForZone(zone).filter(c => 
                c.season && c.season.toLowerCase().includes('rabi')
            ) : [];

            activities.push({
                period: 'sowing',
                month: 'November-December',
                priority: 'critical',
                tasks: [
                    'Sow Rabi crops',
                    'Ensure adequate moisture',
                    'Apply basal fertilizers',
                    'Monitor germination',
                    'Plan irrigation'
                ],
                recommended_crops: crops.length > 0 ? crops.slice(0, 5).map(c => c.name) : 
                    ['Wheat', 'Gram', 'Jowar', 'Vegetables']
            });
        }

        // Growth stage (December-February)
        if (month === 12 || month === 1 || month === 2) {
            activities.push({
                period: 'growth_stage',
                month: 'December-February',
                priority: 'high',
                tasks: [
                    'Regular irrigation',
                    'Top dressing fertilizers',
                    'Weed control',
                    'Pest monitoring',
                    'Protect from cold damage'
                ]
            });
        }

        // Harvest (March-April)
        if (month >= 3 && month <= 4) {
            activities.push({
                period: 'harvest',
                month: 'March-April',
                priority: 'critical',
                tasks: [
                    'Harvest Rabi crops at maturity',
                    'Timely harvesting to avoid heat damage',
                    'Proper storage',
                    'Market the produce',
                    'Prepare for summer'
                ]
            });
        }

        return {
            season: 'Rabi',
            current_month: month,
            activities: activities,
            overall_status: this.getRabiStatus(month)
        };
    }

    /**
     * Get Summer season calendar
     */
    getSummerCalendar(date = new Date()) {
        const month = date.getMonth() + 1;
        
        if (month === 4 || month === 5) {
            return {
                season: 'Summer/Zaid',
                current_month: month,
                activities: [{
                    period: 'summer_activities',
                    month: 'April-May',
                    priority: 'medium',
                    tasks: [
                        'Deep summer ploughing for moisture conservation',
                        'Prepare for monsoon',
                        'Grow fodder crops if irrigation available',
                        'Maintain farm equipment',
                        'Plan for Kharif season'
                    ],
                    optional_crops: ['Vegetables', 'Fodder', 'Green gram', 'Watermelon']
                }],
                overall_status: 'Off-season land preparation and planning period'
            };
        }

        return null;
    }

    /**
     * Get Kharif status message
     */
    getKharifStatus(month) {
        if (month >= 5 && month <= 6) return 'Preparation and sowing phase';
        if (month >= 7 && month <= 9) return 'Crop growth and management phase';
        if (month >= 10 && month <= 11) return 'Harvest and marketing phase';
        return 'Kharif season concluded';
    }

    /**
     * Get Rabi status message
     */
    getRabiStatus(month) {
        if (month === 10 || month === 11) return 'Preparation and sowing phase';
        if (month === 12 || month === 1 || month === 2) return 'Crop growth and management phase';
        if (month >= 3 && month <= 4) return 'Harvest phase';
        return 'Rabi season concluded';
    }

    /**
     * Get complete seasonal overview
     */
    getSeasonalOverview(date = new Date(), zone = null, rainfallData = null) {
        const currentSeason = this.context.getCurrentSeason(date);
        const monsoonStatus = this.getMonsoonStatus(date, rainfallData);

        let calendar = null;
        if (currentSeason) {
            if (currentSeason.key === 'kharif') {
                calendar = this.getKharifCalendar(date, zone);
            } else if (currentSeason.key === 'rabi') {
                calendar = this.getRabiCalendar(date, zone);
            } else if (currentSeason.key === 'summer') {
                calendar = this.getSummerCalendar(date);
            }
        }

        return {
            current_season: currentSeason,
            monsoon_status: monsoonStatus,
            calendar: calendar,
            zone: zone
        };
    }
}

// Make available globally
window.SeasonalCalendar = SeasonalCalendar;
