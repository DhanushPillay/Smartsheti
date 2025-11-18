// Performance Optimization Utilities
// This file contains utilities to improve website performance

// Debounce function to limit function calls
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function to limit function calls
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Lazy load images when they come into viewport
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// Optimize form inputs with debouncing
function optimizeFormInputs() {
    const searchInputs = document.querySelectorAll('input[type="text"], input[type="search"]');
    
    searchInputs.forEach(input => {
        // Remove existing event listeners
        const originalHandler = input.oninput;
        if (originalHandler) {
            input.removeEventListener('input', originalHandler);
            // Add debounced version
            input.addEventListener('input', debounce(originalHandler, 300));
        }
    });
}

// Preload critical resources
function preloadCriticalResources() {
    // Preload critical images
    const criticalImages = [
        '../assets/images/plant-logo.svg',
        // Add other critical images
    ];
    
    criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = src;
        link.as = 'image';
        document.head.appendChild(link);
    });
}

// Optimize animations and transitions
function optimizeAnimations() {
    // Reduce animations if user prefers reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.documentElement.style.setProperty('--animation-duration', '0.01ms');
        document.documentElement.style.setProperty('--transition-duration', '0.01ms');
    }
}

// Remove unused CSS (basic cleanup)
function removeUnusedStyles() {
    // This is a basic implementation
    // In production, use tools like PurgeCSS
    const unusedClasses = [
        // Add classes that are definitely not used
    ];
    
    unusedClasses.forEach(className => {
        const elements = document.querySelectorAll(`.${className}`);
        if (elements.length === 0) {
            // Class is not used, could remove from CSS
            console.log(`Unused class detected: ${className}`);
        }
    });
}

// Initialize performance optimizations
function initPerformanceOptimizations() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            performOptimizations();
        });
    } else {
        performOptimizations();
    }
}

function performOptimizations() {
    try {
        // Apply optimizations
        lazyLoadImages();
        optimizeFormInputs();
        preloadCriticalResources();
        optimizeAnimations();
        
        // Log performance info
        if (window.performance && window.performance.now) {
            console.log(`Page optimization completed in ${window.performance.now().toFixed(2)}ms`);
        }
        
        // Monitor performance
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (entry.entryType === 'largest-contentful-paint') {
                        console.log('LCP:', entry.startTime);
                    }
                    if (entry.entryType === 'first-input') {
                        console.log('FID:', entry.processingStart - entry.startTime);
                    }
                }
            });
            observer.observe({entryTypes: ['largest-contentful-paint', 'first-input']});
        }
        
    } catch (error) {
        console.warn('Performance optimization error:', error);
    }
}

// Auto-initialize when script loads
initPerformanceOptimizations();

// Export functions for manual use
if (typeof window !== 'undefined') {
    window.performanceUtils = {
        debounce,
        throttle,
        lazyLoadImages,
        optimizeFormInputs,
        initPerformanceOptimizations
    };
}
