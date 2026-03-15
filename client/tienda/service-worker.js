self.addEventListener("install", e => {
  e.waitUntil(
    caches.open("catalogo-cache").then(cache => {
      return cache.addAll([
        "/",
        "/index.html",
        "/catalogo.html",
        "/css/styles.css"
      ]);
    })
  );
});
