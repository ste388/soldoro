// Service Worker per PWA Soldoro
const CACHE_NAME = 'Soldoro-Dungeon72Celle'; // Incrementato il nome della cache per forzare l'aggiornamento
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192x192.png',
  './icons/icon-512x512.png',
  './icons/maskable-icon-512x512.png'
];

// Installa e Cache
self.addEventListener('install', event => {
  // L'installazione è un evento critico, aspettiamo che la cache sia popolata
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache, adding critical resources.');
        return cache.addAll(urlsToCache);
      })
      .catch(error => {
          console.error('Failed to cache critical resources during install:', error);
          // Non possiamo far fallire l'installazione PWA qui, ma lo logghiamo
      })
  );
  self.skipWaiting(); // Forza l'attivazione immediata
});

// Fetch (strategia cache-first per i file statici)
self.addEventListener('fetch', event => {
  // Ignora le richieste non-GET (es. POST)
  if (event.request.method !== 'GET') {
    return;
  }
  
  // Cerchiamo nella cache per primi
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Se troviamo una risposta in cache, la usiamo
        if (response) {
          return response;
        }
        // Altrimenti, andiamo alla rete
        return fetch(event.request);
      })
  );
});

// Attiva (cleanup vecchie cache)
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );

});

