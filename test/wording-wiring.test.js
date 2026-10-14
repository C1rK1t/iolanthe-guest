"use strict";

// wording.js is a new shipped file: the page must load it before the files that use it. (obs-feed-removed.test.js
// already checks that index.html and sw.js carry the same ?v= tag for every local file and that sw.js precaches only
// files that exist, so a wording.js tag in index.html without one in sw.js fails there.)
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.join(__dirname, "..");
const read = name => fs.readFileSync(path.join(ROOT, name), "utf8");

test("index.html and sw.js both list wording.js, and index.html loads it before preview-mode.js and guest.js", () => {
  const scripts = [...read("index.html").matchAll(/<script src="(\/[^"]+)"/g)].map(m => m[1]);
  const wordingAt = scripts.findIndex(src => src.startsWith("/wording.js?v="));
  assert.ok(wordingAt >= 0, "wording.js script tag");
  assert.ok(wordingAt < scripts.findIndex(src => src.startsWith("/preview-mode.js")), "before preview-mode.js");
  assert.ok(wordingAt < scripts.findIndex(src => src.startsWith("/guest.js")), "before guest.js");
  assert.match(read("sw.js"), /"\/wording\.js\?v=[\w.-]+"/);
});

test("guest.js hands the loaded wording to the helper", () => {
  const js = read("guest.js");
  assert.match(js, /const w = WORDING_MODULE\.w;/);
  assert.match(js, /WORDING_MODULE\.setWording\(charterData\.wording\);/);
});
