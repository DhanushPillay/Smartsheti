const CACHE_NAME = 'smartsheti-v1';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/frontend/css/Home page.css',
    '/frontend/css/mobile-improvements.css',
    '/frontend/assets/images/plant-logo.svg',
    '/frontend/js/translations.js',
    '/frontend/js/maharashtra-locations.js',
    '/frontend/js/install-app.js',
    '/frontend/js/component-loader.js',
    '/manifest.json'
];

// Install Event - Cache Assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('✅ Service Worker: Caching Files');
                return cache.addAll(ASSETS_TO_CACHE);
            })
    );
});

// Activate Event - Cleaning old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log('🧹 Service Worker: Clearing Old Cache');
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});

// Fetch Event - Network First, then Cache
self.addEventListener('fetch', (event) => {
    // Skip non-GET requests and API calls
    if (event.request.method !== 'GET' || event.request.url.includes('/api/')) {
        return;
    }

    event.respondWith(
        fetch(event.request)
            .then((res) => {
                // Make a copy/clone of the response
                const resClone = res.clone();
                // Open cache and update
                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, resClone);
                });
                return res;
            })
            .catch(() => caches.match(event.request)) // Fallback to cache if network fails
    );
});
