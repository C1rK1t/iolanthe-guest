(function (root, factory) {
  const mod = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = mod;
  } else {
    root.IolantheGuestPreview = mod;
  }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  // Charter rework spec B §4.1: the guest preview mode, read from ?preview=YYYY-MM-DD&charter=<id>. The admin's
  // Guest view tab loads the guest in an iframe with these params. Pure: no DOM, no fetch.

  const DATE_RE = /^(\d{4})-(\d{2})-(\d{2})$/;
  const WEEKDAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  const PROBLEMS = { 401: "LOG IN TO THE ADMIN AGAIN", 404: "CHARTER NOT FOUND" };

  function isRealDate(value) {
    const m = DATE_RE.exec(String(value || ""));
    if (!m) return false;
    const d = new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])));
    return d.getUTCFullYear() === Number(m[1]) && d.getUTCMonth() === Number(m[2]) - 1 && d.getUTCDate() === Number(m[3]);
  }

  // The server's validateAdminCharterId rule.
  function validCharterId(value) {
    const t = typeof value === "string" ? value.trim().toLowerCase() : "";
    return /^[a-z0-9][a-z0-9-]{0,62}$/.test(t) && !t.includes("--") ? t : "";
  }

  // { active, date, charterId }: active only with a real date; a bad charter id is dropped (the active charter shows).
  function parsePreview(search) {
    const params = new URLSearchParams(typeof search === "string" ? search : "");
    const date = params.get("preview");
    if (!isRealDate(date)) return { active: false, date: "", charterId: "" };
    return { active: true, date, charterId: validCharterId(params.get("charter")) };
  }

  function withPreviewParams(url, preview) {
    if (!preview || !preview.active) return url;
    const extra = `${preview.charterId ? `charter=${encodeURIComponent(preview.charterId)}&` : ""}preview=${preview.date}`;
    return `${url}${url.includes("?") ? "&" : "?"}${extra}`;
  }

  // "PREVIEW · TUE 3 NOV", or the problem for a refused preview (401 / 404); "" when not previewing.
  function bannerText(preview, status) {
    if (!preview || !preview.active) return "";
    if (PROBLEMS[status]) return `PREVIEW · ${PROBLEMS[status]}`;
    const [y, m, d] = preview.date.split("-").map(Number);
    return `PREVIEW · ${WEEKDAYS[new Date(Date.UTC(y, m - 1, d)).getUTCDay()]} ${d} ${MONTHS[m - 1]}`;
  }

  // ---- spec B follow-up (David, 2026-10-08): a stand-in position, and the tabs a preview greys out ----

  // Live or same-every-day tabs: greyed out (visible, not clickable) in a preview.
  const OFF_TABS = ["navigation", "weather", "vessel", "safety"];
  function isTabOff(preview, tabId) {
    return Boolean(preview && preview.active) && OFF_TABS.includes(tabId);
  }

  const DAY_MS = 86400000;
  const isStop = (p) => Boolean(p && (p.anchorage_id || p.stop === true));
  const utcDay = (value) => {
    const m = DATE_RE.exec(String(value || "").trim());
    return m ? Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])) : null;
  };

  // The charter day of a preview date: 0 the day before boarding, n on day n; NaN without both dates.
  function previewDayNumber(startDate, date) {
    const start = utcDay(startDate);
    const at = utcDay(date);
    return start === null || at === null ? NaN : Math.round((at - start) / DAY_MS) + 1;
  }

  const coords = (p) => ({ latitude: p.latitude, longitude: p.longitude });

  // The point halfway along a path of points, by distance (flat-earth legs, fine over a day's passage).
  function halfway(path) {
    const legs = path.slice(1).map((b, i) => {
      const a = path[i];
      const k = Math.cos(((a.latitude + b.latitude) / 2) * Math.PI / 180);
      return Math.hypot(b.latitude - a.latitude, (b.longitude - a.longitude) * k);
    });
    let left = legs.reduce((sum, d) => sum + d, 0) / 2;
    for (let i = 0; i < legs.length; i += 1) {
      if (left <= legs[i] || i === legs.length - 1) {
        const t = legs[i] ? Math.min(1, left / legs[i]) : 0;
        const a = path[i];
        const b = path[i + 1];
        return { latitude: a.latitude + (b.latitude - a.latitude) * t, longitude: a.longitude + (b.longitude - a.longitude) * t };
      }
      left -= legs[i];
    }
    return coords(path[0]);
  }

  // Where the boat spends the night of charter day `day`: the stop it sleeps at; on a night at sea, halfway along the
  // route between the stop it left and the next one; the first stop before the charter, the last after it. The same
  // rule as the admin slider's title. { latitude, longitude } or null.
  function previewPosition(points, day) {
    const pts = (Array.isArray(points) ? points : []).filter((p) => p && Number.isFinite(p.latitude) && Number.isFinite(p.longitude));
    const stops = pts.map((p, i) => ({ p, i })).filter((e) => isStop(e.p));
    if (!stops.length || !Number.isFinite(day)) return null;
    if (day < 1) return coords(stops[0].p);
    for (let k = 0; k < stops.length; k += 1) {
      const p = stops[k].p;
      const arrive = k === 0 ? 1 : ((p.arrive && p.arrive.day) || 1);
      const depart = k === stops.length - 1 ? Infinity : ((p.depart && p.depart.day) || arrive);
      if (arrive <= day && day < depart) return coords(p);
    }
    const next = stops.findIndex((e, k) => k > 0 && e.p.arrive && e.p.arrive.day > day);
    if (next > 0) return halfway(pts.slice(stops[next - 1].i, stops[next].i + 1));
    return coords(stops[stops.length - 1].p);
  }

  // The /api/nmea snapshot a preview shows instead of the live one: the stand-in position, every reading unknown.
  function previewSnapshot(position) {
    const valid = Boolean(position);
    return {
      updated_at: "",
      age_seconds: null,
      source: { preview: true },
      position: { valid, latitude: valid ? position.latitude : null, longitude: valid ? position.longitude : null, source_sentence: valid ? "preview" : "", timestamp_utc: "" },
      navigation: { course_over_ground_deg: null, speed_over_ground_knots: null, speed_over_ground_kmh: null, heading_true_deg: null, depth_m: null, depth_source: "", rate_of_turn_deg_per_min: null, pitch_deg: null, roll_deg: null, yaw_deg: null },
      wind: { apparent_angle_deg: null, apparent_speed_knots: null, apparent_source: "", true_direction_deg: null, true_speed_knots: null, true_source: "", derived_true_direction_deg: null, derived_true_speed_knots: null, derived_true_source: "" },
      route: { active: false },
      raw: { sentences: {} }
    };
  }

  return { parsePreview, withPreviewParams, bannerText, validCharterId, isTabOff, previewDayNumber, previewPosition, previewSnapshot };
});
