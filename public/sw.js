// 📖 GraceVoice Service Worker (Enhanced Security and Performance)

const CACHE_NAME = "gracevoice-cache-v2";
const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/manifest.json",
  "/icon-192.png",
  "/icon-512.png",
  "/offline.html" // Add a dedicated offline page
];

// ✅ Install: Pre-cache static assets
self.addEventListener("install", (event) => {
  console.log("[GraceVoice SW] Installing...");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[GraceVoice SW] Caching shell files...");
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// 🔁 Activate: Clear outdated caches
self.addEventListener("activate", (event) => {
  console.log("[GraceVoice SW] Activating...");
  event.waitUntil(
    caches.keys().then((keyList) =>
      Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            console.log("[GraceVoice SW] Removing old cache:", key);
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// 🌐 Fetch: Serve cached resources when offline
self.addEventListener("fetch", (event) => {
  // Only handle GET requests
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Return cached response if available
      if (cachedResponse) {
        console.log("[GraceVoice SW] Serving cached:", event.request.url);
        return cachedResponse;
      }

      // Try to fetch from network, fallback to offline page
      return fetch(event.request)
        .then((networkResponse) => {
          // Cache the fetched response dynamically
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse.clone());
            console.log("[GraceVoice SW] Cached new resource:", event.request.url);
            return networkResponse;
          });
        })
        .catch(() => {
          // If offline, return the offline page (if it exists)
          return caches.match("/offline.html");
        });
    })
  );
});
