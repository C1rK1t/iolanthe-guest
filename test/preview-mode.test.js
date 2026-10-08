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
