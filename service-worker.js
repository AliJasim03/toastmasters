// minimal-sw.js - A minimal service worker that avoids chrome-extension issues

const CACHE_NAME = 'dtac-cache-v1';
const STATIC_ASSETS = [
    './',
    './index.html',
    './manifest.json',
    './assets/css/main.css',
    './assets/js/main.js',
    './assets/img/logo-dtac.png',
    './assets/img/banner-min.jpg'
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

// Add this to your service-worker.js file
// Optimize cache strategy
self.addEventListener('fetch', event => {
    // Skip non-GET requests
    if (event.request.method !== 'GET') return;

    // Parse URL
    const url = new URL(event.request.url);

    // Image optimization strategy
    if (event.request.url.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
        event.respondWith(
            caches.match(event.request).then(cachedResponse => {
                // Return cached response immediately if available
                if (cachedResponse) {
                    // Fetch updated version in background for next time
                    fetch(event.request).then(response => {
                        if (response && response.status === 200) {
                            caches.open(CACHE_NAME).then(cache => {
                                cache.put(event.request, response.clone());
                            });
                        }
                    }).catch(() => {});
                    return cachedResponse;
                }

                // Otherwise fetch and cache
                return fetch(event.request).then(response => {
                    if (!response || response.status !== 200) {
                        return response;
                    }

                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, response.clone());
                    });
                    return response.clone();
                });
            })
        );
        return;
    }

    // Network-first strategy for HTML, CSS and JS
    if (url.pathname.endsWith('.html') ||
        url.pathname.endsWith('.css') ||
        url.pathname.endsWith('.js')) {
        event.respondWith(
            fetch(event.request)
                .then(response => {
                    // Cache fresh response
                    const clonedResponse = response.clone();
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, clonedResponse);
                    });
                    return response;
                })
                .catch(() => {
                    // Fall back to cache
                    return caches.match(event.request);
                })
        );
        return;
    }

    // Default cache-first strategy for other assets
    event.respondWith(
        caches.match(event.request).then(cachedResponse => {
            if (cachedResponse) {
                return cachedResponse;
            }
            return fetch(event.request).then(response => {
                if (!response || response.status !== 200) {
                    return response;
                }

                caches.open(CACHE_NAME).then(cache => {
                    cache.put(event.request, response.clone());
                });
                return response.clone();
            });
        })
    );
});