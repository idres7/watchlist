// Service Worker — يخزّن صفحة التطبيق عشان تفتح بدون إنترنت
// بياناتك (الأعمال، الصور، التقييمات) تبقى محفوظة بـ localStorage بالمتصفح دائماً
// بغض النظر عن هذا الملف — هذا الملف بس يخزّن "الهيكل" مال التطبيق

const CACHE_NAME = 'watchlist-cache-v1';
const APP_SHELL = [
  './',
  './watchlist_final.html'
];

// عند التثبيت: خزّن نسخة من صفحة التطبيق
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(APP_SHELL).catch(() => {});
    })
  );
});

// عند التفعيل: احذف أي نسخ قديمة من الكاش
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// عند أي طلب: جرب الشبكة أول، ولو ما وصلت رجّع النسخة المخزنة (بدون إنترنت)
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        return response;
      })
      .catch(() => {
        return caches.match(event.request).then((cached) => {
          if (cached) return cached;
          return caches.match('./watchlist_final.html');
        });
      })
  );
});
