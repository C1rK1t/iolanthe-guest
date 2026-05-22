const STATIC_CACHE_NAME = "iolanthe-onboard-static-v2";
const LEAFLET_ASSET_CACHE_NAME = "iolanthe-onboard-leaflet-v1";

const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/guest.css",
  "/guest.js",
  "/manifest.json",
  "/manifest.webmanifest",
  "/vendor/hls.min.js",
  "/images/shoulder-patch.svg",
  "/images/chest-logo-wide.png",
  "/images/icon-route.png",
  "/images/vessel-line-art.png",
  "/images/nautical_watermark_dark.png",
  "/images/nautical-watermark.png",
  "/assets/icons/onboard/favicon.svg",
  "/assets/icons/onboard/favicon.ico",
  "/assets/icons/onboard/favicon-96x96.png",
  "/assets/icons/onboard/apple-touch-icon.png",
  "/assets/icons/onboard/web-app-manifest-192x192.png",
  "/assets/icons/onboard/web-app-manifest-512x512.png",
  "/assets/moon-phases/new-moon-000.png",
  "/assets/moon-phases/waxing-cres-125.png",
  "/assets/moon-phases/first-quarter-250.png",
  "/assets/moon-phases/waxing-gib-375.png",
  "/assets/moon-phases/full-moon-500.png",
  "/assets/moon-phases/waning-gib-625.png",
  "/assets/moon-phases/last-quarter-750.png",
  "/assets/moon-phases/waning-cres-875.png"
];

const STATIC_ASSET_PATHS = new Set(STATIC_ASSETS);
const LEAFLET_ASSET_HOSTS = new Set(["unpkg.com"]);
const CACHEABLE_STATIC_EXTENSIONS = new Set([
  ".css",
  ".ico",
  ".js",
  ".jpg",
  ".jpeg",
  ".png",
  ".svg",
  ".webmanifest",
  ".webp"
]);

self.addEventListener("install", event => {
  event.waitUntil(precacheStaticAssets());
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys
        .filter(key => ![STATIC_CACHE_NAME, LEAFLET_ASSET_CACHE_NAME].includes(key))
        .map(key => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") {
    return;
  }

  if (event.request.headers.has("range")) {
    event.respondWith(fetch(event.request));
    return;
  }

  const url = new URL(event.request.url);

  if (url.origin !== self.location.origin) {
    if (isLeafletAssetRequest(url)) {
      event.respondWith(cacheFirstNamed(LEAFLET_ASSET_CACHE_NAME, event.request, 8));
    }
    return;
  }

  if (isAdminRequest(url) || isLiveDataRequest(url)) {
    event.respondWith(networkOnly(event.request));
    return;
  }

  if (isGuestShellRequest(url)) {
    event.respondWith(networkFirst(event.request));
    return;
  }

  if (isStaticShellAsset(url)) {
    event.respondWith(cacheFirst(event.request));
    return;
  }

  event.respondWith(fetch(event.request));
});

async function precacheStaticAssets() {
  const cache = await caches.open(STATIC_CACHE_NAME);
  await Promise.all(STATIC_ASSETS.map(async asset => {
    try {
      const response = await fetch(asset, { cache: "reload" });
      if (isCacheableResponse(response)) {
        await cache.put(asset, response.clone());
      }
    } catch (error) {
      // A missing optional shell asset should not prevent installation.
    }
  }));
}

function isAdminRequest(url) {
  return url.pathname === "/admin"
    || url.pathname.startsWith("/admin/")
    || url.pathname.startsWith("/assets/icons/admin/");
}

function isLiveDataRequest(url) {
  const path = url.pathname.toLowerCase();
  return path.startsWith("/api/")
    || path.startsWith("/data/")
    || path.endsWith(".json") && path !== "/manifest.json";
}

function isGuestShellRequest(url) {
  return url.pathname === "/" || url.pathname === "/index.html";
}

function isStaticShellAsset(url) {
  if (STATIC_ASSET_PATHS.has(url.pathname)) {
    return true;
  }

  const extension = url.pathname.toLowerCase().match(/\.[a-z0-9]+$/);
  return !!(extension && CACHEABLE_STATIC_EXTENSIONS.has(extension[0]));
}

function isLeafletAssetRequest(url) {
  return LEAFLET_ASSET_HOSTS.has(url.hostname)
    && url.pathname.includes("/leaflet@1.9.4/")
    && (url.pathname.endsWith(".js") || url.pathname.endsWith(".css"));
}

function isCacheableResponse(response) {
  return !!(response && (response.ok || response.type === "opaque"));
}

async function networkOnly(request) {
  return fetch(request, { cache: "no-store" });
}

async function networkFirst(request) {
  const cache = await caches.open(STATIC_CACHE_NAME);

  try {
    const response = await fetch(request, { cache: "no-store" });
    if (isCacheableResponse(response)) {
      await cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cached = await cache.match(request);
    if (cached) {
      return cached;
    }
    throw error;
  }
}

async function cacheFirst(request) {
  const cache = await caches.open(STATIC_CACHE_NAME);
  const cached = await cache.match(request);
  if (cached) {
    return cached;
  }

  const response = await fetch(request);
  if (isCacheableResponse(response)) {
    await cache.put(request, response.clone());
  }
  return response;
}

async function cacheFirstNamed(cacheName, request, maxEntries) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) {
    return cached;
  }

  const response = await fetch(request);
  if (isCacheableResponse(response)) {
    await cache.put(request, response.clone());
    await trimCache(cacheName, maxEntries);
  }
  return response;
}

async function trimCache(cacheName, maxEntries) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  if (keys.length <= maxEntries) {
    return;
  }

  const surplus = keys.length - maxEntries;
  await Promise.all(keys.slice(0, surplus).map(key => cache.delete(key)));
}
