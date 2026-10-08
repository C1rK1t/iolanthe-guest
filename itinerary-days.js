(function (root, factory) {
  const mod = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = mod;
  } else {
    root.IolantheItineraryDays = mod;
  }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  // Pure derivation of guest-facing days from the version 2 itinerary (charter rework spec A §6).
  // Mirrors the server's deriveDays rule: a day holds every stop whose span includes it, in route order.

  const DAY_MS = 86400000;
  const toObj = (v) => (v && typeof v === "object" && !Array.isArray(v) ? v : {});
  const text = (v) => (typeof v === "string" ? v.trim() : "");
  const isStop = (p) => Boolean(p && (p.anchorage_id || p.stop === true));

  function parseDateOnly(value) {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(text(value));
    if (!m) return null;
    const t = Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
    return Number.isFinite(t) ? t : null;
  }
  function dateKey(startMs, day) {
    const d = new Date(startMs + (day - 1) * DAY_MS);
    return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
  }
  // The guest receives start_date / end_date on the itinerary object (the server copies them from charter.json).
  function charterDayCount(source) {
    const s = toObj(source);
    const start = parseDateOnly(s.start_date);
    const end = parseDateOnly(s.end_date);
    if (start === null || end === null || end < start) return 0;
    return Math.round((end - start) / DAY_MS) + 1;
  }

  function stopEntries(points) {
    return (Array.isArray(points) ? points : []).map((point, index) => ({ point, index })).filter((e) => isStop(e.point));
  }
  function positionOf(i, count) {
    if (count === 1) return "only";
    if (i === 0) return "origin";
    return i === count - 1 ? "terminus" : "middle";
  }
  function stopSpan(stop, position, dayCount) {
    const arriveDay = stop.arrive ? stop.arrive.day : 1;
    const departDay = stop.depart ? stop.depart.day : (dayCount || arriveDay);
    const from = position === "origin" || position === "only" ? 1 : arriveDay;
    const to = position === "terminus" || position === "only" ? Math.max(dayCount || departDay, arriveDay) : departDay;
    return { from, to: Math.max(from, to) };
  }

  function siteIndex(siteLibrary) {
    const map = new Map();
    (toObj(siteLibrary).sites || []).forEach((site) => { if (site && typeof site.id === "string") map.set(site.id, site); });
    return map;
  }
  function siteImages(site) {
    if (!site) return [];
    const list = Array.isArray(site.images) ? site.images : [];
    return list.filter((x) => typeof x === "string" && x.trim());
  }

  function deriveGuestDays(itinerary, dayCount, siteLibrary) {
    const it = toObj(itinerary);
    const route = toObj(it.route);
    const stops = stopEntries(route.points);
    const sites = siteIndex(siteLibrary);
    const startMs = parseDateOnly(it.start_date);
    const activities = (Array.isArray(it.activities) ? it.activities : []).slice().sort((a, b) => (a.order || 0) - (b.order || 0));
    const spans = stops.map((e, i) => stopSpan(e.point, positionOf(i, stops.length), dayCount));
    const out = [];
    for (let day = 1; day <= dayCount; day += 1) {
      const dayStops = [];
      stops.forEach((entry, i) => {
        if (day < spans[i].from || day > spans[i].to) return;
        const p = entry.point;
        dayStops.push({
          id: p.id,
          name: text(p.name) || `Stop ${i + 1}`,
          arriveTime: p.arrive && p.arrive.day === day && p.arrive.time ? p.arrive.time : "",
          departTime: p.depart && p.depart.day === day && p.depart.time ? p.depart.time : "",
          nights: p.arrive && p.depart ? p.depart.day - p.arrive.day : 0,
          latitude: p.latitude,
          longitude: p.longitude,
          activities: activities.filter((a) => a.stop_id === p.id && a.day === day).map((a) => {
            const site = a.site_id ? (sites.get(a.site_id) || null) : null;
            return { id: a.id, title: text(a.title) || (site ? text(site.title) : "") || "Activity", notes: text(a.notes), time: text(a.time), siteId: text(a.site_id), site, images: siteImages(site) };
          })
        });
      });
      let passage = "";
      if (!dayStops.length && stops.length) {
        const before = stops.slice().reverse().find((e, k) => { const idx = stops.length - 1 - k; return spans[idx].to < day; });
        const after = stops.find((e, idx) => spans[idx].from > day);
        passage = before && after ? `Underway · ${text(before.point.name) || "previous stop"} to ${text(after.point.name) || "next stop"}` : "At sea";
      }
      out.push({
        id: `day-${day}`,
        day: `Day ${day}`,
        dayNumber: day,
        date: startMs === null ? "" : dateKey(startMs, day),
        area: dayStops.map((s) => s.name).filter((v, i, arr) => arr.indexOf(v) === i).join(" · "),
        summary: "",
        passage,
        stops: dayStops
      });
    }
    return out;
  }

  return { charterDayCount, deriveGuestDays, stopEntries, isStop, parseDateOnly };
});
