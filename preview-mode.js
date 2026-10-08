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

  return { parsePreview, withPreviewParams, bannerText, validCharterId };
});
