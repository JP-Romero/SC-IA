const CACHE_NAME = "salud-conecta-v3";
const ASSETS_TO_CACHE = [
  "/",
  "/index.html",
  "/manifest.json"
];

// Install Event
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[PWA SW] Pre-caching offline support resources");
      return cache.addAll(ASSETS_TO_CACHE).catch((err) => {
        console.warn("[PWA SW] Pre-cache warning: Some resources could not be cached on install", err);
      });
    })
  );
  self.skipWaiting();
});

// Activate Event
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log("[PWA SW] Removing old cache:", key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Event (Offline Fallback)
self.addEventListener("fetch", (event) => {
  // Only handle GET requests and skip API requests
  if (event.request.method !== "GET" || event.request.url.includes("/api/")) {
    return;
  }

<<<<<<< HEAD
  const isNavigation = event.request.mode === 'navigate' || event.request.headers.get('accept')?.includes('text/html');

  if (isNavigation) {
    // NETWORK-FIRST: Para el HTML (Evita cargar un HTML viejo con hashes JS/CSS muertos)
    event.respondWith(
      fetch(event.request).then((networkResponse) => {
        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
=======
  // Estrategia Network-First para la navegación (HTML principal)
  // Esto evita que se cargue un index.html viejo con hashes de JS/CSS inexistentes
  if (event.request.mode === 'navigate') {
    event.respondWith(networkFirst(event.request));
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then((networkResponse) => {
        // Cache newly requested resources dynamically if they are HTML/CSS/JS
        const isSafeToCache = event.request.url.startsWith(self.location.origin);
        if (isSafeToCache && networkResponse.status === 200) {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        }
        return networkResponse;
>>>>>>> 5317ca9cd2567012894ab44f944b4bffd39d2da1
      }).catch(() => {
        // Fallback offline si no hay internet
        return caches.match(event.request).then((cachedResponse) => {
          return cachedResponse || caches.match("/");
        });
      })
    );
  } else {
    // CACHE-FIRST: Para assets estáticos (JS, CSS, Imágenes)
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(event.request).then((networkResponse) => {
          const isSafeToCache = event.request.url.startsWith(self.location.origin);
          if (isSafeToCache && networkResponse.status === 200) {
            return caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, networkResponse.clone());
              return networkResponse;
            });
          }
          return networkResponse;
        }).catch(() => {
          return new Response('', { status: 404, statusText: 'Not Found' });
        });
      })
    );
  }
});

async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (err) {
    return caches.match(request) || caches.match("/");
  }
}
