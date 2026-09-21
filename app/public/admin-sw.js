// Minimal worker: it exists so the panel can be installed as an app. It never
// caches, because a stale listing screen would be worse than no app at all.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));
self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request).catch(
      () =>
        new Response(
          "<!doctype html><html lang=ar dir=rtl><meta charset=utf-8><meta name=viewport content='width=device-width,initial-scale=1'><body style=\"font-family:system-ui;background:#F2F2EF;color:#111619;display:grid;place-items:center;height:100vh;margin:0;text-align:center\"><div><p style=\"font-size:18px\">ما فيه اتصال بالإنترنت</p><p style=\"color:#6E767C;font-size:14px\">افتح الأداة مرة ثانية بعد ما يرجع الاتصال.</p></div></body></html>",
          { status: 503, headers: { "Content-Type": "text/html; charset=utf-8" } },
        ),
    ),
  );
});
