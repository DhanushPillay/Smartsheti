// Simple translation manager
const TranslationManager = {
    init() {
        this.setupLanguageDropdown();
        this.applyLanguage();
    },

    setupLanguageDropdown() {
        if (typeof window.setupLanguageDropdown === 'function') {
            window.setupLanguageDropdown();
        }
    },

    applyLanguage() {
        if (typeof window.translatePage === 'function') {
            window.translatePage();
        }
    },

    getPestRisks(temperature, humidity) {
        if (typeof window.getTranslatedPestRisks === 'function') {
            return window.getTranslatedPestRisks(temperature, humidity);
        }
        return "Low risk of pest attacks due to dry conditions";
    },

    getIrrigationAdvice(temperature, humidity, rainfall) {
        if (typeof window.getTranslatedIrrigationAdvice === 'function') {
            return window.getTranslatedIrrigationAdvice(temperature, humidity, rainfall);
        }
        return "Maintain normal irrigation schedule";
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    TranslationManager.init();
});
