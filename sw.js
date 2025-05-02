// 📖 GraceVoice Service Worker

const CACHE_NAME = "gracevoice-cache-v1";
const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/manifest.json",
  "/icon-192.png",
  "/icon-512.png"
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
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    }).catch(() => {
      return new Response("⚠️ You're offline, and the resource isn't cached.");
    })
  );
});
