// Book33 service worker -- offline app-shell cache.
// Hand-edited directly in this clone (book33-app-redesign) -- there is no build step
// here. Bump CACHE_VERSION on any meaningful change so a fresh deploy evicts the old cache.
var CACHE_VERSION = "b33-20260816-mobile-day-approved-design";

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

// 2026-08-05 (Linh: "offline design is off"): deleting the old cache wholesale on every
// CACHE_VERSION bump also threw away the opportunistically-cached Google Fonts css/woff2
// (and the Supabase CDN script) â€” so an offline launch right after an update rendered in
// fallback system type until the next ONLINE visit re-fetched them. Cross-origin assets
// never change per app version, so migrate them into the fresh cache before the old one
// is deleted; the app shell itself still refreshes per version exactly as before.
var KEEP_XORIGIN = /^https:\/\/(fonts\.googleapis\.com|fonts\.gstatic\.com|cdn\.jsdelivr\.net)\//;
self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      // "b33-share" is the share-target's tiny hand-off stash, not an app-shell
      // version â€” never sweep it (a shared .ics could be mid-flight during an update)
      var olds = keys.filter(function (k) { return k !== CACHE_VERSION && k !== "b33-share"; });
      return caches.open(CACHE_VERSION).then(function (fresh) {
        return Promise.all(olds.map(function (name) {
          return caches.open(name).then(function (old) {
            return old.keys().then(function (reqs) {
              return Promise.all(reqs.filter(function (r) { return KEEP_XORIGIN.test(r.url); }).map(function (r) {
                return fresh.match(r).then(function (hit) {
                  if (hit) return null;
                  return old.match(r).then(function (res) { return res ? fresh.put(r, res) : null; });
                });
              }));
            });
          }).catch(function () {}).then(function () { return caches.delete(name); });
        }));
      });
    }).then(function () { return self.clients.claim(); })
  );
});

// Notification taps (Book33Notify, 2026-08-05): focus the app if a window is already
// open â€” telling it which day the notification was about so it can jump there â€” or
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

// Cloud push (2026-08-05 pt 2): the Supabase Edge Function (supabase/functions/
// b33-push) delivers the app-precomputed reminder as the push payload â€” show it
// verbatim; no storage reads needed here. notificationclick above already routes
// the tap to the right day. Chrome requires a visible notification per push
// (userVisibleOnly), so even a malformed payload shows a generic Book33 line.
self.addEventListener("push", function (e) {
  var p = {};
  try { p = e.data ? e.data.json() : {}; } catch (err) {}
  var opts = {
    body: p.body || "", data: p.data || {},
    icon: "./icon-192.png", badge: "./icon-192.png",
    silent: !!p.silent,
  };
  if (p.tag) opts.tag = p.tag;
  if (p.vibrate !== false) opts.vibrate = [200, 100, 200];
  e.waitUntil(self.registration.showNotification(p.title || "Book33", opts));
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
  // Share target (2026-08-05, Linh: "sometimes i get ical"): Android's share sheet
  // POSTs the shared .ics here (see manifest.json share_target). Stash the file text
  // in its own small cache, then bounce into the app with ?shareics=1 â€” the calendar
  // import module reads the stash on boot and opens its normal import preview.
  if (req.method === "POST" && new URL(req.url).pathname.indexOf("share-ics") !== -1) {
    e.respondWith(
      req.formData().then(function (fd) {
        var f = fd.get("ics");
        return f && f.text ? f.text() : "";
      }).then(function (text) {
        return caches.open("b33-share").then(function (c) {
          return c.put("./shared.ics", new Response(text || "", { headers: { "Content-Type": "text/calendar" } }));
        });
      }).catch(function () {}).then(function () {
        return Response.redirect("./?shareics=1", 303);
      })
    );
    return;
  }
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
      }).catch(function () {
        // offline and no exact hit: accept a query-string-variant match (Google Fonts
        // css2 URLs can differ by subset params) â€” a near-match beats fallback type
        return cached || caches.match(req, { ignoreSearch: true });
      });
    })
  );
});
