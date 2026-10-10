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
    /obs(?=[A-Z_-])/, /Obs(?=[A-Z])/, /OBS/, /\[obs\]/, /\bHls\b/, /hls_url/, /stream_key/, /stream_url/, /m3u8/,
    /navigationData/, /DEFAULT_NAVIGATION_DATA/, /charterData\.navigation/, /renderNavigationTab\(navigation\)/,
    /idleTransition/, /Bridge Notes/, /Configured vessel position/, /configured fallback/i,
    /fallback latitude and longitude/, /stream-frame/, /navigation-feed/
  ];
  for (const pattern of gone) {
    assert.equal(pattern.test(source), false, String(pattern));
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
  const html = read("index.html");
  const sw = read("sw.js");
  const tagged = [...html.matchAll(/(?:href|src)="(\/[\w.-]+\.(?:css|js))\?v=([\w.-]+)"/g)];
  assert.equal(tagged.length, 4);
  for (const [, file, tag] of tagged) {
    assert.ok(sw.includes(`"${file}?v=${tag}"`), `${file}?v=${tag} is not in sw.js`);
  }
});
