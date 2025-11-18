/**
 * Pest Risk Utilities
 * Simple interface for pest risk analysis in web applications
 */

// Initialize the pest analyzer
let pestAnalyzer = null;

/**
 * Initialize pest risk system
 */
function initializePestRiskSystem() {
    if (typeof PestRiskAnalyzer !== 'undefined') {
        pestAnalyzer = new PestRiskAnalyzer();
        console.log('Pest Risk System initialized successfully');
        return true;
    } else {
        console.error('PestRiskAnalyzer not found. Make sure pest_risk_analyzer.js is loaded first.');
        return false;
    }
}

/**
 * Get simple pest risks for display
 * @param {Object} weatherData - Weather data object
 * @returns {Array} Array of simple risk descriptions
 */
function getSimplePestRisks(weatherData) {
    if (!pestAnalyzer) {
        console.warn('Pest analyzer not initialized, using fallback system');
        return getFallbackPestRisks(weatherData);
    }
    
    try {
        const detectedPests = pestAnalyzer.analyzePestRisks(weatherData);
        return detectedPests.map(pest => `${pest.icon} ${pest.name} risk - ${pest.description}`);
    } catch (error) {
        console.error('Error in pest analysis:', error);
        return getFallbackPestRisks(weatherData);
    }
}

/**
 * Get comprehensive pest risk report
 * @param {Object} weatherData - Weather data object
 * @param {string} language - Language code (default: 'en')
 * @returns {Object} Comprehensive pest report
 */
function getComprehensivePestReport(weatherData, language = 'en') {
    if (!pestAnalyzer) {
        initializePestRiskSystem();
    }
    
    if (pestAnalyzer) {
        return pestAnalyzer.generatePestRiskReport(weatherData, language);
    }
    
    return {
        timestamp: new Date().toISOString(),
        weatherConditions: weatherData,
        totalPestsDetected: 0,
        riskLevel: 'unknown',
        detectedPests: [],
        recommendations: ['Initialize pest risk system for detailed analysis'],
        preventiveMeasures: ['Regular field monitoring recommended'],
        monitoringAdvice: { frequency: 'Weekly', urgency: 'low' }
    };
}

/**
 * Fallback pest risk analysis (simplified version)
 * @param {Object} weatherData - Weather data object
 * @returns {Array} Array of risk descriptions
 */
function getFallbackPestRisks(weatherData) {
    const temp = weatherData.main?.temp || 25;
    const humidity = weatherData.main?.humidity || 50;
    const rain_mm = weatherData.rain?.['1h'] || 0;
    const cloud_cover = weatherData.clouds?.all || 0;
    const wind_speed = weatherData.wind?.speed || 0;

    const risks = [];

    // Simplified conditions (same as before but organized)
    if (temp >= 18 && temp <= 35 && humidity > 50 && cloud_cover > 30) {
        risks.push("🐛 Aphid risk - Warm + Humid + Cloudy conditions");
    }

    if (temp >= 20 && temp <= 32 && humidity >= 35) {
        risks.push("☁️ Whitefly risk - Ideal growth temperature range");
    }

    if (temp > 25 && humidity < 60) {
        risks.push("🕷️ Red Spider Mite risk - Hot & Dry conditions");
    }

    if (temp > 20 && wind_speed < 8 && cloud_cover > 40) {
        risks.push("🌾 Stem Borer risk - Still & cloudy weather");
    }

    if (rain_mm > 0.5 && humidity > 70) {
        risks.push("🍄 Fungal risk - Wet leaf conditions");
    }

    if (temp > 24 && humidity < 65 && wind_speed > 5) {
        risks.push("🌬️ Thrips risk - Hot + dry + windy conditions");
    }

    if (temp >= 22 && temp <= 35 && rain_mm > 0.1) {
        risks.push("🍃 Leafhopper risk - Moderate temps with rain");
    }

    if (temp >= 24 && temp <= 40 && rain_mm >= 0.1 && rain_mm <= 8 && humidity < 70) {
        risks.push("🐞 Shoot fly risk - Moderate rainfall conditions");
    }

    if (temp > 20 && humidity > 45) {
        risks.push("🧨 Bollworm risk - Night warmth + moisture");
    }

    if (humidity > 60 && rain_mm > 0.1 && temp >= 18 && temp <= 35) {
        risks.push("🪖 Armyworm risk - Stormy weather conditions");
    }

    return risks;
}

