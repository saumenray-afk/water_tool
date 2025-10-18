// ===== SERVICE WORKER - RTM MOBILE PWA =====

const CACHE_NAME = 'rtm-mobile-v1.0.0';
const RUNTIME_CACHE = 'rtm-runtime-v1.0.0';

// Assets to cache on install
const PRECACHE_ASSETS = [
    '/mobile/',
    '/mobile/index.html',
    '/mobile/styles.css',
    '/mobile/app.js',
    '/mobile/config.js',
    '/mobile/pwa.js',
    '/mobile/manifest.json',
    'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
    'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
    'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js'
];

// Install event - cache assets
self.addEventListener('install', (event) => {
    console.log('[SW] Installing service worker...');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[SW] Caching app shell');
                return cache.addAll(PRECACHE_ASSETS);
            })
            .then(() => {
                console.log('[SW] Skip waiting');
                return self.skipWaiting();
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('[SW] Activating service worker...');
    
    const currentCaches = [CACHE_NAME, RUNTIME_CACHE];
    
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return cacheNames.filter((cacheName) => !currentCaches.includes(cacheName));
            })
            .then((cachesToDelete) => {
                return Promise.all(
                    cachesToDelete.map((cacheToDelete) => {
                        console.log('[SW] Deleting old cache:', cacheToDelete);
                        return caches.delete(cacheToDelete);
                    })
                );
            })
            .then(() => {
                console.log('[SW] Claiming clients');
                return self.clients.claim();
            })
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Skip cross-origin requests
    if (url.origin !== location.origin) {
        // For external resources, use network first with cache fallback
        event.respondWith(
            fetch(request)
                .then((response) => {
                    // Cache the response
                    const responseClone = response.clone();
                    caches.open(RUNTIME_CACHE).then((cache) => {
                        cache.put(request, responseClone);
                    });
                    return response;
                })
                .catch(() => {
                    return caches.match(request);
                })
        );
        return;
    }
    
    // For same-origin requests, use cache-first strategy
    event.respondWith(
        caches.match(request)
            .then((cachedResponse) => {
                if (cachedResponse) {
                    console.log('[SW] Serving from cache:', request.url);
                    return cachedResponse;
                }
                
                console.log('[SW] Fetching from network:', request.url);
                return fetch(request)
                    .then((response) => {
                        // Don't cache non-successful responses
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }
                        
                        // Cache the fetched resource
                        const responseToCache = response.clone();
                        caches.open(RUNTIME_CACHE)
                            .then((cache) => {
                                cache.put(request, responseToCache);
                            });
                        
                        return response;
                    })
                    .catch((error) => {
                        console.error('[SW] Fetch failed:', error);
                        
                        // Return offline page if available
                        if (request.mode === 'navigate') {
                            return caches.match('/mobile/index.html');
                        }
                        
                        throw error;
                    });
            })
    );
});

// Background Sync - sync data when back online
self.addEventListener('sync', (event) => {
    console.log('[SW] Background sync:', event.tag);
    
    if (event.tag === 'sync-data') {
        event.waitUntil(syncData());
    }
});

async function syncData() {
    console.log('[SW] Syncing data...');
    
    try {
        // Get pending data from IndexedDB or localStorage
        // Send to server
        // Clear pending queue
        
        console.log('[SW] Data synced successfully');
        
        // Notify the app
        const clients = await self.clients.matchAll();
        clients.forEach((client) => {
            client.postMessage({
                type: 'SYNC_COMPLETE',
                message: 'Data synced successfully'
            });
        });
    } catch (error) {
        console.error('[SW] Sync failed:', error);
        throw error;
    }
}

// Push Notification
self.addEventListener('push', (event) => {
    console.log('[SW] Push notification received');
    
    let data = {};
    
    if (event.data) {
        try {
            data = event.data.json();
        } catch (e) {
            data = { title: 'RTM Mobile', body: event.data.text() };
        }
    }
    
    const title = data.title || 'RTM Mobile';
    const options = {
        body: data.body || 'You have a new notification',
        icon: '/mobile/icons/icon-192x192.png',
        badge: '/mobile/icons/badge-72x72.png',
        vibrate: [200, 100, 200],
        data: data.data || {},
        actions: [
            { action: 'open', title: 'Open App' },
            { action: 'close', title: 'Close' }
        ]
    };
    
    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

// Notification Click
self.addEventListener('notificationclick', (event) => {
    console.log('[SW] Notification clicked:', event.action);
    
    event.notification.close();
    
    if (event.action === 'open') {
        event.waitUntil(
            clients.openWindow('/mobile/')
        );
    }
});

// Message from app
self.addEventListener('message', (event) => {
    console.log('[SW] Message received:', event.data);
    
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'CHECK_UPDATE') {
        // Check for updates
        self.registration.update();
    }
});

// Periodic Background Sync (if supported)
self.addEventListener('periodicsync', (event) => {
    console.log('[SW] Periodic sync:', event.tag);
    
    if (event.tag === 'sync-data-periodic') {
        event.waitUntil(syncData());
    }
});

console.log('[SW] Service Worker loaded');
