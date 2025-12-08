self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open('forex-pwa-cache').then((cache) => {
            return cache.addAll([
                '/icon-192.png',
                '/icon-512.png',
                '/',
                '/index.html',
                '/style.css',
                '/app.js',
                '/manifest.json'
            ]);
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
