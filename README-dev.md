# README-dev — iolanthe-guest

Developer notes for maintaining the Princess Iolanthe guest portal frontend.

## Purpose

Static, offline-friendly PWA served over the guest VLAN. No build step, no
framework, no package manager. Styles in `guest.css`, client-side logic in
`guest.js`, HTML shell in `index.html`.

That simplicity is a feature. Keep changes easy for crew to deploy from a
lightweight local web server.

## Local Run

The guest app has no server of its own — it is served by `iolanthe-server`.

```powershell
# In the iolanthe-server repo:
$env:DATA_DIR="$PWD\data-local"; $env:GUEST_STATIC_DIR="$PWD\..\iolanthe-guest"; node server.js
```

Then open `http://localhost:8000`.

## Project Layout

```
iolanthe-guest/
  index.html              HTML shell — no inline CSS or JS
  guest.css               All styles (extracted from monorepo index.html)
  guest.js                All client-side JavaScript (extracted from monorepo)
  sw.js                   Service worker for offline shell caching
  manifest.json
  manifest.webmanifest
  moon-phase.js           TEMPORARY COPY — remove after Step 3 cutover
  vendor/
    hls.min.js            Vendored HLS player for OBS screensaver feed
  assets/
    icons/onboard/        Guest PWA favicons and home-screen icons
    moon-phases/          Moon phase images
  images/                 Vessel branding, site photos, plans
  plans/                  Safety PDFs
```

## Tab Structure

| Tab id | Label | Data source |
|--------|-------|-------------|
| `navigation` | Navigation | `/api/nmea`, `/api/track`, `/api/planned-route` |
| `itinerary` | Itinerary | `/api/charter` |
| `menu` | Today's Menu | `/api/charter` |
| `drinks` | Wine & Drinks | `/api/charter` |
| `vessel` | Vessel Info | `/api/charter` |
| `weather` | Weather | `/api/weather` |
| `safety` | Safety | `/api/charter` |

All fetch calls use relative URLs — they resolve correctly whether the app is
served from `localhost:8000` or the vessel IP.

## Service Worker

`sw.js` caches the static shell so the app loads offline after the first visit.

Rules:
- Bump `STATIC_CACHE_NAME` in `sw.js` any time static assets change. The
  version string forces a cache refresh on next load.
- Never add `/api/*` routes to the cache list — charter, weather, and
  telemetry data must always come from the network.
- All files listed in `STATIC_ASSETS` must physically exist in the repo.

Current version: `iolanthe-onboard-static-v2`

## Guest PWA and QR Install

Guests scan a QR code that opens the onboard guest URL:

```
http://iolanthe.local/
```

If local DNS is unavailable, use the vessel network IP instead. Do not
generate QR codes in application code — keep that out of band.

## Quick Verification Checklist

After any change:

1. All six main tabs render without console errors.
2. `/api/nmea` telemetry updates the header position strip.
3. Leaflet map loads and shows the vessel marker.
4. Service worker installs and the app shell loads offline after first visit.
5. OBS HLS screensaver activates after idle timeout.
6. No 404s for CSS, JS, or image assets.

## Working with Codex / Claude

- `CLAUDE.md` in this repo has architecture context for AI-assisted editing.
- Changes to `guest.css` and `guest.js` are self-contained — no build step.
- When adding or renaming static files, update the `STATIC_ASSETS` list in
  `sw.js` and bump `STATIC_CACHE_NAME`.
