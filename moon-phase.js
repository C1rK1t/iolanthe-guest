// TEMPORARY COPY — remove after Step 3 cutover.
// moon-phase.js is served by iolanthe-server and its output is included
// in the /api/weather response as the `moon` object. Once Step 3 is live
// this file and any direct require/import of it in guest.js must be removed.
(function exposeMoonPhase(root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.IolantheMoonPhase = factory();
  }
}(typeof globalThis !== "undefined" ? globalThis : this, function createMoonPhaseUtility() {
  "use strict";

  const MS_PER_DAY = 24 * 60 * 60 * 1000;
  const SYNODIC_MONTH_DAYS = 29.530588853;
  const KNOWN_NEW_MOON_MS = Date.UTC(2000, 0, 6, 18, 14, 0);
  const MOON_PHASE_IMAGE_BASE_PATH = "/assets/moon-phases";
  const PHASES = Object.freeze([
    { phase: 0, name: "New Moon", image: `${MOON_PHASE_IMAGE_BASE_PATH}/new-moon-000.png` },
    { phase: 0.125, name: "Waxing Crescent", image: `${MOON_PHASE_IMAGE_BASE_PATH}/waxing-cres-125.png` },
    { phase: 0.25, name: "First Quarter", image: `${MOON_PHASE_IMAGE_BASE_PATH}/first-quarter-250.png` },
    { phase: 0.375, name: "Waxing Gibbous", image: `${MOON_PHASE_IMAGE_BASE_PATH}/waxing-gib-375.png` },
    { phase: 0.5, name: "Full Moon", image: `${MOON_PHASE_IMAGE_BASE_PATH}/full-moon-500.png` },
    { phase: 0.625, name: "Waning Gibbous", image: `${MOON_PHASE_IMAGE_BASE_PATH}/waning-gib-625.png` },
    { phase: 0.75, name: "Last Quarter", image: `${MOON_PHASE_IMAGE_BASE_PATH}/last-quarter-750.png` },
    { phase: 0.875, name: "Waning Crescent", image: `${MOON_PHASE_IMAGE_BASE_PATH}/waning-cres-875.png` }
  ]);

  function plainObject(value) {
    return value && typeof value === "object" && !Array.isArray(value)
      ? value
      : {};
  }

  function firstArrayValue(value) {
    return Array.isArray(value) ? value[0] : value;
  }

  function parseNumber(value) {
    if (typeof value === "number") {
      return Number.isFinite(value) ? value : null;
    }
    if (typeof value !== "string") {
      return null;
    }
    const trimmed = value.trim();
    if (!trimmed) {
      return null;
    }
    const parsed = Number.parseFloat(trimmed.replace("%", ""));
    return Number.isFinite(parsed) ? parsed : null;
  }

  function normalizePhaseNumber(value) {
    const parsed = parseNumber(value);
    if (!Number.isFinite(parsed)) {
      return null;
    }

    const scaled = Math.abs(parsed) > 1 && Math.abs(parsed) <= 100
      ? parsed / 100
      : parsed;
    let phase = scaled % 1;
    if (phase < 0) {
      phase += 1;
    }
    if (phase >= 0.9995 || phase < 0.0005) {
      return 0;
    }
    return Number(phase.toFixed(4));
  }

  function phaseFromName(value) {
    if (typeof value !== "string") {
      return null;
    }
    const clean = value.toLowerCase().replace(/[_-]/g, " ").trim();
    if (!clean) {
      return null;
    }
    if (clean.includes("new")) {
      return 0;
    }
    if (clean.includes("full")) {
      return 0.5;
    }
    if (clean.includes("first") || clean.includes("1st")) {
      return 0.25;
    }
    if (clean.includes("last") || clean.includes("third") || clean.includes("3rd")) {
      return 0.75;
    }
    if (clean.includes("waxing") && clean.includes("crescent")) {
      return 0.125;
    }
    if (clean.includes("waxing") && clean.includes("gibbous")) {
      return 0.375;
    }
    if (clean.includes("waning") && clean.includes("gibbous")) {
      return 0.625;
    }
    if (clean.includes("waning") && clean.includes("crescent")) {
      return 0.875;
    }
    return null;
  }

  function normalizeIllumination(value, phase) {
    const parsed = parseNumber(value);
    if (Number.isFinite(parsed)) {
      const scaled = parsed >= 0 && parsed <= 1 ? parsed * 100 : parsed;
      return Math.max(0, Math.min(100, Math.round(scaled)));
    }
    return Math.round((1 - Math.cos(2 * Math.PI * phase)) * 50);
  }

  function phaseInfo(phase) {
    const index = Math.round(phase * 8) % 8;
    return PHASES[index];
  }

  function moonPhaseImageForPhase(value) {
    const phase = normalizePhaseNumber(value);
    return Number.isFinite(phase) ? phaseInfo(phase).image : "";
  }

  function normalizeDate(value) {
    const date = value instanceof Date ? value : new Date(value || Date.now());
    return Number.isFinite(date.getTime()) ? date : new Date();
  }

  function buildMoon(phase, source, date, illuminationValue) {
    const normalizedPhase = normalizePhaseNumber(phase);
    if (!Number.isFinite(normalizedPhase)) {
      return null;
    }
    const normalizedDate = normalizeDate(date);
    const info = phaseInfo(normalizedPhase);
    return {
      phase: normalizedPhase,
      phase_name: info.name,
      illumination: normalizeIllumination(illuminationValue, normalizedPhase),
      image: info.image,
      source: source === "provider" ? "provider" : "calculated",
      updated_at: normalizedDate.toISOString()
    };
  }

  function readFirst(source, keys) {
    for (const key of keys) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        return firstArrayValue(source[key]);
      }
    }
    return undefined;
  }

  function readMoonCandidate(value) {
    if (typeof value === "number" || typeof value === "string") {
      return { phase: value };
    }

    const source = plainObject(value);
    if (!Object.keys(source).length) {
      return null;
    }

    const direct = {
      phase: readFirst(source, ["moon_phase", "moonPhase", "phase", "lunar_phase", "lunarPhase", "moon_phase_lunation"]),
      phaseName: readFirst(source, ["phase_name", "phaseName", "moon_phase_name", "moonPhaseName"]),
      illumination: readFirst(source, ["illumination", "moon_illumination", "moonIllumination", "illuminated_fraction", "illuminatedFraction"]),
      source: typeof source.source === "string" ? source.source : ""
    };
    if (direct.phase !== undefined || direct.phaseName !== undefined || direct.illumination !== undefined) {
      return direct;
    }

    const daily = plainObject(source.daily);
    const dailyCandidate = {
      phase: readFirst(daily, ["moon_phase", "moonPhase", "phase"]),
      phaseName: readFirst(daily, ["moon_phase_name", "moonPhaseName", "phase_name"]),
      illumination: readFirst(daily, ["moon_illumination", "moonIllumination", "illumination"])
    };
    if (dailyCandidate.phase !== undefined || dailyCandidate.phaseName !== undefined || dailyCandidate.illumination !== undefined) {
      return dailyCandidate;
    }

    const weatherEntry = firstArrayValue(source.weather);
    const astronomy = firstArrayValue(source.astronomy) || firstArrayValue(weatherEntry && weatherEntry.astronomy);
    const astronomySource = plainObject(astronomy);
    const astronomyCandidate = {
      phase: readFirst(astronomySource, ["moon_phase", "moonPhase", "phase"]),
      phaseName: readFirst(astronomySource, ["moon_phase_name", "moonPhaseName", "phase_name"]),
      illumination: readFirst(astronomySource, ["moon_illumination", "moonIllumination", "illumination"])
    };
    if (astronomyCandidate.phase !== undefined || astronomyCandidate.phaseName !== undefined || astronomyCandidate.illumination !== undefined) {
      return astronomyCandidate;
    }

    return null;
  }

  function providerMoon(value, date) {
    const candidate = readMoonCandidate(value);
    if (!candidate) {
      return null;
    }

    const numericPhase = normalizePhaseNumber(candidate.phase);
    const phase = Number.isFinite(numericPhase)
      ? numericPhase
      : phaseFromName(candidate.phaseName || candidate.phase);
    if (!Number.isFinite(phase)) {
      return null;
    }
    const source = candidate.source === "calculated" ? "calculated" : "provider";
    return buildMoon(phase, source, date, candidate.illumination);
  }

  function calculateMoonPhase(date = new Date()) {
    const normalizedDate = normalizeDate(date);
    const elapsedDays = (normalizedDate.getTime() - KNOWN_NEW_MOON_MS) / MS_PER_DAY;
    let phase = (elapsedDays / SYNODIC_MONTH_DAYS) % 1;
    if (phase < 0) {
      phase += 1;
    }
    return buildMoon(phase, "calculated", normalizedDate);
  }

  function normalizeMoonPhase(value, date = new Date()) {
    const normalizedDate = normalizeDate(date);
    return providerMoon(value, normalizedDate) || calculateMoonPhase(normalizedDate);
  }

  return {
    calculateMoonPhase,
    moonPhaseImageForPhase,
    normalizeMoonPhase
  };
}));
