// sw.js – GraceVoice PWA Service Worker

self.addEventListener('install', event => {
  console.log('[GraceVoice SW] Installed');
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  console.log('[GraceVoice SW] Activated');
});

self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return new Response("⚠️ You're offline. GraceVoice cannot fetch new resources.");
    })
  );
});
