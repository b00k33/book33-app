// Book33 service worker -- offline app-shell cache.
// Hand-edited directly in this clone (book33-app-redesign) -- there is no build step
// here. Bump CACHE_VERSION on any meaningful change so a fresh deploy evicts the old cache.
var CACHE_VERSION = "b33-20260805d";

// Precached at install so the shell is available offline from the very first launch --
// fonts aren't in this list (cross-origin, subset-dependent Noto Emoji query string,
// and cache.addAll fails the whole install if any one entry 404s); the generic fetch
// handler below caches them opportunistically the first time they're actually requested,
// which covers every real "opened it online once, now opening offline" case.
var SHELL = ["./", "./index.html", "./manifest.json", "./icon-192.png", "./icon-512.png", "./apple-touch-icon.png", "./favicon-32.png"];

self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(CACHE_VERSION).then(function (c) {
      return Promise.all(SHELL.map(function (u) { return c.add(u).catch(function () {}); }));
    }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== CACHE_VERSION; }).map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

// Notification taps (Book33Notify, 2026-08-05): focus the app if a window is already
// open — telling it which day the notification was about so it can jump there — or
// cold-open it with ?nday=<date>, which the app's boot consumes (consumeOpenParam()).
self.addEventListener("notificationclick", function (e) {
  e.notification.close();
  var data = e.notification.data || {};
  var day = typeof data.date === "string" ? data.date : "";
  e.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(function (list) {
      var c = list && list.length ? list[0] : null;
      if (c) {
        if (day) { try { c.postMessage({ type: "b33-open-day", date: day, eventId: data.eventId || null }); } catch (err) {} }
        return c.focus ? c.focus() : undefined;
      }
      return self.clients.openWindow(day ? "./?nday=" + encodeURIComponent(day) : "./");
    }).catch(function () {})
  );
});

// A hung connection (flaky wifi, captive portal) must never leave a navigation pending
// forever -- race the network against a short timer and fall back to cache either way.
function timeoutFetch(req, ms) {
  return new Promise(function (resolve, reject) {
    var t = setTimeout(function () { reject(new Error("sw-timeout")); }, ms);
    fetch(req).then(function (r) { clearTimeout(t); resolve(r); }, function (e) { clearTimeout(t); reject(e); });
  });
}

// Navigations: try the network first (always get the freshest app + data when
// online, time-boxed to 4s), fall back to the cached shell when offline or slow.
// Everything else (Google Fonts, the Supabase CDN script): cache-first once fetched,
// so a repeat offline load still has them -- opaque cross-origin responses are cached
// too (status is always 0 for those, so status===200 alone would skip them).
self.addEventListener("fetch", function (e) {
  var req = e.request;
  if (req.method !== "GET") return;
  if (req.mode === "navigate") {
    e.respondWith(
      timeoutFetch(req, 4000).then(function (res) {
        caches.open(CACHE_VERSION).then(function (c) { c.put("./", res.clone()); });
        return res;
      }).catch(function () { return caches.match(req).then(function (c) { return c || caches.match("./"); }); })
    );
    return;
  }
  e.respondWith(
    caches.match(req).then(function (cached) {
      return cached || fetch(req).then(function (res) {
        if (res && (res.status === 200 || res.type === "opaque")) {
          caches.open(CACHE_VERSION).then(function (c) { c.put(req, res.clone()); });
        }
        return res;
      }).catch(function () { return cached; });
    })
  );
});
