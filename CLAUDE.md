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
- Local CSS/JS are loaded with `?v=<tag>` in `index.html`; change the tag in `index.html` **and** the matching
  `STATIC_ASSETS` entries in `sw.js` on every release (the cache is keyed by the full URL).
- Preview mode (charter rework spec B): `?preview=YYYY-MM-DD&charter=<id>` (parsed by `preview-mode.js`) replaces the
  browser clock in `calculateCurrentCharterDayState` / `getCurrentDateKey`, adds the params to `/api/charter`,
  `/api/planned-route` and `/api/track`, shows a red banner, and switches off the SW registration, the install prompt
  and idle mode. In a preview the NMEA snapshot is a stand-in (`previewSnapshot`: the position where the boat spends
  that night, `previewPosition`; no readings) and the Navigation, Weather, Vessel Info and Safety tabs are greyed out
  (`isTabOff`). The admin's Guest view tab loads it in an iframe. Without the params nothing changes.
- Preserve offline behaviour — all shell assets must be in the cache list.
- Tablet-first layout, nautical luxury visual language.

## moon-phase.js

`moon-phase.js` in this repo is a **temporary copy** — remove it after Step 3
cutover. Once Step 3 is live, moon phase data arrives via `/api/weather` as
the `moon` object and this local file is no longer needed.
