// Universal Translation Initializer
// Include this script after translations.js to ensure consistent translation behavior across all pages

(function() {
    'use strict';
    
    // Check if translations.js is loaded
    if (typeof window.translations === 'undefined') {
        console.warn('translations.js not loaded. Translation features will not work.');
        return;
    }
    
    // Initialize translation system when DOM is ready
    function initializeTranslations() {
        try {
            // Setup language dropdown if available
            if (typeof window.setupLanguageDropdown === 'function') {
                window.setupLanguageDropdown();
                console.log('✅ Language dropdown initialized');
            } else {
                console.warn('setupLanguageDropdown function not available');
            }
            
            // Apply saved language preference
            if (typeof window.translatePage === 'function') {
                const savedLang = localStorage.getItem('preferredLanguage') || 'en';
                window.translatePage(savedLang);
                console.log(`✅ Translation applied for language: ${savedLang}`);
            } else {
                console.warn('translatePage function not available');
            }
            
            // Update current language indicator
            const currentLangElement = document.getElementById('currentLang');
            if (currentLangElement) {
                const currentLang = localStorage.getItem('preferredLanguage') || 'en';
                currentLangElement.textContent = currentLang.toUpperCase();
            }
            
        } catch (error) {
            console.error('Error initializing translations:', error);
        }
    }
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeTranslations);
    } else {
        // DOM is already ready, initialize immediately
        initializeTranslations();
    }
    
    // Export initialization function for manual use
    window.initializeTranslations = initializeTranslations;
    
    console.log('🌐 Universal translation initializer loaded');
})();