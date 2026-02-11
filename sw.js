const CACHE_NAME = "fubc-band-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/logo.png",
  "/manifest.json",
  "https://cdn.tailwindcss.com", // Cache the styling
  "https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap"
];

// 1. Install: Cache core assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// 2. Fetch: Network First, Fallback to Cache (Ensures users get the latest setlist)
self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // If successful, clone and cache it for next time
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        return response;
      })
      .catch(() => {
        // If offline, try to find it in the cache
        return caches.match(event.request);
      })
  );
});
