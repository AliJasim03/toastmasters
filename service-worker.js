const CACHE_NAME = 'dtac-2025-v1';
const urlsToCache = [
    './',
    './index.html',
    './assets/css/main.css',
    './assets/js/main.js',
    './assets/img/logo-dtac.png',
    './assets/img/banner.jpg',
    './assets/img/favicon-192.png',
    './assets/img/favicon-512.png',
    './assets/vendor/bootstrap/css/bootstrap.min.css',
    './assets/vendor/bootstrap-icons/bootstrap-icons.css',
    './assets/vendor/aos/aos.css',
    './assets/vendor/glightbox/css/glightbox.min.css',
    './assets/vendor/swiper/swiper-bundle.min.css',
    './assets/vendor/bootstrap/js/bootstrap.bundle.min.js',
    './assets/vendor/aos/aos.js',
    './assets/vendor/glightbox/js/glightbox.min.js',
    './assets/vendor/swiper/swiper-bundle.min.js',
    './assets/img/venue-gallery/crowne-plaza-2.png',
    './assets/img/venue-gallery/crowne-plaza-3.png',
    './assets/img/venue-gallery/crowne-plaza-4.png',
    './assets/img/venue-gallery/crowne-plaza-8.png',
    './manifest.json',
    './contest-roles.html',
    './join-our-teams.html',
    './registration.html',
    './speaker-details.html',
    './starter-page.html',
    './assets/fonts/Tajawal-Regular.ttf',
    './assets/fonts/Tajawal-Medium.ttf',
    './assets/fonts/Tajawal-Bold.ttf',
    './assets/vendor/bootstrap-icons/fonts/bootstrap-icons.woff',
    './assets/vendor/bootstrap-icons/fonts/bootstrap-icons.woff2'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache).catch(error => {
                    console.error('Failed to cache resources:', error);
                    throw error;
                });
            })
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                if (response) {
                    return response;
                }
                return fetch(event.request).then(
                    (response) => {
                        if (!response || response.status !== 200) {
                            console.log('Fetch failed:', response);
                            return response;
                        }

                        const responseToCache = response.clone();

                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(event.request, responseToCache);
                            })
                            .catch(error => {
                                console.error('Failed to cache response:', error);
                            });

                        return response;
                    }
                ).catch(error => {
                    console.error('Fetch failed:', error);
                    throw error;
                });
            })
    );
});