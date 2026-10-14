"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const { BUILT_IN, createWording, lowerWords } = require("../wording.js");

// The trip column of every key this site uses (the "Keys this plan needs" table of the plan).
const TRIP = {
  unit: ["Trip", "Trips"],
  unit_day: ["TRIP DAY {n}", "TRIP DAY {n}"],
  unit_completed_title: ["Trip completed", "Trip completed"],
  unit_completed: ["This trip has been completed.", "This trip has been completed."],
  unit_not_found: ["TRIP NOT FOUND", "TRIP NOT FOUND"],
  drinks_requested: ["Alcohol requested for this trip", "Alcohol requested for this trip"],
  track_note: [
    "Shared onboard track shows {points} for this trip and retains data for the trip plus {extra}.",
    "Shared onboard track shows {points} for this trip and retains data for the trip plus {extra}."
  ]
};

const placeholders = text => (text.match(/\{[a-z_]+\}/g) || []).sort().join(",");

test("BUILT_IN holds today's charter text, exactly", () => {
  assert.deepEqual(Object.keys(BUILT_IN).sort(), Object.keys(TRIP).sort());
  assert.deepEqual(BUILT_IN.unit, ["Charter", "Charters"]);
  assert.equal(BUILT_IN.unit_day[0], "CHARTER DAY {n}");
  assert.equal(BUILT_IN.unit_completed_title[0], "Charter completed");
  assert.equal(BUILT_IN.unit_completed[0], "This charter has been completed.");
  assert.equal(BUILT_IN.unit_not_found[0], "CHARTER NOT FOUND");
  assert.equal(BUILT_IN.drinks_requested[0], "Alcohol requested for this charter");
  assert.equal(
    BUILT_IN.track_note[0],
    "Shared onboard track shows {points} for this charter and retains data for the charter plus {extra}."
  );
  assert.ok(Object.isFrozen(BUILT_IN));
});

test("every key: both forms present, placeholders match across the four strings, trip text has no charter word", () => {
  for (const key of Object.keys(BUILT_IN)) {
    const four = [...BUILT_IN[key], ...TRIP[key]];
    assert.equal(four.length, 4, key);
    for (const text of four) assert.ok(text.trim() !== "", key);
    assert.equal(new Set(four.map(placeholders)).size, 1, `${key}: placeholders differ`);
    for (const text of TRIP[key]) assert.doesNotMatch(text, /\b(charters?|apa|clients?|agents?|proposals?)\b/i, key);
  }
});

test("w: no wording loaded -> the charter words", () => {
  const { w } = createWording(BUILT_IN);
  assert.equal(w("unit"), "Charter");
  assert.equal(w("unit", { plural: true }), "Charters");
  assert.equal(w("unit", { plural: true, lower: true }), "charters");
  assert.equal(w("unit_day", { vars: { n: 3 } }), "CHARTER DAY 3");
});

test("w: loaded trip wording is used, plural and vars apply", () => {
  const { w, setWording } = createWording(BUILT_IN);
  setWording(TRIP);
  assert.equal(w("unit"), "Trip");
  assert.equal(w("unit", { plural: true }), "Trips");
  assert.equal(w("unit_day", { vars: { n: 3 } }), "TRIP DAY 3");
  assert.equal(w("unit_not_found"), "TRIP NOT FOUND");
  assert.equal(
    w("track_note", { vars: { points: "12 logged points", extra: "3 extra days" } }),
    "Shared onboard track shows 12 logged points for this trip and retains data for the trip plus 3 extra days."
  );
});

test("w: a missing key or a broken entry falls back to the charter word, never blank or raw", () => {
  const { w, setWording } = createWording(BUILT_IN);
  setWording({ unit: ["Trip", "Trips"], unit_day: ["", "TRIP DAY {n}"], unit_completed: "nope", unit_not_found: ["only one"] });
  assert.equal(w("unit"), "Trip");
  assert.equal(w("unit_day", { vars: { n: 2 } }), "CHARTER DAY 2");
  assert.equal(w("unit_completed"), "This charter has been completed.");
  assert.equal(w("unit_not_found"), "CHARTER NOT FOUND");
  assert.equal(w("drinks_requested"), "Alcohol requested for this charter");
});

test("w: a placeholder with no var stays visible as written; vars are not lower-cased", () => {
  const { w } = createWording(BUILT_IN);
  assert.equal(w("unit_day"), "CHARTER DAY {n}");
  assert.equal(w("unit_day", { lower: true, vars: { n: "ABC" } }), "CHARTER DAY ABC");
});

test("w: var values go in literally (no $-patterns, no second expansion)", () => {
  const { w } = createWording(BUILT_IN);
  assert.equal(w("unit_day", { vars: { n: "$& {n}" } }), "CHARTER DAY $& {n}");
});

test("w: an unknown key is a bug and throws", () => {
  const { w } = createWording(BUILT_IN);
  assert.throws(() => w("no_such_key"), /Unknown wording key/);
});

test("setWording: a non-object keeps the words already loaded; reset clears them", () => {
  const { w, setWording, reset } = createWording(BUILT_IN);
  setWording(TRIP);
  setWording(undefined);
  setWording(null);
  setWording(["x"]);
  assert.equal(w("unit"), "Trip");
  reset();
  assert.equal(w("unit"), "Charter");
});

test("lowerWords: first letter of each word, all-capital words stay", () => {
  assert.equal(lowerWords("Active Charter"), "active charter");
  assert.equal(lowerWords("APA received"), "APA received");
  assert.equal(lowerWords("Trip Documents"), "trip documents");
  assert.equal(lowerWords("TRIP DAY {n}"), "TRIP DAY {n}");
});

function fakeNode(attrs) {
  const map = new Map(Object.entries(attrs));
  return {
    textContent: "pre-filled",
    getAttribute: name => (map.has(name) ? map.get(name) : null),
    hasAttribute: name => map.has(name),
    setAttribute: (name, value) => map.set(name, value),
    attr: name => map.get(name)
  };
}

test("applyStatic: text, plural, lower and attribute targets", () => {
  const { setWording, applyStatic } = createWording(BUILT_IN);
  const text = fakeNode({ "data-w": "unit" });
  const lowerPlural = fakeNode({ "data-w": "unit", "data-w-plural": "", "data-w-lower": "" });
  const title = fakeNode({ "data-w": "unit", "data-w-attr": "title" });
  const scope = { querySelectorAll: () => [text, lowerPlural, title] };
  setWording(TRIP);
  applyStatic(scope);
  assert.equal(text.textContent, "Trip");
  assert.equal(lowerPlural.textContent, "trips");
  assert.equal(title.attr("title"), "Trip");
  assert.equal(title.textContent, "pre-filled");
  applyStatic(null);
});
