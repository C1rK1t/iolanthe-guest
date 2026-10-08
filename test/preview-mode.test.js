"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const pm = require("../preview-mode.js");

test("parsePreview: a real date turns preview on; the charter id is validated", () => {
  assert.deepEqual(pm.parsePreview("?preview=2026-11-03&charter=csaba"), { active: true, date: "2026-11-03", charterId: "csaba" });
  assert.deepEqual(pm.parsePreview("?preview=2026-11-03"), { active: true, date: "2026-11-03", charterId: "" });
  assert.deepEqual(pm.parsePreview("?preview=2026-11-03&charter=Bad--id"), { active: true, date: "2026-11-03", charterId: "" });
  assert.deepEqual(pm.parsePreview("?charter=csaba"), { active: false, date: "", charterId: "" });
  assert.deepEqual(pm.parsePreview("?preview=2026-02-30"), { active: false, date: "", charterId: "" });
  assert.deepEqual(pm.parsePreview(""), { active: false, date: "", charterId: "" });
  assert.deepEqual(pm.parsePreview(undefined), { active: false, date: "", charterId: "" });
});

test("validCharterId: the server's validateAdminCharterId rule", () => {
  assert.equal(pm.validCharterId(" Csaba "), "csaba");
  assert.equal(pm.validCharterId("e2e-csaba-copy"), "e2e-csaba-copy");
  assert.equal(pm.validCharterId("a--b"), "");
  assert.equal(pm.validCharterId("-abc"), "");
  assert.equal(pm.validCharterId("a".repeat(64)), "");
  assert.equal(pm.validCharterId(null), "");
});

test("withPreviewParams: appends charter and preview, respecting an existing query", () => {
  const p = { active: true, date: "2026-11-03", charterId: "csaba" };
  assert.equal(pm.withPreviewParams("/api/charter", p), "/api/charter?charter=csaba&preview=2026-11-03");
  assert.equal(pm.withPreviewParams("/api/track?x=1", p), "/api/track?x=1&charter=csaba&preview=2026-11-03");
  assert.equal(pm.withPreviewParams("/api/track", { ...p, charterId: "" }), "/api/track?preview=2026-11-03");
  assert.equal(pm.withPreviewParams("/api/charter", { active: false, date: "", charterId: "" }), "/api/charter");
  assert.equal(pm.withPreviewParams("/api/charter", null), "/api/charter");
});

test("bannerText: the date, or the problem", () => {
  const p = { active: true, date: "2026-11-03", charterId: "csaba" };
  assert.equal(pm.bannerText(p), "PREVIEW · TUE 3 NOV");
  assert.equal(pm.bannerText({ ...p, date: "2026-12-31" }), "PREVIEW · THU 31 DEC");
  assert.equal(pm.bannerText(p, 401), "PREVIEW · LOG IN TO THE ADMIN AGAIN");
  assert.equal(pm.bannerText(p, 404), "PREVIEW · CHARTER NOT FOUND");
  assert.equal(pm.bannerText(p, 500), "PREVIEW · TUE 3 NOV");
  assert.equal(pm.bannerText({ active: false, date: "", charterId: "" }), "");
});

// ---- preview position and tabs (spec B follow-up, David 2026-10-08) ----
const S = (name, lat, lon, extra) => ({ name, latitude: lat, longitude: lon, stop: true, ...(extra || {}) });
const W = (lat, lon) => ({ latitude: lat, longitude: lon });
// Cebu (sails day 1) -> Oslob (1 night) -> Apo (2 nights, departs day 4) -> two waypoints at sea -> Tubbataha (arrives day 6).
const route = [
  S("Cebu", 10, 124, { depart: { day: 1 } }),
  S("Oslob", 9.5, 123.4, { arrive: { day: 1 }, depart: { day: 2 } }),
  S("Apo", 9.0, 123.2, { arrive: { day: 2 }, depart: { day: 4 } }),
  W(9.0, 122.2),
  W(9.0, 121.2),
  S("Tubbataha", 9.0, 120.2, { arrive: { day: 6 } })
];

test("previewDayNumber: 0 before boarding, n on day n, NaN without a start date", () => {
  assert.equal(pm.previewDayNumber("2026-11-01", "2026-10-31"), 0);
  assert.equal(pm.previewDayNumber("2026-11-01", "2026-11-01"), 1);
  assert.equal(pm.previewDayNumber("2026-11-01", "2026-11-10"), 10);
  assert.ok(Number.isNaN(pm.previewDayNumber("", "2026-11-01")));
  assert.ok(Number.isNaN(pm.previewDayNumber("2026-11-01", "")));
});

test("previewPosition: the overnight stop; halfway along the route at sea; first / last stop outside the charter", () => {
  assert.deepEqual(pm.previewPosition(route, 0), { latitude: 10, longitude: 124 });
  assert.deepEqual(pm.previewPosition(route, 1), { latitude: 9.5, longitude: 123.4 });
  assert.deepEqual(pm.previewPosition(route, 3), { latitude: 9.0, longitude: 123.2 });
  const sea = pm.previewPosition(route, 4);                 // Apo -> Tubbataha along three equal 1-degree legs: the middle one
  assert.ok(Math.abs(sea.latitude - 9.0) < 1e-9 && Math.abs(sea.longitude - 121.7) < 1e-9, JSON.stringify(sea));
  assert.deepEqual(pm.previewPosition(route, 6), { latitude: 9.0, longitude: 120.2 });
  assert.deepEqual(pm.previewPosition(route, 10), { latitude: 9.0, longitude: 120.2 });
  assert.equal(pm.previewPosition([], 2), null);
  assert.equal(pm.previewPosition(route, NaN), null);
  assert.equal(pm.previewPosition([W(1, 2)], 1), null);   // no stops
});

test("previewSnapshot: a valid position and nothing else", () => {
  const snap = pm.previewSnapshot({ latitude: 9, longitude: 123 });
  assert.deepEqual(snap.position, { valid: true, latitude: 9, longitude: 123, source_sentence: "preview", timestamp_utc: "" });
  assert.equal(snap.navigation.speed_over_ground_knots, null);
  assert.equal(snap.wind.apparent_speed_knots, null);
  assert.equal(snap.route.active, false);
  assert.equal(pm.previewSnapshot(null).position.valid, false);
});

test("isTabOff: Navigation, Weather, Vessel Info and Safety are greyed out in a preview only", () => {
  const on = { active: true, date: "2026-11-03", charterId: "csaba" };
  assert.deepEqual(["navigation", "weather", "vessel", "safety", "itinerary", "menu", "drinks"].map((t) => pm.isTabOff(on, t)), [true, true, true, true, false, false, false]);
  assert.equal(pm.isTabOff({ active: false, date: "", charterId: "" }, "navigation"), false);
});
