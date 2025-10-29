const CACHE_NAME = 'league-info-cache-v1';
const STATIC_ASSETS = [
  './index.html',
  './style.css',
  './app.js',
  './manifest.json'
];

// Instalação do Service Worker e cache dos arquivos estáticos
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Ativação do Service Worker e limpeza de caches antigos
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// Fetch com cache dinâmico
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Retorna do cache se disponível
      if (cachedResponse) {
        return cachedResponse;
      }

      // Se não tiver no cache, busca na rede e adiciona ao cache
      return fetch(event.request)
        .then((networkResponse) => {
          return caches.open(CACHE_NAME).then((cache) => {
            // Evita cache de requests não GET (como POST)
            if (event.request.method === 'GET') {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          });
        })
        .catch(() => {
          // Opcional: retorna um fallback offline se quiser
          // return caches.match('./offline.html');
        });
    })
  );
});
