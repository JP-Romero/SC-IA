/*
 * Service Worker para Salud-Conecta IA
 * Proporciona soporte offline y cumple con los requisitos de PWA.
 */

const CACHE_NAME = "salud-conecta-v8";
const ASSETS_TO_CACHE = [
  "/",
  "/index.html",
  "/manifest.json?v=8",
  "/app-logo-v1.jpg"
];

// Evento de Instalación: Cachea los recursos esenciales
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[SW] Pre-cacheando recursos iniciales");
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  // Fuerza al SW a activarse inmediatamente
  self.skipWaiting();
});

// Evento de Activación: Limpia caches antiguas
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log("[SW] Eliminando cache antigua:", key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  // Toma control de todas las pestañas abiertas inmediatamente
  self.clients.claim();
});

// Evento Fetch: Estrategia Network-First con Fallback a Cache
self.addEventListener("fetch", (event) => {
  // Solo manejar peticiones GET de nuestro propio origen (evita problemas con APIs externas)
  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // Si la respuesta es válida, clonarla y guardarla en cache
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // Si falla la red, intentar buscar en cache
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // Si es una navegación, devolver la raíz para que el router de React maneje el offline
          if (event.request.mode === 'navigate') {
            return caches.match("/");
          }
          return new Response("No conectado a Internet", {
            status: 503,
            statusText: "Service Unavailable",
          });
        });
      })
  );
});
