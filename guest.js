    const SAFETY_TAB = { id: "safety", label: "Safety" };
    const defaultTabs = [
      { id: "navigation", label: "Navigation" },
      { id: "itinerary", label: "Itinerary" },
      { id: "menu", label: "Today's Menu" },
      { id: "drinks", label: "Wine & Drinks" },
      { id: "vessel", label: "Vessel Info" },
      SAFETY_TAB
    ];
    const SUPPORTED_STATIC_TAB_IDS = new Set(defaultTabs.map(tab => tab.id));
    const SAFETY_DOCUMENTS = Object.freeze([
      {
        id: "briefing",
        label: "Safety Briefing",
        file: "plans/safety_brief.pdf"
      },
      {
        id: "state-escape",
        label: "State Room Escape Plan",
        file: "plans/state-escape-plan.pdf"
      },
      {
        id: "port-vip",
        label: "Port VIP Escape Plan",
        file: "plans/port-vip-escape-plan.pdf"
      },
      {
        id: "starboard-vip",
        label: "Starboard VIP Escape Plan",
        file: "plans/starboard-vip-escape-plan.pdf"
      },
      {
        id: "port-twin",
        label: "Port Twin Escape Plan",
        file: "plans/port-twin-escape-plan.pdf"
      },
      {
        id: "starboard-twin",
        label: "Starboard Twin Escape Plan",
        file: "plans/starboard-twin-escape-plan.pdf"
      }
    ]);
    const DEFAULT_SETTINGS_DATA = {
      site_title: "Princess Iolanthe Onboard",
      site_subtitle: "Guest Portal",
      tabs: defaultTabs
    };
    const DEFAULT_NAVIGATION_DATA = {};
    const WEATHER_TAB = { id: "weather", label: "Weather" };
    const WEATHER_API_URL = "/api/weather";
    const WEATHER_POLL_INTERVAL_MS = 30 * 60 * 1000;
    const WEATHER_MIN_REFRESH_INTERVAL_MS = 15 * 60 * 1000;
    const CARDINAL_DIRECTIONS = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
    const AVAILABLE_ALCOHOL_MAX_PRICE = 999999;
    const AVAILABLE_ALCOHOL_SUBCATEGORY_FALLBACK = "Other";
    const CHARTER_API_URL = "/api/charter";
    const CHARTER_REFRESH_INTERVAL_MS = 30 * 1000;
    const LOCAL_DAY_MS = 24 * 60 * 60 * 1000;
    const NMEA_API_URL = "/api/nmea";
    const TRACK_API_URL = "/api/track";
    const PLANNED_ROUTE_API_URL = "/api/planned-route";
    const ROUTE_PLAN_IDS = Object.freeze(["primary", "alternative"]);
    const TRACK_POLL_INTERVAL_MS = 30 * 1000;
    const VERSION_API_URL = "/api/version";
    const INSTALL_PROMPT_DISMISSED_KEY = "iolanthe-onboard-install-dismissed-v1";
    const NMEA_POLL_INTERVAL_MS = 5000;
    const OBS_RETRY_BASE_MS = 5000;
    const OBS_RETRY_MAX_MS = 60000;
    const OBS_RETRY_MAX_ATTEMPTS = 5;
    const OBS_IDLE_READY_TIMEOUT_MS = 12000;
    // Offshore tile providers may not supply usable data at lower zooms.
    // Keep the idle/moving map above this zoom to avoid "No Map Data Yet Available" tiles.
    const OFFSHORE_SAFE_MIN_ZOOM = 9;
    const NAVIGATION_MAP_MIN_ZOOM = OFFSHORE_SAFE_MIN_ZOOM;
    const NAVIGATION_MAP_MAX_ZOOM = 18;
    const NAVIGATION_MAP_DEFAULT_ZOOM = 11;
    const MAP_TILE_ERROR_THRESHOLD = 4;
    const MAP_TILE_ERROR_WINDOW_MS = 2000;
    const MAP_ZOOM_CORRECTION_COOLDOWN_MS = 2000;
    const MAP_TILE_UNAVAILABLE_MESSAGE = "Map detail unavailable offshore at this zoom level";
    const unavailableMapZooms = new Set();
    let effectiveUnavailableMapMinZoom = NAVIGATION_MAP_MIN_ZOOM;
    const BEVERAGE_CATEGORY_ORDER = Object.freeze(["Champagne", "Wine", "Spirits", "Beers", "Other"]);
    const BEVERAGE_STOCK_TYPE_ALIASES = Object.freeze({
      rose: "rosie",
      "rose-wine": "rosie",
      sparkling: "sparkling-wine",
      tonic: "tonic-water"
    });
    const PLANNED_ROUTE_LINE_STYLE = Object.freeze({
      color: "#3ee6d6",
      weight: 4,
      opacity: 0.92,
      dashArray: "10 8",
      lineCap: "round",
      lineJoin: "round",
      smoothFactor: 0,
      noClip: true
    });
    const COMPASS_DIRECTIONS = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
    const HOURLY_WIND_DIRECTION_FIELDS = [
      "wind_direction_10m",
      "wind_direction",
      "winddirection",
      "wind_dir",
      "winddir",
      "wind_dir_10m",
      "winddirection_10m",
      "windDirection",
      "windDirection10m",
      "winddirDegree",
      "wind_dir_degree",
      "wind_direction_deg"
    ];
    const TELEMETRY_DISPLAY_LABELS = {
      LATITUDE: "Latitude",
      LONGITUDE: "Longitude",
      COG: "Course",
      SOG: "Speed",
      HEADING: "Heading",
      DEPTH: "Depth",
      ROT: "Turn Rate",
      PITCH: "Pitch",
      ROLL: "Roll",
      YAW: "Yaw",
      WIND_SPEED: "Wind Speed",
      WIND_DIRECTION: "Wind Direction",
      APPARENT_WIND_SPEED: "Apparent Wind Speed",
      APPARENT_WIND_ANGLE: "Apparent Wind Angle",
      ORIGIN_WAYPOINT: "Origin Waypoint",
      DESTINATION_WAYPOINT: "Waypoint",
      DESTINATION_LATITUDE: "Waypoint Lat",
      DESTINATION_LONGITUDE: "Waypoint Lon",
      DISTANCE_TO_WAYPOINT: "Distance to Waypoint",
      BEARING_TO_WAYPOINT: "Bearing to Waypoint",
      CROSS_TRACK_ERROR: "Cross-track Error",
      STEER_DIRECTION: "Steer",
      CLOSING_VELOCITY: "Closing Speed",
      TTG: "TTG",
      ETA: "ETA",
      ARRIVAL_STATUS: "Arrival"
    };
    const TELEMETRY_FIELD_KEYS = Object.freeze([
      "latitude",
      "longitude",
      "cog",
      "sog",
      "heading",
      "depth",
      "rot",
      "pitch",
      "roll",
      "yaw",
      "wind_speed",
      "wind_direction",
      "apparent_wind_speed",
      "apparent_wind_angle",
      "origin_waypoint",
      "destination_waypoint",
      "destination_latitude",
      "destination_longitude",
      "distance_to_waypoint",
      "bearing_to_waypoint",
      "cross_track_error",
      "steer_direction",
      "closing_velocity",
      "ttg",
      "eta",
      "arrival_status"
    ]);
    const TELEMETRY_ITEM_ALIASES = Object.freeze({
      latitude: ["latitude", "lat", "position.latitude", "vessel.latitude"],
      longitude: ["longitude", "lon", "lng", "position.longitude", "vessel.longitude"],
      cog: ["cog", "COG", "course", "courseOverGround", "course_over_ground", "nav.course", "vessel.cog"],
      sog: ["sog", "SOG", "speed", "Speed", "speedOverGround", "speed_over_ground", "nav.speed", "vessel.sog"],
      heading: ["heading", "Heading", "headingTrue", "heading_true", "headingTrueDeg", "nav.heading"],
      depth: ["depth", "Depth", "nav.depth", "vessel.depth"],
      rot: ["rot", "ROT", "rateOfTurn", "turnRate"],
      pitch: ["pitch", "Pitch", "nav.pitch"],
      roll: ["roll", "Roll", "nav.roll"],
      yaw: ["yaw", "Yaw", "nav.yaw"],
      wind_speed: ["windSpeed", "wind_speed", "trueWindSpeed", "true_wind_speed", "tws", "TWS"],
      wind_direction: ["windDirection", "wind_direction", "trueWindDirection", "true_wind_direction", "twd", "TWD"],
      apparent_wind_speed: ["apparentWindSpeed", "apparent_wind_speed", "aws", "AWS"],
      apparent_wind_angle: ["apparentWindAngle", "apparent_wind_angle", "awa", "AWA"],
      origin_waypoint: ["originWaypoint", "origin_waypoint", "route.origin"],
      destination_waypoint: ["destinationWaypoint", "destination_waypoint", "waypoint", "route.destination"],
      destination_latitude: ["destinationLatitude", "destination_latitude", "waypointLatitude"],
      destination_longitude: ["destinationLongitude", "destination_longitude", "waypointLongitude"],
      distance_to_waypoint: ["distanceToWaypoint", "distance_to_waypoint", "dtw"],
      bearing_to_waypoint: ["bearingToWaypoint", "bearing_to_waypoint", "btw"],
      cross_track_error: ["crossTrackError", "cross_track_error", "xte", "XTE"],
      steer_direction: ["steerDirection", "steer_direction"],
      closing_velocity: ["closingVelocity", "closing_velocity", "vmg"],
      ttg: ["ttg", "TTG"],
      eta: ["eta", "ETA"],
      arrival_status: ["arrivalStatus", "arrival_status", "arrival"]
    });
    const TELEMETRY_ALIAS_LOOKUP = Object.freeze(Object.keys(TELEMETRY_ITEM_ALIASES).reduce((lookup, canonical) => {
      TELEMETRY_ITEM_ALIASES[canonical].forEach(alias => {
        lookup[getTelemetryAliasToken(alias)] = canonical;
      });
      if (canonical === "wind_speed") {
        lookup.wind = ["wind_speed", "wind_direction"];
      }
      return lookup;
    }, {}));
    const IDLE_OBS_RATIO_DEFAULT = {
      raw: "16:9",
      css: "16 / 9",
      number: 16 / 9
    };
    const IDLE_SCREENSAVER_DEFAULTS = {
      enabled: false,
      timeout_seconds: 180,
      zoom_levels: [{
        map_zoom: NAVIGATION_MAP_DEFAULT_ZOOM,
        center_on_vessel: true,
        latitude: 0,
        longitude: 0
      }],
      zoom_cycle_seconds: 15,
      obsFeedEnabled: true,
      obs_feed_interval_seconds: 300,
      obs_feed_duration_seconds: 45,
      obs_feed_transition_seconds: 2,
      obs_ratio: IDLE_OBS_RATIO_DEFAULT.raw,
      obs_ratio_css: IDLE_OBS_RATIO_DEFAULT.css,
      obs_ratio_number: IDLE_OBS_RATIO_DEFAULT.number,
      show_weather: true,
      show_itinerary: true,
      show_telemetry: true,
      telemetry_items: ["cog", "sog", "depth", "wind_speed", "wind_direction", "eta"]
    };
    const IDLE_MOUSEMOVE_RESET_THROTTLE_MS = 1000;
    const IDLE_CLOCK_REFRESH_MS = 30000;

    let siteData = DEFAULT_SETTINGS_DATA;
    let currentTabId = defaultTabs[0].id;
    let currentDrinksSubPageId = "included-drinks";
    let charterBundleData = {};
    let charterSitesData = { sites: [] };
    let navigationData = null;
    let itineraryData = null;
    let selectedItineraryDayId = "";
    let lastResolvedItineraryCurrentDayNumber = null;
    let charterRefreshTimer = null;
    let charterRefreshPromise = null;
    let nmeaRefreshTimer = null;
    let trackRefreshTimer = null;
    let weatherRefreshTimer = null;
    let idleClockTimer = null;
    let idleZoomTimer = null;
    let idleObsFeedTimer = null;
    let idleObsFeedDurationTimer = null;
    let idleObsFeedReadyTimer = null;
    let idleTransitionTimer = null;
    let idleTransitionMidpointTimer = null;
    let weatherRequestId = 0;
    let weatherRequestPromise = null;
    let weatherLastRequestAt = 0;
    let weatherPanelSignature = "";
    let idleWeatherSectionSignature = "";
    let weatherDiagnosticsSignature = "";
    let nmeaState = {
      loading: true,
      data: null,
      error: "",
      updatedAt: ""
    };
    let weatherState = {
      visible: true,
      loading: true,
      data: null,
      moon: null,
      error: "",
      updatedAt: "",
      source: "",
      signature: ""
    };
    let idleWeatherState = {
      loading: false,
      current: null,
      next: null,
      moon: null,
      error: "",
      signature: "",
      updatedAt: ""
    };
    let navigationMapState = {
      map: null,
      marker: null,
      satelliteLayer: null,
      trackLine: null,
      trackPoints: [],
      plannedRouteLayer: null,
      itineraryLayer: null,
      itinerarySignature: "",
      plannedRouteVisible: true,
      plannedRouteToggleTouched: false,
      followVessel: true,
      initialized: false,
      lastPositionKey: "",
      hasCentered: false,
      tileRecovery: createMapTileRecoveryState("navigation", "navigationMapUnavailableNotice")
    };
    let navigationTrackData = {
      charter: "",
      startedAt: "",
      updatedAt: "",
      retentionDaysAfterCharter: 3,
      points: []
    };
    let obsFeedState = {
      startToken: 0,
      retryTimer: null,
      retryAttempt: 0,
      failureLogged: false,
      lastConfigSignature: "",
      lastEnabled: IDLE_SCREENSAVER_DEFAULTS.obsFeedEnabled,
      lastLoadedEnabled: null,
      lastIdleDecisionSignature: ""
    };
    let idleState = {
      active: false,
      enabled: false,
      initialized: false,
      timerId: 0,
      timeoutMs: IDLE_SCREENSAVER_DEFAULTS.timeout_seconds * 1000,
      lastMousemoveAt: 0,
      zoomIndex: 0,
      showingObsFeed: false,
      obsFeedReady: false,
      transitioning: false
    };
    let idleMapState = {
      map: null,
      marker: null,
      satelliteLayer: null,
      trackLine: null,
      plannedRouteLayer: null,
      itineraryLayer: null,
      itinerarySignature: "",
      hasCentered: false,
      lastPositionKey: "",
      tileRecovery: createMapTileRecoveryState("idle", "idleDashboardMapUnavailableNotice")
    };
    let plannedRouteData = {
      source: null,
      routes: [],
      route: {
        primary: { source: null, routes: [] },
        alternative: { source: null, routes: [] }
      },
      requestedPlan: "primary",
      activePlan: "primary",
      fallbackPlan: "",
      routeCount: 0,
      coordinateCount: 0
    };
    let deferredInstallPromptEvent = null;

    function isTabletOrLarger() {
      return window.innerWidth >= 700;
    }

    function redirectToGuestLanding() {
      window.location.href = "/";
    }

    async function loadJSON(path) {
      const res = await fetch(path, { cache: "no-store" });
      if (!res.ok) throw new Error(`Failed to load ${path}: ${res.status}`);
      const text = await res.text();
      try {
        return JSON.parse(text);
      } catch (err) {
        throw new Error(`Failed to parse ${path}: ${err.message}`);
      }
    }

    async function loadCharterBundle() {
      try {
        return await loadJSON(CHARTER_API_URL);
      } catch (error) {
        console.error(error);
        return {
          settings: DEFAULT_SETTINGS_DATA,
          navigation: DEFAULT_NAVIGATION_DATA,
          itinerary: {},
          menus: {},
          drinks: {},
          notices: {},
          sites: { sites: [] },
          vessel: {}
        };
      }
    }

    function syncSiteFooterVersion(data) {
      const versionNode = document.getElementById("siteFooterVersion");
      if (!versionNode) {
        return;
      }

      const branch = data && typeof data.branch === "string" ? data.branch.trim() : "";
      const build = data && typeof data.build === "string" ? data.build.trim() : "";
      if (!branch || !build) {
        versionNode.hidden = true;
        versionNode.textContent = "";
        return;
      }

      versionNode.textContent = `(${branch}-${build})`;
      versionNode.hidden = false;
    }

    async function loadSiteFooterVersion() {
      try {
        syncSiteFooterVersion(await loadJSON(VERSION_API_URL));
      } catch (error) {
        syncSiteFooterVersion(null);
      }
    }

    function logObsFeed(level, message, detail) {
      if (typeof console === "undefined") {
        return;
      }
      const logger = typeof console[level] === "function" ? console[level] : console.log;
      if (detail === undefined) {
        logger.call(console, `[obs] ${message}`);
      } else {
        logger.call(console, `[obs] ${message}`, detail);
      }
    }

    function logIdleObsDecision(message, detail) {
      const signature = `${message}|${detail || ""}`;
      if (signature === obsFeedState.lastIdleDecisionSignature) {
        return;
      }
      obsFeedState.lastIdleDecisionSignature = signature;
      logObsFeed("info", message, detail);
    }

    function isStandaloneDisplayMode() {
      return window.matchMedia("(display-mode: standalone)").matches
        || window.navigator.standalone === true;
    }

    function isLikelyMobileOrTablet() {
      const userAgent = navigator.userAgent || "";
      const touchScreen = navigator.maxTouchPoints > 0 || window.matchMedia("(pointer: coarse)").matches;
      const compactViewport = window.matchMedia("(max-width: 1180px)").matches;
      return (touchScreen && compactViewport)
        || /Android|iPhone|iPad|iPod|Mobile|Tablet|Silk|Kindle/i.test(userAgent)
        || (/Macintosh/i.test(userAgent) && navigator.maxTouchPoints > 1);
    }

    function isIosDevice() {
      const userAgent = navigator.userAgent || "";
      return /iPhone|iPad|iPod/i.test(userAgent)
        || (/Macintosh/i.test(userAgent) && navigator.maxTouchPoints > 1);
    }

    function installPromptDismissed() {
      try {
        return window.localStorage.getItem(INSTALL_PROMPT_DISMISSED_KEY) === "1";
      } catch (error) {
        return false;
      }
    }

    function dismissInstallPrompt() {
      try {
        window.localStorage.setItem(INSTALL_PROMPT_DISMISSED_KEY, "1");
      } catch (error) {
        // Storage can be unavailable in private browsing; hiding for this view is enough.
      }
      const prompt = document.getElementById("installPrompt");
      if (prompt) {
        prompt.hidden = true;
      }
    }

    function syncInstallPrompt() {
      const prompt = document.getElementById("installPrompt");
      const hint = document.getElementById("installPromptHint");
      const installButton = document.getElementById("installPromptButton");
      if (!prompt || !hint || !installButton) {
        return;
      }

      const shouldShow = !isStandaloneDisplayMode()
        && isLikelyMobileOrTablet()
        && !installPromptDismissed();

      if (!shouldShow) {
        prompt.hidden = true;
        return;
      }

      hint.textContent = isIosDevice()
        ? "Tap Share, then Add to Home Screen."
        : (deferredInstallPromptEvent ? "Tap Install to add it now." : "Use your browser menu to add this page to your Home Screen.");
      installButton.hidden = !deferredInstallPromptEvent;
      prompt.hidden = false;
    }

    function initializeInstallPrompt() {
      const dismissButton = document.getElementById("installPromptDismiss");
      const installButton = document.getElementById("installPromptButton");

      if (dismissButton) {
        dismissButton.addEventListener("click", dismissInstallPrompt);
      }

      if (installButton) {
        installButton.addEventListener("click", async () => {
          if (!deferredInstallPromptEvent) {
            return;
          }
          const promptEvent = deferredInstallPromptEvent;
          deferredInstallPromptEvent = null;
          installButton.disabled = true;
          try {
            promptEvent.prompt();
            const choice = await promptEvent.userChoice;
            if (choice && choice.outcome === "accepted") {
              dismissInstallPrompt();
            }
          } catch (error) {
            // Installation is browser-controlled; failure should not affect the portal.
          } finally {
            installButton.disabled = false;
            syncInstallPrompt();
          }
        });
      }

      window.addEventListener("beforeinstallprompt", event => {
        event.preventDefault();
        deferredInstallPromptEvent = event;
        syncInstallPrompt();
      });

      window.addEventListener("appinstalled", () => {
        deferredInstallPromptEvent = null;
        dismissInstallPrompt();
      });

      window.addEventListener("resize", syncInstallPrompt);
      syncInstallPrompt();
    }

    function registerGuestServiceWorker() {
      if (!("serviceWorker" in navigator)) {
        return;
      }

      window.addEventListener("load", () => {
        navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(() => {});
      });
    }

    function el(tag, attrs = {}, children = []) {
      const node = document.createElement(tag);
      Object.entries(attrs).forEach(([key, value]) => {
        if (key === "class") node.className = value;
        else if (key === "html") node.innerHTML = value;
        else node.setAttribute(key, value);
      });
      children.forEach(child => {
        if (typeof child === "string") node.appendChild(document.createTextNode(child));
        else if (child) node.appendChild(child);
      });
      return node;
    }

    function safeText(value, fallback = "") {
      if (value === null || value === undefined) return fallback;
      if (typeof value === "number" && !Number.isFinite(value)) return fallback;
      if (typeof value === "object" || typeof value === "function") return fallback;
      const text = String(value).trim();
      const lower = text.toLowerCase();
      if (!text || lower === "null" || lower === "undefined" || lower === "nan") return fallback;
      return text;
    }

    function firstSafeText(...values) {
      for (const value of values) {
        const text = safeText(value);
        if (text) {
          return text;
        }
      }
      return "";
    }

    function replaceNodeChildren(node, ...children) {
      if (!node) {
        return;
      }

      if (typeof node.replaceChildren === "function") {
        node.replaceChildren(...children);
        return;
      }

      while (node.firstChild) {
        node.removeChild(node.firstChild);
      }

      children.forEach(child => {
        if (typeof child === "string") node.appendChild(document.createTextNode(child));
        else if (child) node.appendChild(child);
      });
    }

    function removeNode(node) {
      if (!node) {
        return;
      }

      if (typeof node.remove === "function") {
        node.remove();
        return;
      }

      if (node.parentNode) {
        node.parentNode.removeChild(node);
      }
    }

    function replaceNode(node, nextNode) {
      if (!node || !nextNode) {
        return;
      }

      if (typeof node.replaceWith === "function") {
        node.replaceWith(nextNode);
        return;
      }

      if (node.parentNode) {
        node.parentNode.replaceChild(nextNode, node);
      }
    }

    function setOptionalStatus(node, message, show = true) {
      if (!node) {
        return;
      }

      const text = typeof message === "string" ? message.trim() : "";
      node.textContent = text;
      node.hidden = !show || !text;
    }

    function formatDisplayDate(value) {
      if (!value) {
        return "";
      }

      const parsed = new Date(value);
      if (Number.isNaN(parsed.getTime())) {
        return String(value);
      }

      return parsed.toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric"
      });
    }

    function twoDigitNumber(value) {
      const numeric = Number(value);
      return numeric < 10 ? `0${numeric}` : String(numeric);
    }

    function normalizeDateKey(value) {
      const text = getItineraryTextValue(value);
      if (!text) {
        return "";
      }

      if (/^\d{4}-\d{2}-\d{2}$/.test(text)) {
        return text;
      }

      const parsed = new Date(text);
      if (Number.isNaN(parsed.getTime())) {
        return text.slice(0, 10);
      }

      return `${parsed.getFullYear()}-${twoDigitNumber(parsed.getMonth() + 1)}-${twoDigitNumber(parsed.getDate())}`;
    }

    function itineraryDateKeyToLocalDate(value) {
      const key = normalizeDateKey(value);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(key)) {
        return null;
      }

      const [year, month, day] = key.split("-").map(part => Number(part));
      if (![year, month, day].every(part => Number.isFinite(part))) {
        return null;
      }

      const date = new Date(year, month - 1, day);
      if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
        return null;
      }
      return date;
    }

    function localDateKeyFromDate(date) {
      if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
        return "";
      }
      return `${date.getFullYear()}-${twoDigitNumber(date.getMonth() + 1)}-${twoDigitNumber(date.getDate())}`;
    }

    function normalizeLocalDate(dateLike) {
      if (dateLike instanceof Date) {
        return Number.isNaN(dateLike.getTime())
          ? null
          : new Date(dateLike.getFullYear(), dateLike.getMonth(), dateLike.getDate());
      }

      const dateKey = normalizeDateKey(dateLike);
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateKey)) {
        return itineraryDateKeyToLocalDate(dateKey);
      }

      const parsed = new Date(dateLike);
      if (Number.isNaN(parsed.getTime())) {
        return null;
      }
      return new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
    }

    function localDateDayDifference(laterDateLike, earlierDateLike) {
      const laterDate = normalizeLocalDate(laterDateLike);
      const earlierDate = normalizeLocalDate(earlierDateLike);
      if (!laterDate || !earlierDate) {
        return NaN;
      }

      // Rounded local-midnight deltas stay stable across DST boundaries.
      return Math.round((laterDate.getTime() - earlierDate.getTime()) / LOCAL_DAY_MS);
    }

    function calculateCurrentCharterDayState(options = {}) {
      const dayNumbers = Array.isArray(options.dayNumbers)
        ? options.dayNumbers
          .map(value => Number(value))
          .filter(value => Number.isFinite(value) && value > 0)
          .map(value => Math.round(value))
        : [];
      const firstDayNumber = dayNumbers.length ? Math.min(...dayNumbers) : 1;
      const finalDayNumber = dayNumbers.length ? Math.max(...dayNumbers) : firstDayNumber;
      const today = normalizeLocalDate(options.today === undefined ? new Date() : options.today);
      const startDate = normalizeLocalDate(options.startDate);
      const endDate = normalizeLocalDate(options.endDate);
      const localDateKey = localDateKeyFromDate(today);
      const charterStartKey = localDateKeyFromDate(startDate);
      const charterEndKey = localDateKeyFromDate(endDate);

      if (!today || !startDate) {
        return {
          canCalculateCurrentDay: false,
          defaultDayNumber: firstDayNumber,
          currentDayNumber: null,
          allDaysPast: false,
          firstDayNumber,
          finalDayNumber,
          localDateKey,
          charterStartKey,
          charterEndKey
        };
      }

      const dayOffset = localDateDayDifference(today, startDate);
      if (!Number.isFinite(dayOffset)) {
        return {
          canCalculateCurrentDay: false,
          defaultDayNumber: firstDayNumber,
          currentDayNumber: null,
          allDaysPast: false,
          firstDayNumber,
          finalDayNumber,
          localDateKey,
          charterStartKey,
          charterEndKey
        };
      }

      if (dayOffset < 0) {
        return {
          canCalculateCurrentDay: false,
          defaultDayNumber: firstDayNumber,
          currentDayNumber: null,
          allDaysPast: false,
          firstDayNumber,
          finalDayNumber,
          localDateKey,
          charterStartKey,
          charterEndKey
        };
      }

      const currentDayNumber = firstDayNumber + dayOffset;
      const charterEnded = !!(endDate && localDateDayDifference(today, endDate) > 0);
      if (charterEnded || currentDayNumber > finalDayNumber) {
        return {
          canCalculateCurrentDay: true,
          defaultDayNumber: finalDayNumber,
          currentDayNumber: null,
          allDaysPast: true,
          firstDayNumber,
          finalDayNumber,
          localDateKey,
          charterStartKey,
          charterEndKey
        };
      }

      return {
        canCalculateCurrentDay: true,
        defaultDayNumber: Math.max(firstDayNumber, currentDayNumber),
        currentDayNumber: Math.max(firstDayNumber, currentDayNumber),
        allDaysPast: false,
        firstDayNumber,
        finalDayNumber,
        localDateKey,
        charterStartKey,
        charterEndKey
      };
    }

    function itineraryOrdinalDayNumber(value) {
      const numeric = Number(value);
      if (!Number.isFinite(numeric)) {
        return "";
      }
      const day = Math.round(numeric);
      const mod100 = day % 100;
      const suffix = mod100 >= 11 && mod100 <= 13
        ? "th"
        : ({ 1: "st", 2: "nd", 3: "rd" }[day % 10] || "th");
      return `${day}${suffix}`;
    }

    function formatItineraryPillHoverDate(date) {
      if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
        return "";
      }
      const weekday = date.toLocaleDateString(undefined, { weekday: "long" });
      const month = date.toLocaleDateString(undefined, { month: "long" });
      return [
        weekday,
        `${itineraryOrdinalDayNumber(date.getDate())} ${month}`,
        String(date.getFullYear())
      ].join("\n");
    }

    function guestItineraryDayHoverDateLabel(itineraryInfo, day) {
      const dayNumber = Number(day && day.dayNumber);
      const fallback = day && day.day
        ? day.day
        : `Day ${Number.isFinite(dayNumber) && dayNumber > 0 ? Math.round(dayNumber) : ""}`.trim();
      const explicitDate = itineraryDateKeyToLocalDate(day && day.date);
      if (explicitDate) {
        return formatItineraryPillHoverDate(explicitDate);
      }

      const startDate = itineraryDateKeyToLocalDate(itineraryInfo && itineraryInfo.start_date);
      if (!startDate || !Number.isFinite(dayNumber) || dayNumber < 1) {
        return fallback || "Itinerary day";
      }

      const date = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + Math.round(dayNumber) - 1);
      return formatItineraryPillHoverDate(date) || fallback || "Itinerary day";
    }

    function getCurrentDateKey() {
      return localDateKeyFromDate(normalizeLocalDate(new Date()));
    }

    function formatCharterDayLabel(value, fallbackIndex) {
      const numeric = Number(value);
      if (Number.isFinite(numeric) && numeric > 0) {
        return `Day ${Math.round(numeric)}`;
      }

      const text = getItineraryTextValue(value);
      if (text) {
        return /^\d+$/.test(text) ? `Day ${text}` : text;
      }

      return `Day ${fallbackIndex + 1}`;
    }

    function itineraryDayNumberValue(entry, fallbackIndex = 0) {
      const numeric = Number(entry && (entry.charter_day || entry.day || entry.order || fallbackIndex + 1));
      return Number.isFinite(numeric) && numeric > 0 ? Math.round(numeric) : fallbackIndex + 1;
    }

    function getSiteEntries(source = charterSitesData) {
      return source && Array.isArray(source.sites)
        ? source.sites.filter(site => site && (site.id || site.title))
        : [];
    }

    function getSiteById(siteId, source = charterSitesData) {
      const normalizedId = getItineraryTextValue(siteId);
      if (!normalizedId) {
        return null;
      }

      const entries = getSiteEntries(source);
      for (const site of entries) {
        if (getItineraryTextValue(site.id) === normalizedId) {
          return site;
        }
      }

      return null;
    }

    function getMenuEntries(source) {
      const data = source && typeof source === "object" ? source : {};
      if (Array.isArray(data.menus)) {
        return data.menus.filter(entry => entry && typeof entry === "object");
      }

      return Object.keys(data).length ? [data] : [];
    }

    function menuEntryDayNumber(entry, index = 0) {
      const numeric = Number(entry && (entry.charter_day || entry.day || entry.order || index + 1));
      return Number.isFinite(numeric) && numeric > 0 ? Math.round(numeric) : index + 1;
    }

    function logGuestPortalMenuDaySelection(dayState, selectedMenu) {
      const selectedMenuDayNumber = Number(selectedMenu && selectedMenu.charter_day);
      const selectedMenuDate = normalizeDateKey(selectedMenu && selectedMenu.date);
      console.info(
        `[guest-portal] local_date=${dayState.localDateKey || "unknown"} charter_start=${dayState.charterStartKey || "unknown"} current_charter_day=${Number.isFinite(dayState.currentDayNumber) ? dayState.currentDayNumber : (dayState.allDaysPast ? dayState.finalDayNumber : "unknown")} selected_menu_day=${Number.isFinite(selectedMenuDayNumber) ? Math.round(selectedMenuDayNumber) : "unknown"} selected_menu_date=${selectedMenuDate || "unknown"}`
      );
    }

    function getSelectedMenuEntry(source) {
      const entries = getMenuEntries(source).filter(entry => entry.active !== false);
      const dayState = calculateCurrentCharterDayState({
        startDate: itineraryData && itineraryData.start_date,
        endDate: itineraryData && itineraryData.end_date,
        dayNumbers: entries.map((entry, index) => menuEntryDayNumber(entry, index))
      });
      const todayKey = dayState.localDateKey || getCurrentDateKey();
      const dayMatch = dayState.canCalculateCurrentDay && Number.isFinite(dayState.defaultDayNumber)
        ? entries.find((entry, index) => menuEntryDayNumber(entry, index) === dayState.defaultDayNumber)
        : null;
      const datedMatch = entries.find(entry => normalizeDateKey(entry.date) === todayKey);
      const selectedMenu = dayMatch || datedMatch || entries[0] || {};
      logGuestPortalMenuDaySelection(dayState, selectedMenu);
      return selectedMenu;
    }

    const MENU_LOCKED_SECTION_KEYS = Object.freeze(["breakfast", "lunch", "dinner"]);
    const MENU_LEGACY_SECTION_KEYS = Object.freeze([...MENU_LOCKED_SECTION_KEYS, "snacks"]);

    function menuSectionTitle(key) {
      return getItineraryTextValue(key)
        .replace(/[-_]+/g, " ")
        .replace(/\b\w/g, letter => letter.toUpperCase());
    }

    function normalizeMenuSectionName(value) {
      return getItineraryTextValue(value).replace(/\s+/g, " ").trim().toLowerCase();
    }

    function menuLockedSectionKey(value) {
      const key = normalizeMenuSectionName(value).replace(/\s+/g, "_");
      return MENU_LOCKED_SECTION_KEYS.includes(key) ? key : "";
    }

    function menuLockedSectionKeyFromChild(child) {
      if (!child || typeof child !== "object") {
        return "";
      }

      return menuLockedSectionKey(child.type || child.key || child.id || child.name || child.title || child.label);
    }

    function normalizeMenuFoodItem(item) {
      if (typeof item === "string") {
        const name = item.trim();
        return name ? { name, description: "" } : null;
      }

      if (!item || typeof item !== "object") {
        return null;
      }

      const name = getItineraryTextValue(item.name, item.title);
      const description = getItineraryTextValue(item.description, item.notes);
      if (!name && !description) {
        return null;
      }

      return { ...item, name: name || "Item", description };
    }

    function normalizeMenuFoodItems(items) {
      return (Array.isArray(items) ? items : [])
        .map(normalizeMenuFoodItem)
        .filter(Boolean);
    }

    function getValidMenuChildren(day) {
      const source = day && typeof day === "object" ? day : {};
      const children = Array.isArray(source.children) ? source.children : [];
      return children.filter(child => child && typeof child === "object" && (
        menuLockedSectionKeyFromChild(child) ||
        getItineraryTextValue(child.name, child.title, child.label)
      ));
    }

    function normalizeMenuChildSections(day, validChildren = getValidMenuChildren(day)) {
      if (!validChildren.length) {
        return [];
      }

      const lockedSections = new Map();
      const customSections = [];
      const customNames = new Set();

      validChildren.forEach((child, index) => {
        const hidden = child.hidden === true || child.visible === false;
        const lockedKey = menuLockedSectionKeyFromChild(child);
        const items = normalizeMenuFoodItems(child.items);
        if (lockedKey) {
          if (!lockedSections.has(lockedKey)) {
            lockedSections.set(lockedKey, {
              key: lockedKey,
              title: menuSectionTitle(lockedKey),
              hidden,
              items
            });
          }
          return;
        }

        if (hidden || !items.length) {
          return;
        }

        const title = getItineraryTextValue(child.name, child.title, child.label, `Section ${index + 1}`);
        const nameKey = normalizeMenuSectionName(title);
        if (!title || customNames.has(nameKey) || MENU_LOCKED_SECTION_KEYS.some(key => normalizeMenuSectionName(menuSectionTitle(key)) === nameKey)) {
          return;
        }

        customNames.add(nameKey);
        customSections.push({
          key: child.key || "",
          title,
          hidden: false,
          items
        });
      });

      const orderedLocked = MENU_LOCKED_SECTION_KEYS
        .map(key => lockedSections.get(key))
        .filter(section => section && section.hidden !== true && section.items.length);

      return [...orderedLocked, ...customSections];
    }

    function normalizeLegacyMenuSections(day) {
      const source = day && typeof day === "object" ? day : {};
      const legacyItems = Object.fromEntries(MENU_LEGACY_SECTION_KEYS.map(key => [key, normalizeMenuFoodItems(source[key])]));
      const hasCoreMealItems = MENU_LOCKED_SECTION_KEYS.some(key => legacyItems[key].length);
      const sections = [];

      MENU_LOCKED_SECTION_KEYS.forEach(key => {
        if (hasCoreMealItems || legacyItems[key].length) {
          sections.push({
            key,
            title: menuSectionTitle(key),
            items: legacyItems[key],
            showEmpty: hasCoreMealItems
          });
        }
      });

      if (legacyItems.snacks.length) {
        sections.push({
          key: "snacks",
          title: "Snacks",
          items: legacyItems.snacks,
          showEmpty: false
        });
      }

      return sections;
    }

    function normalizeMenuDaySections(day) {
      const validChildren = getValidMenuChildren(day);
      return validChildren.length ? normalizeMenuChildSections(day, validChildren) : normalizeLegacyMenuSections(day);
    }

    function getDocumentFullscreenElement() {
      return document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement || null;
    }

    async function requestElementFullscreen(node) {
      if (!node) {
        return false;
      }

      const request = node.requestFullscreen || node.webkitRequestFullscreen || node.msRequestFullscreen;
      if (typeof request === "function") {
        const result = request.call(node);
        if (result && typeof result.then === "function") {
          await result;
        }
        return true;
      }

      const video = node.querySelector && node.querySelector("video");
      if (video && typeof video.webkitEnterFullscreen === "function") {
        video.webkitEnterFullscreen();
        return true;
      }

      return false;
    }

    async function exitActiveFullscreen() {
      const exit = document.exitFullscreen || document.webkitExitFullscreen || document.msExitFullscreen;
      if (typeof exit !== "function") {
        return;
      }

      const result = exit.call(document);
      if (result && typeof result.then === "function") {
        await result;
      }
    }

    function bindNavigationFeedFullscreen(shell) {
      if (!shell || shell.dataset.fullscreenBound === "true") {
        return shell;
      }

      shell.dataset.fullscreenBound = "true";
      shell.tabIndex = 0;
      shell.setAttribute("role", "button");
      shell.setAttribute("aria-label", "Navigation feed. Double-click for full screen; click or Escape to exit.");

      const syncState = () => {
        shell.classList.toggle("is-fullscreen", getDocumentFullscreenElement() === shell);
      };

      shell.addEventListener("dblclick", event => {
        event.preventDefault();
        if (getDocumentFullscreenElement() === shell) {
          exitActiveFullscreen().catch(() => {});
          return;
        }
        requestElementFullscreen(shell).catch(() => {});
      });

      shell.addEventListener("click", () => {
        if (getDocumentFullscreenElement() === shell) {
          exitActiveFullscreen().catch(() => {});
        }
      });

      shell.addEventListener("keydown", event => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          if (getDocumentFullscreenElement() === shell) {
            exitActiveFullscreen().catch(() => {});
            return;
          }
          requestElementFullscreen(shell).catch(() => {});
        }
      });

      document.addEventListener("fullscreenchange", syncState);
      document.addEventListener("webkitfullscreenchange", syncState);
      shell._navigationFeedCleanup = () => {
        document.removeEventListener("fullscreenchange", syncState);
        document.removeEventListener("webkitfullscreenchange", syncState);
        shell._navigationFeedCleanup = null;
      };
      syncState();
      return shell;
    }

    function wrapNavigationFeed(mediaNode, statusNode = null, attributes = {}) {
      const children = [mediaNode];
      if (statusNode) {
        children.push(statusNode);
      }
      const className = attributes.class
        ? `navigation-feed-shell ${attributes.class}`
        : "navigation-feed-shell";
      return bindNavigationFeedFullscreen(el("div", {
        ...attributes,
        class: className
      }, children));
    }

    function syncSiteFooterVisibility() {
      const footer = document.getElementById("siteFooter");
      if (!footer) {
        return;
      }

      footer.hidden = document.body.classList.contains("idle-active");
    }

    function getBaseTabs() {
      const configuredTabs = siteData && Array.isArray(siteData.tabs)
        ? siteData.tabs.filter(tab => tab && SUPPORTED_STATIC_TAB_IDS.has(tab.id))
        : [];
      const tabs = configuredTabs.length ? configuredTabs.slice() : defaultTabs.slice();
      if (!tabs.some(tab => tab.id === SAFETY_TAB.id)) {
        tabs.push(SAFETY_TAB);
      }
      return tabs;
    }

    function getRenderedTabs() {
      const tabs = getBaseTabs().slice();
      if (weatherState.visible) {
        const navigationIndex = tabs.findIndex(tab => tab.id === "navigation");
        tabs.splice(navigationIndex >= 0 ? navigationIndex + 1 : tabs.length, 0, WEATHER_TAB);
      }
      return tabs;
    }

    function renderTabs() {
      const tabsWrap = document.getElementById("tabs");
      tabsWrap.innerHTML = "";
      const tabs = getRenderedTabs();

      if (!tabs.some(tab => tab.id === currentTabId)) {
        currentTabId = tabs[0] ? tabs[0].id : defaultTabs[0].id;
      }

      tabs.forEach(tab => {
        const btn = el("button", {
          class: "tab-btn" + (tab.id === currentTabId ? " active" : ""),
          "data-tab": tab.id,
          type: "button"
        }, [tab.label]);

        btn.addEventListener("click", () => activateTab(tab.id));
        tabsWrap.appendChild(btn);
      });
    }

    function activateTab(tabId) {
      const tabs = getRenderedTabs();
      const targetTabId = tabs.some(tab => tab.id === tabId)
        ? tabId
        : (tabs[0] ? tabs[0].id : defaultTabs[0].id);
      currentTabId = targetTabId;

      document.querySelectorAll(".tab-btn").forEach(btn => {
        btn.classList.toggle("active", btn.dataset.tab === targetTabId);
      });
      document.querySelectorAll(".tab-panel").forEach(panel => {
        panel.classList.toggle("active", panel.id === `panel-${targetTabId}`);
      });
      history.replaceState(null, "", `#${targetTabId}`);

      if (targetTabId === "navigation") {
        window.requestAnimationFrame(() => {
          invalidateNavigationMapSize();
          window.setTimeout(() => invalidateNavigationMapSize(), 120);
        });
        startObsFeed({ forceReload: false, resetFailureCycle: true });
      } else {
        stopObsFeed();
      }

      window.requestAnimationFrame(syncSiteFooterVisibility);
    }

    function makeList(items, formatter) {
      const ul = el("ul", { class: "list" });
      items.forEach(item => ul.appendChild(formatter(item)));
      return ul;
    }

    function getSafetyDocumentById(documentId) {
      return SAFETY_DOCUMENTS.find(document => document.id === documentId) || SAFETY_DOCUMENTS[0] || null;
    }

    function getSafetyDocumentViewerSrc(path) {
      const documentPath = typeof path === "string" ? path.trim() : "";
      if (!documentPath) {
        return "";
      }

      return documentPath.includes("#")
        ? `${documentPath}&toolbar=0&navpanes=0&scrollbar=0`
        : `${documentPath}#toolbar=0&navpanes=0&scrollbar=0`;
    }

    function isBrowserEmbeddableUrl(url) {
      return /^(https?:\/\/|\/|\.\/|\.\.\/)/i.test((url || "").trim());
    }

    function isHlsPlaylistUrl(url) {
      return /\.m3u8($|[?#])/i.test((url || "").trim());
    }

    function resolveNavigationHlsUrl(data) {
      const explicitHlsUrl = (data.hls_url || "").trim();
      if (isBrowserEmbeddableUrl(explicitHlsUrl)) {
        return explicitHlsUrl;
      }

      const legacyStreamUrl = (data.stream_url || "").trim();
      if (isBrowserEmbeddableUrl(legacyStreamUrl) && isHlsPlaylistUrl(legacyStreamUrl)) {
        return legacyStreamUrl;
      }

      const streamKey = (data.stream_key || "").trim();

      if (!legacyStreamUrl || !streamKey || !isBrowserEmbeddableUrl(legacyStreamUrl)) {
        return "";
      }

      try {
        return new URL(`/hls/${encodeURIComponent(streamKey)}.m3u8`, legacyStreamUrl).toString();
      } catch (error) {
        return "";
      }
    }

    function setNavigationStreamStatus(node, message) {
      setOptionalStatus(node, message, true);
    }

    function clearObsFeedRetryTimer() {
      if (obsFeedState.retryTimer) {
        window.clearTimeout(obsFeedState.retryTimer);
        obsFeedState.retryTimer = null;
      }
    }

    function resetObsFeedFailureCycle() {
      clearObsFeedRetryTimer();
      obsFeedState.retryAttempt = 0;
      obsFeedState.failureLogged = false;
    }

    function scheduleObsFeedRetry(statusNode, reason) {
      if (!isObsFeedEnabled(getIdleScreensaverSettings()) || currentTabId !== "navigation") {
        return;
      }

      if (obsFeedState.retryTimer) {
        return;
      }

      if (obsFeedState.retryAttempt >= OBS_RETRY_MAX_ATTEMPTS) {
        if (!obsFeedState.failureLogged) {
          logObsFeed("warn", "OBS feed unavailable.", reason || "Unknown OBS feed error.");
          obsFeedState.failureLogged = true;
        }
        setNavigationStreamStatus(
          statusNode,
          "OBS feed is unavailable. It will retry when Navigation is opened again or settings change."
        );
        return;
      }

      const delay = Math.min(
        OBS_RETRY_MAX_MS,
        OBS_RETRY_BASE_MS * Math.pow(2, Math.max(0, obsFeedState.retryAttempt))
      );
      obsFeedState.retryAttempt += 1;

      if (!obsFeedState.failureLogged) {
        logObsFeed("warn", "OBS feed unavailable.", reason || "Unknown OBS feed error.");
        obsFeedState.failureLogged = true;
      }

      setNavigationStreamStatus(
        statusNode,
        `OBS feed is unavailable. Retrying in ${Math.round(delay / 1000)} seconds.`
      );

      const token = obsFeedState.startToken;
      obsFeedState.retryTimer = window.setTimeout(() => {
        obsFeedState.retryTimer = null;
        if (token !== obsFeedState.startToken || currentTabId !== "navigation" || !isObsFeedEnabled(getIdleScreensaverSettings())) {
          return;
        }
        startObsFeed({ forceReload: true });
      }, delay);
    }

    function cleanupNavigationVideo(video) {
      if (!video) {
        return;
      }

      if (Array.isArray(video._obsEventCleanups)) {
        video._obsEventCleanups.forEach(cleanup => {
          try {
            cleanup();
          } catch (error) {
            // Ignore listener cleanup issues during teardown.
          }
        });
        video._obsEventCleanups = [];
      }

      if (video._obsStartupTimer) {
        window.clearTimeout(video._obsStartupTimer);
        video._obsStartupTimer = null;
      }

      if (video._hls && typeof video._hls.destroy === "function") {
        video._hls.destroy();
        video._hls = null;
      }

      try {
        video.pause();
      } catch (error) {
        // Ignore media pause issues during teardown.
      }

      video.removeAttribute("src");
      try {
        video.load();
      } catch (error) {
        // Ignore media reset issues during teardown.
      }
      if (video._obsPlayerStarted) {
        logObsFeed("info", "OBS player destroyed.");
      }
      video._obsPlayerStarted = false;
    }

    function initializeNavigationHlsPlayer(video, hlsUrl, statusNode, options = {}) {
      if (!video || !hlsUrl || !video.isConnected || video._obsPlayerStarted) {
        return;
      }

      const managedRetry = Boolean(options.managedRetry);
      const shell = video.closest(".navigation-feed-shell");
      let failureReported = false;
      let readyReported = false;
      video._obsPlayerStarted = true;
      video._obsEventCleanups = [];

      const addVideoListener = (type, handler) => {
        video.addEventListener(type, handler);
        video._obsEventCleanups.push(() => video.removeEventListener(type, handler));
      };

      const setShellState = (state, message) => {
        if (shell) {
          shell.classList.toggle("is-loading", state === "loading");
          shell.classList.toggle("is-unavailable", state === "unavailable");
        }
        if (message) {
          setNavigationStreamStatus(statusNode, message);
        } else {
          setOptionalStatus(statusNode, "", false);
        }
      };

      const markReady = () => {
        if (readyReported) {
          return;
        }
        readyReported = true;
        failureReported = false;
        setShellState("ready", "");
        if (managedRetry) {
          resetObsFeedFailureCycle();
        }
        if (typeof options.onReady === "function") {
          options.onReady();
        }
      };

      const reportFailure = message => {
        if (!failureReported) {
          setShellState("unavailable", message);
          failureReported = true;
          if (typeof options.onFailure === "function") {
            options.onFailure(message);
          }
        }
        if (managedRetry) {
          scheduleObsFeedRetry(statusNode, message);
        }
      };

      setShellState("loading", "Connecting to OBS feed.");

      addVideoListener("playing", () => {
        markReady();
      });

      addVideoListener("error", () => {
        reportFailure("The OBS feed is unavailable right now.");
        if (managedRetry) {
          video.removeAttribute("src");
          try {
            video.load();
          } catch (error) {
            // Ignore media reset issues; the retry path rebuilds the player.
          }
        }
      });

      const startPlayback = () => {
        video.play().catch(() => {
          reportFailure("OBS feed could not start automatically.");
        });
      };

      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = hlsUrl;
        video.load();
        startPlayback();
        return;
      }

      if (window.Hls && window.Hls.isSupported()) {
        const hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 30,
          manifestLoadingMaxRetry: 1,
          manifestLoadingRetryDelay: 1000,
          manifestLoadingMaxRetryTimeout: 4000,
          levelLoadingMaxRetry: 1,
          levelLoadingRetryDelay: 1000,
          levelLoadingMaxRetryTimeout: 4000,
          fragLoadingMaxRetry: 1,
          fragLoadingRetryDelay: 1000,
          fragLoadingMaxRetryTimeout: 4000
        });

        video._hls = hls;
        hls.attachMedia(video);
        const onMediaAttached = () => {
          if (!video.isConnected || (managedRetry && !isObsFeedEnabled(getIdleScreensaverSettings()))) {
            return;
          }
          hls.loadSource(hlsUrl);
        };
        const onManifestParsed = () => {
          markReady();
          startPlayback();
        };
        const onHlsError = (_event, data) => {
          if (data && data.fatal) {
            const detail = data.details || data.type || "unknown error";
            reportFailure(`OBS feed is unavailable (${detail}).`);
            cleanupNavigationVideo(video);
          }
        };
        hls.on(window.Hls.Events.MEDIA_ATTACHED, onMediaAttached);
        hls.on(window.Hls.Events.MANIFEST_PARSED, onManifestParsed);
        hls.on(window.Hls.Events.ERROR, onHlsError);
        video._obsEventCleanups.push(() => {
          hls.off(window.Hls.Events.MEDIA_ATTACHED, onMediaAttached);
          hls.off(window.Hls.Events.MANIFEST_PARSED, onManifestParsed);
          hls.off(window.Hls.Events.ERROR, onHlsError);
        });
        return;
      }

      reportFailure("This browser cannot play the HLS plotter stream.");
    }

    function buildNavigationHlsPlayer(hlsUrl, options = {}) {
      const video = el("video", {
        class: "stream-frame",
        autoplay: "true",
        muted: "true",
        playsinline: "true",
        preload: "auto",
        crossorigin: "anonymous",
        controlslist: "nodownload nofullscreen noremoteplayback",
        disablepictureinpicture: "true",
        disableremoteplayback: "true",
        tabindex: "-1"
      });
      const status = el("p", { class: "footer-note navigation-feed-status", hidden: "hidden" });

      video.muted = true;
      video.autoplay = true;
      video.playsInline = true;
      video.controls = false;
      video.disablePictureInPicture = true;
      video.disableRemotePlayback = true;
      video.removeAttribute("controls");

      video._obsStartupTimer = window.setTimeout(() => {
        video._obsStartupTimer = null;
        if (!video.isConnected) {
          return;
        }
        initializeNavigationHlsPlayer(video, hlsUrl, status, options);
      }, 0);

      const shell = wrapNavigationFeed(video, status, options.attributes || {});
      shell.classList.add("is-loading");
      setNavigationStreamStatus(status, "Connecting to OBS feed.");
      logObsFeed("info", "OBS player created.", options.context || "navigation");
      return shell;
    }

    function buildNavigationMedia(data, options = {}) {
      if (!isObsFeedEnabled(getIdleScreensaverSettings())) {
        return null;
      }

      const hlsUrl = resolveNavigationHlsUrl(data);
      const legacyStreamUrl = (data.stream_url || "").trim();
      const browserUrl = isBrowserEmbeddableUrl(legacyStreamUrl) && !isHlsPlaylistUrl(legacyStreamUrl)
        ? legacyStreamUrl
        : "";
      const attributes = options.attributes || {};

      if (hlsUrl) {
        return buildNavigationHlsPlayer(hlsUrl, {
          ...options,
          attributes
        });
      }

      if (browserUrl) {
        const status = el("p", { class: "footer-note navigation-feed-status", hidden: "hidden" });
        const frame = el("iframe", {
          class: "stream-frame",
          src: browserUrl,
          allowfullscreen: "true",
          loading: "lazy"
        });
        frame.addEventListener("load", () => {
          const shell = frame.closest(".navigation-feed-shell");
          if (shell) {
            shell.classList.remove("is-loading", "is-unavailable");
          }
          setOptionalStatus(status, "", false);
          if (typeof options.onReady === "function") {
            options.onReady();
          }
        }, { once: true });
        frame.addEventListener("error", () => {
          const message = "OBS iframe feed is unavailable.";
          const shell = frame.closest(".navigation-feed-shell");
          if (shell) {
            shell.classList.remove("is-loading");
            shell.classList.add("is-unavailable");
          }
          setNavigationStreamStatus(status, message);
          if (typeof options.onFailure === "function") {
            options.onFailure(message);
          }
          if (options.managedRetry) {
            scheduleObsFeedRetry(status, message);
          }
        }, { once: true });
        logObsFeed("info", "OBS player created.", options.context || "navigation");
        const shell = wrapNavigationFeed(frame, status, attributes);
        shell.classList.add("is-loading");
        setNavigationStreamStatus(status, "Connecting to OBS feed.");
        return shell;
      }

      return wrapNavigationFeed(el("div", { class: "empty-stream" }, [
        el("div", {}, [
          el("strong", {}, ["No browser-ready bridge feed is configured yet."]),
          el("p", { class: "muted" }, ["Set the HLS playlist URL in the OBS Feed settings."])
        ])
      ]), null, attributes);
    }

    function getObsFeedConfigSignature(data = navigationData || {}) {
      const source = data && typeof data === "object" ? data : {};
      return JSON.stringify({
        hls_url: typeof source.hls_url === "string" ? source.hls_url.trim() : "",
        stream_url: typeof source.stream_url === "string" ? source.stream_url.trim() : "",
        stream_key: typeof source.stream_key === "string" ? source.stream_key.trim() : ""
      });
    }

    function removeNavigationObsFeed() {
      const existing = document.getElementById("navigationObsFeed");
      if (!existing) {
        return;
      }
      if (typeof existing._navigationFeedCleanup === "function") {
        existing._navigationFeedCleanup();
      }
      destroyEmbeddedMedia(existing);
      existing.remove();
    }

    function stopObsFeed() {
      const hadNavigationFeed = Boolean(document.getElementById("navigationObsFeed"));
      const hadRetry = Boolean(obsFeedState.retryTimer);
      const hadIdleFeed = Boolean(idleState.showingObsFeed);
      if (hadNavigationFeed || hadRetry || hadIdleFeed) {
        logObsFeed("info", "OBS stop requested.");
      }
      obsFeedState.startToken += 1;
      resetObsFeedFailureCycle();
      obsFeedState.lastConfigSignature = "";
      removeNavigationObsFeed();
      if (idleState.showingObsFeed) {
        clearIdleObsFeedTimers();
        deactivateIdleObsFeed();
      }
    }

    function startObsFeed(options = {}) {
      const settings = getIdleScreensaverSettings();
      if (!isObsFeedEnabled(settings)) {
        stopObsFeed();
        return null;
      }

      const mapCard = document.getElementById("navigationMap")
        ? document.getElementById("navigationMap").closest(".navigation-map-card")
        : null;
      if (!mapCard || !mapCard.parentNode) {
        return null;
      }

      const signature = getObsFeedConfigSignature(navigationData || {});
      const existing = document.getElementById("navigationObsFeed");
      if (existing && !options.forceReload && obsFeedState.lastConfigSignature === signature) {
        return existing;
      }

      logObsFeed("info", "OBS start requested.", options.forceReload ? "force reload" : "normal");
      obsFeedState.startToken += 1;
      if (options.resetFailureCycle) {
        resetObsFeedFailureCycle();
      } else {
        clearObsFeedRetryTimer();
      }
      removeNavigationObsFeed();
      obsFeedState.lastConfigSignature = signature;

      const feed = buildNavigationMedia(navigationData || {}, {
        managedRetry: true,
        context: "navigation",
        attributes: {
          id: "navigationObsFeed",
          "data-obs-feed": "navigation"
        }
      });
      if (!feed) {
        return null;
      }
      mapCard.parentNode.insertBefore(feed, mapCard.nextSibling);
      return feed;
    }

    function buildNavigationMapShell() {
      return el("div", { class: "navigation-map-card" }, [
        el("div", { class: "navigation-map-frame", id: "navigationMap" }),
        el("div", {
          class: "map-availability-notice",
          id: "navigationMapUnavailableNotice",
          hidden: "hidden"
        }),
        el("button", {
          class: "navigation-map-control navigation-map-recenter",
          id: "navigationMapFollowButton",
          type: "button",
          hidden: "hidden"
        }, ["Recenter on vessel"]),
        el("button", {
          class: "navigation-map-control navigation-map-route-toggle",
          id: "navigationMapPlannedRouteToggle",
          type: "button",
          hidden: "hidden",
          title: "Hide planned route overlay",
          "aria-label": "Hide planned route overlay",
          "aria-pressed": "true"
        }, [
          el("span", {
            class: "navigation-map-route-toggle__icon",
            "aria-hidden": "true"
          })
        ])
      ]);
    }

    function renderNavigationTab(data) {
      const notes = Array.isArray(data && data.notes)
        ? data.notes.filter(note => note && (String(note.title || "").trim() || String(note.body || "").trim()))
        : [];
      const telemetrySettings = getIdleScreensaverSettings();
      const panel = el("section", { class: "tab-panel active", id: "panel-navigation" });
      const hero = el("div", { class: "hero-card" }, [
        el("div", { class: "section-kicker" }, ["Bridge Relay"]),
        el("h2", {}, ["Navigation"]),
        el("p", { class: "muted" }, ["Live data from the bridge navigation equipment, suitable for internal onboard access only."]),
        el("div", { class: "metric-grid telemetry-grid", id: "navigationTelemetryGrid" },
          renderConfiguredTelemetryCards(telemetrySettings, getNavigationTelemetryCardDefinitions(null, null, true))
        ),
        el("p", { class: "footer-note", id: "navigationTelemetryStatus", hidden: "hidden" }),
        buildNavigationMapShell()
      ]);

      panel.appendChild(hero);
      if (notes.length) {
        panel.appendChild(el("div", { class: "grid" }, [
          el("div", { class: "card brand-watermark span-12" }, [
            el("div", { class: "section-kicker" }, ["Bridge Notes"]),
            makeList(notes, note =>
              el("li", { class: "list-item" }, [
                el("strong", {}, [note.title || "Note"]),
                el("div", { class: "muted" }, [note.body || ""])
              ])
            )
          ])
        ]));
      }
      return panel;
    }

    function getTelemetryAliasToken(value) {
      return String(value || "")
        .trim()
        .replace(/[\s_-]+/g, "")
        .toLowerCase();
    }

    function normalizeTelemetryItemKey(value) {
      const text = String(value || "").trim();
      const token = getTelemetryAliasToken(text);
      if (!token) {
        return "";
      }
      return TELEMETRY_ALIAS_LOOKUP[token] || text.toLowerCase();
    }

    function expandTelemetryItemKeys(value) {
      const normalized = normalizeTelemetryItemKey(value);
      return Array.isArray(normalized) ? normalized : (normalized ? [normalized] : []);
    }

    function normalizeTelemetryItems(items, fallbackItems = []) {
      const sourceItems = Array.isArray(items)
        ? items
        : (typeof items === "string" ? items.split(",") : fallbackItems);
      return sourceItems.reduce((result, item) => {
        expandTelemetryItemKeys(item).forEach(normalized => {
          if (normalized && !result.includes(normalized)) {
            result.push(normalized);
          }
        });
        return result;
      }, []);
    }

    function isTelemetryEnabled(settings, key) {
      const normalizedKeys = expandTelemetryItemKeys(key);
      if (!normalizedKeys.length) {
        return false;
      }
      const items = settings
        && (Array.isArray(settings.telemetry_items) || typeof settings.telemetry_items === "string")
        ? settings.telemetry_items
        : IDLE_SCREENSAVER_DEFAULTS.telemetry_items;
      const enabledItems = normalizeTelemetryItems(items);
      return normalizedKeys.some(normalized => enabledItems.includes(normalized));
    }

    function getTelemetryMetricLabel(label) {
      const normalized = (expandTelemetryItemKeys(label)[0] || "").toUpperCase();
      return TELEMETRY_DISPLAY_LABELS[normalized] || label;
    }

    function renderMetricCard(label, value, detail) {
      return el("div", { class: "metric-card" }, [
        el("div", { class: "metric-label" }, [getTelemetryMetricLabel(label)]),
        el("div", { class: "metric-value" }, [value]),
        ...(detail ? [el("div", { class: "metric-detail" }, [detail])] : [])
      ]);
    }

    function normalizeDegrees(value) {
      if (!Number.isFinite(value)) {
        return NaN;
      }
      return ((Number(value) % 360) + 360) % 360;
    }

    function formatNavigationDegrees(value) {
      return Number.isFinite(value) ? `${normalizeDegrees(value).toFixed(1)}\u00B0 T` : "--";
    }

    function formatSignedDegrees(value) {
      if (!Number.isFinite(value)) {
        return "--";
      }
      const prefix = value > 0 ? "+" : "";
      return `${prefix}${value.toFixed(1)}\u00B0`;
    }

    function formatNauticalMiles(value) {
      return Number.isFinite(value) ? `${value.toFixed(value < 10 ? 2 : 1)} nm` : "--";
    }

    function formatWaypointId(value) {
      const text = safeText(value);
      return text || "--";
    }

    function formatWaypointDetail(route) {
      const waypoint = safeText(route && route.destination_waypoint_id);
      return waypoint ? `to ${waypoint}` : "";
    }

    function formatSteerDirection(value) {
      const direction = safeText(value).toUpperCase();
      if (direction === "L") {
        return "Left";
      }
      if (direction === "R") {
        return "Right";
      }
      return direction || "--";
    }

    function formatArrivalStatus(value) {
      const status = safeText(value).toUpperCase();
      if (status === "A") {
        return "Arrived";
      }
      if (status === "V") {
        return "En route";
      }
      return status || "--";
    }

    function telemetryTextAvailable(value) {
      const text = safeText(value);
      return !!text && text !== "--";
    }

    function getNavigationTelemetryCardDefinitions(data, preferredWind, empty = false) {
      const source = data && (data.navigation || data.position || data.wind || data.route)
        ? data
        : { navigation: data || null };
      const position = source.position;
      const navigation = source.navigation;
      const wind = source.wind;
      const route = source.route;
      const trueWind = preferredWind || getPreferredTrueWind();
      return [
        {
          key: "latitude",
          label: "Latitude",
          available: Number.isFinite(position && position.latitude),
          value: empty ? "--" : formatTraditionalCoordinate(position && position.latitude, true, 3)
        },
        {
          key: "longitude",
          label: "Longitude",
          available: Number.isFinite(position && position.longitude),
          value: empty ? "--" : formatTraditionalCoordinate(position && position.longitude, false, 3)
        },
        {
          key: "cog",
          label: "COG",
          available: Number.isFinite(navigation && navigation.course_over_ground_deg),
          showWhenUnavailable: true,
          value: empty ? "--" : formatCourseOverGround(navigation && navigation.course_over_ground_deg)
        },
        {
          key: "sog",
          label: "SOG",
          available: Number.isFinite(navigation && navigation.speed_over_ground_knots),
          showWhenUnavailable: true,
          value: empty ? "--" : formatSpeedKnots(navigation && navigation.speed_over_ground_knots)
        },
        {
          key: "heading",
          label: "Heading",
          available: Number.isFinite(navigation && navigation.heading_true_deg),
          value: empty ? "--" : formatNavigationDegrees(navigation && navigation.heading_true_deg)
        },
        {
          key: "depth",
          label: "Depth",
          available: Number.isFinite(navigation && navigation.depth_m),
          showWhenUnavailable: true,
          value: empty ? "--" : formatDepth(navigation && navigation.depth_m)
        },
        {
          key: "rot",
          label: "ROT",
          available: Number.isFinite(navigation && navigation.rate_of_turn_deg_per_min),
          value: empty ? "--" : formatRateOfTurn(navigation && navigation.rate_of_turn_deg_per_min)
        },
        {
          key: "pitch",
          label: "Pitch",
          available: Number.isFinite(navigation && navigation.pitch_deg),
          value: empty ? "--" : formatSignedDegrees(navigation && navigation.pitch_deg)
        },
        {
          key: "roll",
          label: "Roll",
          available: Number.isFinite(navigation && navigation.roll_deg),
          value: empty ? "--" : formatSignedDegrees(navigation && navigation.roll_deg)
        },
        {
          key: "yaw",
          label: "Yaw",
          available: Number.isFinite(navigation && navigation.yaw_deg),
          value: empty ? "--" : formatSignedDegrees(navigation && navigation.yaw_deg)
        },
        {
          key: "wind_speed",
          label: "Wind Speed",
          available: Number.isFinite(trueWind && trueWind.speedKnots),
          showWhenUnavailable: true,
          value: empty ? "--" : formatWindSpeedPill(trueWind && trueWind.speedKnots)
        },
        {
          key: "wind_direction",
          label: "Wind Direction",
          available: Number.isFinite(trueWind && trueWind.directionDegrees),
          showWhenUnavailable: true,
          value: empty ? "--" : formatWindDirectionPill(trueWind && trueWind.directionDegrees)
        },
        {
          key: "apparent_wind_speed",
          label: "Apparent Wind Speed",
          available: Number.isFinite(wind && wind.apparent_speed_knots),
          value: empty ? "--" : formatWindSpeedPill(wind && wind.apparent_speed_knots)
        },
        {
          key: "apparent_wind_angle",
          label: "Apparent Wind Angle",
          available: Number.isFinite(wind && wind.apparent_angle_deg),
          value: empty ? "--" : formatDegrees(wind && wind.apparent_angle_deg, 0)
        },
        {
          key: "origin_waypoint",
          label: "Origin Waypoint",
          available: telemetryTextAvailable(route && route.origin_waypoint_id),
          value: empty ? "--" : formatWaypointId(route && route.origin_waypoint_id)
        },
        {
          key: "destination_waypoint",
          label: "Waypoint",
          available: telemetryTextAvailable(route && route.destination_waypoint_id),
          value: empty ? "--" : formatWaypointId(route && route.destination_waypoint_id)
        },
        {
          key: "destination_latitude",
          label: "Waypoint Lat",
          available: Number.isFinite(route && route.destination_latitude),
          value: empty ? "--" : formatTraditionalCoordinate(route && route.destination_latitude, true, 3)
        },
        {
          key: "destination_longitude",
          label: "Waypoint Lon",
          available: Number.isFinite(route && route.destination_longitude),
          value: empty ? "--" : formatTraditionalCoordinate(route && route.destination_longitude, false, 3)
        },
        {
          key: "distance_to_waypoint",
          label: "Distance to Waypoint",
          available: Number.isFinite(route && route.distance_to_waypoint_nm),
          value: empty ? "--" : formatNauticalMiles(route && route.distance_to_waypoint_nm)
        },
        {
          key: "bearing_to_waypoint",
          label: "Bearing to Waypoint",
          available: Number.isFinite(route && route.bearing_to_waypoint_true_deg),
          value: empty ? "--" : formatNavigationDegrees(route && route.bearing_to_waypoint_true_deg)
        },
        {
          key: "cross_track_error",
          label: "Cross-track Error",
          available: Number.isFinite(route && route.cross_track_error_nm),
          value: empty ? "--" : formatNauticalMiles(route && route.cross_track_error_nm),
          detail: empty || !safeText(route && route.steer_direction) ? "" : formatSteerDirection(route && route.steer_direction)
        },
        {
          key: "steer_direction",
          label: "Steer",
          available: telemetryTextAvailable(route && route.steer_direction),
          value: empty ? "--" : formatSteerDirection(route && route.steer_direction)
        },
        {
          key: "closing_velocity",
          label: "Closing Speed",
          available: Number.isFinite(route && route.closing_velocity_knots),
          value: empty ? "--" : formatSpeedKnots(route && route.closing_velocity_knots)
        },
        {
          key: "ttg",
          label: "TTG",
          available: Number.isFinite(route && route.ttg_minutes),
          value: empty ? "--" : formatTtgMinutes(route && route.ttg_minutes),
          detail: empty ? "" : formatWaypointDetail(route)
        },
        {
          key: "eta",
          label: "ETA",
          available: telemetryTextAvailable(route && route.eta_utc),
          value: empty ? "--" : formatEta(route && route.eta_utc),
          detail: empty ? "" : (route && route.source_sentence ? `via ${route.source_sentence}` : formatWaypointDetail(route))
        },
        {
          key: "arrival_status",
          label: "Arrival",
          available: telemetryTextAvailable(route && route.arrival_status),
          value: empty ? "--" : formatArrivalStatus(route && route.arrival_status)
        }
      ];
    }

    function renderConfiguredTelemetryCards(settings, definitions) {
      return definitions
        .filter(definition => isTelemetryEnabled(settings, definition.key))
        .filter(definition => definition.showWhenUnavailable || definition.available)
        .map(definition => renderMetricCard(definition.label, definition.value, definition.detail));
    }

    function formatDegrees(value, digits = 1) {
      return Number.isFinite(value) ? `${value.toFixed(digits)}\u00B0` : "--";
    }

    function formatCourseOverGround(value) {
      if (!Number.isFinite(value)) {
        return "--";
      }

      let normalized = ((Number(value) % 360) + 360) % 360;
      normalized = Number(normalized.toFixed(1));
      if (normalized >= 360) {
        normalized = 0;
      }

      return `${normalized.toFixed(1).padStart(5, "0")}\u00B0 T`;
    }

    function formatDepth(value) {
      return Number.isFinite(value) ? `${value.toFixed(1)} m` : "--";
    }

    function formatSpeedKnots(value) {
      return Number.isFinite(value) ? `${value.toFixed(value < 10 ? 2 : 1)} kn` : "--";
    }

    function formatRateOfTurn(value) {
      if (!Number.isFinite(value)) {
        return "--";
      }

      const prefix = value > 0 ? "+" : "";
      return `${prefix}${value.toFixed(1)}\u00B0/min`;
    }

    function formatSpeedKmh(value) {
      return Number.isFinite(value) ? `${value.toFixed(value < 10 ? 1 : 0)} km/h` : "--";
    }

    function formatTtgMinutes(value) {
      if (!Number.isFinite(value)) {
        return "--";
      }

      if (value <= 0) {
        return "<1 min";
      }

      const totalMinutes = Math.round(value);
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;

      if (!hours) {
        return `${minutes} min`;
      }

      if (!minutes) {
        return `${hours}h`;
      }

      return `${hours}h ${minutes}m`;
    }

    function formatEta(value) {
      if (!value) {
        return "--";
      }

      const date = new Date(value);
      if (Number.isNaN(date.getTime())) {
        return "--";
      }

      return date.toLocaleString([], {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    }

    function formatDecimalCoordinate(value) {
      return Number.isFinite(value) ? value.toFixed(6) : "--";
    }

    function formatTraditionalCoordinate(value, isLatitude, minuteDigits = 3) {
      if (!Number.isFinite(value)) {
        return "--";
      }

      const absolute = Math.abs(value);
      const degrees = Math.floor(absolute);
      const minutes = (absolute - degrees) * 60;
      const hemisphere = isLatitude
        ? (value >= 0 ? "N" : "S")
        : (value >= 0 ? "E" : "W");
      const paddedDegrees = isLatitude
        ? String(degrees).padStart(2, "0")
        : String(degrees).padStart(3, "0");

      return `${paddedDegrees}\u00B0${minutes.toFixed(minuteDigits)}'${hemisphere}`;
    }

    function formatCoordinatePairTraditional(latitude, longitude, minuteDigits = 3) {
      if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
        return "--";
      }

      return `${formatTraditionalCoordinate(latitude, true, minuteDigits)} ${formatTraditionalCoordinate(longitude, false, minuteDigits)}`;
    }

    function formatCoordinatePairDecimal(latitude, longitude) {
      if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
        return "Decimal --";
      }

      return `Decimal ${formatDecimalCoordinate(latitude)}, ${formatDecimalCoordinate(longitude)}`;
    }

    function getLiveWeatherCoords() {
      const position = nmeaState.data && nmeaState.data.position;
      if (!position || !position.valid) {
        return null;
      }

      return {
        latitude: position.latitude,
        longitude: position.longitude,
        label: "Live vessel position",
        source: "NMEA feed"
      };
    }

    function getNavigationMapCoordinates() {
      const liveCoords = getLiveWeatherCoords();
      if (liveCoords) {
        return liveCoords;
      }

      const configuredCoords = getConfiguredWeatherCoords();
      if (configuredCoords) {
        return configuredCoords;
      }

      return null;
    }

    function getNavigationMapHeading() {
      const navigation = nmeaState.data && nmeaState.data.navigation;
      if (!navigation) {
        return null;
      }

      if (Number.isFinite(navigation.heading_true_deg)) {
        return navigation.heading_true_deg;
      }

      if (Number.isFinite(navigation.course_over_ground_deg)) {
        return navigation.course_over_ground_deg;
      }

      return null;
    }

    function formatNavigationMapTimestamp(value) {
      if (!value) {
        return "";
      }

      const date = new Date(value);
      if (Number.isNaN(date.getTime())) {
        return "";
      }

      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      });
    }

    function setNavigationMapPlaceholder(title, message) {
      const mapNode = document.getElementById("navigationMap");
      if (!mapNode || navigationMapState.initialized) {
        return;
      }

      mapNode.innerHTML = "";
      mapNode.appendChild(el("div", { class: "navigation-map-placeholder" }, [
        el("div", {}, [
          el("strong", {}, [title]),
          el("div", { class: "muted" }, [message])
        ])
      ]));
    }

    function setNavigationMapStatus(message) {
      return message;
    }

    function updateNavigationMapMeta(coordinates, hasLivePosition) {
      return { coordinates, hasLivePosition };
    }

    function syncNavigationMapFollowButton() {
      const button = document.getElementById("navigationMapFollowButton");
      if (!button) {
        return;
      }

      const shouldShow = navigationMapState.hasCentered
        && !navigationMapState.followVessel
        && !isNavigationMapCenteredOnVessel();
      button.hidden = !shouldShow;
      button.setAttribute("aria-hidden", shouldShow ? "false" : "true");
    }

    function isNavigationMapCenteredOnVessel() {
      if (!navigationMapState.map || !navigationMapState.marker || !navigationMapState.hasCentered) {
        return true;
      }

      const center = navigationMapState.map.getCenter();
      const markerLatLng = navigationMapState.marker.getLatLng();
      return center.distanceTo(markerLatLng) < 12;
    }

    function invalidateNavigationMapSize() {
      if (!navigationMapState.map) {
        return;
      }

      navigationMapState.map.invalidateSize(false);
    }

    function parseCoordinateValue(value) {
      const normalized = typeof value === "string" ? value.trim() : value;

      if (normalized === null || normalized === undefined || normalized === "") {
        return NaN;
      }

      const parsed = Number(normalized);
      return Number.isFinite(parsed) ? parsed : NaN;
    }

    function getItineraryTextValue(...values) {
      for (const value of values) {
        if (typeof value === "string") {
          const normalized = value.trim();
          if (normalized) {
            return normalized;
          }
        } else if (value !== null && value !== undefined) {
          const normalized = String(value).trim();
          if (normalized) {
            return normalized;
          }
        }
      }

      return "";
    }

    function getItineraryTextKey(value) {
      return getItineraryTextValue(value).replace(/\s+/g, " ").trim().toLowerCase();
    }

    function getUnusedItineraryTextValue(usedText, ...values) {
      for (const value of values) {
        const text = getItineraryTextValue(value);
        if (!text) {
          continue;
        }

        const key = getItineraryTextKey(text);
        if (usedText && usedText.has(key)) {
          continue;
        }

        if (usedText) {
          usedText.add(key);
        }
        return text;
      }

      return "";
    }

    function itineraryMediaEntriesForStopSite(site) {
      const media = Array.isArray(site && site.media) ? site.media : [];
      const legacyImages = Array.isArray(site && site.images) ? site.images : [];
      if (media.length || !legacyImages.length) {
        return media.length ? media : (site && site.image ? [site.image] : []);
      }
      return legacyImages;
    }

    function uniqueItineraryImages(images) {
      const seen = new Set();
      return (Array.isArray(images) ? images : []).filter(image => {
        const entry = image && typeof image === "object" ? image : {};
        const src = getItineraryTextValue(entry.src, entry.url, entry.path, entry.href);
        const key = getItineraryTextValue(entry.id, entry.filename, entry.fileName, entry.media_id, entry.mediaId, src);
        if (!src || !key) {
          return false;
        }
        const stableKey = key.trim().toLowerCase();
        if (seen.has(stableKey)) {
          return false;
        }
        seen.add(stableKey);
        return true;
      });
    }

    function normalizeItineraryImages(...sources) {
      const images = [];

      function mediaTypeFromSrc(src, explicitType) {
        const type = getItineraryTextValue(explicitType).toLowerCase();
        if (type === "video") {
          return "video";
        }
        const extension = String(src || "").split("?")[0].toLowerCase().match(/\.([a-z0-9]+)$/);
        return extension && ["mp4", "webm", "mov"].includes(extension[1]) ? "video" : "image";
      }

      function addImageEntry(entry, index) {
        if (typeof entry === "string") {
          const src = entry.trim();
          if (src) {
            images.push({ type: mediaTypeFromSrc(src), src, alt: "", caption: "" });
          }
          return;
        }

        if (!entry || typeof entry !== "object") {
          return;
        }

        const src = getItineraryTextValue(entry.src, entry.url, entry.path, entry.href);
        if (!src) {
          return;
        }

        const title = getItineraryTextValue(entry.title);
        const caption = getItineraryTextValue(entry.caption, title, entry.description);
        const alt = getItineraryTextValue(entry.alt, entry.title, entry.caption, `Itinerary image ${index + 1}`);
        images.push({ type: mediaTypeFromSrc(src, entry.type), src, title, alt, caption });
      }

      sources.forEach(source => {
        if (Array.isArray(source)) {
          source.forEach(addImageEntry);
        } else {
          addImageEntry(source, images.length);
        }
      });

      return uniqueItineraryImages(images);
    }

    function getCameraIconMarkup() {
      return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path d="M14.5 4l1.4 2H19a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3.1l1.4-2h5z"></path><circle cx="12" cy="12.5" r="3.2"></circle></svg>';
    }

    function getChevronIconMarkup(direction) {
      const path = direction === "prev" ? "M15 18l-6-6 6-6" : "M9 18l6-6-6-6";
      return `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${path}"></path></svg>`;
    }

    function getCloseIconMarkup() {
      return '<svg viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12"></path><path d="M18 6L6 18"></path></svg>';
    }

    function renderItineraryImageButton(stop) {
      const images = stop && Array.isArray(stop.images) ? stop.images : [];
      if (!images.length) {
        return null;
      }

      const title = getItineraryTextValue(stop.location, stop.label, "Itinerary stop");
      const button = el("button", {
        class: "itinerary-image-button",
        type: "button",
        title: images.length === 1 ? `View media for ${title}` : `View ${images.length} media items for ${title}`,
        "aria-label": images.length === 1 ? `View media for ${title}` : `View ${images.length} media items for ${title}`
      }, [
        el("span", { html: getCameraIconMarkup() }),
        images.length > 1 ? el("span", { class: "itinerary-image-count" }, [String(images.length)]) : null
      ]);

      button.addEventListener("click", event => {
        event.preventDefault();
        event.stopPropagation();
        openItineraryImageViewer(images, 0, title);
      });

      return button;
    }

    function renderItineraryStopTitle(stop, stopIndex, visibleStopCount) {
      const title = stop.location || stop.label || `Stop ${stopIndex + 1}`;

      return el("div", { class: "itinerary-stop-title" }, [
        el("div", { class: "itinerary-stop-title-main" }, [
          visibleStopCount > 1
            ? el("span", { class: "itinerary-stop-index" }, [`Stop ${stopIndex + 1}`])
            : null,
          el("strong", {}, [title])
        ]),
        renderItineraryImageButton(stop)
      ]);
    }

    function ensureItineraryImageViewer() {
      let viewer = document.getElementById("itineraryImageViewer");
      if (viewer) {
        return viewer;
      }

      viewer = el("div", {
        class: "itinerary-gallery",
        id: "itineraryImageViewer",
        role: "dialog",
        "aria-modal": "true",
        "aria-label": "Itinerary image viewer",
        hidden: "hidden"
      });
      viewer.addEventListener("click", event => {
        if (event.target === viewer) {
          closeItineraryImageViewer();
        }
      });
      document.body.appendChild(viewer);
      return viewer;
    }

    function openItineraryImageViewer(images, startIndex = 0, title = "Itinerary images") {
      const viewer = ensureItineraryImageViewer();
      const usableImages = uniqueItineraryImages(images).filter(image => image && image.src);
      if (!usableImages.length) {
        return;
      }

      viewer._itineraryImages = usableImages;
      viewer._itineraryImageIndex = Math.min(Math.max(0, startIndex), usableImages.length - 1);
      viewer._itineraryTitle = title;
      viewer.hidden = false;
      document.body.classList.add("has-itinerary-gallery");
      renderItineraryImageViewer();
      const closeButton = viewer.querySelector("[data-itinerary-gallery-close]");
      if (closeButton) {
        closeButton.focus();
      }
    }

    function closeItineraryImageViewer() {
      const viewer = document.getElementById("itineraryImageViewer");
      if (!viewer) {
        return;
      }

      viewer.hidden = true;
      viewer._itineraryImages = [];
      viewer._itineraryImageIndex = 0;
      document.body.classList.remove("has-itinerary-gallery");
    }

    function showItineraryImageAt(offset) {
      const viewer = document.getElementById("itineraryImageViewer");
      if (!viewer || viewer.hidden) {
        return;
      }

      const images = Array.isArray(viewer._itineraryImages) ? viewer._itineraryImages : [];
      if (!images.length) {
        return;
      }

      viewer._itineraryImageIndex = (viewer._itineraryImageIndex + offset + images.length) % images.length;
      renderItineraryImageViewer();
    }

    function renderItineraryImageViewer() {
      const viewer = ensureItineraryImageViewer();
      const images = Array.isArray(viewer._itineraryImages) ? viewer._itineraryImages : [];
      const imageIndex = Math.min(Math.max(0, viewer._itineraryImageIndex || 0), Math.max(0, images.length - 1));
      const image = images[imageIndex];
      if (!image) {
        return;
      }

      const hasMultiple = images.length > 1;
      const previousButton = el("button", {
        class: "itinerary-gallery__button",
        type: "button",
        "aria-label": "Previous image",
        title: "Previous image",
        ...(hasMultiple ? {} : { disabled: "disabled" })
      }, [el("span", { html: getChevronIconMarkup("prev") })]);
      previousButton.addEventListener("click", () => showItineraryImageAt(-1));

      const nextButton = el("button", {
        class: "itinerary-gallery__button",
        type: "button",
        "aria-label": "Next image",
        title: "Next image",
        ...(hasMultiple ? {} : { disabled: "disabled" })
      }, [el("span", { html: getChevronIconMarkup("next") })]);
      nextButton.addEventListener("click", () => showItineraryImageAt(1));

      const closeButton = el("button", {
        class: "itinerary-gallery__button",
        type: "button",
        "aria-label": "Close image viewer",
        title: "Close",
        "data-itinerary-gallery-close": "true"
      }, [el("span", { html: getCloseIconMarkup() })]);
      closeButton.addEventListener("click", closeItineraryImageViewer);

      replaceNodeChildren(viewer,
        el("div", { class: "itinerary-gallery__panel" }, [
          el("div", { class: "itinerary-gallery__header" }, [
            el("div", { class: "itinerary-gallery__title" }, [viewer._itineraryTitle || "Itinerary images"]),
            closeButton
          ]),
          el("div", { class: "itinerary-gallery__stage" }, [
            image.type === "video"
              ? el("video", { src: image.src, controls: "controls", preload: "metadata" })
              : el("img", { src: image.src, alt: image.alt || viewer._itineraryTitle || "" })
          ]),
          el("div", { class: "itinerary-gallery__footer" }, [
            el("div", {}, [
              el("div", { class: "itinerary-gallery__counter" }, [`${imageIndex + 1} of ${images.length}`]),
              image.caption ? el("div", { class: "itinerary-gallery__caption" }, [image.caption]) : null
            ]),
            el("div", { class: "itinerary-gallery__actions" }, [
              previousButton,
              nextButton
            ])
          ])
        ])
      );
    }

    function getItineraryDays(source = itineraryData) {
      const data = source && typeof source === "object" ? source : {};
      const days = Array.isArray(data.days)
        ? data.days
        : [];

      return days.map((entry, dayIndex) => {
        const rawDay = entry && typeof entry === "object" ? entry : {};
        const daySite = getSiteById(rawDay.site_id);
        const hasStops = Array.isArray(rawDay.stops) && rawDay.stops.length > 0;
        const dayNumber = itineraryDayNumberValue(rawDay, dayIndex);
        const dayLabel = formatCharterDayLabel(dayNumber, dayIndex);
        const usedDayText = new Set();
        const parentLocation = getItineraryTextValue(
          rawDay.title_override,
          rawDay.location,
          daySite && daySite.title
        );
        const summary = getUnusedItineraryTextValue(usedDayText, rawDay.notes, rawDay.summary);

        function resolveStop(stopEntry, stopIndex) {
          const rawStop = stopEntry && typeof stopEntry === "object" ? stopEntry : {};
          const stopSite = getSiteById(rawStop.site_id);
          const associatedSite = stopSite || (hasStops ? null : daySite);
          const includeSiteNotes = rawStop.include_site_notes !== false && rawStop.exclude_site_notes !== true;
          const siteDescription = includeSiteNotes && associatedSite ? associatedSite.description : "";
          const location = getItineraryTextValue(
            rawStop.title_override,
            rawStop.location,
            rawStop.map_label,
            stopSite && stopSite.title,
            daySite && daySite.title,
            parentLocation
          );
          const plan = hasStops
            ? getUnusedItineraryTextValue(
              usedDayText,
              rawStop.notes,
              rawStop.plan,
              rawStop.timing,
              siteDescription
            )
            : getUnusedItineraryTextValue(
              usedDayText,
              rawStop.timing,
              rawStop.plan,
              siteDescription
            );
          const latitude = parseCoordinateValue(
            rawStop.latitude !== undefined
              ? rawStop.latitude
              : (stopSite && stopSite.latitude !== undefined
                ? stopSite.latitude
                : (daySite && daySite.latitude !== undefined ? daySite.latitude : undefined))
          );
          const longitude = parseCoordinateValue(
            rawStop.longitude !== undefined
              ? rawStop.longitude
              : (stopSite && stopSite.longitude !== undefined
                ? stopSite.longitude
                : (daySite && daySite.longitude !== undefined ? daySite.longitude : undefined))
          );
          const label = getItineraryTextValue(
            rawStop.map_label,
            location,
            stopSite && stopSite.title,
            parentLocation
          ) || `${dayLabel} Stop ${stopIndex + 1}`;

          return {
            id: rawStop.id || rawStop.site_id || `${rawDay.id || dayLabel}-stop-${stopIndex + 1}`,
            siteId: getItineraryTextValue(rawStop.site_id),
            location,
            plan,
            latitude,
            longitude,
            label,
            timing: getItineraryTextValue(rawStop.timing),
            notes: getItineraryTextValue(rawStop.notes),
            images: normalizeItineraryImages(itineraryMediaEntriesForStopSite(associatedSite))
          };
        }

        const rawStops = hasStops
          ? rawDay.stops
          : [{
              id: rawDay.id,
              site_id: rawDay.site_id,
              location: rawDay.location,
              map_label: rawDay.map_label,
              plan: rawDay.plan,
              timing: rawDay.timing,
              latitude: rawDay.latitude,
              longitude: rawDay.longitude
            }];
        const stops = rawStops.map(resolveStop);

        return {
          id: rawDay.id || `day-${dayNumber}`,
          day: dayLabel,
          dayNumber,
          date: getItineraryTextValue(rawDay.date, rawDay.start_date),
          area: parentLocation,
          summary,
          timing: getItineraryTextValue(rawDay.timing),
          hasExplicitStops: hasStops,
          stops
        };
      });
    }

    function getItineraryMapPoints() {
      const itineraryDays = getItineraryDays();
      const points = [];

      itineraryDays.forEach(dayEntry => {
        dayEntry.stops.forEach((stop, stopIndex) => {
          if (!Number.isFinite(stop.latitude) || !Number.isFinite(stop.longitude)) {
            return;
          }

          points.push({
            id: `${dayEntry.id}-${stop.id || stopIndex + 1}`,
            latitude: stop.latitude,
            longitude: stop.longitude,
            day: dayEntry.day,
            location: stop.location,
            label: stop.label,
            plan: stop.plan || dayEntry.summary || ""
          });
        });
      });

      return points;
    }

    function getItineraryMapSignature(points) {
      return points
        .map(point => [
          point.id,
          point.latitude.toFixed(5),
          point.longitude.toFixed(5),
          point.day,
          point.location,
          point.label,
          point.plan
        ].join("|"))
        .join(";");
    }

    function parseNavigationTrackTimestamp(value) {
      if (typeof value === "number") {
        return Number.isFinite(value) ? value : NaN;
      }

      if (typeof value === "string") {
        const trimmed = value.trim();
        if (!trimmed) {
          return NaN;
        }

        const asNumber = Number(trimmed);
        if (Number.isFinite(asNumber)) {
          return asNumber;
        }

        const asDate = Date.parse(trimmed);
        return Number.isFinite(asDate) ? asDate : NaN;
      }

      return NaN;
    }

    function normalizeNavigationTrackPoint(rawPoint) {
      if (!rawPoint || typeof rawPoint !== "object") {
        return null;
      }

      const latitude = parseCoordinateValue(rawPoint.latitude !== undefined ? rawPoint.latitude : rawPoint.lat);
      const longitude = parseCoordinateValue(rawPoint.longitude !== undefined ? rawPoint.longitude : rawPoint.lng);
      const timestamp = parseNavigationTrackTimestamp(rawPoint.timestamp);
      if (!Number.isFinite(latitude) || !Number.isFinite(longitude) || !Number.isFinite(timestamp)) {
        return null;
      }

      return {
        lat: latitude,
        lng: longitude,
        timestamp
      };
    }

    function updateSharedTrackLines() {
      const polylinePoints = navigationMapState.trackPoints.map(point => [point.lat, point.lng]);

      if (navigationMapState.trackLine) {
        navigationMapState.trackLine.setLatLngs(polylinePoints);
      }

      if (idleMapState.trackLine) {
        idleMapState.trackLine.setLatLngs(polylinePoints);
      }
    }

    function normalizePlannedRouteCoordinate(rawCoordinate) {
      if (!rawCoordinate || typeof rawCoordinate !== "object") {
        return null;
      }

      const latitude = parseCoordinateValue(rawCoordinate.latitude !== undefined ? rawCoordinate.latitude : rawCoordinate.lat);
      const longitude = parseCoordinateValue(rawCoordinate.longitude !== undefined ? rawCoordinate.longitude : rawCoordinate.lng);
      const altitude = rawCoordinate.altitude === null || rawCoordinate.altitude === undefined || rawCoordinate.altitude === ""
        ? null
        : Number(rawCoordinate.altitude);

      if (!Number.isFinite(latitude) || !Number.isFinite(longitude) || latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
        return null;
      }

      return {
        latitude,
        longitude,
        altitude: Number.isFinite(altitude) ? altitude : null
      };
    }

    function normalizeRoutePlanId(value) {
      const planId = String(value || "").trim().toLowerCase();
      return ROUTE_PLAN_IDS.includes(planId) ? planId : "primary";
    }

    function explicitRoutePlanId(value) {
      const planId = String(value || "").trim().toLowerCase();
      return ROUTE_PLAN_IDS.includes(planId) ? planId : "";
    }

    function normalizeSinglePlannedRouteData(rawData) {
      const data = rawData && typeof rawData === "object" ? rawData : {};
      const routes = Array.isArray(data.routes)
        ? data.routes.map((rawRoute, routeIndex) => {
          const route = rawRoute && typeof rawRoute === "object" ? rawRoute : {};
          const coordinates = Array.isArray(route.coordinates)
            ? route.coordinates.map(normalizePlannedRouteCoordinate).filter(Boolean)
            : [];

          if (coordinates.length < 2) {
            return null;
          }

          return {
            name: getItineraryTextValue(route.name, `Planned Route ${routeIndex + 1}`),
            description: getItineraryTextValue(route.description),
            coordinates
          };
        }).filter(Boolean)
        : [];

      return {
        source: data.source && typeof data.source === "object" && !Array.isArray(data.source) ? data.source : null,
        routes
      };
    }

    function plannedRoutePlanHasData(routePlan) {
      return !!(routePlan && Array.isArray(routePlan.routes) && routePlan.routes.some(route => Array.isArray(route.coordinates) && route.coordinates.length >= 2));
    }

    function routePlanFromDisplayedDayId(value) {
      const dayId = getItineraryTextValue(value).toLowerCase();
      if (!dayId) {
        return "";
      }
      if (dayId.startsWith("alt-day")) {
        return "alternative";
      }
      if (dayId.startsWith("day")) {
        return "primary";
      }
      return "";
    }

    function getDisplayedItineraryDayNumber(options = {}) {
      const itinerary = options.itinerary && typeof options.itinerary === "object" ? options.itinerary : itineraryData;
      const charter = options.charter && typeof options.charter === "object" ? options.charter : {};
      const explicitDayNumber = Number(options.dayNumber);
      if (Number.isFinite(explicitDayNumber) && explicitDayNumber > 0) {
        return Math.round(explicitDayNumber);
      }

      const days = getItineraryDays(itinerary);
      const validDayNumbers = days
        .map(day => Number(day && day.dayNumber))
        .filter(dayNumber => Number.isFinite(dayNumber) && dayNumber > 0);
      if (!validDayNumbers.length) {
        return null;
      }

      return calculateCurrentCharterDayState({
        startDate: getItineraryTextValue(itinerary && itinerary.start_date, charter && charter.start_date),
        endDate: getItineraryTextValue(itinerary && itinerary.end_date, charter && charter.end_date),
        today: options.today,
        dayNumbers: validDayNumbers
      }).defaultDayNumber;
    }

    function getDisplayedItineraryPlan(options = {}) {
      const selectedPlan = explicitRoutePlanId(options.selectedPlan);
      if (selectedPlan) {
        return selectedPlan;
      }

      const itinerary = options.itinerary && typeof options.itinerary === "object" ? options.itinerary : itineraryData;
      const days = getItineraryDays(itinerary);
      const displayedDayNumber = getDisplayedItineraryDayNumber(options);
      const activePlanByDay = itinerary && itinerary.active_plan_by_day && typeof itinerary.active_plan_by_day === "object" && !Array.isArray(itinerary.active_plan_by_day)
        ? itinerary.active_plan_by_day
        : {};
      const explicitPlan = explicitRoutePlanId(displayedDayNumber === null ? "" : activePlanByDay[String(displayedDayNumber)]);
      if (explicitPlan) {
        return explicitPlan;
      }

      const displayedDay = Number.isFinite(displayedDayNumber)
        ? (days.find(day => Number(day && day.dayNumber) === displayedDayNumber) || null)
        : null;
      const inferredPlan = explicitRoutePlanId(routePlanFromDisplayedDayId(displayedDay && displayedDay.id));
      if (inferredPlan) {
        return inferredPlan;
      }

      const earliestMappedDayNumber = Object.keys(activePlanByDay)
        .map(key => Number(key))
        .filter(dayNumber => Number.isInteger(dayNumber) && dayNumber > 0)
        .sort((left, right) => left - right)[0];
      const earliestMappedPlan = explicitRoutePlanId(earliestMappedDayNumber ? activePlanByDay[String(earliestMappedDayNumber)] : "");
      if (earliestMappedPlan) {
        return earliestMappedPlan;
      }

      return "primary";
    }

    function itineraryWelcomeMessageForPlan(itinerary, planId) {
      const source = itinerary && typeof itinerary === "object" ? itinerary : itineraryData;
      const plans = source && source.plans && typeof source.plans === "object" && !Array.isArray(source.plans)
        ? source.plans
        : {};
      const normalizedPlanId = explicitRoutePlanId(planId) || "primary";
      const planData = plans[normalizedPlanId] && typeof plans[normalizedPlanId] === "object" && !Array.isArray(plans[normalizedPlanId])
        ? plans[normalizedPlanId]
        : {};
      return getItineraryTextValue(
        planData.welcome_message,
        source && source.welcome_message,
        source && source.summary
      );
    }

    function getDisplayedItineraryWelcomeMessage(options = {}) {
      const itinerary = options.itinerary && typeof options.itinerary === "object" ? options.itinerary : itineraryData;
      const selectedPlan = explicitRoutePlanId(options.selectedPlan);
      return itineraryWelcomeMessageForPlan(itinerary, selectedPlan || getDisplayedItineraryPlan(options));
    }

    function getActiveRouteForPlan(activePlan, routes) {
      const plans = routes && typeof routes === "object" && !Array.isArray(routes) ? routes : {};
      const primary = normalizeSinglePlannedRouteData(plans.primary);
      const alternative = normalizeSinglePlannedRouteData(plans.alternative);
      const requestedPlan = normalizeRoutePlanId(activePlan);
      const requestedRoute = requestedPlan === "alternative" ? alternative : primary;
      const fallbackPlan = requestedPlan === "alternative" && !plannedRoutePlanHasData(requestedRoute)
        ? "primary"
        : requestedPlan;
      const activeRoute = fallbackPlan === "alternative" ? alternative : primary;
      return {
        source: activeRoute.source,
        routes: activeRoute.routes,
        route: {
          primary,
          alternative
        },
        requestedPlan,
        activePlan: fallbackPlan,
        fallbackPlan: fallbackPlan === requestedPlan ? "" : fallbackPlan
      };
    }

    function getDisplayedPlannedRoute(options = {}) {
      return getActiveRouteForPlan(getDisplayedItineraryPlan(options), plannedRouteData.route);
    }

    function normalizePlannedRouteData(rawData) {
      const data = rawData && typeof rawData === "object" ? rawData : {};
      const legacyRoute = normalizeSinglePlannedRouteData(data);
      const plans = data.route && typeof data.route === "object" && !Array.isArray(data.route)
        ? data.route
        : {};
      const primaryPlan = normalizeSinglePlannedRouteData(plans.primary);
      const alternativePlan = normalizeSinglePlannedRouteData(plans.alternative);
      const primary = plannedRoutePlanHasData(primaryPlan) || primaryPlan.source ? primaryPlan : legacyRoute;
      const activeRoute = getActiveRouteForPlan(getDisplayedItineraryPlan(), {
        primary,
        alternative: alternativePlan
      });
      const coordinateCount = activeRoute.routes.reduce((total, route) => total + route.coordinates.length, 0);

      return {
        source: activeRoute.source,
        routes: activeRoute.routes,
        route: activeRoute.route,
        requestedPlan: activeRoute.requestedPlan,
        activePlan: activeRoute.activePlan,
        fallbackPlan: activeRoute.fallbackPlan,
        routeCount: activeRoute.routes.length,
        coordinateCount
      };
    }

    function hasPlannedRoute() {
      return plannedRoutePlanHasData(getDisplayedPlannedRoute());
    }

    function syncNavigationPlannedRouteToggle() {
      const button = document.getElementById("navigationMapPlannedRouteToggle");
      if (!button) {
        return;
      }

      const hasRoute = hasPlannedRoute();
      const routeToggleLabel = navigationMapState.plannedRouteVisible
        ? "Hide planned route overlay"
        : "Show planned route overlay";
      button.hidden = !hasRoute;
      button.setAttribute("aria-hidden", hasRoute ? "false" : "true");
      button.setAttribute("aria-pressed", navigationMapState.plannedRouteVisible ? "true" : "false");
      button.setAttribute("aria-label", routeToggleLabel);
      button.title = routeToggleLabel;
    }

    function clearLayerGroup(map, layer) {
      if (map && layer) {
        map.removeLayer(layer);
      }
    }

    function createPlannedRouteLayer(map, interactive = true) {
      const activeRoute = getDisplayedPlannedRoute();
      if (!map || !window.L || !plannedRoutePlanHasData(activeRoute)) {
        return null;
      }

      const layerGroup = window.L.layerGroup();
      activeRoute.routes.forEach(route => {
        const points = route.coordinates.map(coordinate => [coordinate.latitude, coordinate.longitude]);
        const line = window.L.polyline(points, {
          ...PLANNED_ROUTE_LINE_STYLE,
          interactive
        });

        if (interactive) {
          const popupParts = [
            route.name ? `<strong>${route.name}</strong>` : "<strong>Planned Route</strong>",
            route.description ? `<div>${route.description}</div>` : "",
            `<div>${route.coordinates.length} points</div>`
          ].filter(Boolean);
          line.bindPopup(popupParts.join(""));
        }

        line.addTo(layerGroup);
      });
      layerGroup.addTo(map);
      return layerGroup;
    }

    function syncPlannedRouteLayers() {
      if (navigationMapState.map) {
        clearLayerGroup(navigationMapState.map, navigationMapState.plannedRouteLayer);
        navigationMapState.plannedRouteLayer = null;
        if (navigationMapState.plannedRouteVisible && hasPlannedRoute()) {
          navigationMapState.plannedRouteLayer = createPlannedRouteLayer(navigationMapState.map, true);
        }
      }

      if (idleMapState.map) {
        clearLayerGroup(idleMapState.map, idleMapState.plannedRouteLayer);
        idleMapState.plannedRouteLayer = null;
        if (hasPlannedRoute()) {
          idleMapState.plannedRouteLayer = createPlannedRouteLayer(idleMapState.map, false);
        }
      }

      syncNavigationPlannedRouteToggle();
    }

    function syncPlannedRouteData(rawData) {
      plannedRouteData = normalizePlannedRouteData(rawData);
      if (!navigationMapState.plannedRouteToggleTouched) {
        navigationMapState.plannedRouteVisible = hasPlannedRoute();
      }
      syncPlannedRouteLayers();
    }

    async function refreshPlannedRouteData() {
      try {
        syncPlannedRouteData(await loadJSON(PLANNED_ROUTE_API_URL));
      } catch (error) {
        syncPlannedRouteData(null);
      }
    }

    function normalizeNavigationTrackData(rawTrack) {
      const track = rawTrack && typeof rawTrack === "object" ? rawTrack : {};
      const points = Array.isArray(track.points)
        ? track.points
          .map(normalizeNavigationTrackPoint)
          .filter(Boolean)
          .sort((pointA, pointB) => pointA.timestamp - pointB.timestamp)
        : [];

      return {
        charter: getItineraryTextValue(track.charter),
        startedAt: getItineraryTextValue(track.started_at),
        updatedAt: getItineraryTextValue(track.updated_at),
        retentionDaysAfterCharter: Number.isFinite(Number(track.retention_days_after_charter))
          ? Math.max(0, Math.round(Number(track.retention_days_after_charter)))
          : 3,
        points
      };
    }

    function syncNavigationTrackData(rawTrack) {
      navigationTrackData = normalizeNavigationTrackData(rawTrack);
      navigationMapState.trackPoints = navigationTrackData.points.slice();
      updateSharedTrackLines();
    }

    async function refreshNavigationTrackData() {
      try {
        syncNavigationTrackData(await loadJSON(TRACK_API_URL));
      } catch (error) {
        if (!navigationTrackData.points.length) {
          syncNavigationTrackData(null);
        }
      }
    }

    function startNavigationTrackRefreshLoop() {
      if (trackRefreshTimer) {
        window.clearInterval(trackRefreshTimer);
      }

      trackRefreshTimer = window.setInterval(() => {
        refreshNavigationTrackData().catch(() => {});
      }, TRACK_POLL_INTERVAL_MS);
    }

    function syncNavigationItineraryOverlay() {
      if (!navigationMapState.map) {
        return;
      }

      const points = getItineraryMapPoints();
      const signature = getItineraryMapSignature(points);

      if (!points.length) {
        if (navigationMapState.itineraryLayer) {
          navigationMapState.map.removeLayer(navigationMapState.itineraryLayer);
          navigationMapState.itineraryLayer = null;
        }
        navigationMapState.itinerarySignature = "";
        return;
      }

      if (signature === navigationMapState.itinerarySignature) {
        return;
      }

      if (navigationMapState.itineraryLayer) {
        navigationMapState.map.removeLayer(navigationMapState.itineraryLayer);
      }

      const itineraryLayer = window.L.layerGroup();
      points.forEach(point => {
        const marker = window.L.circleMarker([point.latitude, point.longitude], {
          radius: 6,
          weight: 2,
          color: "#fff5d8",
          fillColor: "#d4b06a",
          fillOpacity: 0.95
        });

        const popupLines = [
          point.day && point.location ? `<strong>${point.day}: ${point.location}</strong>` : `<strong>${point.label}</strong>`,
          point.plan ? `<div>${point.plan}</div>` : ""
        ].filter(Boolean);

        marker.bindTooltip(point.label, {
          permanent: true,
          direction: "top",
          offset: [0, -10],
          className: "navigation-itinerary-tooltip"
        });
        marker.bindPopup(popupLines.join(""));
        marker.addTo(itineraryLayer);
      });

      itineraryLayer.addTo(navigationMapState.map);
      navigationMapState.itineraryLayer = itineraryLayer;
      navigationMapState.itinerarySignature = signature;
    }

    function getNavigationTrackDistanceMeters(a, b) {
      const earthRadius = 6371000;
      const lat1 = a.lat * Math.PI / 180;
      const lat2 = b.lat * Math.PI / 180;
      const deltaLat = (b.lat - a.lat) * Math.PI / 180;
      const deltaLng = (b.lng - a.lng) * Math.PI / 180;
      const sinLat = Math.sin(deltaLat / 2);
      const sinLng = Math.sin(deltaLng / 2);
      const haversine = (sinLat * sinLat) + (Math.cos(lat1) * Math.cos(lat2) * sinLng * sinLng);
      return 2 * earthRadius * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
    }

    function createNavigationVesselIcon() {
      return window.L.divIcon({
        className: "navigation-vessel-marker",
        html: '<div class="navigation-vessel-marker-shell"><div class="navigation-vessel-marker-pulse"></div><div class="navigation-vessel-marker-ship" aria-hidden="true"><div class="navigation-vessel-marker-image-frame"></div></div></div>',
        iconSize: [56, 56],
        iconAnchor: [28, 28]
      });
    }

    function applyVesselMarkerHeading(marker) {
      if (!marker) {
        return;
      }

      const heading = getNavigationMapHeading();
      const markerElement = marker.getElement();
      if (markerElement) {
        markerElement.style.setProperty("--vessel-heading", Number.isFinite(heading) ? `${heading}deg` : "0deg");
      }
    }

    function initializeNavigationMap() {
      if (navigationMapState.map) {
        return navigationMapState.map;
      }

      const mapNode = document.getElementById("navigationMap");
      if (!mapNode) {
        return null;
      }

      if (!window.L || typeof window.L.map !== "function") {
        setNavigationMapPlaceholder(
          "Map library unavailable",
          "Load this page once while online so Leaflet and the viewed tiles can be reused when internet access drops."
        );
        setNavigationMapStatus("Interactive map is waiting for the Leaflet library. The rest of the navigation panel remains available.");
        return null;
      }

      mapNode.innerHTML = "";

      const map = window.L.map(mapNode, {
        zoomControl: false,
        minZoom: NAVIGATION_MAP_MIN_ZOOM,
        maxZoom: NAVIGATION_MAP_MAX_ZOOM,
        worldCopyJump: true
      });

      const satelliteLayer = createSatelliteTileLayer();

      satelliteLayer.addTo(map);
      window.L.control.zoom({ position: "topleft" }).addTo(map);

      const trackLine = window.L.polyline([], {
        color: "#d94a43",
        weight: 3,
        opacity: 0.88,
        smoothFactor: 0,
        noClip: true
      }).addTo(map);

      const marker = window.L.marker([0, 0], {
        icon: createNavigationVesselIcon(),
        keyboard: false
      }).addTo(map);

      marker.bindTooltip("Princess Iolanthe", {
        direction: "top",
        offset: [0, -12]
      });

      map.on("dragstart", () => {
        navigationMapState.followVessel = false;
        syncNavigationMapFollowButton();
        setNavigationMapStatus("Map follow paused. Use the button to recenter on the live vessel position.");
      });
      map.on("moveend", () => {
        syncNavigationMapFollowButton();
      });

      const plannedRouteToggle = document.getElementById("navigationMapPlannedRouteToggle");
      if (plannedRouteToggle && plannedRouteToggle.dataset.bound !== "true") {
        plannedRouteToggle.dataset.bound = "true";
        plannedRouteToggle.addEventListener("click", () => {
          navigationMapState.plannedRouteToggleTouched = true;
          navigationMapState.plannedRouteVisible = !navigationMapState.plannedRouteVisible;
          syncPlannedRouteLayers();
        });
      }

      navigationMapState.map = map;
      navigationMapState.marker = marker;
      navigationMapState.satelliteLayer = satelliteLayer;
      navigationMapState.trackLine = trackLine;
      updateSharedTrackLines();
      syncPlannedRouteLayers();
      navigationMapState.initialized = true;
      bindMapTileRecovery(navigationMapState, satelliteLayer);
      syncMapAvailabilityNotice(navigationMapState);
      syncNavigationItineraryOverlay();
      syncNavigationMapFollowButton();
      return map;
    }

    function updateNavigationMapMarkerHeading() {
      applyVesselMarkerHeading(navigationMapState.marker);
    }

    function updateIdleMapMarkerHeading() {
      applyVesselMarkerHeading(idleMapState.marker);
    }

    function updateNavigationMapView(latitude, longitude) {
      if (!navigationMapState.map || !Number.isFinite(latitude) || !Number.isFinite(longitude)) {
        return;
      }

      const nextLatLng = [latitude, longitude];
      if (!navigationMapState.hasCentered) {
        const zoomChoice = getAutomaticMapZoomChoice(NAVIGATION_MAP_DEFAULT_ZOOM, { map: navigationMapState.map });
        setMapViewWithRecovery(navigationMapState, nextLatLng, zoomChoice.zoom, { animate: false });
        navigationMapState.hasCentered = true;
        if (!zoomChoice.available) {
          setMapAvailabilityNotice(navigationMapState, MAP_TILE_UNAVAILABLE_MESSAGE);
        }
        return;
      }

      if (navigationMapState.followVessel) {
        navigationMapState.map.panTo(nextLatLng, { animate: true, duration: 0.8 });
      }
    }

    function syncNavigationMap() {
      const coordinates = getNavigationMapCoordinates();
      const hasLivePosition = !!getLiveWeatherCoords();
      updateNavigationMapMeta(coordinates, hasLivePosition);
      syncNavigationMapFollowButton();

      if (!coordinates) {
        setNavigationMapPlaceholder(
          "Awaiting map position",
          "The moving map will activate as soon as live NMEA coordinates arrive or fallback latitude and longitude are added to the navigation settings."
        );
        setNavigationMapStatus("Map is waiting for a usable vessel position.");
        return;
      }

      const map = initializeNavigationMap();
      if (!map) {
        return;
      }

      syncNavigationItineraryOverlay();

      const latitude = Number(coordinates.latitude);
      const longitude = Number(coordinates.longitude);
      if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
        setNavigationMapStatus("Map position is unavailable right now.");
        return;
      }

      navigationMapState.marker.setLatLng([latitude, longitude]);
      updateNavigationMapMarkerHeading();

      updateNavigationMapView(latitude, longitude);
      invalidateNavigationMapSize();

      const updatedAt = nmeaState.data && nmeaState.data.updated_at
        ? `Updated ${formatNavigationMapTimestamp(nmeaState.data.updated_at)}. `
        : "";
      const followNote = navigationMapState.followVessel
        ? "Map is following the vessel."
        : "Map follow is paused.";
      const trackPointCount = navigationMapState.trackPoints.length;
      const retentionDays = Number.isFinite(Number(navigationTrackData.retentionDaysAfterCharter))
        ? Number(navigationTrackData.retentionDaysAfterCharter)
        : 3;
      const trackNote = trackPointCount
        ? `Shared onboard track shows ${trackPointCount} logged point${trackPointCount === 1 ? "" : "s"} for this charter and retains data for the charter plus ${retentionDays} extra day${retentionDays === 1 ? "" : "s"}.`
        : "Shared onboard track history will appear here as live NMEA positions are recorded.";
      const sourceNote = hasLivePosition
        ? "Live NMEA position active."
        : "Using configured fallback coordinates.";
      setNavigationMapStatus(`${updatedAt}${sourceNote} ${trackNote} Viewed satellite tiles remain available offline after they have been loaded once. ${followNote}`);
    }

    async function fetchNmeaSnapshot() {
      const response = await fetch(NMEA_API_URL, { cache: "no-store" });
      if (!response.ok) {
        throw new Error(`NMEA endpoint returned ${response.status}.`);
      }
      return response.json();
    }

    function updateHeaderPosition() {
      const primary = document.getElementById("headerPositionPrimary");
      const secondary = document.getElementById("headerPositionSecondary");
      const meta = document.getElementById("headerPositionMeta");

      if (!primary || !secondary || !meta) {
        return;
      }

      const position = nmeaState.data && nmeaState.data.position;
      const navigation = nmeaState.data && nmeaState.data.navigation;

      if (!position || !position.valid) {
        primary.textContent = "Awaiting live NMEA position";
        secondary.textContent = "Decimal --, --";
        meta.textContent = "";
        return;
      }

      primary.textContent = formatCoordinatePairTraditional(position.latitude, position.longitude, 3);
      secondary.textContent = formatCoordinatePairDecimal(position.latitude, position.longitude);
      meta.textContent = "";
    }

    function getPreferredTrueWind() {
      const wind = nmeaState.data && nmeaState.data.wind;
      if (!wind) {
        return null;
      }

      const hasUsefulDirectTrueWind = Number.isFinite(wind.true_speed_knots)
        && Number.isFinite(wind.true_direction_deg)
        && wind.true_speed_knots > 0.05;
      const hasDerivedTrueWind = Number.isFinite(wind.derived_true_speed_knots)
        && Number.isFinite(wind.derived_true_direction_deg);

      if (hasUsefulDirectTrueWind) {
        return {
          speedKnots: wind.true_speed_knots,
          directionDegrees: wind.true_direction_deg,
          gustKnots: Number.isFinite(wind.true_gust_knots) ? wind.true_gust_knots : null,
          source: wind.true_source || "Direct true wind feed"
        };
      }

      if (hasDerivedTrueWind) {
        return {
          speedKnots: wind.derived_true_speed_knots,
          directionDegrees: wind.derived_true_direction_deg,
          gustKnots: Number.isFinite(wind.derived_true_gust_knots) ? wind.derived_true_gust_knots : null,
          source: wind.derived_true_source || "Derived true wind"
        };
      }

      if (Number.isFinite(wind.true_speed_knots) && Number.isFinite(wind.true_direction_deg)) {
        return {
          speedKnots: wind.true_speed_knots,
          directionDegrees: wind.true_direction_deg,
          gustKnots: Number.isFinite(wind.true_gust_knots) ? wind.true_gust_knots : null,
          source: wind.true_source || "Direct true wind feed"
        };
      }

      return null;
    }

    function formatWindSpeedPill(value) {
      return Number.isFinite(value) ? `${value.toFixed(value < 10 ? 1 : 0)} kts` : "--";
    }

    function formatWindDirectionPill(value) {
      if (!Number.isFinite(value)) {
        return "--";
      }

      return `${toCompass(value)} ${formatDegrees(value, 0)}T`;
    }

    function formatWindMetricValue(preferredWind) {
      if (!preferredWind) {
        return "--";
      }

      const parts = [];
      if (Number.isFinite(preferredWind.speedKnots)) {
        parts.push(formatWindSpeedPill(preferredWind.speedKnots));
      }
      if (Number.isFinite(preferredWind.directionDegrees)) {
        parts.push(formatWindDirectionPill(preferredWind.directionDegrees));
      }

      return parts.length ? parts.join(" / ") : "--";
    }

    function formatWindMetricDetail(preferredWind) {
      const gustKnots = preferredWind && Number.isFinite(preferredWind.gustKnots)
        ? preferredWind.gustKnots
        : null;
      return `Gusts ${formatWindSpeedPill(gustKnots)}`;
    }

    function updateNavigationTelemetry() {
      const grid = document.getElementById("navigationTelemetryGrid");
      const status = document.getElementById("navigationTelemetryStatus");

      if (!grid || !status) {
        return;
      }

      const navigation = nmeaState.data && nmeaState.data.navigation;
      const position = nmeaState.data && nmeaState.data.position;
      const wind = nmeaState.data && nmeaState.data.wind;
      const route = nmeaState.data && nmeaState.data.route;
      const source = nmeaState.data && nmeaState.data.source;
      const updatedAt = nmeaState.data && nmeaState.data.updated_at;
      const telemetrySettings = getIdleScreensaverSettings();
      const preferredWind = getPreferredTrueWind();
      const routeDestination = route && route.destination_waypoint_id
        ? `to ${route.destination_waypoint_id}`
        : "No active waypoint";
      const hasMeaningfulRouteData = !!(route && route.active && (
        Number.isFinite(route.ttg_minutes)
        || !!route.eta_utc
        || route.source_sentence === "RMB"
      ));

      if (!navigation && !position && !hasMeaningfulRouteData) {
        const emptyCards = renderConfiguredTelemetryCards(
          telemetrySettings,
          getNavigationTelemetryCardDefinitions(null, null, true)
        );

        replaceNodeChildren(grid, ...emptyCards);
        if (nmeaState.error) {
          setOptionalStatus(status, nmeaState.error, true);
        } else if (source && source.udp_error) {
          setOptionalStatus(status, `NMEA socket issue: ${source.udp_error}.`, true);
        } else if (source && source.last_rejected_sender) {
          setOptionalStatus(status, `Packets are arriving from ${source.last_rejected_sender}, but the server is currently filtering for ${source.source_host_filter || "any sender"}.`, true);
        } else {
          setOptionalStatus(status, "Waiting for onboard instrument data.", true);
        }
        return;
      }

      const cards = renderConfiguredTelemetryCards(
        telemetrySettings,
        getNavigationTelemetryCardDefinitions(nmeaState.data, preferredWind)
      );

      replaceNodeChildren(grid, ...cards);

      const windNote = preferredWind
        ? (wind && preferredWind.source === "Derived from MWV apparent wind"
          ? " True wind is estimated from the apparent wind feed."
          : "")
        : " True wind is not available yet.";
      const routeNote = route && route.active
        ? (Number.isFinite(route.ttg_minutes) && route.eta_utc
          ? ` Route guidance active ${routeDestination}${route.source_sentence ? ` via ${route.source_sentence}` : ""}.`
          : (route.source_sentence === "APB"
            ? ""
            : ` Route guidance detected ${routeDestination}, but TTG and ETA are not available yet.`))
        : " No route guidance sentence detected yet.";
      setOptionalStatus(
        status,
        updatedAt
          ? `Live NMEA update ${new Date(updatedAt).toLocaleTimeString()}.${windNote}${routeNote}`
          : `Live NMEA data active.${windNote}${routeNote}`,
        false
      );
    }

    function syncNmeaUi() {
      updateHeaderPosition();
      updateNavigationTelemetry();
      syncNavigationMap();
      syncIdleDashboard();
    }

    async function refreshNmeaData() {
      const hadLiveCoords = !!getLiveWeatherCoords();

      try {
        const snapshot = await fetchNmeaSnapshot();
        nmeaState = {
          loading: false,
          data: snapshot,
          error: "",
          updatedAt: snapshot && snapshot.updated_at ? snapshot.updated_at : ""
        };
      } catch (error) {
        nmeaState = {
          loading: false,
          data: null,
          error: error && error.message ? error.message : "Unable to reach the NMEA bridge.",
          updatedAt: ""
        };
      }

      syncNmeaUi();

      if (weatherState.visible) {
        const hasLiveCoords = !!getLiveWeatherCoords();
        if (hasLiveCoords && (!hadLiveCoords || !weatherState.data)) {
          refreshWeather({ force: !hadLiveCoords }).catch(() => {});
        }
      }
    }

    function startNmeaRefreshLoop() {
      if (nmeaRefreshTimer) {
        window.clearInterval(nmeaRefreshTimer);
      }

      nmeaRefreshTimer = window.setInterval(() => {
        refreshNmeaData().catch(() => {});
      }, NMEA_POLL_INTERVAL_MS);
    }

    function formatWeatherWind(value) {
      if (!Number.isFinite(value)) {
        return "â€”";
      }
      const knots = value / 1.852;
      return `${knots.toFixed(knots < 10 ? 1 : 0)} kts`;
    }

    function formatTemperature(value) {
      return Number.isFinite(value) ? `${Math.round(value)}°C` : "—";
    }

    function formatPercent(value) {
      return Number.isFinite(value) ? `${Math.round(value)}%` : "—";
    }

    function formatWind(value) {
      return Number.isFinite(value) ? `${Math.round(value)} km/h` : "—";
    }

    function formatPrecipitation(value) {
      return Number.isFinite(value) ? `${value.toFixed(value < 10 ? 1 : 0)} mm` : "—";
    }

    function formatCoordinate(value, positiveLabel, negativeLabel) {
      if (!Number.isFinite(value)) {
        return "—";
      }
      const label = value >= 0 ? positiveLabel : negativeLabel;
      return `${Math.abs(value).toFixed(3)}° ${label}`;
    }

    function formatOptionalClock(value) {
      const text = safeText(value);
      if (!text) {
        return "";
      }
      const date = new Date(text);
      if (Number.isNaN(date.getTime())) {
        return "";
      }
      return new Intl.DateTimeFormat(undefined, {
        hour: "numeric",
        minute: "2-digit"
      }).format(date);
    }

    function formatClock(value) {
      return formatOptionalClock(value) || "\u2014";
    }

    function formatClockLegacy(value) {
      if (!value) {
        return "—";
      }
      const date = new Date(value);
      if (Number.isNaN(date.getTime())) {
        return "\u2014";
      }
      return new Intl.DateTimeFormat(undefined, {
        hour: "numeric",
        minute: "2-digit"
      }).format(date);
    }

    function formatDayLabel(value) {
      const text = safeText(value);
      if (!text) {
        return "\u2014";
      }
      const date = new Date(text);
      if (Number.isNaN(date.getTime())) {
        return "\u2014";
      }
      return new Intl.DateTimeFormat(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric"
      }).format(date);
    }

    function formatDayLabelLegacy(value) {
      if (!value) {
        return "—";
      }
      const date = new Date(value);
      if (Number.isNaN(date.getTime())) {
        return "\u2014";
      }
      return new Intl.DateTimeFormat(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric"
      }).format(date);
    }

    function degreesToCardinal(deg) {
      if (deg === null || deg === undefined || isNaN(deg)) return null;

      const index = Math.round(Number(deg) / 45) % 8;
      return CARDINAL_DIRECTIONS[index];
    }

    function toCompass(degrees) {
      if (!Number.isFinite(degrees)) {
        return "—";
      }
      const normalized = ((degrees % 360) + 360) % 360;
      return COMPASS_DIRECTIONS[Math.round(normalized / 22.5) % COMPASS_DIRECTIONS.length];
    }

    function describeWeatherCode(code, isDay) {
      const label = {
        0: isDay === 0 ? "Clear night" : "Clear sky",
        1: "Mostly clear",
        2: "Partly cloudy",
        3: "Overcast",
        45: "Fog",
        48: "Rime fog",
        51: "Light drizzle",
        53: "Drizzle",
        55: "Dense drizzle",
        56: "Freezing drizzle",
        57: "Heavy freezing drizzle",
        61: "Light rain",
        63: "Rain",
        65: "Heavy rain",
        66: "Freezing rain",
        67: "Heavy freezing rain",
        71: "Light snow",
        73: "Snow",
        75: "Heavy snow",
        77: "Snow grains",
        80: "Light showers",
        81: "Showers",
        82: "Heavy showers",
        85: "Snow showers",
        86: "Heavy snow showers",
        95: "Thunderstorm",
        96: "Thunderstorm and hail",
        99: "Severe thunderstorm and hail"
      }[code];
      return label || "Conditions unavailable";
    }

    function getConfiguredWeatherCoords() {
      const latitude = Number(navigationData && navigationData.latitude);
      const longitude = Number(navigationData && navigationData.longitude);

      if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
        return null;
      }

      return {
        latitude,
        longitude,
        label: (navigationData && navigationData.location_label) || "Configured vessel position",
        source: "Configured coordinates"
      };
    }

    async function fetchWithTimeout(url, timeoutMs) {
      const controller = new AbortController();
      const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);

      try {
        const response = await fetch(url, { cache: "no-store", signal: controller.signal });
        if (!response.ok) {
          throw new Error(`Weather service returned ${response.status}.`);
        }
        return response;
      } catch (error) {
        if (error && error.name === "AbortError") {
          throw new Error("Weather service timed out.");
        }
        throw error;
      } finally {
        window.clearTimeout(timeoutId);
      }
    }

    async function fetchWeatherPayload() {
      const response = await fetchWithTimeout(WEATHER_API_URL, 8000);
      return response.json();
    }

    function weatherEntryNotice(entry) {
      const source = entry && typeof entry === "object" ? entry : {};
      if (source.status === "rate_limited") {
        return "Weather service temporarily rate limited. Showing last successful update.";
      }
      if (source.stale && source.last_success_at && Number.isFinite(Date.parse(source.last_success_at))) {
        return `Showing cached weather from ${formatClock(source.last_success_at)}`;
      }
      return safeText(source.message);
    }

    const MOON_PHASE_IMAGE_BASE_PATH = "/assets/moon-phases";
    const MOON_PHASE_IMAGE_MAP = [
      "new-moon-000.png",
      "waxing-cres-125.png",
      "first-quarter-250.png",
      "waxing-gib-375.png",
      "full-moon-500.png",
      "waning-gib-625.png",
      "last-quarter-750.png",
      "waning-cres-875.png"
    ];

    function moonPhaseImageForPhase(value) {
      const number = Number(value);
      if (!Number.isFinite(number)) {
        return "";
      }
      let phase = Math.abs(number) > 1 && Math.abs(number) <= 100 ? number / 100 : number;
      phase %= 1;
      if (phase < 0) {
        phase += 1;
      }
      const index = Math.round(phase * 8) % 8;
      return `${MOON_PHASE_IMAGE_BASE_PATH}/${MOON_PHASE_IMAGE_MAP[index]}`;
    }

    function normalizeMoonForClient(value) {
      const source = value && typeof value === "object" ? value : {};
      const phase = Number(source.phase);
      const illumination = Number(source.illumination);
      const phaseName = firstSafeText(source.phase_name, source.phaseName);
      const image = safeText(source.image) || moonPhaseImageForPhase(phase);
      if (!Number.isFinite(phase) && !phaseName && !image) {
        return null;
      }
      return {
        phase: Number.isFinite(phase) ? phase : null,
        phaseName: phaseName || "Moon Phase",
        illumination: Number.isFinite(illumination) ? Math.max(0, Math.min(100, Math.round(illumination))) : null,
        image,
        source: safeText(source.source) === "provider" ? "provider" : "calculated",
        updatedAt: firstSafeText(source.updated_at, source.updatedAt)
      };
    }

    function getMoonSignature(moon) {
      const source = normalizeMoonForClient(moon);
      if (!source) {
        return "moon:none";
      }
      return [
        "moon",
        source.phase === null ? "unknown" : source.phase.toFixed(4),
        source.phaseName,
        source.illumination === null ? "unknown" : source.illumination,
        source.image || "",
        source.source,
        source.updatedAt
      ].join("|");
    }

    function getWeatherPayloadMoon(payload) {
      const source = payload && typeof payload === "object" ? payload : {};
      return normalizeMoonForClient(source.moon)
        || normalizeMoonForClient(source.current_position && source.current_position.data && source.current_position.data.moon)
        || normalizeMoonForClient(source.next_stop_forecast && source.next_stop_forecast.data && source.next_stop_forecast.data.moon);
    }

    function weatherEntryToClientData(entry) {
      const source = entry && typeof entry === "object" ? entry : {};
      const location = source.location && typeof source.location === "object" ? source.location : {};
      const latitude = Number(location.latitude);
      const longitude = Number(location.longitude);
      const forecast = source.data && typeof source.data === "object" ? source.data : null;
      return {
        coords: {
          latitude: Number.isFinite(latitude) ? latitude : null,
          longitude: Number.isFinite(longitude) ? longitude : null,
          label: safeText(location.label),
          source: safeText(location.source)
        },
        forecast,
        moon: normalizeMoonForClient(forecast && forecast.moon),
        source: firstSafeText(source.source, location.source, "Onboard weather cache"),
        status: safeText(source.status, "unavailable"),
        message: weatherEntryNotice(source),
        updatedAt: firstSafeText(source.last_success_at, source.last_attempt_at)
      };
    }

    function getWeatherClientDataSignature(data) {
      const source = data && typeof data === "object" ? data : {};
      const coords = source.coords || {};
      return [
        source.status || "unavailable",
        source.message || "",
        source.source || "",
        source.forecast ? "forecast" : "empty",
        Number.isFinite(coords.latitude) ? coords.latitude.toFixed(4) : "none",
        Number.isFinite(coords.longitude) ? coords.longitude.toFixed(4) : "none",
        coords.label || "",
        source.updatedAt || "",
        getMoonSignature(source.moon)
      ].join("|");
    }

    function getWeatherDisplaySignature(state) {
      const source = state && typeof state === "object" ? state : {};
      return [
        source.visible ? "visible" : "hidden",
        source.loading ? "loading" : "idle",
        source.error || "",
        source.updatedAt || "",
        getMoonSignature(source.moon),
        getWeatherClientDataSignature(source.data)
      ].join("|");
    }

    function getWeatherPayloadSignature(payload) {
      function key(entry) {
        const data = weatherEntryToClientData(entry);
        return getWeatherClientDataSignature(data);
      }
      return `${key(payload && payload.current_position)}|${key(payload && payload.next_stop_forecast)}|${getMoonSignature(getWeatherPayloadMoon(payload))}`;
    }

    function getWeatherPayloadUpdatedAt(payload, currentData, nextData) {
      return firstSafeText(
        currentData && currentData.updatedAt,
        nextData && nextData.updatedAt,
        payload && payload.updated_at
      );
    }

    function applyIdleWeatherPayload(payload) {
      const current = weatherEntryToClientData(payload && payload.current_position);
      const next = weatherEntryToClientData(payload && payload.next_stop_forecast);
      const moon = getWeatherPayloadMoon(payload) || current.moon || next.moon;
      const signature = getWeatherPayloadSignature(payload);
      const changed = idleWeatherState.loading
        || idleWeatherState.error
        || idleWeatherState.signature !== signature;
      idleWeatherState = {
        loading: false,
        current,
        next,
        moon,
        error: "",
        signature,
        updatedAt: getWeatherPayloadUpdatedAt(payload, current, next)
      };
      return changed;
    }

    function logWeatherDiagnostics(payload) {
      const diagnostics = payload && payload.diagnostics && typeof payload.diagnostics === "object"
        ? payload.diagnostics
        : null;
      if (!diagnostics || typeof console === "undefined" || typeof console.info !== "function") {
        return;
      }

      const signature = JSON.stringify(diagnostics);
      if (signature === weatherDiagnosticsSignature) {
        return;
      }
      weatherDiagnosticsSignature = signature;

      ["current_position", "next_stop_forecast"].forEach(key => {
        const entry = diagnostics[key];
        if (!entry || typeof entry !== "object") {
          return;
        }
        console.info(
          `[weather] ${key}: served=${entry.served_from || "cache"} status=${entry.status || "unavailable"} last_backend_fetch=${entry.last_backend_fetch_at || "none"} next_allowed_fetch=${entry.next_allowed_fetch_at || "now"}`
        );
      });
    }

    function getGuestItineraryVisibleStops(day) {
      return day && Array.isArray(day.stops)
        ? day.stops.filter(stop => !!stop.plan || (Array.isArray(stop.images) && stop.images.length))
        : [];
    }

    function guestItineraryDayHasContent(day) {
      if (!day) {
        return false;
      }

      return !!(day.area || day.summary || day.timing || getGuestItineraryVisibleStops(day).length);
    }

    function getGuestItineraryDateViewState(itineraryInfo, days) {
      const validDays = Array.isArray(days)
        ? days.filter(day => day && Number.isFinite(Number(day.dayNumber)))
        : [];
      return calculateCurrentCharterDayState({
        startDate: itineraryInfo && itineraryInfo.start_date,
        endDate: itineraryInfo && itineraryInfo.end_date,
        dayNumbers: validDays.map(day => Number(day.dayNumber))
      });
    }

    function getGuestVisibleItineraryDays(days, viewState) {
      if (!Array.isArray(days) || !days.length) {
        return [];
      }

      return days;
    }

    function guestItineraryDayStatus(day, viewState) {
      if (!viewState || !viewState.canCalculateCurrentDay) {
        return "";
      }
      if (viewState.allDaysPast) {
        return "past";
      }
      const dayNumber = Number(day && day.dayNumber);
      if (!Number.isFinite(dayNumber)) {
        return "";
      }
      if (dayNumber < viewState.currentDayNumber) {
        return "past";
      }
      if (dayNumber === viewState.currentDayNumber) {
        return "current";
      }
      return "future";
    }

    function resolveGuestSelectedItineraryDay(visibleDays, viewState) {
      if (!Array.isArray(visibleDays) || !visibleDays.length) {
        selectedItineraryDayId = "";
        lastResolvedItineraryCurrentDayNumber = null;
        return null;
      }

      const currentDayNumber = Number(viewState && viewState.currentDayNumber);
      if (Number.isFinite(currentDayNumber) && lastResolvedItineraryCurrentDayNumber !== currentDayNumber) {
        selectedItineraryDayId = "";
      }

      const existing = selectedItineraryDayId
        ? visibleDays.find(day => day && day.id === selectedItineraryDayId)
        : null;
      const selected = existing
        || visibleDays.find(day => Number(day && day.dayNumber) === viewState.defaultDayNumber)
        || visibleDays[0];

      selectedItineraryDayId = selected && selected.id ? selected.id : "";
      lastResolvedItineraryCurrentDayNumber = Number.isFinite(currentDayNumber) ? currentDayNumber : null;
      return selected || null;
    }

    function buildWeatherLocationText(data) {
      const parts = [];
      if (data.coords && data.coords.label) {
        parts.push(data.coords.label);
      }
      parts.push(`Lat ${formatCoordinate(data.coords.latitude, "N", "S")}`);
      parts.push(`Lon ${formatCoordinate(data.coords.longitude, "E", "W")}`);
      if (data.forecast && data.forecast.timezone) {
        parts.push(data.forecast.timezone.replace(/_/g, " "));
      }
      return parts.join(" · ");
    }

    function buildWeatherLocationDecimalText(data) {
      const coords = data && data.coords ? data.coords : {};
      return formatCoordinatePairDecimal(coords.latitude, coords.longitude);
    }

    function getHourlyWeatherValue(hourly, index, fieldNames) {
      const source = hourly && typeof hourly === "object" ? hourly : {};
      for (const fieldName of fieldNames) {
        const values = source[fieldName];
        const rawValue = Array.isArray(values) ? values[index] : undefined;
        if (rawValue === null || rawValue === undefined || rawValue === "") {
          continue;
        }
        const number = Number(rawValue);
        if (Number.isFinite(number)) {
          return number;
        }
      }
      return null;
    }

    function getWeatherHourlyRows(forecast) {
      if (!forecast || !forecast.hourly || !Array.isArray(forecast.hourly.time)) {
        return [];
      }

      const hourly = forecast.hourly;
      const currentTime = forecast.current && forecast.current.time ? forecast.current.time : hourly.time[0];
      const todayKey = currentTime.split("T")[0];
      const rawStartIndex = hourly.time.findIndex(time => time >= currentTime);
      const startIndex = rawStartIndex >= 0 ? rawStartIndex : 0;
      const rows = [];

      for (let index = startIndex; index < hourly.time.length; index += 1) {
        if (!hourly.time[index].startsWith(todayKey)) {
          break;
        }
        if (index !== startIndex && (index - startIndex) % 3 !== 0) {
          continue;
        }
        rows.push({
          time: hourly.time[index],
          weather_code: hourly.weather_code ? hourly.weather_code[index] : null,
          temperature_2m: hourly.temperature_2m ? hourly.temperature_2m[index] : null,
          precipitation_probability: hourly.precipitation_probability ? hourly.precipitation_probability[index] : null,
          wind_speed_10m: hourly.wind_speed_10m ? hourly.wind_speed_10m[index] : null,
          wind_direction: getHourlyWeatherValue(hourly, index, HOURLY_WIND_DIRECTION_FIELDS)
        });
      }

      return rows.slice(0, 8);
    }

    function formatWind(value) {
      if (!Number.isFinite(value)) {
        return "â€”";
      }
      const knots = value / 1.852;
      return `${knots.toFixed(knots < 10 ? 1 : 0)} kts`;
    }

    function formatWeatherWindDirection(value) {
      if (!Number.isFinite(value)) {
        return "";
      }
      return `${toCompass(value)} ${Math.round(value)}°T`;
    }

    function formatWeatherHourlyWindTitle(directionDegrees, cardinal) {
      const normalized = ((directionDegrees % 360) + 360) % 360;
      const rounded = Math.round(normalized) % 360;
      return `Wind: ${String(rounded).padStart(3, "0")}\u00B0 (${cardinal})`;
    }

    function renderWeatherHourlyWind(row) {
      const source = row && typeof row === "object" ? row : {};
      const directionDegrees = Number.isFinite(source.wind_direction) ? source.wind_direction : null;
      const cardinal = degreesToCardinal(directionDegrees);
      const hasWindSpeed = Number.isFinite(source.wind_speed_10m);
      const speed = formatWeatherWind(source.wind_speed_10m);
      const attrs = {};
      const children = [];

      if (cardinal) {
        attrs.title = formatWeatherHourlyWindTitle(directionDegrees, cardinal);
      }
      if (hasWindSpeed) {
        children.push(el("span", { class: "weather-wind-speed" }, [speed]));
      }
      if (cardinal) {
        children.push(el("span", { class: "weather-wind-direction" }, [cardinal]));
      }
      if (!children.length) {
        children.push(speed);
      }

      return el("td", attrs, children);
    }

    function buildWeatherWindValue(current) {
      const source = current && typeof current === "object" ? current : {};
      const speed = formatWind(source.wind_speed_10m);
      const direction = formatWeatherWindDirection(source.wind_direction_10m);
      if (speed.includes("kts") && direction) {
        return `${speed} / ${direction}`;
      }
      return speed.includes("kts") ? speed : (direction || "--");
    }

    function buildWeatherGustDetail(current) {
      const source = current && typeof current === "object" ? current : {};
      return Number.isFinite(source.wind_gusts_10m)
        ? `Gusts ${formatWind(source.wind_gusts_10m)}`
        : "";
    }

    function normalizeWeatherStatDetail(label, detail) {
      const text = typeof detail === "string" ? detail.trim() : "";
      if (label !== "Wind" || !text || /\bGusts\s+\d/.test(text)) {
        return text;
      }
      return text.replace(/\s*(?:\u00c2?\u00b7|\|)\s*Gusts\b.*$/u, "").trim();
    }

    function renderWeatherStat(label, value, detail) {
      const cleanDetail = normalizeWeatherStatDetail(label, detail);
      return el("div", { class: "weather-stat" }, [
        el("div", { class: "weather-stat-label" }, [label]),
        el("strong", { class: "weather-stat-value" }, [value]),
        ...(cleanDetail ? [el("div", { class: "muted" }, [cleanDetail])] : [])
      ]);
    }

    function renderMoonPhaseImage(moon, modifier = "") {
      const source = normalizeMoonForClient(moon);
      if (!source || !source.image) {
        return null;
      }
      const image = el("img", {
        class: `moon-phase-image${modifier ? ` moon-phase-image--${modifier}` : ""}`,
        src: source.image,
        alt: "",
        "aria-hidden": "true",
        loading: "lazy",
        decoding: "async"
      });
      image.addEventListener("error", () => {
        image.hidden = true;
        const shell = image.closest("[data-moon-phase-shell]");
        if (shell) {
          shell.hidden = true;
        }
      });
      if (modifier === "idle") {
        return el("div", { class: "idle-moon-phase-shell", "data-moon-phase-shell": "true", "aria-hidden": "true" }, [image]);
      }
      return image;
    }

    function renderWeatherHourlyTable(forecast) {
      const rows = getWeatherHourlyRows(forecast);
      const table = el("table", { class: "weather-hourly-table" });
      const thead = el("thead", {}, [
        el("tr", {}, [
          el("th", {}, ["Time"]),
          el("th", {}, ["Conditions"]),
          el("th", {}, ["Temp"]),
          el("th", {}, ["Rain"]),
          el("th", {}, ["Wind"])
        ])
      ]);
      const tbody = el("tbody");

      rows.forEach(row => {
        tbody.appendChild(el("tr", {}, [
          el("td", {}, [formatClock(row.time)]),
          el("td", {}, [describeWeatherCode(row.weather_code, 1)]),
          el("td", {}, [formatTemperature(row.temperature_2m)]),
          el("td", {}, [formatPercent(row.precipitation_probability)]),
          renderWeatherHourlyWind(row)
        ]));
      });

      if (!rows.length) {
        tbody.appendChild(el("tr", {}, [
          el("td", { colspan: "5" }, ["No hourly weather data is available for the rest of today."])
        ]));
      }

      table.appendChild(thead);
      table.appendChild(tbody);
      return table;
    }

    function renderWeatherForecastGrid(forecast) {
      const daily = forecast && forecast.daily ? forecast.daily : null;
      const cards = [];

      if (daily && Array.isArray(daily.time)) {
        for (let index = 1; index < Math.min(daily.time.length, 6); index += 1) {
          cards.push(el("div", { class: "weather-day-card" }, [
            el("div", { class: "weather-day-label" }, [formatDayLabel(daily.time[index])]),
            el("strong", { class: "weather-day-value" }, [describeWeatherCode(daily.weather_code[index], 1)]),
            el("div", { class: "muted" }, [`High ${formatTemperature(daily.temperature_2m_max[index])} · Low ${formatTemperature(daily.temperature_2m_min[index])}`]),
            el("div", { class: "muted" }, [`Rain ${formatPercent(daily.precipitation_probability_max[index])} · ${formatPrecipitation(daily.precipitation_sum[index])}`]),
            el("div", { class: "muted" }, [`Max wind ${formatWeatherWind(daily.wind_speed_10m_max[index])}`])
          ]));
        }
      }

      return el("div", { class: "weather-forecast-grid" }, cards.length
        ? cards
        : [el("div", { class: "weather-day-card" }, ["Upcoming forecast is unavailable right now."])]);
    }

    function renderWeatherTab() {
      const panel = el("section", { class: "tab-panel", id: "panel-weather" });
      const heroChildren = [
        el("div", { class: "section-kicker" }, ["Live Forecast"]),
        el("h2", {}, ["Weather"])
      ];
      const moonImage = renderMoonPhaseImage(weatherState.moon, "weather");
      if (moonImage) {
        heroChildren.push(moonImage);
      }

      if (weatherState.loading) {
        heroChildren.push(el("p", { class: "muted weather-location" }, ["Checking the onboard weather cache for the current location."]));
        heroChildren.push(el("div", { class: "empty-stream weather-empty" }, [
          el("div", {}, [
            el("strong", {}, ["Loading weather data"]),
            el("p", { class: "muted" }, ["The portal will show cached weather when the external service or internet link is unavailable."])
          ])
        ]));
        panel.appendChild(el("div", { class: "hero-card weather-card" }, heroChildren));
        return panel;
      }

      if (!weatherState.data) {
        heroChildren.push(el("p", { class: "muted weather-location" }, [safeText(weatherState.error) || "Weather data is not available right now."]));
        heroChildren.push(el("div", { class: "empty-stream weather-empty" }, [
          el("div", {}, [
            el("strong", {}, ["Weather unavailable"]),
            el("p", { class: "muted" }, ["Weather will appear after the onboard server has a vessel or itinerary position and a successful weather update."])
          ])
        ]));
        panel.appendChild(el("div", { class: "hero-card weather-card" }, heroChildren));
        return panel;
      }

      const forecast = weatherState.data.forecast;
      const current = forecast.current || {};
      const daily = forecast.daily || {};
      const todaySummary = describeWeatherCode(current.weather_code, current.is_day);
      const sourceText = safeText(weatherState.data.source, "Onboard weather cache");
      const updatedClock = formatOptionalClock(weatherState.updatedAt);
      const timezoneText = safeText(forecast.timezone).replace(/_/g, " ");
      const errorText = safeText(weatherState.error);

      heroChildren.push(el("p", { class: "muted weather-location" }, [
        formatCoordinatePairTraditional(weatherState.data.coords.latitude, weatherState.data.coords.longitude)
      ]));
      heroChildren.push(el("p", { class: "muted weather-location" }, [buildWeatherLocationDecimalText(weatherState.data)]));
      heroChildren.push(el("div", { class: "split-meta" }, [
        el("div", { class: "pill" }, [`Source: ${sourceText}`]),
        ...(updatedClock ? [el("div", { class: "pill" }, [`Updated ${updatedClock}`])] : []),
        ...(timezoneText ? [el("div", { class: "pill" }, [`Timezone: ${timezoneText}`])] : [])
      ]));
      if (errorText) {
        heroChildren.push(el("p", { class: "footer-note" }, [errorText]));
      }
      heroChildren.push(el("div", { class: "weather-hero" }, [
        el("div", { class: "weather-now" }, [formatTemperature(current.temperature_2m)]),
        el("div", {}, [
          el("strong", { class: "weather-condition" }, [todaySummary]),
          el("div", { class: "muted" }, [`Feels like ${formatTemperature(current.apparent_temperature)}`])
        ])
      ]));
      heroChildren.push(el("div", { class: "weather-stat-grid" }, [
        renderWeatherStat("Humidity", formatPercent(current.relative_humidity_2m)),
        renderWeatherStat("Wind", buildWeatherWindValue(current), buildWeatherGustDetail(current)),
        renderWeatherStat("Precipitation", formatPrecipitation(current.precipitation)),
        renderWeatherStat("Cloud Cover", formatPercent(current.cloud_cover))
      ]));
      heroChildren.push(el("p", { class: "footer-note" }, [
        `Today: ${formatTemperature(daily.temperature_2m_min ? daily.temperature_2m_min[0] : null)} to ${formatTemperature(daily.temperature_2m_max ? daily.temperature_2m_max[0] : null)} · Sunrise ${formatClock(daily.sunrise ? daily.sunrise[0] : "")} · Sunset ${formatClock(daily.sunset ? daily.sunset[0] : "")}`
      ]));

      panel.appendChild(el("div", { class: "hero-card weather-card" }, heroChildren));
      panel.appendChild(el("div", { class: "grid" }, [
        el("div", { class: "card brand-watermark span-12" }, [
          el("div", { class: "section-kicker" }, ["Next 5 Days"]),
          el("h3", {}, ["Voyage Outlook"]),
          renderWeatherForecastGrid(forecast)
        ]),
        el("div", { class: "card brand-watermark span-12" }, [
          el("div", { class: "section-kicker" }, ["Today"]),
          el("h3", {}, ["Hourly Detail"]),
          renderWeatherHourlyTable(forecast)
        ])
      ]));

      return panel;
    }

    function syncWeatherPanel() {
      const content = document.getElementById("content");
      if (!content) {
        return;
      }

      const existingPanel = document.getElementById("panel-weather");
      if (!weatherState.visible) {
        weatherPanelSignature = "";
        if (existingPanel) {
          removeNode(existingPanel);
        }
        return;
      }

      const signature = weatherState.signature || getWeatherDisplaySignature(weatherState);
      if (existingPanel && weatherPanelSignature === signature) {
        return;
      }

      const panel = renderWeatherTab();
      weatherPanelSignature = signature;
      if (existingPanel) {
        replaceNode(existingPanel, panel);
        return;
      }

      const navigationPanel = document.getElementById("panel-navigation");
      if (navigationPanel && navigationPanel.nextSibling) {
        content.insertBefore(panel, navigationPanel.nextSibling);
      } else {
        content.appendChild(panel);
      }
    }

    function syncDynamicTabsAndPanels() {
      renderTabs();
      const currentMenuPanel = document.getElementById("panel-menu");
      if (currentMenuPanel) {
        replaceNode(currentMenuPanel, renderMenuTab(charterBundleData && charterBundleData.menus));
      }
      const currentItineraryPanel = document.getElementById("panel-itinerary");
      if (currentItineraryPanel) {
        replaceNode(currentItineraryPanel, renderItineraryTab(itineraryData));
      }
      syncWeatherPanel();
      if (document.querySelectorAll(".tab-panel").length) {
        activateTab(currentTabId);
      }
      syncIdleDashboard();
    }

    function createMapTileRecoveryState(context, noticeId) {
      return {
        context,
        noticeId,
        errorTimestampsByZoom: new Map(),
        errorUrlsByZoom: new Map(),
        lastThresholdHandledAtByZoom: new Map(),
        programmaticZoomEvents: 0,
        lastAutoCorrectionAt: 0,
        lastAutoCorrectionFromZoom: NaN,
        lastAutoCorrectionToZoom: NaN,
        listenersBound: false
      };
    }

    function normalizeMapZoomLevel(value, fallback = NAVIGATION_MAP_DEFAULT_ZOOM, minZoom = NAVIGATION_MAP_MIN_ZOOM, maxZoom = NAVIGATION_MAP_MAX_ZOOM) {
      const parsed = Number(value);
      if (!Number.isFinite(parsed)) {
        return Number.isFinite(fallback)
          ? Math.max(minZoom, Math.min(maxZoom, Math.round(Number(fallback))))
          : NaN;
      }

      return Math.max(minZoom, Math.min(maxZoom, Math.round(parsed)));
    }

    function clampMapZoom(zoom, options = {}) {
      const map = options && options.map ? options.map : null;
      const minZoom = Number.isFinite(Number(options && options.minZoom))
        ? Math.max(OFFSHORE_SAFE_MIN_ZOOM, Math.round(Number(options.minZoom)))
        : Math.max(OFFSHORE_SAFE_MIN_ZOOM, getMapMinZoomLimit(map));
      const maxZoom = Number.isFinite(Number(options && options.maxZoom))
        ? Math.round(Number(options.maxZoom))
        : getMapMaxZoomLimit(map);

      return normalizeMapZoomLevel(zoom, OFFSHORE_SAFE_MIN_ZOOM, minZoom, maxZoom);
    }

    function getMapMinZoomLimit(map) {
      if (map && typeof map.getMinZoom === "function") {
        const minZoom = Number(map.getMinZoom());
        if (Number.isFinite(minZoom)) {
          return Math.max(OFFSHORE_SAFE_MIN_ZOOM, Math.round(minZoom));
        }
      }

      return OFFSHORE_SAFE_MIN_ZOOM;
    }

    function getMapMaxZoomLimit(map) {
      if (map && typeof map.getMaxZoom === "function") {
        const maxZoom = Number(map.getMaxZoom());
        if (Number.isFinite(maxZoom)) {
          return Math.round(maxZoom);
        }
      }

      return NAVIGATION_MAP_MAX_ZOOM;
    }

    function isMapZoomUnavailable(zoom) {
      const parsed = Number(zoom);
      if (!Number.isFinite(parsed)) {
        return false;
      }

      return unavailableMapZooms.has(Math.round(parsed));
    }

    function markMapZoomUnavailable(zoom) {
      const normalizedZoom = normalizeMapZoomLevel(zoom, NaN);
      if (!Number.isFinite(normalizedZoom)) {
        return false;
      }

      const sizeBefore = unavailableMapZooms.size;
      unavailableMapZooms.add(normalizedZoom);
      effectiveUnavailableMapMinZoom = Math.max(effectiveUnavailableMapMinZoom, normalizedZoom + 1);
      return unavailableMapZooms.size !== sizeBefore;
    }

    function getEffectiveAutomaticMapMinZoom(map) {
      const minZoom = getMapMinZoomLimit(map);
      const maxZoom = getMapMaxZoomLimit(map);
      return Math.max(minZoom, Math.min(maxZoom + 1, effectiveUnavailableMapMinZoom));
    }

    function resolveAutomaticMapZoom(targetZoom, options = {}) {
      const map = options && options.map ? options.map : null;
      const minZoom = Number.isFinite(Number(options && options.minZoom))
        ? Math.max(OFFSHORE_SAFE_MIN_ZOOM, Math.round(Number(options.minZoom)))
        : getMapMinZoomLimit(map);
      const maxZoom = Number.isFinite(Number(options && options.maxZoom))
        ? Math.round(Number(options.maxZoom))
        : getMapMaxZoomLimit(map);
      const requestedZoom = normalizeMapZoomLevel(targetZoom, NAVIGATION_MAP_DEFAULT_ZOOM, minZoom, maxZoom);
      const startingZoom = Math.max(requestedZoom, getEffectiveAutomaticMapMinZoom(map));

      for (let zoom = startingZoom; zoom <= maxZoom; zoom += 1) {
        if (!unavailableMapZooms.has(zoom)) {
          return zoom;
        }
      }

      return null;
    }

    function getAutomaticMapZoomChoice(targetZoom, options = {}) {
      const map = options && options.map ? options.map : null;
      const minZoom = Number.isFinite(Number(options && options.minZoom))
        ? Math.max(OFFSHORE_SAFE_MIN_ZOOM, Math.round(Number(options.minZoom)))
        : getMapMinZoomLimit(map);
      const maxZoom = Number.isFinite(Number(options && options.maxZoom))
        ? Math.round(Number(options.maxZoom))
        : getMapMaxZoomLimit(map);
      const requestedZoom = normalizeMapZoomLevel(targetZoom, NAVIGATION_MAP_DEFAULT_ZOOM, minZoom, maxZoom);
      const resolvedZoom = resolveAutomaticMapZoom(requestedZoom, { map, minZoom, maxZoom });

      return {
        requestedZoom,
        zoom: Number.isFinite(resolvedZoom) ? resolvedZoom : requestedZoom,
        available: Number.isFinite(resolvedZoom)
      };
    }

    function getMapAvailabilityNoticeNode(mapState) {
      const recovery = mapState && mapState.tileRecovery;
      return recovery && recovery.noticeId ? document.getElementById(recovery.noticeId) : null;
    }

    function setMapAvailabilityNotice(mapState, message = "") {
      const noticeNode = getMapAvailabilityNoticeNode(mapState);
      if (!noticeNode) {
        return;
      }

      const text = typeof message === "string" ? message.trim() : "";
      noticeNode.hidden = !text;
      noticeNode.textContent = text;
    }

    function syncMapAvailabilityNotice(mapState) {
      if (!mapState || !mapState.map) {
        setMapAvailabilityNotice(mapState, "");
        return;
      }

      setMapAvailabilityNotice(
        mapState,
        isMapZoomUnavailable(mapState.map.getZoom()) ? MAP_TILE_UNAVAILABLE_MESSAGE : ""
      );
    }

    function noteProgrammaticMapZoom(mapState, targetZoom) {
      if (!mapState || !mapState.map || !mapState.tileRecovery) {
        return;
      }

      const map = mapState.map;
      const normalizedTargetZoom = clampMapZoom(
        targetZoom,
        { map }
      );
      if (!Number.isFinite(normalizedTargetZoom) || map.getZoom() === normalizedTargetZoom) {
        return;
      }

      mapState.tileRecovery.programmaticZoomEvents += 1;
    }

    function setMapViewWithRecovery(mapState, center, zoom, options = {}) {
      if (!mapState || !mapState.map) {
        return;
      }

      const clampedZoom = clampMapZoom(zoom, { map: mapState.map });
      noteProgrammaticMapZoom(mapState, clampedZoom);
      mapState.map.setView(center, clampedZoom, options);
    }

    function setMapZoomWithRecovery(mapState, zoom, options = {}) {
      if (!mapState || !mapState.map) {
        return;
      }

      const clampedZoom = clampMapZoom(zoom, { map: mapState.map });
      noteProgrammaticMapZoom(mapState, clampedZoom);
      mapState.map.setZoom(clampedZoom, options);
    }

    function getTileErrorEventZoom(event, map) {
      const eventZoom = Number(event && event.coords && event.coords.z);
      if (Number.isFinite(eventZoom)) {
        return Math.round(eventZoom);
      }

      return map
        ? normalizeMapZoomLevel(map.getZoom(), NaN, getMapMinZoomLimit(map), getMapMaxZoomLimit(map))
        : NaN;
    }

    function getTileErrorEventUrl(event) {
      if (event && event.tile && typeof event.tile.src === "string") {
        return event.tile.src;
      }

      if (event && typeof event.url === "string") {
        return event.url;
      }

      return "";
    }

    function maybeRecoverFromTileErrors(mapState, failedZoom, now) {
      if (!mapState || !mapState.map || !mapState.tileRecovery) {
        return;
      }

      const nextZoom = resolveAutomaticMapZoom(failedZoom + 1, { map: mapState.map });
      if (!Number.isFinite(nextZoom)) {
        setMapAvailabilityNotice(mapState, MAP_TILE_UNAVAILABLE_MESSAGE);
        return;
      }

      if (now - mapState.tileRecovery.lastAutoCorrectionAt < MAP_ZOOM_CORRECTION_COOLDOWN_MS) {
        setMapAvailabilityNotice(mapState, MAP_TILE_UNAVAILABLE_MESSAGE);
        return;
      }

      mapState.tileRecovery.lastAutoCorrectionAt = now;
      mapState.tileRecovery.lastAutoCorrectionFromZoom = failedZoom;
      mapState.tileRecovery.lastAutoCorrectionToZoom = nextZoom;
      setMapZoomWithRecovery(mapState, nextZoom, { animate: false });
    }

    function handleMapTileError(mapState, event) {
      if (!mapState || !mapState.map || !mapState.tileRecovery) {
        return;
      }

      const map = mapState.map;
      const recovery = mapState.tileRecovery;
      const currentZoom = normalizeMapZoomLevel(
        map.getZoom(),
        NAVIGATION_MAP_DEFAULT_ZOOM,
        getMapMinZoomLimit(map),
        getMapMaxZoomLimit(map)
      );
      const eventZoom = getTileErrorEventZoom(event, map);
      if (!Number.isFinite(currentZoom) || !Number.isFinite(eventZoom) || eventZoom !== currentZoom) {
        return;
      }

      const now = Date.now();
      const tileUrl = getTileErrorEventUrl(event);
      const timestamps = (recovery.errorTimestampsByZoom.get(currentZoom) || [])
        .filter(timestamp => now - timestamp <= MAP_TILE_ERROR_WINDOW_MS);
      timestamps.push(now);
      recovery.errorTimestampsByZoom.set(currentZoom, timestamps);

      if (tileUrl) {
        const urls = (recovery.errorUrlsByZoom.get(currentZoom) || []).slice(-3);
        urls.push(tileUrl);
        recovery.errorUrlsByZoom.set(currentZoom, urls);
      }

      if (timestamps.length < MAP_TILE_ERROR_THRESHOLD) {
        if (isMapZoomUnavailable(currentZoom)) {
          setMapAvailabilityNotice(mapState, MAP_TILE_UNAVAILABLE_MESSAGE);
        }
        return;
      }

      const lastHandledAt = recovery.lastThresholdHandledAtByZoom.get(currentZoom) || 0;
      if (now - lastHandledAt < MAP_ZOOM_CORRECTION_COOLDOWN_MS) {
        setMapAvailabilityNotice(mapState, MAP_TILE_UNAVAILABLE_MESSAGE);
        return;
      }

      recovery.lastThresholdHandledAtByZoom.set(currentZoom, now);
      markMapZoomUnavailable(currentZoom);
      console.warn("[map] tile errors at zoom", currentZoom, {
        map: recovery.context,
        failedTiles: timestamps.length,
        timestamp: new Date(now).toISOString(),
        tileUrl: tileUrl || "",
        recentTileUrls: recovery.errorUrlsByZoom.get(currentZoom) || []
      });
      maybeRecoverFromTileErrors(mapState, currentZoom, now);
    }

    function bindMapTileRecovery(mapState, tileLayer) {
      if (!mapState || !mapState.map || !mapState.tileRecovery || !tileLayer || mapState.tileRecovery.listenersBound) {
        return;
      }

      const map = mapState.map;
      const recovery = mapState.tileRecovery;
      recovery.listenersBound = true;

      tileLayer.on("tileerror", event => {
        handleMapTileError(mapState, event);
      });
      tileLayer.on("tileload", () => {
        if (!isMapZoomUnavailable(map.getZoom())) {
          setMapAvailabilityNotice(mapState, "");
        }
      });
      map.on("zoomend", () => {
        if (map.getZoom() < OFFSHORE_SAFE_MIN_ZOOM) {
          setMapZoomWithRecovery(mapState, OFFSHORE_SAFE_MIN_ZOOM, { animate: false });
          return;
        }
        if (recovery.programmaticZoomEvents > 0) {
          recovery.programmaticZoomEvents -= 1;
        }
        syncMapAvailabilityNotice(mapState);
      });
    }

    function createSatelliteTileLayer(attribution = "Tiles &copy; Esri") {
      return window.L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
        attribution,
        minZoom: NAVIGATION_MAP_MIN_ZOOM,
        maxZoom: NAVIGATION_MAP_MAX_ZOOM
      });
    }

    function normalizeIdleZoomLevel(value) {
      return normalizeMapZoomLevel(value, NaN, NAVIGATION_MAP_MIN_ZOOM, NAVIGATION_MAP_MAX_ZOOM);
    }

    function normalizeIdleZoomConfig(value) {
      if (value && typeof value === "object" && !Array.isArray(value)) {
        const mapZoom = normalizeIdleZoomLevel(
          value.map_zoom !== undefined ? value.map_zoom : value.zoom
        );
        if (!Number.isFinite(mapZoom)) {
          return null;
        }

        const centerOnVessel = value.center_on_vessel !== undefined
          ? !!value.center_on_vessel
          : true;

        return {
          map_zoom: mapZoom,
          center_on_vessel: centerOnVessel,
          latitude: parseCoordinateValue(value.latitude),
          longitude: parseCoordinateValue(value.longitude)
        };
      }

      const mapZoom = normalizeIdleZoomLevel(value);
      if (!Number.isFinite(mapZoom)) {
        return null;
      }

      return {
        map_zoom: mapZoom,
        center_on_vessel: true,
        latitude: NaN,
        longitude: NaN
      };
    }

    function normalizeObsRatioValue(value) {
      if (Array.isArray(value) && value.length >= 2) {
        const width = Number(value[0]);
        const height = Number(value[1]);
        if (Number.isFinite(width) && Number.isFinite(height) && width > 0 && height > 0) {
          const normalizedWidth = Number.isInteger(width) ? String(width) : String(Number(width.toFixed(4)));
          const normalizedHeight = Number.isInteger(height) ? String(height) : String(Number(height.toFixed(4)));
          return {
            raw: `${normalizedWidth}:${normalizedHeight}`,
            css: `${width} / ${height}`,
            number: width / height
          };
        }
      }

      const text = String(value === undefined || value === null ? "" : value).trim();
      if (!text) {
        return { ...IDLE_OBS_RATIO_DEFAULT };
      }

      const pairMatch = text.match(/^(\d+(?:\.\d+)?)\s*[:/x]\s*(\d+(?:\.\d+)?)$/i);
      if (pairMatch) {
        const width = Number(pairMatch[1]);
        const height = Number(pairMatch[2]);
        if (Number.isFinite(width) && Number.isFinite(height) && width > 0 && height > 0) {
          const normalizedWidth = Number.isInteger(width) ? String(width) : String(Number(width.toFixed(4)));
          const normalizedHeight = Number.isInteger(height) ? String(height) : String(Number(height.toFixed(4)));
          return {
            raw: `${normalizedWidth}:${normalizedHeight}`,
            css: `${width} / ${height}`,
            number: width / height
          };
        }
      }

      const numeric = Number(text);
      if (Number.isFinite(numeric) && numeric > 0) {
        return {
          raw: text,
          css: String(numeric),
          number: numeric
        };
      }

      return { ...IDLE_OBS_RATIO_DEFAULT };
    }

    function isObsFeedEnabled(settings) {
      const source = settings && typeof settings === "object" ? settings : {};
      const rawObsFeedEnabled = source.obsFeedEnabled !== undefined ? source.obsFeedEnabled : source.obs_feed_enabled;
      return rawObsFeedEnabled !== false;
    }

    function getActiveIdleZoomLevel(settings = getIdleScreensaverSettings()) {
      const levels = settings && Array.isArray(settings.zoom_levels) && settings.zoom_levels.length
        ? settings.zoom_levels
        : IDLE_SCREENSAVER_DEFAULTS.zoom_levels;
      return levels[Math.min(idleState.zoomIndex, levels.length - 1)] || levels[0];
    }

    function getIdleMapCenterCoordinates(zoomLevel, vesselCoordinates = getNavigationMapCoordinates()) {
      if (!zoomLevel || zoomLevel.center_on_vessel) {
        return vesselCoordinates;
      }

      if (Number.isFinite(zoomLevel.latitude) && Number.isFinite(zoomLevel.longitude)) {
        return {
          latitude: zoomLevel.latitude,
          longitude: zoomLevel.longitude,
          label: "Configured idle focus",
          source: "Idle zoom level"
        };
      }

      return vesselCoordinates;
    }

    function getIdleScreensaverSettings() {
      const displaySettings = siteData && typeof siteData === "object"
        ? (siteData.display_settings || siteData.displaySettings || {})
        : {};
      const raw = siteData && siteData.idle_screensaver && typeof siteData.idle_screensaver === "object"
        ? siteData.idle_screensaver
        : (siteData && siteData.idleScreensaver && typeof siteData.idleScreensaver === "object"
          ? siteData.idleScreensaver
          : (siteData && siteData.idleScreenSettings && typeof siteData.idleScreenSettings === "object"
            ? siteData.idleScreenSettings
            : (displaySettings && typeof displaySettings === "object"
              ? (displaySettings.idle_screensaver || displaySettings.idleScreen || displaySettings.idle_screen || displaySettings)
              : {})));
      const timeoutSeconds = Number(raw.timeout_seconds);
      const zoomCycleSeconds = Number(raw.zoom_cycle_seconds);
      const obsFeedIntervalSeconds = Number(raw.obs_feed_interval_seconds);
      const obsFeedDurationSeconds = Number(raw.obs_feed_duration_seconds);
      const obsFeedTransitionSeconds = Number(raw.obs_feed_transition_seconds);
      const obsRatio = normalizeObsRatioValue(raw.obs_ratio !== undefined ? raw.obs_ratio : raw.OBS_Ratio);
      const rawZoomLevels = Array.isArray(raw.zoom_levels)
        ? raw.zoom_levels
        : (Array.isArray(raw.map_zoom) ? raw.map_zoom : [raw.zoom_levels, raw.map_zoom]);
      const zoomLevels = rawZoomLevels
        .map(normalizeIdleZoomConfig)
        .filter(Boolean);
      const telemetryItems = normalizeTelemetryItems(raw.telemetry_items, IDLE_SCREENSAVER_DEFAULTS.telemetry_items);

      return {
        enabled: raw.enabled === undefined ? IDLE_SCREENSAVER_DEFAULTS.enabled : !!raw.enabled,
        timeout_seconds: Number.isFinite(timeoutSeconds) && timeoutSeconds >= 15
          ? Math.round(timeoutSeconds)
          : IDLE_SCREENSAVER_DEFAULTS.timeout_seconds,
        zoom_levels: zoomLevels.length
          ? zoomLevels
          : IDLE_SCREENSAVER_DEFAULTS.zoom_levels.slice(),
        zoom_cycle_seconds: Number.isFinite(zoomCycleSeconds) && zoomCycleSeconds >= 5
          ? Math.round(zoomCycleSeconds)
          : IDLE_SCREENSAVER_DEFAULTS.zoom_cycle_seconds,
        obsFeedEnabled: isObsFeedEnabled(raw),
        obs_feed_interval_seconds: Number.isFinite(obsFeedIntervalSeconds) && obsFeedIntervalSeconds >= 0
          ? Math.round(obsFeedIntervalSeconds)
          : IDLE_SCREENSAVER_DEFAULTS.obs_feed_interval_seconds,
        obs_feed_duration_seconds: Number.isFinite(obsFeedDurationSeconds) && obsFeedDurationSeconds >= 0
          ? Math.round(obsFeedDurationSeconds)
          : IDLE_SCREENSAVER_DEFAULTS.obs_feed_duration_seconds,
        obs_feed_transition_seconds: Number.isFinite(obsFeedTransitionSeconds) && obsFeedTransitionSeconds >= 0
          ? obsFeedTransitionSeconds
          : IDLE_SCREENSAVER_DEFAULTS.obs_feed_transition_seconds,
        obs_ratio: obsRatio.raw,
        obs_ratio_css: obsRatio.css,
        obs_ratio_number: obsRatio.number,
        show_weather: raw.show_weather === undefined ? IDLE_SCREENSAVER_DEFAULTS.show_weather : !!raw.show_weather,
        show_itinerary: raw.show_itinerary === undefined ? IDLE_SCREENSAVER_DEFAULTS.show_itinerary : !!raw.show_itinerary,
        show_telemetry: raw.show_telemetry === undefined ? IDLE_SCREENSAVER_DEFAULTS.show_telemetry : !!raw.show_telemetry,
        telemetry_items: telemetryItems
      };
    }

    function supportsIdleObsFeedLayout() {
      try {
        return !window.CSS
          || typeof window.CSS.supports !== "function"
          || window.CSS.supports("aspect-ratio: 16 / 9");
      } catch (error) {
        return true;
      }
    }

    function canShowIdleObsFeed() {
      const settings = getIdleScreensaverSettings();
      if (!isObsFeedEnabled(settings)) {
        return false;
      }

      if (!supportsIdleObsFeedLayout()) {
        return false;
      }

      const data = navigationData || {};
      const hlsUrl = resolveNavigationHlsUrl(data);
      if (hlsUrl) {
        const probe = document.createElement("video");
        return !!(
          probe.canPlayType("application/vnd.apple.mpegurl")
          || (window.Hls && typeof window.Hls.isSupported === "function" && window.Hls.isSupported())
        );
      }

      const legacyStreamUrl = (data.stream_url || "").trim();
      return isBrowserEmbeddableUrl(legacyStreamUrl);
    }

    function clearIdleObsFeedTimers() {
      if (idleObsFeedTimer) {
        window.clearTimeout(idleObsFeedTimer);
        idleObsFeedTimer = null;
      }

      if (idleObsFeedDurationTimer) {
        window.clearTimeout(idleObsFeedDurationTimer);
        idleObsFeedDurationTimer = null;
      }

      if (idleObsFeedReadyTimer) {
        window.clearTimeout(idleObsFeedReadyTimer);
        idleObsFeedReadyTimer = null;
      }
    }

    function clearIdleTransitionTimers() {
      if (idleTransitionTimer) {
        window.clearTimeout(idleTransitionTimer);
        idleTransitionTimer = null;
      }

      if (idleTransitionMidpointTimer) {
        window.clearTimeout(idleTransitionMidpointTimer);
        idleTransitionMidpointTimer = null;
      }
    }

    function finishIdlePhaseTransition() {
      clearIdleTransitionTimers();
      idleState.transitioning = false;

      const overlay = document.getElementById("idleTransition");
      if (overlay) {
        overlay.classList.remove("active");
        overlay.setAttribute("aria-hidden", "true");
      }
    }

    function runIdlePhaseTransition(onSwap, onComplete) {
      const settings = getIdleScreensaverSettings();
      const durationMs = Math.max(0, Math.round(settings.obs_feed_transition_seconds * 1000));
      const overlay = document.getElementById("idleTransition");

      if (!overlay || durationMs <= 0) {
        if (typeof onSwap === "function") {
          onSwap();
        }
        if (typeof onComplete === "function") {
          onComplete();
        }
        return;
      }

      clearIdleTransitionTimers();
      idleState.transitioning = true;
      overlay.style.setProperty("--idle-obs-transition-ms", `${durationMs}ms`);
      overlay.classList.remove("active");
      overlay.setAttribute("aria-hidden", "false");
      void overlay.offsetWidth;
      overlay.classList.add("active");

      idleTransitionMidpointTimer = window.setTimeout(() => {
        if (typeof onSwap === "function") {
          onSwap();
        }
      }, Math.round(durationMs / 2));

      idleTransitionTimer = window.setTimeout(() => {
        finishIdlePhaseTransition();
        if (typeof onComplete === "function") {
          onComplete();
        }
      }, durationMs);
    }

    function destroyEmbeddedMedia(root) {
      if (!root) {
        return;
      }

      const cleanupShell = shell => {
        if (shell && typeof shell._navigationFeedCleanup === "function") {
          shell._navigationFeedCleanup();
        }
      };
      cleanupShell(root);
      root.querySelectorAll(".navigation-feed-shell").forEach(cleanupShell);

      root.querySelectorAll("video").forEach(video => {
        cleanupNavigationVideo(video);
      });

      root.querySelectorAll("iframe").forEach(frame => {
        if (frame.src && frame.src !== "about:blank") {
          logObsFeed("info", "OBS player destroyed.");
        }
        frame.src = "about:blank";
      });

      replaceNodeChildren(root);
    }

    function ensureIdleObsFeedRendered(options = {}) {
      const body = document.getElementById("idleObsFeedBody");
      if (!body) {
        return null;
      }

      if (!isObsFeedEnabled(getIdleScreensaverSettings())) {
        destroyEmbeddedMedia(body);
        return null;
      }

      if (body.childNodes.length && !options.forceReload) {
        return body.firstElementChild;
      }

      destroyEmbeddedMedia(body);
      const card = el("div", { class: "idle-obs-feed__card" });
      const media = el("div", { class: "idle-obs-feed__media" });
      const feed = buildNavigationMedia(navigationData || {}, {
        ...options,
        context: "idle",
        managedRetry: false
      });
      if (!feed) {
        return null;
      }
      media.appendChild(feed);
      card.appendChild(media);
      body.appendChild(card);
      return card;
    }

    function deactivateIdleObsFeed() {
      const dashboard = document.getElementById("idleDashboard");
      const feed = document.getElementById("idleObsFeed");
      const body = document.getElementById("idleObsFeedBody");

      idleState.showingObsFeed = false;
      idleState.obsFeedReady = false;

      if (dashboard) {
        dashboard.classList.remove("obs-feed-active");
      }
      if (feed) {
        feed.setAttribute("aria-hidden", "true");
      }
      if (body) {
        destroyEmbeddedMedia(body);
      }
    }

    function hideIdleObsFeed(options = {}) {
      const { resumeCycle = false, useTransition = false } = options;

      clearIdleObsFeedTimers();
      if (useTransition && idleState.active && idleState.showingObsFeed && !idleState.transitioning) {
        clearIdleZoomTimer();
        runIdlePhaseTransition(() => {
          deactivateIdleObsFeed();
        }, () => {
          if (resumeCycle && idleState.active) {
            scheduleIdleZoomCycle();
            scheduleIdleObsFeedCycle();
          }
        });
        return;
      }

      finishIdlePhaseTransition();
      deactivateIdleObsFeed();

      if (resumeCycle && idleState.active) {
        scheduleIdleZoomCycle();
        scheduleIdleObsFeedCycle();
      }
    }

    function showIdleObsFeed() {
      if (!isTabletOrLarger()) {
        return;
      }

      if (!idleState.active || idleState.showingObsFeed || idleState.transitioning) {
        return;
      }

      const settings = getIdleScreensaverSettings();
      clearIdleObsFeedTimers();

      if (!isObsFeedEnabled(settings)) {
        logIdleObsDecision("Idle OBS skipped.", "disabled");
        return;
      }

      if (settings.obs_feed_duration_seconds <= 0) {
        logIdleObsDecision("Idle OBS skipped.", "duration disabled");
        return;
      }

      if (!canShowIdleObsFeed()) {
        logIdleObsDecision("Idle OBS skipped.", "no playable feed");
        return;
      }

      const feed = document.getElementById("idleObsFeed");
      const dashboard = document.getElementById("idleDashboard");
      if (!feed || !dashboard) {
        return;
      }

      let failedBeforeReady = false;
      const failIdleObsFeed = reason => {
        if (!idleState.active || failedBeforeReady) {
          return;
        }
        failedBeforeReady = true;
        logIdleObsDecision("Idle OBS skipped.", reason || "player unavailable");
        hideIdleObsFeed({ resumeCycle: true, useTransition: false });
      };

      clearIdleZoomTimer();
      runIdlePhaseTransition(() => {
        if (!idleState.active) {
          return;
        }

        const rendered = ensureIdleObsFeedRendered({
          forceReload: true,
          onReady: () => {
            if (!idleState.active || !idleState.showingObsFeed || failedBeforeReady) {
              return;
            }
            idleState.obsFeedReady = true;
            if (idleObsFeedReadyTimer) {
              window.clearTimeout(idleObsFeedReadyTimer);
              idleObsFeedReadyTimer = null;
            }
            idleObsFeedDurationTimer = window.setTimeout(() => {
              hideIdleObsFeed({ resumeCycle: true, useTransition: true });
            }, settings.obs_feed_duration_seconds * 1000);
          },
          onFailure: reason => failIdleObsFeed(reason)
        });
        if (!rendered) {
          failIdleObsFeed("render failed");
          return;
        }
        idleObsFeedReadyTimer = window.setTimeout(() => {
          failIdleObsFeed("player did not become ready");
        }, OBS_IDLE_READY_TIMEOUT_MS);
        dashboard.classList.add("obs-feed-active");
        feed.setAttribute("aria-hidden", "false");
        idleState.showingObsFeed = true;
        idleState.obsFeedReady = false;
        logIdleObsDecision("Idle OBS entering.", "player mounted");
      }, () => {
        if (!idleState.active || !idleState.showingObsFeed || failedBeforeReady) {
          return;
        }
      });
    }

    function scheduleIdleObsFeedCycle() {
      clearIdleObsFeedTimers();

      if (!isTabletOrLarger()) {
        return;
      }

      if (!idleState.active || idleState.showingObsFeed || idleState.transitioning) {
        return;
      }

      const settings = getIdleScreensaverSettings();
      if (!isObsFeedEnabled(settings)) {
        logIdleObsDecision("Idle OBS skipped.", "disabled");
        return;
      }

      if (settings.obs_feed_interval_seconds <= 0) {
        logIdleObsDecision("Idle OBS skipped.", "interval disabled");
        return;
      }

      if (!canShowIdleObsFeed()) {
        logIdleObsDecision("Idle OBS skipped.", "no playable feed");
        return;
      }

      idleObsFeedTimer = window.setTimeout(() => {
        idleObsFeedTimer = null;
        showIdleObsFeed();
      }, settings.obs_feed_interval_seconds * 1000);
    }

    function resumeIdleVisualCycle() {
      if (!isTabletOrLarger()) {
        return;
      }

      if (!idleState.active) {
        return;
      }

      if (idleState.transitioning) {
        return;
      }

      if (idleState.showingObsFeed) {
        const settings = getIdleScreensaverSettings();
        if (!idleState.obsFeedReady) {
          return;
        }
        clearIdleObsFeedTimers();

        if (!isObsFeedEnabled(settings) || settings.obs_feed_duration_seconds <= 0) {
          hideIdleObsFeed({ resumeCycle: true });
          return;
        }

        idleObsFeedDurationTimer = window.setTimeout(() => {
          hideIdleObsFeed({ resumeCycle: true });
        }, settings.obs_feed_duration_seconds * 1000);
        return;
      }

      scheduleIdleZoomCycle();
      scheduleIdleObsFeedCycle();
    }

    function clearIdleZoomTimer() {
      if (idleZoomTimer) {
        window.clearTimeout(idleZoomTimer);
        idleZoomTimer = null;
      }
    }

    function scheduleIdleZoomCycle() {
      clearIdleZoomTimer();

      if (!isTabletOrLarger()) {
        return;
      }

      if (!idleState.active || idleState.showingObsFeed || idleState.transitioning) {
        return;
      }

      const settings = getIdleScreensaverSettings();
      if (!settings.zoom_levels || settings.zoom_levels.length < 2) {
        return;
      }

      idleZoomTimer = window.setTimeout(() => {
        idleZoomTimer = null;
        if (!idleState.active || idleState.showingObsFeed || idleState.transitioning) {
          scheduleIdleZoomCycle();
          return;
        }
        idleState.zoomIndex = (idleState.zoomIndex + 1) % settings.zoom_levels.length;
        syncIdleMap(true);
        scheduleIdleZoomCycle();
      }, settings.zoom_cycle_seconds * 1000);
    }

    function syncIdleSettings() {
      const settings = getIdleScreensaverSettings();
      const idleObsFeedBody = document.getElementById("idleObsFeedBody");
      idleState.enabled = settings.enabled;
      idleState.timeoutMs = settings.timeout_seconds * 1000;
      const obsEnabled = isObsFeedEnabled(settings);

      if (obsFeedState.lastLoadedEnabled !== obsEnabled) {
        logObsFeed("info", `OBS enabled setting loaded: ${obsEnabled ? "enabled" : "disabled"}.`);
        obsFeedState.lastLoadedEnabled = obsEnabled;
      }

      if (!isTabletOrLarger()) {
        exitIdleForMobile();
        return settings;
      }

      if (idleObsFeedBody) {
        idleObsFeedBody.style.setProperty("--idle-obs-aspect-ratio", settings.obs_ratio_css);
        idleObsFeedBody.style.setProperty("--idle-obs-aspect-ratio-number", String(settings.obs_ratio_number));
      }

      if (!obsEnabled) {
        clearIdleObsFeedTimers();
        finishIdlePhaseTransition();
        deactivateIdleObsFeed();
      }

      if (!settings.enabled) {
        clearIdleTimer();
        clearIdleZoomTimer();
        clearIdleObsFeedTimers();
        finishIdlePhaseTransition();
        hideIdleObsFeed();
        exitIdleMode({ resetTimer: false });
      }

      return settings;
    }

    function clearIdleTimer() {
      if (idleState.timerId) {
        window.clearTimeout(idleState.timerId);
        idleState.timerId = 0;
      }
    }

    function scheduleIdleTimer() {
      clearIdleTimer();

      if (!isTabletOrLarger() || !idleState.enabled || idleState.active || document.hidden) {
        return;
      }

      idleState.timerId = window.setTimeout(() => {
        enterIdleMode();
      }, idleState.timeoutMs);
    }

    function resetIdleTimer() {
      if (!idleState.initialized) {
        return;
      }

      if (!isTabletOrLarger()) {
        clearIdleTimer();
        return;
      }

      if (!idleState.enabled) {
        clearIdleTimer();
        return;
      }

      scheduleIdleTimer();
    }

    function enterIdleMode() {
      if (!isTabletOrLarger()) {
        exitIdleForMobile();
        redirectToGuestLanding();
        return;
      }

      if (!idleState.enabled || idleState.active) {
        return;
      }

      const dashboard = document.getElementById("idleDashboard");
      if (!dashboard) {
        return;
      }

      idleState.active = true;
      idleState.zoomIndex = 0;
      idleState.showingObsFeed = false;
      idleState.obsFeedReady = false;
      idleState.transitioning = false;
      clearIdleTimer();
      clearIdleObsFeedTimers();
      finishIdlePhaseTransition();
      dashboard.classList.add("active");
      dashboard.setAttribute("aria-hidden", "false");
      document.body.classList.add("idle-active");
      syncSiteFooterVisibility();
      syncIdleDashboard();
      resumeIdleVisualCycle();

      window.requestAnimationFrame(() => {
        invalidateIdleMapSize();
        syncIdleMap(true);
      });
      window.setTimeout(() => {
        invalidateIdleMapSize();
        syncIdleMap(true);
      }, 120);
    }

    function exitIdleMode(options = {}) {
      const { resetTimer = true } = options;
      const dashboard = document.getElementById("idleDashboard");

      clearIdleObsFeedTimers();
      clearIdleZoomTimer();
      finishIdlePhaseTransition();
      hideIdleObsFeed();

      if (dashboard) {
        dashboard.classList.remove("active");
        dashboard.setAttribute("aria-hidden", "true");
      }
      document.body.classList.remove("idle-active");
      syncSiteFooterVisibility();

      if (!idleState.active) {
        if (resetTimer) {
          scheduleIdleTimer();
        }
        return;
      }

      idleState.active = false;
      idleState.showingObsFeed = false;
      idleState.obsFeedReady = false;

      if (currentTabId === "navigation") {
        window.requestAnimationFrame(() => {
          invalidateNavigationMapSize();
          window.setTimeout(() => invalidateNavigationMapSize(), 120);
        });
      }

      if (resetTimer) {
        scheduleIdleTimer();
      }
    }

    function exitIdleForMobile() {
      clearIdleTimer();
      clearIdleClockTimer();
      clearIdleZoomTimer();
      clearIdleObsFeedTimers();
      finishIdlePhaseTransition();
      deactivateIdleObsFeed();
      exitIdleMode({ resetTimer: false });
    }

    function handleIdleViewportChange() {
      if (!isTabletOrLarger()) {
        const dashboard = document.getElementById("idleDashboard");
        const wasIdleActive = idleState.active
          || document.body.classList.contains("idle-active")
          || !!(dashboard && dashboard.classList.contains("active"));
        exitIdleForMobile();
        if (wasIdleActive) {
          redirectToGuestLanding();
        }
        return;
      }

      updateIdleClock();
      ensureIdleClockTimer();

      if (idleState.initialized && !idleState.active && idleState.enabled && !idleState.timerId) {
        scheduleIdleTimer();
      }

      if (!idleMapState.map) {
        return;
      }

      invalidateIdleMapSize();
      if (idleState.active) {
        syncIdleMap(true);
      }
    }

    function handleIdleActivity(event) {
      if (!idleState.initialized) {
        return;
      }

      if (!isTabletOrLarger()) {
        if (idleState.active || document.body.classList.contains("idle-active")) {
          exitIdleForMobile();
          redirectToGuestLanding();
          return;
        }
        clearIdleTimer();
        return;
      }

      const type = event && event.type ? event.type : "";

      if (type === "visibilitychange") {
        if (document.hidden) {
          clearIdleTimer();
          clearIdleZoomTimer();
          clearIdleObsFeedTimers();
          finishIdlePhaseTransition();
          return;
        }

        syncIdleDashboard();
        if (idleState.active) {
          window.requestAnimationFrame(() => {
            invalidateIdleMapSize();
            syncIdleMap(true);
          });
          resumeIdleVisualCycle();
          return;
        }

        resetIdleTimer();
        return;
      }

      if (!idleState.enabled && !idleState.active) {
        return;
      }

      if (type === "mousemove") {
        const now = Date.now();
        if ((now - idleState.lastMousemoveAt) < IDLE_MOUSEMOVE_RESET_THROTTLE_MS) {
          return;
        }
        idleState.lastMousemoveAt = now;
      }

      if (idleState.active) {
        exitIdleMode({ resetTimer: false });
      }

      resetIdleTimer();
    }

    function initializeIdleScreensaver() {
      syncIdleSettings();
      if (isTabletOrLarger()) {
        updateIdleClock();
        ensureIdleClockTimer();
        syncIdleDashboard();
      } else {
        exitIdleForMobile();
      }

      if (idleState.initialized) {
        resetIdleTimer();
        return;
      }

      idleState.initialized = true;

      const passiveCapture = { capture: true, passive: true };
      document.addEventListener("touchstart", handleIdleActivity, passiveCapture);
      document.addEventListener("pointerdown", handleIdleActivity, passiveCapture);
      document.addEventListener("mousemove", handleIdleActivity, passiveCapture);
      document.addEventListener("wheel", handleIdleActivity, passiveCapture);
      document.addEventListener("scroll", handleIdleActivity, passiveCapture);
      window.addEventListener("scroll", handleIdleActivity, passiveCapture);
      document.addEventListener("keydown", handleIdleActivity, true);
      document.addEventListener("visibilitychange", handleIdleActivity, true);
      window.addEventListener("resize", handleIdleViewportChange);
      window.addEventListener("orientationchange", handleIdleViewportChange);

      resetIdleTimer();
    }

    function updateIdleClock() {
      const clock = document.getElementById("idleDashboardClock");
      if (!clock) {
        return;
      }

      clock.textContent = new Intl.DateTimeFormat(undefined, {
        weekday: "long",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit"
      }).format(new Date());
    }

    function clearIdleClockTimer() {
      if (idleClockTimer) {
        window.clearInterval(idleClockTimer);
        idleClockTimer = null;
      }
    }

    function ensureIdleClockTimer() {
      if (idleClockTimer) {
        return;
      }

      idleClockTimer = window.setInterval(updateIdleClock, IDLE_CLOCK_REFRESH_MS);
    }

    function summarizeText(value, maxLength = 150) {
      const text = getItineraryTextValue(value);
      if (!text || text.length <= maxLength) {
        return text;
      }

      const clipped = text.slice(0, maxLength + 1);
      const breakpoint = clipped.lastIndexOf(" ");
      return `${(breakpoint > (maxLength * 0.55) ? clipped.slice(0, breakpoint) : clipped.slice(0, maxLength)).trim()}...`;
    }

    function renderIdleMetricCard(label, value, detail) {
      const card = renderMetricCard(label, value, detail);
      card.classList.add("idle-metric-card");
      return card;
    }

    function renderIdleDataCard(label, value, detail) {
      const cleanDetail = safeText(detail);
      return el("div", { class: "idle-data-card" }, [
        el("div", { class: "idle-data-label" }, [safeText(label)]),
        el("div", { class: "idle-data-value" }, [safeText(value, "\u2014")]),
        ...(cleanDetail ? [el("div", { class: "idle-data-detail" }, [cleanDetail])] : [])
      ]);
    }

    function renderIdleSummaryItem(label, title, copy, extraClass = "") {
      return el("div", { class: `idle-summary-item${extraClass ? ` ${extraClass}` : ""}` }, [
        el("div", { class: "idle-summary-label" }, [label]),
        el("div", { class: "idle-summary-title" }, [title || "--"]),
        ...(copy ? [el("div", { class: "idle-summary-copy" }, [copy])] : [])
      ]);
    }

    function renderIdleSummaryTitleItem(title, extraClass = "") {
      return el("div", { class: `idle-summary-item${extraClass ? ` ${extraClass}` : ""}` }, [
        el("div", { class: "idle-summary-title" }, [title || "--"])
      ]);
    }

    function renderIdleItineraryNotesItem(label, copy, extraClass = "") {
      return el("div", { class: `idle-summary-item${extraClass ? ` ${extraClass}` : ""}` }, [
        el("div", { class: "idle-summary-label" }, [label]),
        el("div", { class: "idle-summary-copy" }, [copy || ""])
      ]);
    }

    function getIdleTelemetryItems() {
      const settings = getIdleScreensaverSettings();
      const preferredWind = getPreferredTrueWind();
      const definitionsByKey = new Map(getNavigationTelemetryCardDefinitions(nmeaState.data, preferredWind)
        .map(definition => [definition.key, definition]));

      return settings.telemetry_items
        .map(normalizeTelemetryItemKey)
        .flatMap(key => Array.isArray(key) ? key : [key])
        .filter(key => TELEMETRY_FIELD_KEYS.includes(key))
        .filter((key, index, items) => items.indexOf(key) === index)
        .filter(key => isTelemetryEnabled(settings, key))
        .map(key => definitionsByKey.get(key) || null)
        .filter(Boolean);
    }

    function getIdleItineraryStops(source = itineraryData) {
      const days = getItineraryDays(source);
      const stops = [];

      days.forEach(dayEntry => {
        dayEntry.stops.forEach((stop, stopIndex) => {
          stops.push({
            id: `${dayEntry.id}-${stop.id || stopIndex + 1}`,
            dayId: dayEntry.id,
            day: dayEntry.day,
            area: dayEntry.area,
            daySummary: dayEntry.summary,
            location: stop.location,
            label: stop.label,
            plan: stop.plan,
            timing: stop.timing,
            notes: stop.notes,
            latitude: stop.latitude,
            longitude: stop.longitude
          });
        });
      });

      return stops;
    }

    function getIdleItinerarySummary() {
      const days = getItineraryDays();
      if (!days.length) {
        return null;
      }

      const stops = getIdleItineraryStops();
      const todayKey = getCurrentDateKey();
      const startKey = normalizeDateKey(itineraryData && itineraryData.start_date);
      const endKey = normalizeDateKey(itineraryData && itineraryData.end_date);
      if (endKey && todayKey > endKey) {
        return {
          completed: true,
          today: null,
          tomorrow: null,
          current: null,
          next: null
        };
      }
      if (startKey && todayKey < startKey) {
        const firstDay = days[0];
        const firstStopIndex = firstDay ? stops.findIndex(stop => stop.dayId === firstDay.id) : -1;
        return {
          today: firstDay,
          tomorrow: days[1] || null,
          current: firstStopIndex >= 0 ? stops[firstStopIndex] : null,
          next: firstStopIndex >= 0 ? (stops[firstStopIndex + 1] || null) : null
        };
      }
      const currentDayNumber = getDisplayedItineraryDayNumber({ itinerary: itineraryData });
      const activeDayIndex = (() => {
        const datedMatchIndex = days.findIndex(dayEntry => normalizeDateKey(dayEntry.date) === todayKey);
        if (datedMatchIndex >= 0) {
          return datedMatchIndex;
        }
        return Number.isFinite(currentDayNumber)
          ? days.findIndex(dayEntry => Number(dayEntry && dayEntry.dayNumber) === currentDayNumber)
          : -1;
      })();
      const activeStopIndex = activeDayIndex >= 0
        ? stops.findIndex(stop => stop.dayId === days[activeDayIndex].id)
        : -1;

      if (!stops.length) {
        const todayIndex = activeDayIndex >= 0 ? activeDayIndex : 0;
        return {
          today: days[todayIndex],
          tomorrow: days[todayIndex + 1] || null,
          current: null,
          next: null
        };
      }

      const coordinates = getNavigationMapCoordinates();
      let currentIndex = activeStopIndex >= 0 ? activeStopIndex : 0;
      if (activeDayIndex < 0 && coordinates) {
        let closestDistance = Number.POSITIVE_INFINITY;
        stops.forEach((stop, index) => {
          if (!Number.isFinite(stop.latitude) || !Number.isFinite(stop.longitude)) {
            return;
          }
          const distance = getNavigationTrackDistanceMeters(
            { lat: Number(coordinates.latitude), lng: Number(coordinates.longitude) },
            { lat: stop.latitude, lng: stop.longitude }
          );
          if (distance < closestDistance) {
            closestDistance = distance;
            currentIndex = index;
          }
        });
      }

      const current = stops[currentIndex] || null;
      const next = stops[currentIndex + 1] || null;
      const inferredDayIndex = days.findIndex(dayEntry => current && dayEntry.id === current.dayId);
      const todayIndex = activeDayIndex >= 0
        ? activeDayIndex
        : (inferredDayIndex >= 0 ? inferredDayIndex : 0);

      return {
        today: days[todayIndex] || days[0],
        tomorrow: days[todayIndex + 1] || null,
        current,
        next
      };
    }

    function getNmeaDataAgeSeconds() {
      const timestamp = nmeaState.updatedAt || (nmeaState.data && nmeaState.data.updated_at) || "";
      const parsed = Date.parse(timestamp);
      return Number.isFinite(parsed) ? (Date.now() - parsed) / 1000 : null;
    }

    function getIdleNmeaStatus() {
      const ageSeconds = getNmeaDataAgeSeconds();
      if (!nmeaState.data || !nmeaState.updatedAt || !Number.isFinite(ageSeconds)) {
        return {
          label: "No data",
          className: "idle-status-badge idle-status-badge--none",
          detail: nmeaState.error || "Awaiting NMEA feed."
        };
      }

      if (ageSeconds > 45) {
        return {
          label: "Stale",
          className: "idle-status-badge idle-status-badge--stale",
          detail: `Last NMEA update ${Math.round(ageSeconds)} seconds ago.`
        };
      }

      return {
        label: "Live",
        className: "idle-status-badge idle-status-badge--live",
        detail: `Updated ${formatClock(nmeaState.updatedAt)}.`
      };
    }

    function syncIdleSidebarLayout() {
      const sidebar = document.querySelector(".idle-dashboard__sidebar");
      if (!sidebar) {
        return;
      }

      const visibleSectionCount = [
        document.getElementById("idleDashboardTelemetrySection"),
        document.getElementById("idleDashboardItinerarySection")
      ].filter(section => section && !section.hidden).length;

      sidebar.style.setProperty("--idle-sidebar-columns", String(Math.max(Math.min(visibleSectionCount, 2), 1)));
      sidebar.classList.toggle("idle-dashboard__sidebar--split", visibleSectionCount > 1);
    }

    function syncIdleHeaderCardLegacy() {
      const settings = getIdleScreensaverSettings();
      const title = document.getElementById("idleDashboardTitle");
      const headerMeta = document.getElementById("idleDashboardHeaderMeta");
      const positionPrimary = document.getElementById("idleDashboardPositionPrimary");
      const mapLabel = document.getElementById("idleDashboardMapLabel");
      const mapTitle = document.getElementById("idleDashboardMapTitle");
      const mapCopy = document.getElementById("idleDashboardMapCopy");
      const vesselCoordinates = getNavigationMapCoordinates();
      const activeZoomLevel = getActiveIdleZoomLevel(settings);
      const centerCoordinates = getIdleMapCenterCoordinates(activeZoomLevel, vesselCoordinates);
      const hasLivePosition = !!getLiveWeatherCoords();
      const positionTitle = vesselCoordinates
        ? formatCoordinatePairTraditional(Number(vesselCoordinates.latitude), Number(vesselCoordinates.longitude), 3)
        : "Awaiting vessel position";
      const positionDetail = vesselCoordinates
        ? `Lat ${Number(vesselCoordinates.latitude).toFixed(4)} · Lon ${Number(vesselCoordinates.longitude).toFixed(4)}`
        : "Lat -- · Lon --";
      const mapDetails = [];
      const mapFocusTitle = centerCoordinates
        ? formatCoordinatePairTraditional(Number(centerCoordinates.latitude), Number(centerCoordinates.longitude), 3)
        : "Awaiting map focus";

      if (activeZoomLevel && activeZoomLevel.center_on_vessel) {
        if (hasLivePosition) {
          mapDetails.push("Centered on live vessel coordinates.");
        } else if (vesselCoordinates) {
          mapDetails.push("Centered on configured fallback vessel coordinates.");
        } else {
          mapDetails.push("The passive display will center on the vessel as soon as a usable position is available.");
        }
      } else if (centerCoordinates) {
        mapDetails.push("Centered on the configured idle map coordinates for this zoom level.");
      } else {
        mapDetails.push("This zoom level is configured for a fixed map focus, but its coordinates are not available.");
      }

      if (settings.zoom_levels.length > 1) {
        mapDetails.push(`View ${Math.min(idleState.zoomIndex + 1, settings.zoom_levels.length)} of ${settings.zoom_levels.length}, rotating every ${settings.zoom_cycle_seconds} seconds.`);
      } else {
        mapDetails.push("Single idle map view active.");
      }
      mapDetails.push(`Zoom ${activeZoomLevel && Number.isFinite(activeZoomLevel.map_zoom) ? activeZoomLevel.map_zoom : NAVIGATION_MAP_DEFAULT_ZOOM}.`);

      if (nmeaState.updatedAt) {
        mapDetails.push(`Updated ${formatNavigationMapTimestamp(nmeaState.updatedAt)}.`);
      }

      if (title) {
        title.textContent = siteData.site_title || "Onboard Portal";
      }
      if (headerMeta) {
        headerMeta.textContent = positionDetail;
      }
      if (positionPrimary) {
        positionPrimary.textContent = positionTitle;
      }
      if (mapLabel) {
        mapLabel.textContent = activeZoomLevel && activeZoomLevel.center_on_vessel
          ? (hasLivePosition ? "Live vessel position" : (vesselCoordinates ? "Configured vessel position" : "Idle dashboard"))
          : "Configured idle focus";
      }
      if (mapTitle) {
        mapTitle.textContent = activeZoomLevel && activeZoomLevel.center_on_vessel ? positionTitle : mapFocusTitle;
      }
      if (mapCopy) {
        mapCopy.textContent = mapDetails.join(" ");
      }
    }

    function syncIdleTelemetrySectionLegacy() {
      const section = document.getElementById("idleDashboardTelemetrySection");
      const grid = document.getElementById("idleDashboardTelemetryGrid");
      const status = document.getElementById("idleDashboardTelemetryStatus");
      const meta = document.getElementById("idleDashboardTelemetryMeta");
      const settings = getIdleScreensaverSettings();
      const coordinates = getNavigationMapCoordinates();

      if (!section || !grid || !status || !meta) {
        return;
      }

      section.hidden = !settings.show_telemetry;
      if (!settings.show_telemetry) {
        return;
      }

      const items = getIdleTelemetryItems();
      const cards = items.map(item => renderIdleMetricCard(item.label, item.value, item.detail));

      replaceNodeChildren(grid, ...cards);
      meta.textContent = coordinates
        ? `Lat ${Number(coordinates.latitude).toFixed(4)} · Lon ${Number(coordinates.longitude).toFixed(4)}`
        : "Lat -- · Lon --";
      meta.textContent = "Live instruments";
      status.textContent = "";
    }

    function syncIdleHeaderCard() {
      const title = document.getElementById("idleDashboardTitle");
      const positionPrimary = document.getElementById("idleDashboardPositionPrimary");
      const mapLabel = document.getElementById("idleDashboardMapLabel");
      const mapTitle = document.getElementById("idleDashboardMapTitle");
      const mapCopy = document.getElementById("idleDashboardMapCopy");
      const settings = getIdleScreensaverSettings();
      const vesselCoordinates = getNavigationMapCoordinates();
      const activeZoomLevel = getActiveIdleZoomLevel(settings);
      const centerCoordinates = getIdleMapCenterCoordinates(activeZoomLevel, vesselCoordinates);
      const hasLivePosition = !!getLiveWeatherCoords();
      const positionTitle = vesselCoordinates
        ? formatCoordinatePairTraditional(Number(vesselCoordinates.latitude), Number(vesselCoordinates.longitude), 3)
        : "Awaiting vessel position";
      const positionDetail = vesselCoordinates
        ? `Lat ${Number(vesselCoordinates.latitude).toFixed(4)} | Lon ${Number(vesselCoordinates.longitude).toFixed(4)}`
        : "Lat -- | Lon --";
      const mapFocusTitle = centerCoordinates
        ? formatCoordinatePairTraditional(Number(centerCoordinates.latitude), Number(centerCoordinates.longitude), 3)
        : "Awaiting map focus";

      if (title) {
        title.textContent = siteData.site_title || "Onboard Portal";
      }
      if (positionPrimary) {
        positionPrimary.textContent = vesselCoordinates ? positionTitle : positionDetail;
      }
      if (mapLabel) {
        mapLabel.textContent = activeZoomLevel && activeZoomLevel.center_on_vessel
          ? (hasLivePosition ? "Live vessel position" : (vesselCoordinates ? "Configured vessel position" : "Idle dashboard"))
          : "Configured idle focus";
      }
      if (mapTitle) {
        mapTitle.textContent = activeZoomLevel && activeZoomLevel.center_on_vessel ? positionTitle : mapFocusTitle;
      }
      if (mapCopy) {
        mapCopy.textContent = "";
      }
    }

    function syncIdleTelemetrySection() {
      const section = document.getElementById("idleDashboardTelemetrySection");
      const grid = document.getElementById("idleDashboardTelemetryGrid");
      const status = document.getElementById("idleDashboardTelemetryStatus");
      const meta = document.getElementById("idleDashboardTelemetryMeta");
      const settings = getIdleScreensaverSettings();

      if (!section || !grid || !status || !meta) {
        return;
      }

      section.hidden = !settings.show_telemetry;
      if (!settings.show_telemetry) {
        return;
      }

      const items = getIdleTelemetryItems();
      const cards = items.map(item => renderIdleMetricCard(item.label, item.value, item.detail));
      const nmeaStatus = getIdleNmeaStatus();

      replaceNodeChildren(grid, ...cards);
      meta.textContent = "";
      replaceNodeChildren(meta, el("span", { class: nmeaStatus.className }, [nmeaStatus.label]));
      meta.hidden = false;
      if (meta.parentElement) {
        meta.parentElement.hidden = false;
      }
      status.textContent = nmeaStatus.detail;
      status.hidden = !nmeaStatus.detail;
    }

    function getDailyValue(daily, key, index) {
      return daily && Array.isArray(daily[key]) ? daily[key][index] : null;
    }

    function idleWeatherLocationText(data) {
      const coords = data && data.coords ? data.coords : {};
      return firstSafeText(coords.label, buildWeatherLocationDecimalText(data));
    }

    function idleWeatherNoticeNode(message) {
      const text = safeText(message);
      return text ? el("div", { class: "idle-dashboard__footer-note" }, [text]) : null;
    }

    function formatIdleCurrentWeatherWind(current) {
      const source = current && typeof current === "object" ? current : {};
      const parts = [];
      if (Number.isFinite(source.wind_speed_10m)) {
        parts.push(formatWeatherWind(source.wind_speed_10m));
      }
      if (Number.isFinite(source.wind_direction_10m)) {
        parts.push(toCompass(source.wind_direction_10m));
      }
      return parts.length ? `Wind ${parts.join(" ")}` : "";
    }

    function formatIdleForecastDetail(daily, index, low) {
      const parts = [];
      const dayValue = getDailyValue(daily, "time", index);
      if (safeText(dayValue)) {
        const dayLabel = formatDayLabel(dayValue);
        if (dayLabel !== "\u2014") {
          parts.push(dayLabel);
        }
      }
      if (Number.isFinite(low)) {
        parts.push(`Low ${formatTemperature(low)}`);
      }
      return parts.join(" | ");
    }

    function renderIdleWeatherPlaceholder(label, message, location = "") {
      const cleanMessage = safeText(message);
      const cleanLocation = safeText(location);
      return el("article", { class: "idle-weather-card" }, [
        el("div", { class: "idle-weather-card__head" }, [
          el("div", { class: "idle-weather-card__label" }, [label]),
          el("div", { class: "idle-weather-card__location" }, [cleanLocation])
        ]),
        cleanMessage ? el("div", { class: "idle-dashboard__footer-note" }, [cleanMessage]) : null
      ]);
    }

    function renderIdleCurrentWeatherCard(data) {
      if (!data || !data.forecast) {
        const message = safeText(data && data.message)
          || (idleWeatherState.loading ? "Loading current conditions." : "Current weather is unavailable until a vessel or itinerary position is known.");
        return renderIdleWeatherPlaceholder(
          "Current weather",
          message,
          data && data.coords ? data.coords.label : ""
        );
      }

      const current = data.forecast.current || {};
      const location = idleWeatherLocationText(data);
      const condition = safeText(describeWeatherCode(current.weather_code, current.is_day));
      const wind = formatIdleCurrentWeatherWind(current);
      const notice = safeText(data.message);
      return el("article", { class: "idle-weather-card" }, [
        el("div", { class: "idle-weather-card__head" }, [
          el("div", { class: "idle-weather-card__label" }, ["Current weather"]),
          el("div", { class: "idle-weather-card__location" }, [location])
        ]),
        el("div", { class: "idle-weather-hero" }, [
          el("div", { class: "idle-weather-temp" }, [formatTemperature(current.temperature_2m)]),
          el("div", {}, [
            condition ? el("div", { class: "idle-weather-condition" }, [condition]) : null,
            wind ? el("div", { class: "muted" }, [wind]) : null
          ])
        ]),
        el("div", { class: "idle-dashboard__data-grid" }, [
          renderIdleDataCard("Rain", formatPrecipitation(current.precipitation)),
          renderIdleDataCard("Cloud", formatPercent(current.cloud_cover))
        ]),
        idleWeatherNoticeNode(notice)
      ]);
    }

    function renderIdleNextForecastCard(data) {
      if (!data || !data.forecast) {
        const message = safeText(data && data.message)
          || (idleWeatherState.loading ? "Loading next-stop forecast." : "Next-stop forecast is unavailable until the next stop has coordinates.");
        return renderIdleWeatherPlaceholder(
          "Next-day forecast",
          message,
          data && data.coords ? data.coords.label : ""
        );
      }

      const daily = data.forecast.daily || {};
      const index = Array.isArray(daily.time) && daily.time.length > 1 ? 1 : 0;
      const high = getDailyValue(daily, "temperature_2m_max", index);
      const low = getDailyValue(daily, "temperature_2m_min", index);
      const rainChance = getDailyValue(daily, "precipitation_probability_max", index);
      const rainSum = getDailyValue(daily, "precipitation_sum", index);
      const windMax = getDailyValue(daily, "wind_speed_10m_max", index);
      const location = idleWeatherLocationText(data);
      const condition = safeText(describeWeatherCode(getDailyValue(daily, "weather_code", index), 1));
      const detail = formatIdleForecastDetail(daily, index, low);
      const notice = safeText(data.message);

      return el("article", { class: "idle-weather-card" }, [
        el("div", { class: "idle-weather-card__head" }, [
          el("div", { class: "idle-weather-card__label" }, ["Next-day forecast"]),
          el("div", { class: "idle-weather-card__location" }, [location])
        ]),
        el("div", { class: "idle-weather-hero" }, [
          el("div", { class: "idle-weather-temp" }, [formatTemperature(high)]),
          el("div", {}, [
            condition ? el("div", { class: "idle-weather-condition" }, [condition]) : null,
            detail ? el("div", { class: "muted" }, [detail]) : null
          ])
        ]),
        el("div", { class: "idle-dashboard__data-grid" }, [
          renderIdleDataCard("Rain", formatPercent(rainChance), formatPrecipitation(rainSum)),
          renderIdleDataCard("Wind", formatWeatherWind(windMax))
        ]),
        idleWeatherNoticeNode(notice)
      ]);
    }

    function syncIdleWeatherSection() {
      const section = document.getElementById("idleDashboardWeatherSection");
      const body = document.getElementById("idleDashboardWeatherBody");
      const meta = document.getElementById("idleDashboardWeatherMeta");
      const settings = getIdleScreensaverSettings();

      if (!section || !body || !meta) {
        return;
      }

      section.hidden = !settings.show_weather;
      if (!settings.show_weather) {
        if (idleWeatherSectionSignature === "hidden") {
          return;
        }
        idleWeatherSectionSignature = "hidden";
        replaceNodeChildren(body);
        return;
      }

      const updatedClock = formatOptionalClock(idleWeatherState.updatedAt);
      const metaText = updatedClock
        ? `Weather | updated ${updatedClock}`
        : "Weather";
      const renderSignature = [
        "visible",
        metaText,
        idleWeatherState.loading ? "loading" : "idle",
        safeText(idleWeatherState.error),
        getMoonSignature(idleWeatherState.moon),
        idleWeatherState.signature || ""
      ].join("|");

      if (idleWeatherSectionSignature === renderSignature) {
        return;
      }

      idleWeatherSectionSignature = renderSignature;
      meta.textContent = metaText;
      const moonImage = renderMoonPhaseImage(idleWeatherState.moon, "idle");
      const weatherGrid = el("div", { class: "idle-weather-grid" }, [
        renderIdleCurrentWeatherCard(idleWeatherState.current),
        renderIdleNextForecastCard(idleWeatherState.next)
      ]);
      replaceNodeChildren(
        body,
        moonImage ? el("div", { class: "idle-weather-layout" }, [moonImage, weatherGrid]) : weatherGrid,
        idleWeatherNoticeNode(idleWeatherState.error)
      );
    }

    function syncIdleItinerarySection() {
      const section = document.getElementById("idleDashboardItinerarySection");
      const body = document.getElementById("idleDashboardItineraryBody");
      const meta = document.getElementById("idleDashboardItineraryMeta");
      const settings = getIdleScreensaverSettings();
      const summary = getIdleItinerarySummary();

      if (!section || !body || !meta) {
        return;
      }

      section.hidden = !settings.show_itinerary;
      if (!settings.show_itinerary) {
        return;
      }

      if (!summary) {
        meta.textContent = "Itinerary";
        replaceNodeChildren(body, el("div", { class: "idle-dashboard__footer-note" }, ["Itinerary data is not available yet."]));
        return;
      }
      if (summary.completed) {
        meta.textContent = "Itinerary";
        replaceNodeChildren(body, el("div", { class: "idle-summary-list" }, [
          renderIdleSummaryItem("Charter", "Charter completed", "This charter has been completed.", "idle-itinerary-current")
        ]));
        return;
      }

      const today = summary.today || {};
      const tomorrow = summary.tomorrow || null;
      const todayNotes = getItineraryTextValue(today.summary) || "No notes for today's itinerary.";
      const tomorrowNotes = tomorrow
        ? (getItineraryTextValue(tomorrow.summary) || "No notes for tomorrow's itinerary.")
        : "No itinerary scheduled for tomorrow.";
      const items = [
        renderIdleSummaryTitleItem(
          getItineraryTextValue(today.day, "Today"),
          "idle-itinerary-today idle-itinerary-day-title"
        ),
        renderIdleItineraryNotesItem(
          "TODAYS ITINERARY",
          todayNotes,
          "idle-itinerary-current"
        ),
        renderIdleItineraryNotesItem(
          "TOMORROWS ITINERARY",
          tomorrowNotes,
          "idle-itinerary-next"
        )
      ];

      meta.textContent = "Itinerary";
      replaceNodeChildren(body, el("div", { class: "idle-summary-list" }, items));
    }

    function setIdleMapPlaceholder(title, message) {
      const placeholder = document.getElementById("idleDashboardMapPlaceholder");
      if (!placeholder) {
        return;
      }

      placeholder.hidden = false;
      replaceNodeChildren(placeholder, el("div", {}, [
        el("strong", {}, [title]),
        el("div", { class: "muted" }, [message])
      ]));
    }

    function hideIdleMapPlaceholder() {
      const placeholder = document.getElementById("idleDashboardMapPlaceholder");
      if (placeholder) {
        placeholder.hidden = true;
      }
    }

    function invalidateIdleMapSize() {
      if (idleMapState.map) {
        idleMapState.map.invalidateSize(false);
      }
    }

    function initializeIdleMap() {
      if (idleMapState.map) {
        return idleMapState.map;
      }

      const mapNode = document.getElementById("idleDashboardMap");
      if (!mapNode) {
        return null;
      }

      if (!window.L || typeof window.L.map !== "function") {
        setIdleMapPlaceholder(
          "Map library unavailable",
          "Load this page once while online so Leaflet and viewed tiles can be reused when connectivity drops."
        );
        return null;
      }

      const map = window.L.map(mapNode, {
        zoomControl: false,
        attributionControl: false,
        zoomAnimation: false,
        markerZoomAnimation: false,
        fadeAnimation: false,
        minZoom: NAVIGATION_MAP_MIN_ZOOM,
        maxZoom: NAVIGATION_MAP_MAX_ZOOM,
        worldCopyJump: true,
        dragging: false,
        touchZoom: false,
        doubleClickZoom: false,
        scrollWheelZoom: false,
        boxZoom: false,
        keyboard: false
      });

      const satelliteLayer = createSatelliteTileLayer("");
      satelliteLayer.addTo(map);

      const trackLine = window.L.polyline([], {
        color: "#d94a43",
        weight: 3,
        opacity: 0.88,
        smoothFactor: 0,
        noClip: true
      }).addTo(map);

      const marker = window.L.marker([0, 0], {
        icon: createNavigationVesselIcon(),
        keyboard: false,
        interactive: false
      }).addTo(map);

      ["dragging", "touchZoom", "doubleClickZoom", "scrollWheelZoom", "boxZoom", "keyboard", "tap"].forEach(control => {
        if (map[control] && typeof map[control].disable === "function") {
          map[control].disable();
        }
      });

      idleMapState.map = map;
      idleMapState.marker = marker;
      idleMapState.satelliteLayer = satelliteLayer;
      idleMapState.trackLine = trackLine;
      updateSharedTrackLines();
      syncPlannedRouteLayers();
      bindMapTileRecovery(idleMapState, satelliteLayer);
      syncMapAvailabilityNotice(idleMapState);
      return map;
    }

    function syncIdleItineraryOverlay() {
      if (!idleMapState.map) {
        return;
      }

      const points = getItineraryMapPoints();
      const signature = getItineraryMapSignature(points);

      if (!points.length) {
        if (idleMapState.itineraryLayer) {
          idleMapState.map.removeLayer(idleMapState.itineraryLayer);
          idleMapState.itineraryLayer = null;
        }
        idleMapState.itinerarySignature = "";
        return;
      }

      if (signature === idleMapState.itinerarySignature) {
        return;
      }

      if (idleMapState.itineraryLayer) {
        idleMapState.map.removeLayer(idleMapState.itineraryLayer);
      }

      const itineraryLayer = window.L.layerGroup();
      points.forEach(point => {
        const marker = window.L.circleMarker([point.latitude, point.longitude], {
          radius: 4,
          weight: 1.5,
          color: "rgba(255,245,216,0.95)",
          fillColor: "#d4b06a",
          fillOpacity: 0.92,
          interactive: false
        });

        marker.bindTooltip(point.label || point.location || point.day, {
          permanent: true,
          direction: "top",
          offset: [0, -8],
          className: "navigation-itinerary-tooltip"
        });
        marker.addTo(itineraryLayer);
      });

      itineraryLayer.addTo(idleMapState.map);
      idleMapState.itineraryLayer = itineraryLayer;
      idleMapState.itinerarySignature = signature;
    }

    function syncIdleMap(forceRefresh = false) {
      const settings = getIdleScreensaverSettings();
      const activeZoom = getActiveIdleZoomLevel(settings);
      const vesselCoordinates = getNavigationMapCoordinates();
      const centerCoordinates = getIdleMapCenterCoordinates(activeZoom, vesselCoordinates);

      if (!centerCoordinates) {
        setIdleMapPlaceholder(
          "Awaiting map position",
          "The passive display will center on the configured focus as soon as live or configured coordinates are available."
        );
        return;
      }

      if (!idleState.active && !idleMapState.map) {
        return;
      }

      const map = initializeIdleMap();
      if (!map) {
        return;
      }

      syncPlannedRouteLayers();
      syncIdleItineraryOverlay();

      const centerLatitude = Number(centerCoordinates.latitude);
      const centerLongitude = Number(centerCoordinates.longitude);
      if (!Number.isFinite(centerLatitude) || !Number.isFinite(centerLongitude)) {
        setIdleMapPlaceholder("Map position unavailable", "The current idle map focus coordinates could not be interpreted.");
        return;
      }

      hideIdleMapPlaceholder();

      if (vesselCoordinates) {
        const vesselLatitude = Number(vesselCoordinates.latitude);
        const vesselLongitude = Number(vesselCoordinates.longitude);
        if (Number.isFinite(vesselLatitude) && Number.isFinite(vesselLongitude)) {
          idleMapState.marker.setLatLng([vesselLatitude, vesselLongitude]);
          if (typeof idleMapState.marker.setOpacity === "function") {
            idleMapState.marker.setOpacity(1);
          }
          updateIdleMapMarkerHeading();
        }
      } else if (typeof idleMapState.marker.setOpacity === "function") {
        idleMapState.marker.setOpacity(0);
      }

      if (idleMapState.trackLine) {
        idleMapState.trackLine.setLatLngs(
          navigationMapState.trackPoints.map(point => [point.lat, point.lng])
        );
      }

      const zoomChoice = getAutomaticMapZoomChoice(
        activeZoom && Number.isFinite(activeZoom.map_zoom) ? activeZoom.map_zoom : NAVIGATION_MAP_DEFAULT_ZOOM,
        { map }
      );

      const positionKey = [
        `${centerLatitude.toFixed(6)},${centerLongitude.toFixed(6)}`,
        vesselCoordinates ? `${Number(vesselCoordinates.latitude).toFixed(6)},${Number(vesselCoordinates.longitude).toFixed(6)}` : "no-vessel",
        zoomChoice.zoom,
        activeZoom && activeZoom.center_on_vessel ? "vessel" : "fixed"
      ].join("|");
      const shouldResetView = !idleMapState.hasCentered
        || forceRefresh
        || idleMapState.lastPositionKey !== positionKey
        || map.getZoom() !== zoomChoice.zoom;

      if (shouldResetView) {
        setMapViewWithRecovery(idleMapState, [centerLatitude, centerLongitude], zoomChoice.zoom, {
          animate: false
        });
        idleMapState.hasCentered = true;
      }

      idleMapState.lastPositionKey = positionKey;
      if (!zoomChoice.available) {
        setMapAvailabilityNotice(idleMapState, MAP_TILE_UNAVAILABLE_MESSAGE);
      }

      if (idleState.active || forceRefresh) {
        invalidateIdleMapSize();
      }
    }

    function syncIdleDashboard() {
      syncIdleSettings();
      updateIdleClock();
      syncIdleHeaderCard();
      syncIdleTelemetrySection();
      syncIdleWeatherSection();
      syncIdleItinerarySection();
      syncIdleSidebarLayout();
      syncIdleMap();
      if (idleState.active) {
        refreshIdleWeatherForecasts().catch(() => {});
      }
    }

    async function refreshIdleWeatherForecasts(force = false) {
      const settings = getIdleScreensaverSettings();
      if (!settings.show_weather) {
        idleWeatherState.loading = false;
        idleWeatherState.error = "";
        syncIdleWeatherSection();
        return;
      }

      if (!force && (
        idleWeatherState.loading
        || idleWeatherState.signature
      )) {
        return;
      }

      await refreshWeather({ force });
    }

    async function refreshWeather(options = {}) {
      const force = typeof options === "boolean"
        ? options
        : Boolean(options && options.force);
      const now = Date.now();
      if (weatherRequestPromise) {
        return weatherRequestPromise;
      }
      if (!force && weatherLastRequestAt && now - weatherLastRequestAt < WEATHER_MIN_REFRESH_INTERVAL_MS) {
        return null;
      }

      weatherLastRequestAt = now;
      const requestId = ++weatherRequestId;

      weatherRequestPromise = (async () => {
        try {
          const payload = await fetchWeatherPayload();
          const currentData = weatherEntryToClientData(payload && payload.current_position);
          const payloadMoon = getWeatherPayloadMoon(payload) || currentData.moon;

          if (requestId !== weatherRequestId) {
            return null;
          }

          logWeatherDiagnostics(payload);
          const idleChanged = applyIdleWeatherPayload(payload);
          const nextWeatherState = {
            visible: true,
            loading: false,
            data: currentData.forecast ? currentData : null,
            moon: payloadMoon,
            error: currentData.message || (currentData.forecast ? "" : "Unable to load weather data."),
            updatedAt: currentData.updatedAt || getWeatherPayloadUpdatedAt(payload, currentData, null),
            source: currentData.source,
            signature: ""
          };
          nextWeatherState.signature = getWeatherDisplaySignature(nextWeatherState);

          const weatherChanged = nextWeatherState.signature !== (weatherState.signature || getWeatherDisplaySignature(weatherState));
          weatherState = nextWeatherState;

          if (weatherChanged) {
            syncDynamicTabsAndPanels();
          } else if (idleChanged) {
            syncIdleWeatherSection();
          }
        } catch (error) {
          if (requestId !== weatherRequestId) {
            return null;
          }

          const nextWeatherState = {
            visible: true,
            loading: false,
            data: weatherState.data,
            moon: weatherState.moon,
            error: error && error.message ? error.message : "Unable to load weather data.",
            updatedAt: weatherState.updatedAt,
            source: weatherState.source,
            signature: ""
          };
          nextWeatherState.signature = getWeatherDisplaySignature(nextWeatherState);

          const weatherChanged = nextWeatherState.signature !== (weatherState.signature || getWeatherDisplaySignature(weatherState));
          weatherState = nextWeatherState;
          idleWeatherState = {
            ...idleWeatherState,
            loading: false,
            error: nextWeatherState.error
          };

          if (weatherChanged) {
            syncDynamicTabsAndPanels();
          } else {
            syncIdleWeatherSection();
          }
        } finally {
          if (weatherRequestPromise) {
            weatherRequestPromise = null;
          }
        }
        return null;
      })();

      return weatherRequestPromise;
    }

    function startWeatherRefreshLoop() {
      if (weatherRefreshTimer) {
        window.clearInterval(weatherRefreshTimer);
      }

      weatherRefreshTimer = window.setInterval(() => {
        refreshWeather().catch(() => {});
      }, WEATHER_POLL_INTERVAL_MS);
    }

    function renderMenuTab(data) {
      const menuData = data && typeof data === "object" ? data : {};
      const selectedMenu = getSelectedMenuEntry(menuData);
      const todaysNotes = getItineraryTextValue(selectedMenu.todays_notes, selectedMenu.notes, selectedMenu.theme);
      const menuSections = normalizeMenuDaySections(selectedMenu);
      const hasMenuContent = menuSections.some(section => Array.isArray(section.items) && section.items.length);
      const menuDayLabel = Number.isFinite(Number(selectedMenu.charter_day))
        ? `CHARTER DAY ${Math.round(Number(selectedMenu.charter_day))}`
        : getItineraryTextValue(
          selectedMenu.label,
          formatDisplayDate(selectedMenu.date),
          selectedMenu.date_label,
          menuData.date_label,
          "Today's selection"
        );
      const metaItems = [
        normalizeDateKey(selectedMenu.date) ? formatDisplayDate(selectedMenu.date) : ""
      ].filter(Boolean);

      return el("section", { class: "tab-panel", id: "panel-menu" }, [
        el("div", { class: "charter-stack" }, [
          el("article", { class: "menu-paper charter-page" }, [
            el("div", { class: "menu-heading" }, ["Onboard Dining"]),
            el("h2", { class: "menu-title" }, ["Today's Menu"]),
            el("div", { class: "menu-subtitle" }, [menuDayLabel]),
            el(
              "div",
              {
                class: `menu-note menu-day-notes${todaysNotes ? "" : " menu-day-notes--empty"}`,
                ...(todaysNotes ? {} : { "aria-hidden": "true" })
              },
              [todaysNotes || "\u00a0"]
            ),
            ...(metaItems.length ? [el("div", { class: "menu-meta-row" }, metaItems.map(item =>
              el("div", { class: "menu-meta-line" }, [item])
            ))] : []),
            el("div", { class: "flourish" }, ["\u2736  \u2736  \u2736"]),
            ...(hasMenuContent
              ? menuSections.map(section => el("section", { class: "menu-section" }, [
                el("div", { class: "menu-section-title" }, [section.title]),
                section.items.length
                  ? makeList(section.items, item =>
                    el("li", { class: "menu-item" }, [
                      el("span", { class: "menu-item-name" }, [item.name || "Item"]),
                      item.description ? el("div", { class: "menu-item-desc" }, [item.description]) : null
                    ])
                  )
                  : el("div", { class: "menu-note" }, ["Selection will be added shortly."])
              ]))
              : [el("div", { class: "menu-note" }, ["Menu to be confirmed"])]),
            el("div", { class: "menu-note" }, ["Prepared onboard with seasonal ingredients where available."])
          ])
        ])
      ]);
    }

    function beverageCategoryKey(value) {
      return String(value || "")
        .trim()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/_/g, " ")
        .toLocaleLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
    }

    function normalizeBeverageStockType(value) {
      const normalized = beverageCategoryKey(value);
      return BEVERAGE_STOCK_TYPE_ALIASES[normalized] || normalized;
    }

    function normalizeBeverageCategory(category, stockType = "") {
      const keys = [beverageCategoryKey(category), normalizeBeverageStockType(stockType)].filter(Boolean);
      if (keys.some(key => ["champagne", "sparkling", "sparkling-wine", "prosecco", "cava"].includes(key))) {
        return "Champagne";
      }
      if (keys.some(key => ["wine", "red-wine", "white-wine", "rose", "rosie", "dessert-wine"].includes(key))) {
        return "Wine";
      }
      if (keys.some(key => [
        "beer",
        "beers",
        "lager",
        "ale",
        "ipa",
        "stout",
        "porter",
        "pilsner",
        "draft-beer",
        "bottle-beer"
      ].includes(key))) {
        return "Beers";
      }
      if (keys.some(key => [
        "spirit",
        "spirits",
        "liquor",
        "vodka",
        "gin",
        "rum",
        "white-rum",
        "dark-rum",
        "spiced-rum",
        "tequila",
        "whisky",
        "whiskey",
        "bourbon",
        "brandy",
        "cognac",
        "liqueur",
        "coffee-liqueur",
        "triple-sec",
        "vermouth",
        "dry-vermouth",
        "mezcal",
        "absinthe"
      ].includes(key))) {
        return "Spirits";
      }
      return "Other";
    }

    function groupBeveragesByCategory(items) {
      const groups = BEVERAGE_CATEGORY_ORDER.map(category => ({ category, title: category, items: [] }));
      const groupsByKey = new Map(groups.map(group => [beverageCategoryKey(group.category), group]));
      (Array.isArray(items) ? items : []).forEach(item => {
        const source = item && typeof item === "object" ? item : {};
        const category = normalizeBeverageCategory(source.category, source.stock_type);
        const group = groupsByKey.get(beverageCategoryKey(category)) || groupsByKey.get(beverageCategoryKey("Other"));
        group.items.push(item);
      });
      return groups;
    }

    function drinkSections(value) {
      if (!value || typeof value !== "object") {
        return [];
      }
      if (Array.isArray(value.sections)) {
        return value.sections.filter(Boolean);
      }
      if (Array.isArray(value.items)) {
        return [{ title: "Available Alcohol", description: "", items: value.items.filter(Boolean) }];
      }
      return [];
    }

    function groupedDrinkSections(value) {
      const source = value && typeof value === "object" ? value : {};
      const items = Array.isArray(source.sections)
        ? source.sections.flatMap(section => {
          const sectionValue = section && typeof section === "object" ? section : {};
          const fallbackCategory = sectionValue.category || sectionValue.title || "";
          return (Array.isArray(sectionValue.items) ? sectionValue.items : [])
            .filter(Boolean)
            .map(item => ({
              ...item,
              category: item.category || fallbackCategory,
              stock_type: item.stock_type || sectionValue.stock_type || ""
            }));
        })
        : (Array.isArray(source.items) ? source.items.filter(Boolean) : []);
      return groupBeveragesByCategory(items).filter(section => section.items.length);
    }

    function hasDrinkSections(value) {
      return drinkSections(value).some(section => Array.isArray(section.items) && section.items.length);
    }

    function hasGroupedDrinkSections(value) {
      return groupedDrinkSections(value).length > 0;
    }

    function normalizeCocktailIngredient(ingredient) {
      const source = typeof ingredient === "string"
        ? { name: ingredient }
        : (ingredient && typeof ingredient === "object" ? ingredient : {});
      const name = typeof source.name === "string"
        ? source.name.trim()
        : (typeof source.label === "string" ? source.label.trim() : "");
      if (!name) {
        return null;
      }
      return { name };
    }

    function normalizeCocktailItem(item) {
      const source = item && typeof item === "object" ? item : {};
      const legacyIngredients = Array.isArray(source.ingredients)
        ? source.ingredients
        : (Array.isArray(source.recipe) ? source.recipe : []);
      const description = typeof source.description === "string"
        ? source.description
        : (typeof source.notes === "string" ? source.notes : "");
      return {
        name: typeof source.name === "string" ? source.name.trim() : "",
        description,
        ingredients: legacyIngredients.map(normalizeCocktailIngredient).filter(Boolean)
      };
    }

    function cocktailList(value) {
      if (Array.isArray(value)) {
        return value
          .map(normalizeCocktailItem)
          .filter(cocktail => cocktail.name || cocktail.description || cocktail.ingredients.length);
      }
      const source = value && typeof value === "object" ? value : {};
      const legacySections = Array.isArray(source.sections) ? source.sections : [];
      const legacyItems = legacySections.flatMap(section => {
        const sectionValue = section && typeof section === "object" ? section : {};
        return Array.isArray(sectionValue.items) ? sectionValue.items : [];
      });
      const items = Array.isArray(source.cocktails)
        ? source.cocktails
        : (Array.isArray(source.items) ? source.items : legacyItems);
      return items
        .map(normalizeCocktailItem)
        .filter(cocktail => cocktail.name || cocktail.description || cocktail.ingredients.length);
    }

    function cocktailIngredientListText(ingredients) {
      return (Array.isArray(ingredients) ? ingredients : [])
        .map(normalizeCocktailIngredient)
        .filter(Boolean)
        .map(ingredient => ingredient.name)
        .join(", ");
    }

    function normalizeAvailableAlcoholPrice(value) {
      if (value === null || value === undefined || value === "") {
        return null;
      }
      const number = Number(value);
      if (!Number.isFinite(number) || number < 0) {
        return null;
      }
      return Math.min(Math.trunc(number), AVAILABLE_ALCOHOL_MAX_PRICE);
    }

    function drinkPriceText(item) {
      const price = normalizeAvailableAlcoholPrice(item && item.price_per_bottle);
      return price === null ? "Price on request" : `${price} ${item.currency || "PHP"}`;
    }

    function availableAlcoholPricesVisible(value) {
      const source = value && typeof value === "object" ? value : {};
      return source.show_prices_to_guests === true || source.showPricesToGuests === true;
    }

    function meaningfulAvailableAlcoholVariant(value) {
      const text = typeof value === "string" ? value.trim().replace(/\s+/g, " ") : "";
      const key = text.toLocaleLowerCase().replace(/[\s.\/-]+/g, "");
      return text && !["na", "n/a", "none", "notapplicable"].includes(key) ? text : "";
    }

    function availableAlcoholNameKey(value) {
      return String(value || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLocaleLowerCase()
        .replace(/[^a-z0-9]+/g, "");
    }

    function availableAlcoholVariantText(item) {
      const source = item && typeof item === "object" ? item : {};
      return meaningfulAvailableAlcoholVariant(source.variant)
        || meaningfulAvailableAlcoholVariant(source.expression)
        || meaningfulAvailableAlcoholVariant(source.age);
    }

    function meaningfulAvailableAlcoholDescription(value) {
      const text = typeof value === "string" ? value.trim() : "";
      const key = text.toLocaleLowerCase().replace(/[\s.\/-]+/g, "");
      return text && !["na", "n/a", "none", "notapplicable"].includes(key) ? text : "";
    }

    function formatAvailableAlcoholName(item) {
      const source = item && typeof item === "object" ? item : {};
      const name = typeof source.name === "string" && source.name.trim()
        ? source.name.trim()
        : (typeof source.display_name === "string" && source.display_name.trim()
          ? source.display_name.trim()
          : (typeof source.label === "string" && source.label.trim() ? source.label.trim() : "Selection"));
      const variant = availableAlcoholVariantText(source);
      if (!variant) {
        return name;
      }
      const nameKey = availableAlcoholNameKey(name);
      const variantKey = availableAlcoholNameKey(variant);
      return variantKey && nameKey.includes(variantKey) ? name : `${name} - ${variant}`;
    }

    function availableAlcoholSubCategoryKey(value) {
      return beverageCategoryKey(value);
    }

    function normalizeAvailableAlcoholSubCategoryLabel(value, category = "") {
      const text = typeof value === "string" ? value.trim().replace(/\s+/g, " ") : "";
      if (!text) {
        return "";
      }
      const key = availableAlcoholSubCategoryKey(text);
      const normalizedCategory = normalizeBeverageCategory(category);
      if (key === "other") {
        return AVAILABLE_ALCOHOL_SUBCATEGORY_FALLBACK;
      }
      if (normalizedCategory === "Champagne") {
        if (key === "champagne") {
          return "Champagne";
        }
        if (key === "prosecco") {
          return "Prosecco";
        }
        if (key === "cava") {
          return "Cava";
        }
        if (key === "sparkling" || key === "sparkling-wine") {
          return "Sparkling";
        }
      }
      if (normalizedCategory === "Wine") {
        if (key === "red" || key === "red-wine") {
          return "Red Wine";
        }
        if (key === "white" || key === "white-wine") {
          return "White Wine";
        }
        if (key === "rose" || key === "rosie" || key === "rose-wine") {
          return "Rosé";
        }
        if (key === "champagne") {
          return "Champagne";
        }
        if (key === "prosecco") {
          return "Prosecco";
        }
        if (key === "cava") {
          return "Cava";
        }
        if (key === "dessert-wine") {
          return "Dessert Wine";
        }
      }
      if (normalizedCategory === "Spirits") {
        if (key === "gin") {
          return "Gin";
        }
        if (key === "vodka") {
          return "Vodka";
        }
        if (key === "white-rum") {
          return "White Rum";
        }
        if (key === "dark-rum") {
          return "Dark Rum";
        }
        if (key === "spiced-rum") {
          return "Spiced Rum";
        }
        if (key === "rum") {
          return "Rum";
        }
        if (key === "tequila") {
          return "Tequila";
        }
        if (key === "mezcal") {
          return "Mezcal";
        }
        if (["whisky", "whiskey", "bourbon", "scotch", "rye"].includes(key)) {
          return "Whisky";
        }
        if (key === "cognac") {
          return "Cognac";
        }
        if (key === "brandy") {
          return "Brandy";
        }
        if (key === "liqueur" || key === "coffee-liqueur") {
          return "Liqueur";
        }
        if (key === "vermouth" || key === "dry-vermouth") {
          return "Vermouth";
        }
        if (key === "absinthe") {
          return "Absinthe";
        }
      }
      if (normalizedCategory === "Beers") {
        if (key === "ipa") {
          return "IPA";
        }
        if (key === "lager") {
          return "Lager";
        }
        if (key === "pilsner") {
          return "Pilsner";
        }
        if (key === "stout") {
          return "Stout";
        }
        if (key === "porter") {
          return "Porter";
        }
        if (key === "ale") {
          return "Ale";
        }
        if (key === "wheat" || key === "wheat-beer") {
          return "Wheat Beer";
        }
        if (key === "cider") {
          return "Cider";
        }
        if (key === "sour") {
          return "Sour";
        }
      }
      return text;
    }

    function availableAlcoholInferenceText(...values) {
      return values
        .map(value => typeof value === "string" ? value.trim() : "")
        .filter(Boolean)
        .join(" ")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLocaleLowerCase()
        .replace(/[^a-z0-9]+/g, " ")
        .trim();
    }

    function inferAvailableAlcoholSubCategoryFromText(text, category = "") {
      const normalizedText = typeof text === "string" ? text.trim() : "";
      const paddedText = ` ${normalizedText} `;
      const hasToken = token => paddedText.includes(` ${token} `);
      switch (normalizeBeverageCategory(category)) {
        case "Champagne":
          if (hasToken("prosecco")) {
            return "Prosecco";
          }
          if (hasToken("cava")) {
            return "Cava";
          }
          if (hasToken("sparkling")) {
            return "Sparkling";
          }
          return "Champagne";
        case "Wine":
          if (hasToken("prosecco")) {
            return "Prosecco";
          }
          if (hasToken("cava")) {
            return "Cava";
          }
          if (hasToken("champagne")) {
            return "Champagne";
          }
          if (hasToken("rose") || hasToken("rose wine") || hasToken("rosie")) {
            return "Rosé";
          }
          if (hasToken("dessert") || hasToken("sauternes") || hasToken("ice wine") || hasToken("icewine") || hasToken("port")) {
            return "Dessert Wine";
          }
          if ([
            "white",
            "sauvignon",
            "blanc",
            "chardonnay",
            "chablis",
            "riesling",
            "semillon",
            "viognier",
            "pinot grigio",
            "pinot gris",
            "albarino",
            "chenin"
          ].some(hasToken)) {
            return "White Wine";
          }
          if ([
            "red",
            "cabernet",
            "merlot",
            "pinot noir",
            "shiraz",
            "syrah",
            "malbec",
            "tempranillo",
            "sangiovese",
            "zinfandel",
            "grenache",
            "pomerol",
            "bordeaux"
          ].some(hasToken)) {
            return "Red Wine";
          }
          return AVAILABLE_ALCOHOL_SUBCATEGORY_FALLBACK;
        case "Spirits":
          if (hasToken("white rum")) {
            return "White Rum";
          }
          if (hasToken("dark rum")) {
            return "Dark Rum";
          }
          if (hasToken("spiced rum")) {
            return "Spiced Rum";
          }
          if (hasToken("gin")) {
            return "Gin";
          }
          if (hasToken("vodka")) {
            return "Vodka";
          }
          if (hasToken("rum")) {
            return "Rum";
          }
          if (hasToken("tequila")) {
            return "Tequila";
          }
          if (hasToken("mezcal")) {
            return "Mezcal";
          }
          if (hasToken("cognac")) {
            return "Cognac";
          }
          if (hasToken("brandy")) {
            return "Brandy";
          }
          if (hasToken("liqueur")) {
            return "Liqueur";
          }
          if (hasToken("vermouth")) {
            return "Vermouth";
          }
          if (hasToken("absinthe")) {
            return "Absinthe";
          }
          if (["whisky", "whiskey", "bourbon", "scotch", "rye"].some(hasToken)) {
            return "Whisky";
          }
          return AVAILABLE_ALCOHOL_SUBCATEGORY_FALLBACK;
        case "Beers":
          if (hasToken("ipa")) {
            return "IPA";
          }
          if (hasToken("lager")) {
            return "Lager";
          }
          if (hasToken("pilsner")) {
            return "Pilsner";
          }
          if (hasToken("stout")) {
            return "Stout";
          }
          if (hasToken("porter")) {
            return "Porter";
          }
          if (hasToken("ale")) {
            return "Ale";
          }
          if (hasToken("wheat beer") || hasToken("wheat")) {
            return "Wheat Beer";
          }
          if (hasToken("cider")) {
            return "Cider";
          }
          if (hasToken("sour")) {
            return "Sour";
          }
          return AVAILABLE_ALCOHOL_SUBCATEGORY_FALLBACK;
        case "Other":
          return AVAILABLE_ALCOHOL_SUBCATEGORY_FALLBACK;
        default:
          return AVAILABLE_ALCOHOL_SUBCATEGORY_FALLBACK;
      }
    }

    function availableAlcoholSubCategoryText(item) {
      const source = item && typeof item === "object" ? item : {};
      const category = normalizeBeverageCategory(source.category, source.stock_type);
      const explicit = normalizeAvailableAlcoholSubCategoryLabel(source.sub_category, category);
      if (explicit) {
        return explicit;
      }
      return inferAvailableAlcoholSubCategoryFromText(availableAlcoholInferenceText(
        source.category,
        source.stock_type,
        source.name,
        source.variant,
        source.expression,
        source.age,
        source.description,
        source.display_name,
        source.label,
        source.brand
      ), category);
    }

    function compareAvailableAlcoholSubCategory(left, right) {
      return availableAlcoholSubCategoryText(left).localeCompare(
        availableAlcoholSubCategoryText(right),
        undefined,
        { sensitivity: "base" }
      );
    }

    function compareAvailableAlcoholItem(left, right) {
      const leftCategory = normalizeBeverageCategory(left && left.category, left && left.stock_type);
      const rightCategory = normalizeBeverageCategory(right && right.category, right && right.stock_type);
      const categoryCompare = BEVERAGE_CATEGORY_ORDER.indexOf(leftCategory) - BEVERAGE_CATEGORY_ORDER.indexOf(rightCategory);
      if (categoryCompare) {
        return categoryCompare;
      }
      const subCategoryCompare = compareAvailableAlcoholSubCategory(left, right);
      if (subCategoryCompare) {
        return subCategoryCompare;
      }
      const leftPrice = normalizeAvailableAlcoholPrice(left && left.price_per_bottle);
      const rightPrice = normalizeAvailableAlcoholPrice(right && right.price_per_bottle);
      const leftSortPrice = leftPrice === null ? Number.NEGATIVE_INFINITY : leftPrice;
      const rightSortPrice = rightPrice === null ? Number.NEGATIVE_INFINITY : rightPrice;
      if (leftSortPrice !== rightSortPrice) {
        return rightSortPrice - leftSortPrice;
      }
      return formatAvailableAlcoholName(left || {}).localeCompare(formatAvailableAlcoholName(right || {}), undefined, { sensitivity: "base" });
    }

    function sortedAvailableAlcoholItems(items) {
      return (Array.isArray(items) ? items.slice() : []).sort(compareAvailableAlcoholItem);
    }

    function availableAlcoholItems(value) {
      const source = value && typeof value === "object" ? value : {};
      if (Array.isArray(source.sections)) {
        return source.sections.flatMap(section => {
          const sectionValue = section && typeof section === "object" ? section : {};
          const fallbackCategory = sectionValue.category || sectionValue.title || "";
          return (Array.isArray(sectionValue.items) ? sectionValue.items : [])
            .filter(Boolean)
            .map(item => ({
              ...item,
              category: item.category || fallbackCategory,
              stock_type: item.stock_type || sectionValue.stock_type || ""
            }));
        });
      }
      return Array.isArray(source.items) ? source.items.filter(Boolean) : [];
    }

    function groupedAvailableAlcoholSections(value) {
      return groupBeveragesByCategory(sortedAvailableAlcoholItems(availableAlcoholItems(value)))
        .map(section => {
          const subgroups = [];
          const subgroupsByKey = new Map();
          section.items.forEach(item => {
            const title = availableAlcoholSubCategoryText(item);
            const key = availableAlcoholSubCategoryKey(title);
            let subgroup = subgroupsByKey.get(key);
            if (!subgroup) {
              subgroup = { title, items: [] };
              subgroupsByKey.set(key, subgroup);
              subgroups.push(subgroup);
            }
            subgroup.items.push(item);
          });
          return { ...section, subgroups };
        })
        .filter(section => section.subgroups.length);
    }

    function purchasedAlcoholSummaryItems(value) {
      const source = value && typeof value === "object" ? value : {};
      return (Array.isArray(source.items) ? source.items : [])
        .filter(item => item && item.reversed !== true)
        .map(item => ({
          name: typeof item?.name === "string" ? item.name.trim() : "",
          variant: availableAlcoholVariantText(item),
          description: meaningfulAvailableAlcoholDescription(item?.description)
        }))
        .filter(item => item.name || item.variant);
    }

    function meaningfulGuestDrinkVariant(value) {
      const text = value === null || value === undefined
        ? ""
        : String(value).trim().replace(/\s+/g, " ");
      const key = text.toLocaleLowerCase().replace(/[\s.\/-]+/g, "");
      return text && key !== "na" ? text : "";
    }

    function guestDrinkNameKey(value) {
      return String(value || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLocaleLowerCase()
        .replace(/[^a-z0-9]+/g, "");
    }

    function guestDrinkVariantText(item) {
      const source = item && typeof item === "object" ? item : {};
      const candidates = [source.variant, source.expression, source.age];
      const rawVariant = candidates.find(value => value !== null && value !== undefined);
      return meaningfulGuestDrinkVariant(rawVariant);
    }

    function formatGuestDrinkName(item, fallback = "Selection") {
      const source = item && typeof item === "object" ? item : {};
      const name = typeof source.name === "string" && source.name.trim()
        ? source.name.trim()
        : (typeof source.display_name === "string" && source.display_name.trim()
          ? source.display_name.trim()
          : (typeof source.label === "string" && source.label.trim() ? source.label.trim() : fallback));
      if (!name) {
        return fallback;
      }
      const variant = guestDrinkVariantText(source);
      if (!variant) {
        return name;
      }
      const nameKey = guestDrinkNameKey(name);
      const variantKey = guestDrinkNameKey(variant);
      return variantKey && nameKey.includes(variantKey) ? name : `${name} - ${variant}`;
    }

    function renderDrinkListSection(section, options = {}) {
      const { showHeading = true, emptyMessage = "Available onboard upon request." } = options;
      const items = Array.isArray(section.items) ? section.items.filter(Boolean) : [];
      if (section && section.summary_only) {
        const body = items.length
          ? el("div", { class: "drinks-cellar-grid" }, items.map(item => {
            return el("div", { class: "menu-item" }, [
              el("span", { class: "menu-item-name" }, [formatAvailableAlcoholName(item)]),
              item.description ? el("div", { class: "menu-item-desc" }, [item.description]) : null
            ]);
          }))
          : el("div", { class: "menu-note" }, [emptyMessage]);
        return el("div", { class: "menu-section drinks-section" }, [
          showHeading ? el("div", { class: "menu-section-title" }, [section.title || ""]) : null,
          body
        ]);
      }
      const body = items.length
        ? el("div", { class: "drinks-cellar-grid" }, items.map(item => {
          return el("div", { class: "menu-item" }, [
            el("span", { class: "menu-item-name" }, [formatGuestDrinkName(item)]),
            item.description ? el("div", { class: "menu-item-desc" }, [item.description]) : null
          ]);
        }))
        : el("div", { class: "menu-note" }, [emptyMessage]);

      return el("div", { class: "menu-section drinks-section" }, [
        showHeading ? el("div", { class: "menu-section-title" }, [section.title || ""]) : null,
        showHeading && section.description ? el("div", { class: "menu-section-copy" }, [section.description]) : null,
        section.callout ? el("div", { class: "drinks-callout" }, [section.callout]) : null,
        body
      ]);
    }

    function renderAvailableAlcoholSection(section, options = {}) {
      const { showPrices = false } = options;
      if (section && section.summary_only) {
        const items = Array.isArray(section.items) ? section.items.filter(Boolean) : [];
        const body = items.length
          ? el("div", { class: "drinks-cellar-grid" }, items.map(item => {
            return el("div", { class: "menu-item" }, [
              el("span", { class: "menu-item-name" }, [formatAvailableAlcoholName(item)])
            ]);
          }))
          : el("div", { class: "menu-note" }, ["No purchased alcohol yet."]);
        return el("div", { class: "menu-section drinks-section" }, [
          section.title ? el("div", { class: "menu-section-title" }, [section.title]) : null,
          body
        ]);
      }
      const subgroups = Array.isArray(section.subgroups) ? section.subgroups.filter(group => Array.isArray(group.items) && group.items.length) : [];
      const body = subgroups.length
        ? el("div", { class: "available-alcohol-subgroup-list" }, subgroups.map(subgroup => {
          return el("div", { class: "available-alcohol-subgroup" }, [
            el("div", { class: "available-alcohol-subgroup-title" }, [subgroup.title || AVAILABLE_ALCOHOL_SUBCATEGORY_FALLBACK]),
            el("div", { class: "drinks-cellar-grid" }, subgroup.items.map(item => {
              return el("div", { class: "menu-item" }, [
                el("span", { class: "menu-item-name" }, [formatAvailableAlcoholName(item)]),
                item.description ? el("div", { class: "menu-item-desc" }, [item.description]) : null,
                showPrices ? el("div", { class: "menu-item-desc" }, [drinkPriceText(item)]) : null
              ]);
            }))
          ]);
        }))
        : el("div", { class: "menu-note" }, ["Available onboard upon request."]);
      return el("div", { class: "menu-section drinks-section" }, [
        section.title ? el("div", { class: "menu-section-title" }, [section.title]) : null,
        section.description ? el("div", { class: "menu-section-copy" }, [section.description]) : null,
        body
      ]);
    }

    function renderCocktailListSection(section, options = {}) {
      const { showHeading = true, emptyMessage = "Cocktails are available to order onboard.", showDescription = false } = options;
      const items = Array.isArray(section.items) ? section.items.filter(Boolean) : [];
      const body = items.length
        ? el("div", { class: "drinks-cocktail-grid" }, items.map(item => {
          const normalized = normalizeCocktailItem(item);
          return el("div", { class: "menu-item" }, [
            el("span", { class: "menu-item-name" }, [normalized.name || "Cocktail"]),
            showDescription && normalized.description ? el("div", { class: "menu-item-desc" }, [normalized.description]) : null
          ]);
        }))
        : el("div", { class: "menu-note" }, [emptyMessage]);

      return el("div", { class: "menu-section drinks-section" }, [
        showHeading ? el("div", { class: "menu-section-title" }, [section.title || ""]) : null,
        showHeading && section.description ? el("div", { class: "menu-section-copy" }, [section.description]) : null,
        body
      ]);
    }

    function renderDrinksPageGroup(group, index, total) {
      const renderedSections = Array.isArray(group.sections)
        ? group.sections.map((section, sectionIndex) => group.renderSection(section, sectionIndex)).filter(Boolean)
        : [];
      return el("article", { class: "menu-paper charter-page" }, [
        el("div", { class: "menu-heading" }, [group.heading || "Onboard Selection"]),
        el("h2", { class: "menu-title" }, [group.title || "Wine & Drinks"]),
        el("div", { class: "menu-subtitle" }, [group.subtitle || "Selection available onboard"]),
        el("div", { class: "flourish" }, ["\u2736  \u2736  \u2736"]),
        ...renderedSections,
        !renderedSections.length && group.emptyMessage ? el("div", { class: "menu-note" }, [group.emptyMessage]) : null,
        index === total - 1 && group.note ? el("div", { class: "menu-note" }, [group.note]) : null
      ]);
    }

    function renderDrinksTab(charterData) {
      const bundle = charterData && typeof charterData === "object" ? charterData : {};
      const hotelDrinks = bundle.hotel_drinks && typeof bundle.hotel_drinks === "object" ? bundle.hotel_drinks : {};
      const guestDrinks = hotelDrinks.guest_drinks && hasDrinkSections(hotelDrinks.guest_drinks)
        ? hotelDrinks.guest_drinks
        : (bundle.guest_drinks && hasDrinkSections(bundle.guest_drinks) ? bundle.guest_drinks : null);
      const availableAlcohol = hotelDrinks.available_alcohol && typeof hotelDrinks.available_alcohol === "object"
        ? hotelDrinks.available_alcohol
        : {};
      const availableAlcoholSections = groupedAvailableAlcoholSections(availableAlcohol);
      const showAvailableAlcoholPrices = availableAlcoholPricesVisible(availableAlcohol);
      const purchasedAlcoholItems = purchasedAlcoholSummaryItems(hotelDrinks.purchased_alcohol);
      const cocktails = cocktailList(hotelDrinks.cocktails || bundle.cocktails);
      const drinksPages = [
        {
          id: "included-drinks",
          label: "Guest Alcohol",
          copy: "Alcohol requested for this charter",
          heading: "Onboard Cellar",
          title: "Guest Alcohol",
          subtitle: "Alcohol requested for this charter",
          sections: (guestDrinks ? groupedDrinkSections(guestDrinks) : []).concat(
            purchasedAlcoholItems.length
              ? [{ title: "Additional Alcohol Purchased", items: purchasedAlcoholItems, summary_only: true }]
              : []
          ),
          renderSection: section => renderDrinkListSection(section, {
            showHeading: true,
            emptyMessage: section && section.summary_only ? "No purchased alcohol yet." : "Guest alcohol will be added shortly."
          }),
          emptyMessage: "Guest alcohol will be added shortly."
        },
        {
          id: "guest-alcohol",
          label: "Available Alcohol",
          copy: "Alcohol available to purchase",
          heading: "Onboard Cellar",
          title: "Available Alcohol",
          subtitle: "Alcohol available to purchase onboard",
          sections: availableAlcoholSections,
          renderSection: section => renderAvailableAlcoholSection(section, { showPrices: showAvailableAlcoholPrices }),
          emptyMessage: "Available alcohol selections will be added shortly."
        },
        {
          id: "cocktails",
          label: "Cocktails",
          copy: "House cocktails available onboard",
          heading: "Onboard Classics",
          title: "Cocktails",
          subtitle: "House cocktail recipes",
          sections: cocktails.length ? [{ items: cocktails }] : [],
          renderSection: section => renderCocktailListSection(section, {
            showHeading: false,
            emptyMessage: "Cocktails will be added shortly.",
            showDescription: true
          }),
          emptyMessage: "Cocktails will be added shortly."
        }
      ];
      const validPageIds = new Set(drinksPages.map(page => page.id));
      if (!validPageIds.has(currentDrinksSubPageId)) {
        currentDrinksSubPageId = drinksPages[0].id;
      }
      const longestDrinkPageLabelLength = drinksPages.reduce((longest, page) => {
        const label = page && typeof page.label === "string" ? page.label.trim() : "";
        return Math.max(longest, label.length);
      }, 0);
      const panel = el("section", { class: "tab-panel", id: "panel-drinks" });
      const browser = el("div", { class: "charter-stack drinks-browser" });
      const nav = el("nav", {
        class: "drinks-subnav",
        "aria-label": "Drinks sections",
        style: `--drinks-subnav-pill-width: calc(${Math.max(1, longestDrinkPageLabelLength)}ch + 32px);`
      });
      const view = el("div", { class: "drinks-page-view" });
      const buttons = [];
      const pages = [];
      const activateDrinksPage = pageId => {
        currentDrinksSubPageId = validPageIds.has(pageId) ? pageId : drinksPages[0].id;
        buttons.forEach(({ id, button }) => {
          const isActive = id === currentDrinksSubPageId;
          button.classList.toggle("active", isActive);
          button.setAttribute("aria-pressed", isActive ? "true" : "false");
        });
        pages.forEach(({ id, page }) => {
          const isActive = id === currentDrinksSubPageId;
          page.hidden = !isActive;
          page.classList.toggle("active", isActive);
        });
      };

      drinksPages.forEach((group, index) => {
        const button = el("button", {
          class: "drinks-subnav-button",
          type: "button",
          "data-drinks-page": group.id,
          "aria-pressed": "false"
        }, [
          el("span", { class: "drinks-subnav-button-label" }, [group.label])
        ]);
        button.addEventListener("click", () => activateDrinksPage(group.id));
        buttons.push({ id: group.id, button });
        nav.appendChild(button);

        const page = renderDrinksPageGroup(group, index, drinksPages.length);
        page.classList.add("drinks-subpage");
        page.setAttribute("data-drinks-page", group.id);
        page.hidden = true;
        pages.push({ id: group.id, page });
        view.appendChild(page);
      });

      browser.appendChild(nav);
      browser.appendChild(view);
      panel.appendChild(browser);
      activateDrinksPage(currentDrinksSubPageId);
      return panel;
    }

    function renderItineraryTab(data) {
      const itineraryInfo = data && typeof data === "object" ? data : {};
      const welcomeMessage = getDisplayedItineraryWelcomeMessage({ itinerary: itineraryInfo });
      const itineraryDays = getItineraryDays(itineraryInfo);
      const viewState = getGuestItineraryDateViewState(itineraryInfo, itineraryDays);
      const visibleItineraryDays = getGuestVisibleItineraryDays(itineraryDays, viewState);
      const selectedDay = resolveGuestSelectedItineraryDay(visibleItineraryDays, viewState);
      const metaItems = [
        formatDisplayDate(itineraryInfo.start_date),
        itineraryDays.length ? `${itineraryDays.length} day${itineraryDays.length === 1 ? "" : "s"}` : ""
      ].filter(Boolean);

      function renderDaySelector() {
        if (!visibleItineraryDays.length) {
          return null;
        }

        return el("div", { class: "guest-itinerary-day-selector", "aria-label": "Itinerary day selector" }, [
          el("div", { class: "guest-itinerary-day-pill-list" }, visibleItineraryDays.map(day => {
            const isActive = !!(selectedDay && day && day.id === selectedDay.id);
            const dayStatus = guestItineraryDayStatus(day, viewState);
            const pillText = day.day || `Day ${day.dayNumber || ""}`.trim();
            const hoverLabel = guestItineraryDayHoverDateLabel(itineraryInfo, day);
            const button = el("button", {
              class: `guest-itinerary-day-pill${dayStatus ? ` guest-itinerary-day-pill--${dayStatus}` : ""}${isActive ? " active" : ""}`,
              type: "button",
              ...(dayStatus ? { "data-itinerary-day-status": dayStatus } : {}),
              title: hoverLabel,
              "aria-label": `${pillText}: ${hoverLabel.replace(/\n/g, ", ")}`,
              "aria-pressed": isActive ? "true" : "false"
            }, [pillText]);

            button.addEventListener("click", () => {
              if (!day || selectedItineraryDayId === day.id) {
                return;
              }

              selectedItineraryDayId = day.id || "";
              const currentPanel = document.getElementById("panel-itinerary");
              if (currentPanel) {
                replaceNode(currentPanel, renderItineraryTab(itineraryData));
                activateTab("itinerary");
              }
            });

            return button;
          }))
        ]);
      }

      function renderSelectedDay(day) {
        if (!day) {
          return el("div", { class: "menu-note" }, ["Itinerary data will be added shortly."]);
        }

        if (!guestItineraryDayHasContent(day)) {
          return el("div", { class: "guest-itinerary-day-empty" }, ["No itinerary has been added for this day."]);
        }

        return makeList([day], selectedItineraryDay => {
          const visibleStops = getGuestItineraryVisibleStops(selectedItineraryDay);
          const isSimpleSingleStop = !selectedItineraryDay.hasExplicitStops && visibleStops.length === 1 && !selectedItineraryDay.area && !selectedItineraryDay.summary;
          const stop = visibleStops[0] || null;

          if (isSimpleSingleStop && stop) {
            return el("li", { class: "list-item" }, [
              el("div", { class: "itinerary-stop-title" }, [
                el("div", { class: "itinerary-stop-title-main" }, [
                  el("strong", {}, [`${selectedItineraryDay.day}: ${stop.location || stop.label || ""}`])
                ]),
                renderItineraryImageButton(stop)
              ]),
              stop.plan ? el("div", { class: "muted itinerary-stop-plan" }, [stop.plan]) : null
            ]);
          }

          return el("li", { class: "list-item" }, [
            el("div", { class: "itinerary-day-header" }, [
              el("strong", {}, [selectedItineraryDay.day]),
              selectedItineraryDay.area ? el("div", { class: "itinerary-day-area" }, [selectedItineraryDay.area]) : null
            ]),
            selectedItineraryDay.summary ? el("div", { class: "muted itinerary-day-summary" }, [selectedItineraryDay.summary]) : null,
            visibleStops.length
              ? el("ul", { class: "list itinerary-stop-list" }, visibleStops.map((itineraryStop, stopIndex) =>
                el("li", { class: "list-item" }, [
                  renderItineraryStopTitle(itineraryStop, stopIndex, visibleStops.length),
                  itineraryStop.plan ? el("div", { class: "muted itinerary-stop-plan" }, [itineraryStop.plan]) : null
                ])
              ))
              : null
          ]);
        });
      }

      return el("section", { class: "tab-panel", id: "panel-itinerary" }, [
        el("div", { class: "charter-stack" }, [
          el("article", { class: "menu-paper charter-page" }, [
            el("div", { class: "menu-heading" }, ["Voyage Outline"]),
            el("h2", { class: "menu-title" }, ["Itinerary"]),
            el("div", { class: "menu-subtitle" }, ["Current voyage plan"]),
            ...(metaItems.length ? [el("div", { class: "menu-meta-row" }, metaItems.map(item =>
              el("div", { class: "menu-meta-line" }, [item])
            ))] : []),
            welcomeMessage ? el("div", { class: "menu-section-copy itinerary-intro" }, [welcomeMessage]) : null,
            itineraryDays.length ? renderDaySelector() : null,
            el("div", { class: "flourish" }, ["\u2736  \u2736  \u2736"]),
            itineraryDays.length
              ? renderSelectedDay(selectedDay)
              : el("div", { class: "menu-note" }, ["Itinerary data will be added shortly."])
          ])
        ])
      ]);
    }

    function renderVesselTab(data) {
      data = data && typeof data === "object" ? data : {};
      const detailItems = Array.isArray(data.details)
        ? data.details.filter(item => item && (item.label || item.value))
        : [];
      const crewGroups = Array.isArray(data.crew_groups) && data.crew_groups.length
        ? data.crew_groups
        : (Array.isArray(data.crew) && data.crew.length
          ? [{ title: "Crew", members: data.crew }]
          : []);
      const extraSections = Array.isArray(data.sections)
        ? data.sections.filter(section => section && section.title && Array.isArray(section.items) && section.items.length)
        : [];

      function renderVesselSectionContent(section) {
        const title = String(section && section.title ? section.title : "").trim().toLowerCase();
        const items = Array.isArray(section && section.items)
          ? section.items.filter(item => {
              if (typeof item === "string") {
                return !!item.trim();
              }
              return !!(item && item.text);
            })
          : [];

        if (!items.length) {
          return el("p", { class: "muted" }, ["Information will be available shortly."]);
        }

        if (title === "general notes") {
          return el("ul", { class: "vessel-bullet-list" }, items.map(item =>
            el("li", {}, [typeof item === "string" ? item : item.text || ""])
          ));
        }

        if (items.length === 1 && typeof items[0] === "string") {
          return el("p", { class: "muted" }, [items[0]]);
        }

        return makeList(items, item =>
          el("li", { class: "list-item" }, [
            el("div", { class: "muted" }, [typeof item === "string" ? item : (item && item.text ? item.text : "")])
          ])
        );
      }

      function getVesselSectionKicker(section) {
        const title = String(section && section.title ? section.title : "").trim().toLowerCase();
        if (title === "sports equipment") {
          return "On The Water";
        }
        if (title === "waivers and disclaimers") {
          return "Safety";
        }
        return "Onboard Reference";
      }

      if (detailItems.length || crewGroups.length || extraSections.length) {
        const sectionCards = [];

        if (detailItems.length) {
          sectionCards.push(
            el("div", { class: "card brand-watermark span-12" }, [
              el("div", { class: "section-kicker" }, ["Vessel"]),
              el("h3", {}, ["Vessel Details"]),
              el("div", { class: "vessel-detail-grid" }, detailItems.map(item =>
                el("div", { class: "vessel-detail-item" }, [
                  el("div", { class: "vessel-detail-label" }, [item.label || "Field"]),
                  el("div", { class: "vessel-detail-value" }, [item.value || "--"])
                ])
              ))
            ])
          );
        }

        sectionCards.push(
          el("div", { class: "card brand-watermark span-12" }, [
            el("div", { class: "section-kicker" }, ["Crew"]),
            el("h3", {}, ["Onboard Team"]),
            el("p", { class: "muted" }, ["The departments below are here to keep the voyage safe, comfortable, and well supported throughout your time onboard."]),
            ...(crewGroups.length
              ? [el("div", { class: "vessel-crew-grid" }, crewGroups.map(group =>
                el("div", { class: "kpi vessel-crew-group" }, [
                  el("div", { class: "section-kicker" }, [group.title || "Crew"]),
                  makeList(group.members || [], item =>
                    el("li", { class: "list-item" }, [
                      el("strong", {}, [[item.name, item.role].filter(Boolean).join(" - ") || "Crew member"]),
                      ...(item.note ? [el("div", { class: "muted" }, [item.note])] : [])
                    ])
                  )
                ])
              ))]
              : [el("p", { class: "muted" }, ["Crew information is not available."])])
          ])
        );

        extraSections.forEach(section => {
          sectionCards.push(
            el("div", { class: "card brand-watermark span-12" }, [
              el("div", { class: "section-kicker" }, [getVesselSectionKicker(section)]),
              el("h3", {}, [section.title]),
              ...(section.description ? [el("p", { class: "muted" }, [section.description])] : []),
              renderVesselSectionContent(section)
            ])
          );
        });

        return el("section", { class: "tab-panel", id: "panel-vessel" }, [
          el("div", { class: "hero-card" }, [
            el("div", { class: "vessel-hero" }, [
              el("div", { class: "vessel-hero-copy" }, [
                el("div", { class: "section-kicker" }, ["Introduction"]),
                el("h2", {}, ["We welcome you onboard"]),
                el("p", { class: "muted" }, [data.description || "Vessel summary"])
              ]),
              el("div", { class: "vessel-hero-mark" }, [
                el("div", { class: "official-mark" }, [
                  el("img", { src: "images/shoulder-patch.svg", alt: "Official vessel mark", class: "optional-image" })
                ])
              ])
            ])
          ]),
          el("div", { class: "grid" }, sectionCards)
        ]);
      }

      return el("section", { class: "tab-panel", id: "panel-vessel" }, [
        el("div", { class: "vessel-paper" }, [
          el("div", { class: "official-mark" }, [
            el("img", { src: "images/shoulder-patch.svg", alt: "Official vessel mark", class: "optional-image" })
          ]),
          el("div", { class: "section-kicker" }, ["Ship's Information"]),
          el("h2", {}, ["Vessel Information"]),
          el("p", { class: "muted" }, [data.description || "Vessel summary"]),
          el("div", { class: "grid" }, [
            el("div", { class: "span-6" }, [
              el("h3", {}, ["Vessel Details"]),
              makeList(data.details || [], item =>
                el("li", { class: "list-item" }, [
                  el("strong", {}, [item.label || "Field"]),
                  el("div", { class: "muted" }, [item.value || ""])
                ])
              )
            ]),
            el("div", { class: "span-6" }, [
              el("h3", {}, ["Crew"]),
              makeList(data.crew || [], item =>
                el("li", { class: "list-item" }, [
                  el("strong", {}, [`${item.name || ""} · ${item.role || ""}`]),
                  el("div", { class: "muted" }, [item.note || ""])
                ])
              )
            ])
          ])
        ])
      ]);
    }

    function renderSafetyTab() {
      const panel = el("section", { class: "tab-panel", id: "panel-safety" });
      const menu = el("div", { class: "card safety-menu" }, [
        el("div", { class: "section-kicker" }, ["Emergency Reference"]),
        el("h3", {}, ["Safety Documents"]),
        el("p", { class: "muted" }, ["Select a document to preview it inline."])
      ]);
      const viewer = el("div", { class: "card safety-viewer" }, [
        el("div", { class: "section-kicker" }, ["Selected Document"])
      ]);
      const title = el("h2", { class: "safety-title" }, ["Safety Briefing"]);
      const frame = el("iframe", {
        class: "safety-pdf-frame",
        id: "safetyPdfFrame",
        src: getSafetyDocumentViewerSrc("plans/safety_brief.pdf"),
        title: "Safety Briefing PDF",
        loading: "lazy"
      });
      const layout = el("div", { class: "safety-layout" }, [menu, viewer]);
      const buttons = [];
      let activeDocumentId = SAFETY_DOCUMENTS[0] ? SAFETY_DOCUMENTS[0].id : "";

      function syncSafetyViewer() {
        const activeDocument = getSafetyDocumentById(activeDocumentId);
        if (!activeDocument) {
          title.textContent = "Safety Document";
          frame.removeAttribute("src");
          frame.title = "Safety PDF";
        } else {
          title.textContent = activeDocument.label;
          frame.src = getSafetyDocumentViewerSrc(activeDocument.file);
          frame.title = `${activeDocument.label} PDF`;
        }

        buttons.forEach(({ button, documentEntry }) => {
          const isActive = !!activeDocument && documentEntry.id === activeDocument.id;
          button.classList.toggle("active", isActive);
          button.setAttribute("aria-pressed", isActive ? "true" : "false");
        });
      }

      SAFETY_DOCUMENTS.forEach(documentEntry => {
        const button = el("button", {
          class: "safety-button",
          type: "button"
        }, [documentEntry.label]);
        button.setAttribute("aria-pressed", "false");
        button.addEventListener("click", () => {
          activeDocumentId = documentEntry.id;
          syncSafetyViewer();
        });
        buttons.push({ button, documentEntry });
        menu.appendChild(button);
      });

      viewer.appendChild(title);
      viewer.appendChild(frame);
      panel.appendChild(layout);
      syncSafetyViewer();
      return panel;
    }

    document.addEventListener("error", (event) => {
      const target = event.target;
      if (target && target.classList && target.classList.contains("optional-image")) {
        target.style.display = "none";
      }
    }, true);

    document.addEventListener("keydown", event => {
      const viewer = document.getElementById("itineraryImageViewer");
      if (!viewer || viewer.hidden) {
        return;
      }

      if (event.key === "Escape") {
        event.preventDefault();
        closeItineraryImageViewer();
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        showItineraryImageAt(-1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        showItineraryImageAt(1);
      }
    });

    function applySavedCharterBundle(charterBundle) {
      const charterData = charterBundle && typeof charterBundle === "object" ? charterBundle : {};
      const settings = charterData.settings && typeof charterData.settings === "object" ? charterData.settings : DEFAULT_SETTINGS_DATA;
      const navigation = charterData.navigation && typeof charterData.navigation === "object" ? charterData.navigation : DEFAULT_NAVIGATION_DATA;
      const itinerary = charterData.itinerary && typeof charterData.itinerary === "object" ? charterData.itinerary : {};

      siteData = settings;
      charterBundleData = charterData;
      charterSitesData = charterData.sites && typeof charterData.sites === "object" ? charterData.sites : { sites: [] };
      navigationData = navigation;
      itineraryData = itinerary;

      const siteTitle = document.getElementById("siteTitle");
      const siteSubtitle = document.getElementById("siteSubtitle");
      if (siteTitle) {
        siteTitle.textContent = settings.site_title || "Onboard Portal";
      }
      if (siteSubtitle) {
        siteSubtitle.textContent = settings.site_subtitle || "Offline-first onboard interface";
      }

      return {
        charterData,
        settings,
        navigation,
        itinerary,
        menus: charterData.menus && typeof charterData.menus === "object" ? charterData.menus : {},
        drinks: charterData.drinks && typeof charterData.drinks === "object" ? charterData.drinks : {},
        vessel: charterData.vessel && typeof charterData.vessel === "object" ? charterData.vessel : {}
      };
    }

    function syncObsFeedAfterSavedSettingsChange(previousEnabled, previousConfigSignature) {
      const enabled = isObsFeedEnabled(getIdleScreensaverSettings());
      const configSignature = getObsFeedConfigSignature(navigationData || {});
      const becameEnabled = previousEnabled === false && enabled;
      const becameDisabled = previousEnabled !== false && !enabled;
      const configChanged = previousConfigSignature !== configSignature;

      obsFeedState.lastEnabled = enabled;
      if (obsFeedState.lastLoadedEnabled !== enabled) {
        logObsFeed("info", `OBS enabled setting loaded: ${enabled ? "enabled" : "disabled"}.`);
        obsFeedState.lastLoadedEnabled = enabled;
      }

      if (!enabled) {
        stopObsFeed();
        clearIdleObsFeedTimers();
        finishIdlePhaseTransition();
        deactivateIdleObsFeed();
        resumeIdleVisualCycle();
        return;
      }

      if (currentTabId === "navigation") {
        startObsFeed({
          forceReload: becameEnabled || configChanged,
          resetFailureCycle: becameEnabled || configChanged
        });
      }

      if (idleState.active && (becameEnabled || becameDisabled || configChanged)) {
        deactivateIdleObsFeed();
        if (becameEnabled) {
          showIdleObsFeed();
        } else {
          resumeIdleVisualCycle();
        }
      } else if (idleState.active) {
        resumeIdleVisualCycle();
      }
    }

    async function refreshSavedCharterBundle(options = {}) {
      if (charterRefreshPromise) {
        return charterRefreshPromise;
      }

      charterRefreshPromise = (async () => {
        const previousEnabled = isObsFeedEnabled(getIdleScreensaverSettings());
        const previousConfigSignature = getObsFeedConfigSignature(navigationData || {});
        const bundle = await loadJSON(CHARTER_API_URL);

        applySavedCharterBundle(bundle);
        syncPlannedRouteLayers();
        syncNmeaUi();
        syncDynamicTabsAndPanels();
        syncObsFeedAfterSavedSettingsChange(previousEnabled, previousConfigSignature);
        refreshPlannedRouteData().catch(() => {});

        return bundle;
      })().catch(error => {
        if (!options.silent) {
          console.error(error);
        }
        return null;
      }).finally(() => {
        charterRefreshPromise = null;
      });

      return charterRefreshPromise;
    }

    function startCharterRefreshLoop() {
      if (charterRefreshTimer) {
        window.clearInterval(charterRefreshTimer);
      }

      charterRefreshTimer = window.setInterval(() => {
        if (!document.hidden) {
          refreshSavedCharterBundle({ silent: true }).catch(() => {});
        }
      }, CHARTER_REFRESH_INTERVAL_MS);
    }

    async function render() {
      const charterBundle = await loadCharterBundle();
      const { charterData, navigation, itinerary, menus, vessel } = applySavedCharterBundle(charterBundle);

      renderTabs();

      const content = document.getElementById("content");
      content.innerHTML = "";
      content.appendChild(renderNavigationTab(navigation));
      content.appendChild(renderItineraryTab(itinerary));
      content.appendChild(renderMenuTab(menus));
      content.appendChild(renderDrinksTab(charterData));
      content.appendChild(renderVesselTab(vessel));
      content.appendChild(renderSafetyTab());
      syncWeatherPanel();
      syncNmeaUi();
      syncSiteFooterVisibility();

      const followButton = document.getElementById("navigationMapFollowButton");
      if (followButton) {
        followButton.addEventListener("click", () => {
          navigationMapState.followVessel = true;
          syncNavigationMapFollowButton();
          syncNavigationMap();
        });
      }

      const initialHash = location.hash.replace("#", "");
      const validTabIds = getRenderedTabs().map(tab => tab.id);
      activateTab(validTabIds.includes(initialHash) ? initialHash : validTabIds[0]);
      initializeIdleScreensaver();
      await refreshPlannedRouteData().catch(() => {});
      await refreshNavigationTrackData().catch(() => {});
      startNavigationTrackRefreshLoop();
      await refreshNmeaData();
      startNmeaRefreshLoop();
      await refreshWeather({ force: true });
      startWeatherRefreshLoop();
      startCharterRefreshLoop();
    }

    renderTabs();

    window.addEventListener("scroll", syncSiteFooterVisibility, { passive: true });
    window.addEventListener("resize", syncSiteFooterVisibility);

    window.addEventListener("online", () => {
      refreshSavedCharterBundle({ silent: true }).catch(() => {});
      refreshWeather({ force: true }).catch(() => {});
    });

    window.addEventListener("offline", () => {
      refreshWeather().catch(() => {});
    });

    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) {
        refreshSavedCharterBundle({ silent: true }).catch(() => {});
      }
    });

    initializeInstallPrompt();
    registerGuestServiceWorker();

    loadSiteFooterVersion();

    render().catch(err => {
      document.getElementById("content").innerHTML = `
        <div class="hero-card">
          <h2>Loading error</h2>
          <p class="muted">${err.message}</p>
          <p class="footer-note">Make sure you are serving this site from a local web server rather than opening the file directly.</p>
        </div>
      `;
    });
