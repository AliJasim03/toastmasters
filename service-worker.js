// minimal-sw.js - A minimal service worker that avoids chrome-extension issues

const CACHE_NAME = 'dtac-cache-v1';
const STATIC_ASSETS = [
    './',
    './index.html',
    './manifest.json',
    './assets/css/main.css',
    './assets/js/main.js',
    './assets/img/logo-dtac.png',
    './assets/img/banner.jpg'
];

// Install event - cache basic assets
self.addEventListener('install', event => {
    self.skipWaiting(); // Activate immediately

    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log('Caching static assets');
            return cache.addAll(STATIC_ASSETS);
        })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.filter(cacheName => {
                    return cacheName !== CACHE_NAME;
                }).map(cacheName => {
                    return caches.delete(cacheName);
                })
            );
        })
    );
});

// Fetch event - serve from cache if available
self.addEventListener('fetch', event => {
    // Skip non-HTTP/HTTPS requests completely
    if (!event.request.url.startsWith('http')) {
        return;
    }

    // Skip non-GET requests
    if (event.request.method !== 'GET') {
        return;
    }

    // Skip cross-origin requests
    const url = new URL(event.request.url);
    if (url.origin !== self.location.origin) {
        return;
    }

    // Use cache-first strategy for same-origin GET requests
    event.respondWith(
        caches.match(event.request).then(response => {
            if (response) {
                return response;
            }

            // If not in cache, fetch from network
            return fetch(event.request).then(response => {
                // Don't cache if response is not valid
                if (!response || response.status !== 200 || response.type !== 'basic') {
                    return response;
                }

                // Clone the response for caching
                const responseToCache = response.clone();

                caches.open(CACHE_NAME).then(cache => {
                    cache.put(event.request, responseToCache);
                });

                return response;
            });
        })
    );
});