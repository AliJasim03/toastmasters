// service-worker.js
const CACHE_NAME = 'dtac-2025-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/assets/css/main.css',
  '/assets/js/main.js',
  '/assets/img/logo-dtac.png',
  '/assets/img/banner.jpg',
  '/assets/img/favicon.png',
  '/assets/vendor/bootstrap/css/bootstrap.min.css',
  '/assets/vendor/bootstrap-icons/bootstrap-icons.css',
  '/assets/vendor/aos/aos.css',
  '/assets/vendor/glightbox/css/glightbox.min.css',
  '/assets/vendor/swiper/swiper-bundle.min.css',
  '/assets/vendor/bootstrap/js/bootstrap.bundle.min.js',
  '/assets/vendor/aos/aos.js',
  '/assets/vendor/glightbox/js/glightbox.min.js',
  '/assets/vendor/swiper/swiper-bundle.min.js',
  // Add paths to venue gallery images
  '/assets/img/venue-gallery/crowne-plaza-2.png',
  '/assets/img/venue-gallery/crowne-plaza-3.png',
  '/assets/img/venue-gallery/crowne-plaza-4.png',
  '/assets/img/venue-gallery/crowne-plaza-8.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request).then(
          (response) => {
            // Check if we received a valid response
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
  );
});

// Clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
