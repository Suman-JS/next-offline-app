// const CACHE_NAME = "my-site-cache-v1";
// const OFFLINE_URL = "/offline.html";

// self.addEventListener("install", (event) => {
//   event.waitUntil(
//     caches
//       .open(CACHE_NAME)
//       .then((cache) => cache.add(OFFLINE_URL))
//       .then(() => self.skipWaiting())
//   );
// });

// self.addEventListener("activate", (event) => {
//   event.waitUntil(self.clients.claim());
// });

// self.addEventListener("fetch", (event) => {
//   if (
//     event.request.mode === "navigate" ||
//     (event.request.method === "GET" &&
//       event.request.headers.get("accept").includes("text/html"))
//   ) {
//     event.respondWith(
//       fetch(event.request).catch(() => {
//         return caches.match(OFFLINE_URL);
//       })
//     );
//   } else {
//     event.respondWith(
//       caches.match(event.request).then((response) => {
//         return response || fetch(event.request);
//       })
//     );
//   }
// });

const CACHE_NAME = "my-site-cache-v1";
const OFFLINE_URL = "/offline.html";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.add(OFFLINE_URL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  if (
    event.request.mode === "navigate" ||
    (event.request.method === "GET" &&
      event.request.headers.get("accept").includes("text/html"))
  ) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
          return response;
        })
        .catch(() => {
          return caches.match(event.request).then((response) => {
            if (response) {
              return response;
            }
            return caches.match(OFFLINE_URL);
          });
        })
    );
  } else {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return (
          response ||
          fetch(event.request).then((response) => {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
            return response;
          })
        );
      })
    );
  }
});

// Listen for online/offline events and notify the client
self.addEventListener("online", () => {
  self.clients.matchAll().then((clients) => {
    clients.forEach((client) => client.postMessage({ type: "ONLINE" }));
  });
});

self.addEventListener("offline", () => {
  self.clients.matchAll().then((clients) => {
    clients.forEach((client) => client.postMessage({ type: "OFFLINE" }));
  });
});
