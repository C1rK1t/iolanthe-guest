"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const days = require("../itinerary-days.js");

const P = (latitude, longitude, extra) => ({ latitude, longitude, ...(extra || {}) });
const sites = { sites: [
  { id: "capones-lh", title: "Capones lighthouse", description: "Climb at sunset", latitude: 14.951, longitude: 120.112, images: ["/data/sites/capones-lh/1.jpg"] },
  { id: "potipot-beach", title: "Potipot beach", description: "", latitude: 15.6, longitude: 119.9, images: [] }
] };

// Same 7-day fixture as the server and admin tests.
const itinerary = {
  version: 2, revision: 4, welcome_message: "Welcome", summary: "North", start_date: "2026-10-12", end_date: "2026-10-18",
  route: { speed_kn: 8, points: [
    P(14.80, 120.27, { stop: true, id: "stp_subic1", name: "Subic Bay", depart: { day: 1, time: "09:00" } }),
    P(14.83, 120.20, { stop: true, id: "stp_anaw", name: "Anawangin", arrive: { day: 1 }, depart: { day: 1, time: "14:00" } }),
    P(14.95, 120.11, { anchorage_id: "capones", id: "stp_capo", name: "Capones Is.", site_ids: ["capones-lh"], arrive: { day: 1 }, depart: { day: 2, time: "08:30" } }),
    P(15.30, 119.80, { anchorage_id: "hermana", id: "stp_herm", name: "Hermana Mayor", arrive: { day: 2 }, depart: { day: 3 } }),
    P(15.60, 119.90, { anchorage_id: "potipot", id: "stp_poti", name: "Potipot", site_ids: ["potipot-beach", "sandbar"], arrive: { day: 3 }, depart: { day: 5, time: "18:00" } }),
    P(16.00, 119.95),
    P(16.20, 120.00, { anchorage_id: "hundred", id: "stp_hund", name: "Hundred Islands", arrive: { day: 6 }, depart: { day: 7, time: "08:00" } }),
    P(14.80, 120.27, { stop: true, id: "stp_subic2", name: "Subic Bay", arrive: { day: 7 } })
  ] },
  activities: [
    { id: "act_1", stop_id: "stp_capo", day: 1, order: 1, title: "Sundowners", notes: "Bring a jumper" },
    { id: "act_2", stop_id: "stp_capo", day: 1, order: 0, title: "Lighthouse walk", notes: "", site_id: "capones-lh", time: "16:30" },
    { id: "act_3", stop_id: "stp_poti", day: 4, order: 0, title: "Kayaks", notes: "" },
    { id: "act_4", stop_id: "stp_poti", day: 3, order: 0, title: "Beach", notes: "", site_id: "potipot-beach" }
  ]
};

test("charterDayCount from the itinerary's dates", () => {
  assert.equal(days.charterDayCount(itinerary), 7);
  assert.equal(days.charterDayCount({}), 0);
});

test("deriveGuestDays: one entry per day with the stops that touch it, in route order", () => {
  const out = days.deriveGuestDays(itinerary, 7, sites);
  assert.equal(out.length, 7);
  assert.deepEqual(out.map((d) => d.stops.map((s) => s.id)), [
    ["stp_subic1", "stp_anaw", "stp_capo"], ["stp_capo", "stp_herm"], ["stp_herm", "stp_poti"], ["stp_poti"], ["stp_poti"], ["stp_hund"], ["stp_hund", "stp_subic2"]
  ]);
  assert.deepEqual([out[0].id, out[0].day, out[0].dayNumber, out[0].date], ["day-1", "Day 1", 1, "2026-10-12"]);
  assert.equal(out[2].area, "Hermana Mayor · Potipot");
});

test("deriveGuestDays: set times only, never estimates; nights on multi-night stops", () => {
  const out = days.deriveGuestDays(itinerary, 7, sites);
  const capo = out[0].stops[2];
  assert.deepEqual([capo.arriveTime, capo.departTime, capo.nights], ["", "", 1]);   // arrival time not set → ""; departure is day 2 so not shown on day 1
  const capoDay2 = out[1].stops[0];
  assert.deepEqual([capoDay2.arriveTime, capoDay2.departTime], ["", "08:30"]);
  const poti = out[2].stops[1];
  assert.deepEqual([poti.arriveTime, poti.departTime, poti.nights], ["", "", 2]);
  assert.equal(out[4].stops[0].departTime, "18:00");
  assert.equal(out[0].stops[0].departTime, "09:00");
});

test("deriveGuestDays: activities in order with site, images and time", () => {
  const out = days.deriveGuestDays(itinerary, 7, sites);
  const acts = out[0].stops[2].activities;
  assert.deepEqual(acts.map((a) => a.id), ["act_2", "act_1"]);
  assert.equal(acts[0].site.title, "Capones lighthouse");
  assert.deepEqual(acts[0].images, ["/data/sites/capones-lh/1.jpg"]);
  assert.equal(acts[0].time, "16:30");
  assert.equal(acts[1].site, null);
  assert.equal(acts[1].notes, "Bring a jumper");
  assert.deepEqual(out[3].stops[0].activities.map((a) => a.title), ["Kayaks"]);
  assert.deepEqual(out[4].stops[0].activities, []);
});

test("deriveGuestDays: a passage day names the stops either side", () => {
  const it = JSON.parse(JSON.stringify(itinerary));
  it.route.points[6].arrive = { day: 7 }; it.route.points[6].depart = { day: 7, time: "08:00" };
  const out = days.deriveGuestDays(it, 7, sites);
  assert.deepEqual(out[5].stops, []);
  assert.equal(out[5].passage, "Underway · Potipot to Hundred Islands");
  assert.equal(out[0].passage, "");
});

test("deriveGuestDays: a missing site falls back quietly", () => {
  const out = days.deriveGuestDays(itinerary, 7, { sites: [] });
  const act = out[0].stops[2].activities[0];
  assert.equal(act.site, null);
  assert.deepEqual(act.images, []);
  assert.equal(act.title, "Lighthouse walk");
});

test("the v1 converter is gone (plan 5 Task 8)", () => {
  assert.equal(days.v1ToGuestDays, undefined);
});
