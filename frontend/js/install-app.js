/**
 * SmartSheti PWA Install Logic
 * Handles the 'Add to Home Screen' functionality
 */

console.log('📱 Install App script loaded');

let deferredPrompt;
const installBtnId = 'installAppBtn';
const installBtnMobileId = 'installAppBtnMobile';

// check if the app is already installed
const isAppInstalled = window.matchMedia('(display-mode: standalone)').matches;

window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault();
    // Stash the event so it can be triggered later.
    deferredPrompt = e;
    console.log('✅ PWA install prompt intercepted');
});

// Always show the install button on page load
document.addEventListener('DOMContentLoaded', () => {
    showInstallButton();
});

function showInstallButton() {
    const btnDesktop = document.getElementById(installBtnId);
    const btnMobile = document.getElementById(installBtnMobileId);

    // Hide buttons if app is already installed
    if (isAppInstalled) {
        console.log('ℹ️ App is already installed (standalone mode)');
        if (btnDesktop) btnDesktop.classList.add('hidden');
        if (btnMobile) btnMobile.classList.add('hidden');
        return;
    }

    // Always show and attach click handlers
    if (btnDesktop) {
        btnDesktop.classList.remove('hidden');
        btnDesktop.addEventListener('click', handleInstallClick);
    }

    if (btnMobile) {
        btnMobile.classList.remove('hidden');
        btnMobile.addEventListener('click', handleInstallClick);
    }

    console.log('📱 Install buttons initialized');
}

function showInstallPromotion() {
    // Legacy function - now handled by showInstallButton
    showInstallButton();
}

async function handleInstallClick(e) {
    if (!deferredPrompt) {
        // If no prompt event (e.g., iOS or manual trigger without event), show instructions
        if (isIOS()) {
            alert('To install SmartSheti on iOS:\n1. Tap the Share button\n2. Scroll down and tap "Add to Home Screen"');
        } else {
            console.log('⚠️ No install prompt available');
        }
        return;
    }

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);

    // We've used the prompt, and can't use it again, discard it
    deferredPrompt = null;

    // Hide buttons after install
    if (outcome === 'accepted') {
        hideInstallButtons();
    }
}

function hideInstallButtons() {
    const btnDesktop = document.getElementById(installBtnId);
    const btnMobile = document.getElementById(installBtnMobileId);
    if (btnDesktop) btnDesktop.classList.add('hidden');
    if (btnMobile) btnMobile.classList.add('hidden');
}

window.addEventListener('appinstalled', () => {
    // Hide the app-provided install promotion
    hideInstallButtons();
    // Clear the deferredPrompt so it can be garbage collected
    deferredPrompt = null;
    console.log('✅ PWA was installed');
});

// Helper to detect iOS
function isIOS() {
    return [
        'iPad Simulator',
        'iPhone Simulator',
        'iPod Simulator',
        'iPad',
        'iPhone',
        'iPod'
    ].includes(navigator.platform)
        // iPad on iOS 13 detection
        || (navigator.userAgent.includes("Mac") && "ontouchend" in document)
}

// Special handling for iOS which doesn't fire beforeinstallprompt
document.addEventListener('DOMContentLoaded', () => {
    if (isIOS() && !isAppInstalled) {
        // Show button for iOS users too, but it will trigger the alert instruction
        showInstallPromotion();
    }
});
