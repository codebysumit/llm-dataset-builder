const cacheName = "site-cache-v1";

self.addEventListener("install", installEvent => {
    console.log("Service Worker: Install");
    self.skipWaiting();
});

self.addEventListener("activate", activateEvent => {
    console.log("Service Worker: Activate");
    activateEvent.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== cacheName) {
                        console.log("Service Worker: Clearing Old Cache.");
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});

self.addEventListener("fetch", fetchEvent => {
    console.log("Service Worker: Fetching");
    fetchEvent.respondWith(
        fetch(fetchEvent.request)
            .then(res => {
                // Make copy/clone of respones
                const resClone = res.clone();
                // Open cache
                caches
                    .open(cacheName)
                    .then(cache => {
                        // Add respones to cashe
                        cache.put(fetchEvent.request, resClone);
                    });
                return res;
            })
            .catch (err => caches.match(fetchEvent.request).then(res => res))
    );
});