/**
 * Format pest risks for UI display
 * @param {Array} risks - Array of risk descriptions
 * @param {string} language - Language code
 * @returns {Object} Formatted display object
 */
function formatPestRisksForDisplay(risks, language = 'en') {
    if (risks.length === 0) {
        return {
            hasRisks: false,
            level: 'low',
            title: '✅ Low Pest Risk',
            message: 'No significant pest risks detected for current weather conditions.',
            risks: [],
            className: 'bg-green-50 border-l-4 border-green-500 p-4 rounded-r'
        };
    }

    // Determine risk level based on number and type of pests
    let level = 'moderate';
    const severeKeywords = ['Armyworm', 'Stem Borer', 'Bollworm'];
    const hasSevereRisks = risks.some(risk => 
        severeKeywords.some(keyword => risk.includes(keyword))
    );

    if (hasSevereRisks || risks.length > 3) {
        level = 'high';
    }

    return {
        hasRisks: true,
        level: level,
        title: `🚨 ${level === 'high' ? 'High' : 'Moderate'} Pest Risk Detected`,
        message: `${risks.length} potential pest ${risks.length === 1 ? 'risk' : 'risks'} identified based on current weather conditions.`,
        risks: risks,
        className: level === 'high' 
            ? 'bg-red-50 border-l-4 border-red-500 p-4 rounded-r'
            : 'bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r'
    };
}

/**
 * Update pest risk UI element
 * @param {string} elementId - ID of the element to update
 * @param {Object} weatherData - Weather data
 * @param {string} language - Language code
 */
function updatePestRiskUI(elementId, weatherData, language = 'en') {
    const element = document.getElementById(elementId);
    if (!element) {
        console.warn(`Element with ID ${elementId} not found`);
        return;
    }

    const risks = getSimplePestRisks(weatherData);
    const displayData = formatPestRisksForDisplay(risks, language);
    
    element.className = displayData.className;
    
    if (displayData.hasRisks) {
        element.innerHTML = `
            <div class="space-y-3">
                <div class="flex items-center">
                    <span class="material-icons text-red-500 mr-2">warning</span>
                    <h3 class="font-semibold text-gray-800">${displayData.title}</h3>
                </div>
                <p class="text-sm text-gray-600">${displayData.message}</p>
                <ul class="list-disc list-inside space-y-1">
                    ${displayData.risks.map(risk => `<li class="text-gray-700">${risk}</li>`).join('')}
                </ul>
                <div class="mt-3 p-2 bg-blue-50 border-l-2 border-blue-400 rounded">
                    <p class="text-xs text-blue-700">
                        <strong>Recommendation:</strong> Monitor your fields closely and take preventive measures as needed.
                    </p>
                </div>
            </div>
        `;
    } else {
        const conditions = weatherData.main || {};
        element.innerHTML = `
            <div class="flex items-center space-x-3">
                <span class="text-green-600 text-2xl">✅</span>
                <div>
                    <h3 class="font-semibold text-gray-800">${displayData.title}</h3>
                    <p class="text-sm text-gray-600">${displayData.message}</p>
                    <p class="text-xs text-gray-500 mt-1">
                        Conditions: ${Math.round(conditions.temp || 0)}°C, ${conditions.humidity || 0}% humidity
                    </p>
                </div>
            </div>
        `;
    }
}

// Auto-initialize when DOM is ready
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', function() {
        // Small delay to ensure other scripts are loaded
        setTimeout(initializePestRiskSystem, 100);
    });
}

// Export functions for global use
if (typeof window !== 'undefined') {
    window.initializePestRiskSystem = initializePestRiskSystem;
    window.getSimplePestRisks = getSimplePestRisks;
    window.getComprehensivePestReport = getComprehensivePestReport;
    window.formatPestRisksForDisplay = formatPestRisksForDisplay;
    window.updatePestRiskUI = updatePestRiskUI;
}

// Export for Node.js if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializePestRiskSystem,
        getSimplePestRisks,
        getComprehensivePestReport,
        formatPestRisksForDisplay,
        updatePestRiskUI
    };
}
