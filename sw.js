var SW_BASE = (function() {
    var path = self.location.pathname;
    return path.substring(0, path.lastIndexOf('/') + 1);
})();

var CACHE_NAME = 'mi-arquivos';
var SW_VERSION = 16;

self.addEventListener('install', function(e) {
  e.waitUntil(
    fetch(SW_BASE + 'version.json', { cache: 'no-cache' })
      .then(function(res) { return res.json(); })
      .then(function(data) {
        var v = data.versionCode || 6;
        CACHE_NAME = 'mi-arquivos-v' + v;
        SW_VERSION = v;
        return caches.open(CACHE_NAME).then(function(cache) {
          return cache.addAll([
            SW_BASE,
            SW_BASE + 'style.css',
            SW_BASE + 'script.js',
            SW_BASE + 'manifest.json',
            SW_BASE + 'programas/shared/i18n.js',
            SW_BASE + 'assets/icons/fontawesome.css',
            SW_BASE + 'assets/fonts/Inter.ttf',
            SW_BASE + 'assets/fonts/MaterialIcons.woff2'
          ]);
        });
      })
      .then(function() { self.skipWaiting(); })
      .catch(function() {
        CACHE_NAME = 'mi-arquivos-v6';
        SW_VERSION = 6;
        return caches.open(CACHE_NAME).then(function(cache) {
          return cache.addAll([
            SW_BASE,
            SW_BASE + 'style.css',
            SW_BASE + 'script.js',
            SW_BASE + 'manifest.json',
            SW_BASE + 'programas/shared/i18n.js',
            SW_BASE + 'assets/icons/fontawesome.css',
            SW_BASE + 'assets/fonts/Inter.ttf',
            SW_BASE + 'assets/fonts/MaterialIcons.woff2'
          ]);
        }).then(function() { self.skipWaiting(); });
      })
  );
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(key) { return key !== CACHE_NAME; })
            .map(function(key) { return caches.delete(key); })
      );
    }).then(function() { self.clients.claim(); })
  );
});

self.addEventListener('fetch', function(e) {
  var url = new URL(e.request.url);
  var isSameOrigin = url.origin === self.location.origin;
  var isGet = e.request.method === 'GET';

  if (!isGet || !isSameOrigin) {
    e.respondWith(fetch(e.request));
    return;
  }

  if (e.request.url.indexOf('version.json') !== -1) {
    e.respondWith(
      fetch(e.request, { cache: 'no-cache' })
        .catch(function() {
          return new Response(JSON.stringify({ error: 'offline' }), {
            status: 503,
            headers: { 'Content-Type': 'application/json' }
          });
        })
    );
    return;
  }

  var isHTML = e.request.mode === 'navigate' || url.pathname === SW_BASE || url.pathname === SW_BASE.slice(0, -1);
  var isAsset = url.pathname.match(/\.(css|js|json|woff2?|ttf|png|jpg|svg|ico)$/);

  if (isHTML) {
    e.respondWith(
      fetch(e.request).then(function(networkResp) {
        return caches.open(CACHE_NAME).then(function(cache) {
          cache.put(e.request, networkResp.clone());
          return networkResp;
        });
      }).catch(function() {
        return caches.match(e.request).then(function(cachedResp) {
          return cachedResp || new Response('Offline', { status: 503 });
        });
      })
    );
  } else if (isAsset) {
    var cacheKey = url.pathname + '?v=' + SW_VERSION;
    e.respondWith(
      caches.match(e.request).then(function(cached) {
        var fetchPromise = fetch(e.request).then(function(networkResp) {
          return caches.open(CACHE_NAME).then(function(cache) {
            cache.put(e.request, networkResp.clone());
            return networkResp;
          });
        });
        return cached || fetchPromise;
      }).catch(function() {
        return new Response('Offline', { status: 503 });
      })
    );
  } else {
    e.respondWith(
      fetch(e.request).then(function(networkResp) {
        return caches.open(CACHE_NAME).then(function(cache) {
          cache.put(e.request, networkResp.clone());
          return networkResp;
        });
      }).catch(function() {
        return caches.match(e.request).then(function(cachedResp) {
          return cachedResp || new Response('Offline', { status: 503 });
        });
      })
    );
  }
});

self.addEventListener('message', function(e) {
  if (e.data && e.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
