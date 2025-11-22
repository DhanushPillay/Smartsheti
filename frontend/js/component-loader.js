/**
 * Component Loader for SmartSheti
 * Loads shared Header and Footer components
 */

document.addEventListener('DOMContentLoaded', async function() {
    // Determine Root Path based on current location
    let rootPath = '.';
    const path = window.location.pathname;
    
    if (path.includes('/frontend/html/')) {
        rootPath = '../..';
    } else if (path.includes('/frontend/')) {
        rootPath = '..';
    }
    
    console.log('Component Loader: Detected rootPath =', rootPath);
    console.log('Component Loader: Current pathname =', path);
    
    // Load Header
    const headerPlaceholder = document.getElementById('header-placeholder');
    if (headerPlaceholder) {
        try {
            const headerUrl = `${rootPath}/frontend/components/header.html`;
            console.log('Fetching header from:', headerUrl);
            const response = await fetch(headerUrl);
            if (response.ok) {
                let html = await response.text();
                // Replace {{ROOT}} placeholder with actual relative path
                html = html.replace(/{{ROOT}}/g, rootPath);
                headerPlaceholder.innerHTML = html;
                
                // Initialize Header Logic
                initializeHeader();

                // Trigger animation
                const header = headerPlaceholder.querySelector('header');
                if (header) {
                    // Small delay to ensure DOM update
                    setTimeout(() => {
                        header.classList.add('loaded');
                    }, 50);
                }
            } else {
                console.error('Failed to load header: ' + response.status);
            }
        } catch (e) {
            console.error('Error loading header:', e);
        }
    }
    
    // Load Footer
    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (footerPlaceholder) {
        try {
            const footerUrl = `${rootPath}/frontend/components/footer.html`;
            console.log('Fetching footer from:', footerUrl);
            const response = await fetch(footerUrl);
            if (response.ok) {
                let html = await response.text();
                html = html.replace(/{{ROOT}}/g, rootPath);
                footerPlaceholder.innerHTML = html;
            }
        } catch (e) {
            console.error('Error loading footer:', e);
        }
    }
});

function initializeHeader() {
    console.log('Initializing header components...');

    // 1. Highlight active page
    const currentPage = document.body.getAttribute('data-page-name');
    if (currentPage) {
        // Desktop
        const desktopLink = document.querySelector(`nav a[data-page="${currentPage}"]`);
        if (desktopLink) {
            desktopLink.classList.remove('text-gray-600');
            desktopLink.classList.add('text-green-600', 'font-bold');
        }
        
        // Mobile
        const mobileLink = document.querySelector(`.mobile-nav-link[data-page="${currentPage}"]`);
        if (mobileLink) {
            mobileLink.classList.add('active');
            // Ensure icon is green
            const icon = mobileLink.querySelector('.material-icons');
            if (icon) {
                icon.classList.remove('text-gray-400');
                icon.classList.add('text-green-600');
            }
        }
    }

    // 2. Mobile Menu Logic
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            mobileMenu.classList.toggle('hidden');
        });
        
        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                mobileMenu.classList.add('hidden');
            }
        });
    }

    // 3. Profile Dropdown Logic
    const profileBtn = document.getElementById('profileBtn');
    const profileDropdown = document.getElementById('profileDropdown');
    if (profileBtn && profileDropdown) {
        profileBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            profileDropdown.classList.toggle('hidden');
        });
        document.addEventListener('click', (e) => {
            if (!profileBtn.contains(e.target) && !profileDropdown.contains(e.target)) {
                profileDropdown.classList.add('hidden');
            }
        });
    }
    
    // 4. Initialize Translations
    // We need to wait a bit to ensure translations.js is loaded
    if (window.setupLanguageDropdown) {
        window.setupLanguageDropdown();
    } else {
        // Retry after a short delay if translations.js hasn't loaded yet
        setTimeout(() => {
            if (window.setupLanguageDropdown) window.setupLanguageDropdown();
        }, 500);
    }
    
    if (window.translatePage) {
        const savedLang = localStorage.getItem('preferredLanguage') || 'en';
        window.translatePage(savedLang);
    }
}