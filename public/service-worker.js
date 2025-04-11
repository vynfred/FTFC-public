// Service Worker for FTFC PWA - Team Members Only

const CACHE_NAME = 'ftfc-team-cache-v1';

// Assets to cache immediately on install
const CORE_ASSETS = [
  '/offline.html',
  '/manifest.json',
  '/favicon.ico',
  '/logo192.png',
  '/logo512.png'
];

// Dashboard routes to cache on install
const DASHBOARD_ROUTES = [
  '/dashboard',
  '/dashboard/',
  '/dashboard/clients',
  '/dashboard/investors',
  '/dashboard/partners',
  '/dashboard/leads',
  '/dashboard/marketing',
  '/dashboard/analytics',
  '/dashboard/settings'
];

// Combined list of URLs to cache on install
const urlsToCache = [
  ...CORE_ASSETS,
  ...DASHBOARD_ROUTES
];

// Install a service worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Cache and return requests
self.addEventListener('fetch', event => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // Get the pathname from the URL
  const url = new URL(event.request.url);
  const pathname = url.pathname;

  // Only apply caching strategy to dashboard routes and static assets
  const isDashboardRoute = pathname.startsWith('/dashboard');
  const isStaticAsset = (
    pathname.startsWith('/static/') ||
    pathname.startsWith('/assets/') ||
    CORE_ASSETS.includes(pathname)
  );

  // If not a dashboard route or static asset, use network-only strategy
  if (!isDashboardRoute && !isStaticAsset) {
    return;
  }

  // For dashboard routes and static assets, use cache-first strategy
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // Not in cache, fetch from network
        return fetch(event.request)
          .then(response => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response
            const responseToCache = response.clone();

            // Cache the response for future use
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch(error => {
            // If the request is for a web page, show the offline page
            if (event.request.destination === 'document') {
              return caches.match('/offline.html');
            }

            // Otherwise, just log the error
            console.error('Fetch failed:', error);
            return new Response('Network error', { status: 503, statusText: 'Service Unavailable' });
          });
      })
  );
});

// Update a service worker
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
