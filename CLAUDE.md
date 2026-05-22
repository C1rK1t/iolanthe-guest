# iolanthe-guest

Guest-facing PWA kiosk for Princess Iolanthe. Served on the guest VLAN
(10.33.4.0/24). Offline-capable via service worker.

## Architecture position

```
iolanthe-server  (serves static files + API)
        ↓
iolanthe-guest  (PWA — index.html, guest.css, guest.js)
        ↓  API calls (all relative URLs)
/api/nmea  /api/weather  /api/charter  /api/track  /api/planned-route
```

## Tabs

- Navigation — Leaflet moving map, live NMEA position/COG/SOG/depth
- Itinerary — charter stops from active charter
- Today's Menu — current day's menu from active charter
- Wine & Drinks — drinks list from active charter
- Vessel Info — vessel details and crew bios
- Weather — live weather + moon phase (dynamic, requires internet)

## Stack

- Plain HTML, CSS, JavaScript — no build step, no framework
- Leaflet for the moving map (CDN, cached by service worker)
- HLS.js vendored at `vendor/hls.min.js` for OBS screensaver feed
- `sw.js` service worker for offline shell caching

## Running locally

```bash
# In the iolanthe-server repo (step 3):
DATA_DIR=./data-local node server.js
# Then open http://localhost:8000
```

The guest app has no server of its own — it is served by iolanthe-server.

## Key constraints

- No build step. No npm. No dependencies beyond vendor files.
- Keep all API calls as relative URLs.
- Never cache /api/* routes in the service worker.
- Bump STATIC_CACHE_NAME in sw.js whenever static assets change.
- Preserve offline behaviour — all shell assets must be in the cache list.
- Tablet-first layout, nautical luxury visual language.

## moon-phase.js

`moon-phase.js` in this repo is a **temporary copy** — remove it after Step 3
cutover. Once Step 3 is live, moon phase data arrives via `/api/weather` as
the `moon` object and this local file is no longer needed.
