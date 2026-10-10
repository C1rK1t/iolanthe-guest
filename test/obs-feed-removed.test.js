"use strict";

// The OBS feed is gone (2026-10-10; iolanthe-server docs/superpowers/specs/2026-10-10-remove-obs-feed-design.md): no
// player on the Navigation tab, no feed in the idle screen, no hls.min.js, nothing read from navigation.json.
// guest.js is not a module, so these read the shipped files.

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.join(__dirname, "..");
const read = name => fs.readFileSync(path.join(ROOT, name), "utf8");

test("hls.min.js is gone: no file, no script tag, no precache entry", () => {
  assert.equal(fs.existsSync(path.join(ROOT, "vendor", "hls.min.js")), false);
  assert.equal(read("index.html").includes("hls.min.js"), false);
  assert.equal(read("sw.js").includes("hls.min.js"), false);
});

test("index.html has no idle feed and no fade overlay", () => {
  const html = read("index.html");
  for (const id of ["idleObsFeed", "idleObsFeedBody", "idleTransition"]) {
    assert.equal(html.includes(`id="${id}"`), false, id);
  }
});

// guest.js also reads nmeaState.data.navigation, the live NMEA readings (COG, SOG, heading), which stay: the charter
// payload's navigation block is named exactly.
test("guest.js has no OBS feed code and reads nothing from navigation.json", () => {
  const source = read("guest.js");
  const gone = [
    /(?<![A-Za-z])obs(?=[A-Z_-])/, /Obs(?=[A-Z])/, /(?<![A-Za-z])OBS(?![A-Za-z])/, /\[obs\]/, /hls/i, /stream_key/,
    /stream_url/, /m3u8/, /navigationData/, /DEFAULT_NAVIGATION_DATA/, /charterData\.navigation/,
    /renderNavigationTab\(navigation\)/, /idleTransition/, /Bridge Notes/, /Configured vessel position/,
    /configured fallback/i, /fallback latitude and longitude/, /stream-frame/, /navigation-feed/
  ];
  for (const pattern of gone) {
    assert.equal(pattern.test(source), false, String(pattern));
  }
});

// The helpers that served only the feed, its full-screen shell and the idle fade: a call left behind would throw when
// the idle screen or the Navigation tab opens.
test("guest.js keeps none of the feed's helpers", () => {
  const source = read("guest.js");
  for (const name of [
    "resumeIdleVisualCycle", "finishIdlePhaseTransition", "runIdlePhaseTransition", "clearIdleTransitionTimers",
    "destroyEmbeddedMedia", "cleanupNavigationVideo", "wrapNavigationFeed", "bindNavigationFeedFullscreen",
    "getConfiguredWeatherCoords", "getDocumentFullscreenElement", "requestElementFullscreen", "exitActiveFullscreen",
    "isBrowserEmbeddableUrl", "setNavigationStreamStatus", "buildNavigationMedia", "canShowIdleObsFeed"
  ]) {
    assert.equal(new RegExp(`\\b${name}\\b`).test(source), false, name);
  }
});

test("guest.css has no feed or fade styles, and keeps .empty-stream for the Weather tab", () => {
  const css = read("guest.css");
  for (const text of [
    ".stream-frame", ".navigation-feed-shell", ".navigation-feed-status", ".idle-obs-feed", ".obs-feed-active",
    ".idle-transition", "idleTransitionFade", "idleTransitionArt", "--idle-obs-"
  ]) {
    assert.equal(css.includes(text), false, text);
  }
  assert.ok(css.includes(".empty-stream {"));
  assert.match(read("guest.js"), /class: "empty-stream weather-empty"/);
});

test("index.html and sw.js load the same ?v= tag for every local CSS and JS file", () => {
  const tagged = text => [...text.matchAll(/"(\/[\w.-]+\.(?:css|js))\?v=([\w.-]+)"/g)].map(([, file, tag]) => `${file}?v=${tag}`).sort();
  const inHtml = tagged(read("index.html"));
  assert.ok(inHtml.length > 0);
  assert.deepEqual(tagged(read("sw.js")), inHtml);
});

// The service worker skips a precache entry it cannot fetch without a word (sw.js precacheStaticAssets), so a file
// deleted with its entry left behind would go unnoticed.
test("every file sw.js precaches is in the repo", () => {
  const sw = read("sw.js");
  const start = sw.indexOf("const STATIC_ASSETS = [");
  const assets = [...sw.slice(start, sw.indexOf("];", start)).matchAll(/"([^"]+)"/g)]
    .map(([, asset]) => asset.split("?")[0])
    .filter(asset => asset !== "/");
  assert.ok(assets.length > 10);
  for (const asset of assets) {
    assert.ok(fs.existsSync(path.join(ROOT, asset)), asset);
  }
});
