"use strict";

// Every wording key used in the site's code must exist in the built-in charter copy, and every built-in key must be used
// (no dead keys, no typos that would throw "Unknown wording key" on a tablet).

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { BUILT_IN } = require("../wording.js");

const ROOT = path.join(__dirname, "..");
const read = name => fs.readFileSync(path.join(ROOT, name), "utf8");

test("every w(\"key\") in the site's code is a built-in key, and every built-in key is used", () => {
  const used = new Set();
  for (const name of ["guest.js", "preview-mode.js"]) {
    for (const m of read(name).matchAll(/\bw\(\s*["']([a-z0-9_]+)["']/g)) used.add(m[1]);
  }
  for (const key of used) assert.ok(Object.hasOwn(BUILT_IN, key), `unknown wording key ${key}`);
  for (const key of Object.keys(BUILT_IN)) assert.ok(used.has(key), `built-in key ${key} is never used`);
});
