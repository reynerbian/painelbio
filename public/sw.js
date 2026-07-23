const CACHE_NAME = 'painelbio-v2';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  
  const url = new URL(event.request.url);
  
  // Se for o link de bio de um cliente (ex: /cleyvv), NÃO passa pelo ServiceWorker do App
  if (
    url.pathname !== '/' && 
    url.pathname !== '/index.html' && 
    !url.pathname.startsWith('/css') && 
    !url.pathname.startsWith('/js') && 
    !url.pathname.startsWith('/models') && 
    !url.pathname.startsWith('/api') && 
    url.pathname !== '/manifest.json' && 
    url.pathname !== '/icon.png'
  ) {
    return; // Passa direto para o Cloudflare sem passar pelo cache do PWA
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response.status === 200) {
          const resClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, resClone);
          });
        }
        return response;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});
