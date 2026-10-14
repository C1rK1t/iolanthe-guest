# Trip Mode: Guest and Crew Sites Implementation Plan

> **Amended after the build (2026-10-14).** Two changes were made in the final fix wave (guest 5900f96, crew cf72c8a), to
> match the binding ruling already applied to the server and the admin. The code blocks below now show the shipped
> helper; the scanner blocks in Tasks 2 and 6 still show the first version.
> 1. **The helper never throws.** An unknown key logs one `console.warn` per key and returns the key text (no vars);
>    `applyStatic` keeps going past an unknown `data-w` key. A missing map or key still falls back to the built-in
>    charter copy. The keys tests still fail on an unknown or unused key, so a typo is caught before release.
> 2. **The scanner is stricter** (ported from iolanthe-admin `test/wording-scan.js`): it catches a word joined by a slash
>    or hyphen ("Client/Agent", "Charter-specific"), attributes written `\s*=\s*` with double, single or no quotes, and
>    `data-label` / `data-title`; a lowercase `word=` (a query parameter such as `charter=`) is exempt. The
>    shipped `test/visible-words.js` in each repo is the reference.

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Every visible commercial word in the guest site (`iolanthe-guest`) and the crew site (`iolanthe-crew`) is read from the server's wording map through a small per-site helper, so a vessel in `trip` mode shows "Trip" where Iolanthe (charter mode) shows "Charter", and charter mode looks exactly as it does today.

**Architecture:** Each site gets its own copy of one small UMD helper, `wording.js`, with the same semantics as the cross-repo contract: `w(key, { plural, lower, vars })`, a built-in frozen copy of the charter column of just the keys that site uses, `setWording(map)` and `applyStatic(root)`. A guard test per site scans the site's own files for visible commercial words typed in code and carries an allow-list that starts with the unconverted files and ends empty. The guest and crew sites read the `wording` the server adds to the `GET /api/charter` payload (the one endpoint both sites already load). Older and newer servers need no coordination: no `wording` means the built-in charter words.

**Tech Stack:** Plain HTML/CSS/JS with no build step and no dependencies (`node --test` on Node 25 for the tests, no npm install). Service worker precache bumped per site.

**Spec:** `iolanthe-admin/docs/superpowers/specs/2026-10-14-trip-mode-design.md` (spec T) sections 4 and 5, batch G (the guest and crew halves). Local path: `S:/Users/David/OneDrive/Maker Space/GitHub/worktrees/spec-t/iolanthe-admin/docs/superpowers/specs/2026-10-14-trip-mode-design.md`. The server's own messages and `wording.json` are in the server plan (spec T, server half); this plan only consumes the payload and lists the keys the server must add ("Keys this plan needs", last section).

## Global Constraints

The binding cross-repo contract (copied verbatim; all four plans implement exactly this):

````markdown
# Spec T shared contract: the wording map (server = admin = guest = crew)

All plans MUST implement exactly this.

## The mode
- `settings.json` `vessel_mode`: "charter" | "trip". Missing or any other value -> "charter" (server logs once for a
  non-empty unknown value). Read live on each request.

## wording.json (server repo root: `iolanthe-server/wording.json`)
```
{ "<key>": { "charter": ["<singular>", "<plural>"], "trip": ["<singular>", "<plural>"] }, ... }
```
- Keys: lower snake_case `[a-z0-9_]+`. Every key has both modes, each exactly 2 non-blank strings (a word with no plural
  repeats its singular). Placeholders `{name}` (`{[a-z_]+}`) must be the same set in all four strings of a key.
- STARTING keys (spec T §3.1, exact strings):
  unit Charter/Charters | Trip/Trips; department Charter Admin/Charter Admin | Trip Admin/Trip Admin;
  active_unit Active Charter/Active Charters | Active Trip/Active Trips;
  documents Charter Pack/Charter Packs | Trip Documents/Trip Documents;
  kind_proposal Charter Proposal/Charter Proposals | Trip Plan/Trip Plans;
  kind_brief Charter Brief/Charter Briefs | Trip Brief/Trip Briefs;
  proposal_footer "Proposal — subject to change" (both forms) | "Plan — subject to change" (both forms);
  ledger APA/APA | Budget/Budget; statement APA Statement/APA Statements | Budget Statement/Budget Statements;
  fee Charter fee/Charter fees | Trip budget/Trip budgets; percent APA %/APA % | Budget %/Budget %;
  received APA received/APA received | Funds received/Funds received; client Client/Clients | Owner/Owners;
  agent Agent/Agents | Manager/Managers.
- Each site plan ADDS the keys its screens need (sentence keys such as `unit_completed`, `unit_day` with `{n}`), and
  lists them in a table "Keys this plan needs" with all four strings. The charter strings MUST be exactly today's text
  (so charter mode is unchanged). The server plan then writes wording.json = starting keys + the union of those tables.

## Delivery (field name `wording`, the RESOLVED column only)
`wording: { "<key>": ["<singular>", "<plural>"], ... }` for the vessel's mode, plus `vessel_mode: "charter"|"trip"`:
- admin: `GET /api/admin/bootstrap` -> `settings.wording`, `settings.vessel_mode`
- guest: `GET /api/charter` (and the preview variant) -> top-level `wording`, `vessel_mode`
- crew: whatever payload the crew site loads (the crew plan names it) -> top-level `wording`, `vessel_mode`
Server messages that users see read the same resolved map.

## The helper (one per site, same semantics)
`w(key, opts)` with `opts = { plural?: boolean, lower?: boolean, vars?: { name: value } }`:
- picks `[0]` or `[1]` (plural); `lower` lower-cases the first letter of each word EXCEPT words that are all capitals
  (e.g. "APA", "TRIP" stay); `vars` replaces `{name}` with String(value).
- Source: the loaded `wording`; a missing map or missing key -> the site's BUILT-IN charter copy for that key (a frozen
  object holding exactly the charter column of every key the site uses); never returns "" or the raw key.
- Static HTML: `data-w="<key>"` (textContent), optional `data-w-plural`, `data-w-lower`, and
  `data-w-attr="alt|title|aria-label|placeholder"` (sets that attribute instead). Applied once after the start-up data
  arrives, and again after any re-render of static parts.

## The guard test (each site)
Fails when a whole word Charter/Charters/APA/Client/Clients/Agent/Agents/Proposal/Proposals (case-insensitive) appears in
a string literal (quotes or template-literal text) or HTML text/visible attribute (alt, title, aria-label, placeholder,
value of buttons) in the site's own source files, EXCEPT: the built-in charter copy and the wording module itself;
identifiers; object keys; data-* attribute values; CSS classes/ids; URLs/paths (`/api/...charter...`, `charter.json`,
`charter-*.js`); comments; test files; and files on the ALLOW-LIST (not yet converted). The allow-list only shrinks.
````

Site and repo constraints for this plan:

- **Only what people see changes (T-D2).** Internal names stay: `charter.json`, `/api/charter`, `charter_day`, ids such as `charterName`, CSS classes such as `charter-stack` and `topbar-charter`, `data-tab="charter"`, JSON keys, file names. Crew-typed text (charter names, notes, menus, the vessel record, settings titles) is never touched.
- **Charter mode is byte-for-byte today's text.** Every built-in string below is the exact current literal. Do not "fix" capitalisation, punctuation or spacing in them.
- **No build step, no npm, no dependencies** in both repos. Relative URLs only. Never cache `/api/*` in the service worker. Do not add a `package.json`.
- **Line endings.** `iolanthe-guest` files are CRLF in the working tree (git `core.autocrlf=true`, index LF): every guest file you create or edit must end up CRLF; the edit scripts in this plan preserve the endings of the file they edit, and for a new guest file written with the Write tool run `node -e "const f=process.argv[1],fs=require('fs');fs.writeFileSync(f,fs.readFileSync(f,'utf8').replace(/\r?\n/g,'\r\n'))" <file>` once. `iolanthe-crew` files are LF: keep them LF. Never mix endings in one file (check with `file <path>`).
- **Edit scripts.** The Edit tool struggles with multi-line matches in CRLF files, so the edits to existing guest files are node scripts (below). Save each script **outside the repo** (for example in the session scratchpad), then run it from the repo root: `node <script>`. Each script refuses to run if a target text is missing or appears twice.
- **Paths used below.** `<guest worktree>` = `S:/Users/David/OneDrive/Maker Space/GitHub/worktrees/trip-sites/iolanthe-guest` and `<crew worktree>` = `S:/Users/David/OneDrive/Maker Space/GitHub/worktrees/trip-sites/iolanthe-crew` (both created in Tasks 1 and 5). Substitute them literally in the commands.
- **Running the tests:** `cd "<repo>" || exit 1; node --test test/*.test.js`. The shell's working directory resets between calls, so always `cd` first. Baselines on `origin/main` today: guest 25 tests, crew none.
- **Release tag and cache bump** (guest): `index.html` and `sw.js` carry the same `?v=guest-b-N` tag on every local CSS/JS file (today `guest-b-6`) and `STATIC_CACHE_NAME` is `iolanthe-onboard-static-vN` (today `v10`); a new file is added to both and both numbers go up by one (the script reads the current numbers, so a newer `origin/main` is fine). Crew: `CACHE` in `sw.js` (`iolanthe-crew-v2` today) goes to `v3` and `/crew/wording.js` is added to `STATIC`.
- **Commits:** conventional (`feat:`, `test:`, `docs:`), each ending with the attribution line the session's rules require. Do not push, open PRs or merge: the controller does that after review (spec T section 8: server first, then these two sites, last).
- **Both sites must work against the old server.** `wording` and `vessel_mode` are optional in every payload; nothing may throw or show a raw key or blank when they are missing.

## Review Focus

These are the failure modes the spec implies that no per-literal test would catch, most likely first. Each has its test in the task named.

1. **Older server, newer server, or a failed load (no `wording`).** The site must show today's charter words and must not throw. Pinned by Task 1 (`w: no wording loaded`, `setWording: a non-object keeps the words already loaded`) and Task 5 for the crew.
2. **A damaged wording entry from the server** (blank string, one-element array, a string where an array belongs, a key the site does not know). Per key, fall back to the built-in charter text; never blank, never the raw key. Pinned by Task 1 (`a missing key or a broken entry`) and Task 5.
3. **A refused or failed preview must not reset the language.** In a `trip` preview, the 404 "charter deleted" banner must say the trip word, and the guest's fallback bundle (no `wording`) must not flip the page back to charter words. The guest keeps the last words it loaded (Task 1: `setWording: a non-object keeps...`), and a 404 JSON body may carry the words (Task 3 hook-up; Task 4 `bannerText: the 404 text is the vessel's word`).
4. **Variable values with `$&`, `$1` or `{name}` inside** (a stop or charter name is user text). Values go in literally, once, never re-expanded. Pinned by Task 1 and Task 5 (`var values go in literally`).
5. **The crew "no watch schedule" note appears before or after the wording arrives** (`fetchWatches` and `fetchCharter` run in parallel). The note is built with `w()` and carries `data-w`, so either order ends right. Pinned by Task 7 (`the empty-watches note carries data-w and is built with w()`), and by the live check (Task 8).

Also guarded structurally: the page loads `wording.js` before the files that use it, with the same `?v=` tag, and the service worker precaches it (Task 3, plus the existing `obs-feed-removed.test.js`); an unknown or unused key fails a test (Task 4 and Task 7); the guard's allow-list may only shrink (Tasks 2, 4, 6, 7).

## What the survey found (2026-10-14, `origin/main` of both repos)

Search used on every file of both repos: `grep -nEi '\b(charters?|apa|clients?|agents?|proposals?)\b'` over `*.js`, `*.html`, `*.json`, `*.webmanifest`, `*.css` (no CSS `content:` hit), plus the scanner in Task 2 (which ignores comments, identifiers, class names, URLs, keys). The scanner and the grep agree.

**Guest: seven visible literals in two files, nothing in `index.html`, `itinerary-days.js`, `sw.js`, `moon-phase.js`, manifests.**

| File and line | Exact current text | Key |
|---|---|---|
| `guest.js` ~2662 (Navigation map status) | `` `Shared onboard track shows ${trackPointCount} logged point${trackPointCount === 1 ? "" : "s"} for this charter and retains data for the charter plus ${retentionDays} extra day${retentionDays === 1 ? "" : "s"}.` `` | `track_note` with `{points}`, `{extra}` |
| `guest.js` ~5069 (idle screen, finished itinerary), label | `"Charter"` | `unit` |
| `guest.js` ~5069, title | `"Charter completed"` | `unit_completed_title` |
| `guest.js` ~5069, copy | `"This charter has been completed."` | `unit_completed` |
| `guest.js` ~5472 (menu day label) | `` `CHARTER DAY ${Math.round(Number(selectedMenu.charter_day))}` `` | `unit_day` with `{n}` |
| `guest.js` ~6315 (Guest Alcohol page, `copy`) | `"Alcohol requested for this charter"` | `drinks_requested` |
| `guest.js` ~6318 (same page, `subtitle`) | `"Alcohol requested for this charter"` | `drinks_requested` |
| `preview-mode.js` ~17 (refused-preview banner, status 404) | `"CHARTER NOT FOUND"` | `unit_not_found` |

(The other `charter` hits in the guest repo are comments, identifiers such as `charterData` and `charter_day`, the `charter` object key at `guest.js` ~2379, the classes `charter-stack` and `charter-page`, the `charter=` query parameter and `/api/charter`; none is visible text. `PREVIEW · LOG IN TO THE ADMIN AGAIN` has no commercial word.)

**Crew: three visible literals in two files.**

| File and line | Exact current text | Key |
|---|---|---|
| `index.html` ~25 (tab button text) | `Charter` (`<button ... data-tab="charter">Charter</button>`) | `unit` via `data-w` |
| `index.html` ~108 (card heading) | `Active Charter` | `active_unit` via `data-w` |
| `crew.js` ~219 (detail row label) | `'Charter'` in `['Charter',   d.name]` | `unit` |
| `crew.js` ~258 (empty watch list) | `'<p class="watch-empty">No watch schedule set for this charter.</p>'` | `watches_none` |

(Not visible and left alone: `id="charterName"`, `class="topbar-charter"`, `id="tab-charter"`, `id="charterCard"`, `id="charterDetail"`, `class="charter-detail"`, `charter-field*` classes, `data-tab="charter"`, `fetch('/api/charter')`, `fetch('/api/charter/watches')`, comments. The value `d.name` is crew-typed.)

**The crew site's endpoint:** `fetchCharter()` in `crew.js` loads `GET /api/charter` (the same endpoint as the guest site). The server plan adds top-level `wording` and `vessel_mode` to that one payload and both sites are served. The crew page reads it once per page load.

## File Structure

Guest (`iolanthe-guest`, worktree off `origin/main`):

- Create `wording.js`: the helper (UMD; browser global `IolantheWording`, node `require`). One responsibility: resolve words.
- Create `test/wording.test.js`, `test/wording-wiring.test.js`, `test/wording-keys.test.js`: helper, wiring, keys.
- Create `test/visible-words.js` (the scanner, no tests inside) and `test/visible-words.test.js` (scanner fixtures), `test/trip-guard.test.js` (the guard over the real files).
- Modify `index.html` (script tag, tag bump), `sw.js` (precache, bump), `guest.js` (helper, hook-up, 5 conversions), `preview-mode.js` (1 conversion), `test/replace-node-children.test.js` (sandbox loads `wording.js`), `test/preview-mode.test.js` (one new test), `CLAUDE.md`, `README-dev.md`.

Crew (`iolanthe-crew`, new worktree off `origin/main`; it has no tests today):

- Create `wording.js`, `test/wording.test.js`, `test/wording-wiring.test.js`, `test/visible-words.js`, `test/visible-words.test.js`, `test/trip-guard.test.js`.
- Modify `index.html`, `crew.js`, `sw.js`, `CLAUDE.md`.

The scanner and the helper are deliberately copied, not shared: the sites are separate repos with no common package.

---

### Task 1: Guest wording helper

**Files:**
- Create: `test/wording.test.js`, `wording.js`

**Interfaces:**
- Consumes: nothing.
- Produces (browser global `window.IolantheWording`, node `require("./wording.js")`): `BUILT_IN` (frozen `{ key: [singular, plural] }`, the charter column of 7 keys), `createWording(builtIn)` returning `{ w, setWording, reset, applyStatic }`, `lowerWords(text)`, and the default instance's `w`, `setWording`, `reset`, `applyStatic`. `w(key, { plural?: boolean, lower?: boolean, vars?: object }) -> string` (never throws: a key in neither the loaded words nor `BUILT_IN` is a programming error the keys test catches, so `w` warns once per key with `console.warn` and returns the key text). `setWording(map)` ignores anything that is not a plain object (it keeps the words already loaded). `applyStatic(root)` fills `[data-w]` elements.

- [ ] **Step 1: Create the worktree.** From the main checkout, with the plan branch left alone:

```bash
cd "S:/Users/David/OneDrive/Maker Space/GitHub/portal/iolanthe-guest" || exit 1
git fetch origin && mkdir -p "../../worktrees/trip-sites"
git worktree add "../../worktrees/trip-sites/iolanthe-guest" -b feat/trip-mode-sites origin/main
cd "../../worktrees/trip-sites/iolanthe-guest" || exit 1
node --test test/*.test.js 2>&1 | grep -E '^ℹ (tests|pass|fail)'
```

Expected: `tests 25`, `pass 25`, `fail 0`. All later guest tasks work in `S:/Users/David/OneDrive/Maker Space/GitHub/worktrees/trip-sites/iolanthe-guest`.

- [ ] **Step 2: Write the failing test** `test/wording.test.js` (the `TRIP` object is the trip column from "Keys this plan needs"; keep the two in step).

```js
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

// Runs fn with console.warn stubbed; returns the warnings it collected.
function collectWarnings(fn) {
  const warnings = [];
  const original = console.warn;
  console.warn = message => warnings.push(message);
  try {
    fn();
  } finally {
    console.warn = original;
  }
  return warnings;
}

test("w: an unknown key warns once and returns the key text", () => {
  const { w } = createWording(BUILT_IN);
  const warnings = collectWarnings(() => {
    assert.equal(w("no_such_key"), "no_such_key");
    assert.equal(w("no_such_key", { plural: true, vars: { n: 1 } }), "no_such_key");
    assert.equal(w("other_missing_key"), "other_missing_key");
  });
  assert.equal(warnings.length, 2, "one warning per key, not per call");
  assert.match(warnings[0], /no word "no_such_key"/);
  assert.match(warnings[1], /no word "other_missing_key"/);
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
```

- [ ] **Step 3: Run it to see it fail.**

Run: `cd "<guest worktree>" || exit 1; node --test test/wording.test.js`
Expected: FAIL with `Cannot find module '../wording.js'`.

- [ ] **Step 4: Write `wording.js`.**

```js
(function (root, factory) {
  const mod = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = mod;
  } else {
    root.IolantheWording = mod;
  }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  // Spec T (Trip mode): the guest site's wording helper. The server sends `wording` ({ key: [singular, plural] }, the
  // vessel's mode already resolved) in the /api/charter payload. A missing map or key falls back to BUILT_IN, the charter
  // column of every key this site uses, so charter mode looks exactly as before and nothing shows a raw key or a blank.
  // The same semantics are copied into iolanthe-crew/wording.js (separate repos, separate copies).

  const BUILT_IN = Object.freeze({
    unit: Object.freeze(["Charter", "Charters"]),
    unit_day: Object.freeze(["CHARTER DAY {n}", "CHARTER DAY {n}"]),
    unit_completed_title: Object.freeze(["Charter completed", "Charter completed"]),
    unit_completed: Object.freeze(["This charter has been completed.", "This charter has been completed."]),
    unit_not_found: Object.freeze(["CHARTER NOT FOUND", "CHARTER NOT FOUND"]),
    drinks_requested: Object.freeze(["Alcohol requested for this charter", "Alcohol requested for this charter"]),
    track_note: Object.freeze([
      "Shared onboard track shows {points} for this charter and retains data for the charter plus {extra}.",
      "Shared onboard track shows {points} for this charter and retains data for the charter plus {extra}."
    ])
  });

  const STATIC_ATTRS = ["alt", "title", "aria-label", "placeholder"];

  // Lower-cases the first letter of each word except all-capital words ("APA", "TRIP" stay).
  function lowerWords(text) {
    return text.replace(/\S+/g, word => (/[A-Z]/.test(word) && word === word.toUpperCase()
      ? word
      : word.charAt(0).toLowerCase() + word.slice(1)));
  }

  function isForm(value) {
    return typeof value === "string" && value.trim() !== "";
  }

  function createWording(builtIn) {
    let loaded = null;
    const warned = new Set();

    function entryFor(key) {
      const fromServer = loaded && Object.prototype.hasOwnProperty.call(loaded, key) ? loaded[key] : null;
      if (Array.isArray(fromServer) && fromServer.length >= 2 && isForm(fromServer[0]) && isForm(fromServer[1])) {
        return fromServer;
      }
      if (Object.prototype.hasOwnProperty.call(builtIn, key)) {
        return builtIn[key];
      }
      return null;
    }

    // Never throws: a key in neither the loaded words nor builtIn is a programming mistake (the keys test catches it),
    // but one wrong key must not blank a page, so it warns once per key and returns the key text.
    // w("unit_day", { vars: { n: 3 } }) -> "TRIP DAY 3"; w("unit", { plural: true, lower: true }) -> "trips".
    function w(key, opts) {
      const options = opts || {};
      const entry = entryFor(key);
      if (entry === null) {
        if (!warned.has(key)) {
          warned.add(key);
          console.warn(`wording.js: no word "${key}"`);
        }
        return String(key);
      }
      let text = entry[options.plural ? 1 : 0];
      if (options.lower) {
        text = lowerWords(text);
      }
      const vars = options.vars || {};
      return text.replace(/\{([a-z_]+)\}/g, (match, name) => (
        Object.prototype.hasOwnProperty.call(vars, name) ? String(vars[name]) : match
      ));
    }

    // A non-object (an older server sent no `wording`, or a fallback bundle) keeps the last words that were loaded.
    function setWording(map) {
      if (map && typeof map === "object" && !Array.isArray(map)) {
        loaded = map;
      }
    }

    function reset() {
      loaded = null;
    }

    // data-w="<key>" [data-w-plural] [data-w-lower] [data-w-attr="alt|title|aria-label|placeholder"]
    function applyStatic(scope) {
      if (!scope || typeof scope.querySelectorAll !== "function") {
        return;
      }
      scope.querySelectorAll("[data-w]").forEach(node => {
        const text = w(node.getAttribute("data-w"), {
          plural: node.hasAttribute("data-w-plural"),
          lower: node.hasAttribute("data-w-lower")
        });
        const attr = node.getAttribute("data-w-attr");
        if (attr && STATIC_ATTRS.includes(attr)) {
          node.setAttribute(attr, text);
        } else {
          node.textContent = text;
        }
      });
    }

    return { w, setWording, reset, applyStatic };
  }

  return Object.assign({ BUILT_IN, createWording, lowerWords }, createWording(BUILT_IN));
});
```

- [ ] **Step 5: Run the test to see it pass.**

Run: `cd "<guest worktree>" || exit 1; node --test test/wording.test.js`
Expected: `pass 11`, `fail 0`.

- [ ] **Step 6: Line endings and commit.** Convert both new files to CRLF with the one-liner from Global Constraints, check `file wording.js test/wording.test.js` says CRLF, then:

```bash
git add wording.js test/wording.test.js
git commit -m "feat: add the wording helper for spec T (Trip mode)"
```

(end the message with the attribution line)

---

### Task 2: Guest guard test (scanner, fixtures, allow-list)

**Files:**
- Create: `test/visible-words.js`, `test/visible-words.test.js`, `test/trip-guard.test.js`

**Interfaces:**
- Consumes: nothing from Task 1 except that `wording.js` is excluded from the scan by name.
- Produces: `require("./visible-words.js")` exports `{ scanJs(source) -> [{ line, text }], scanHtml(source) -> [{ line, text }], WORD, isInternalLiteral }`. `test/trip-guard.test.js` holds `ALLOW_LIST` (starts `["guest.js", "preview-mode.js"]`, the only two files with visible words), shrunk to `[]` in Task 4.

What the scan counts as visible: the text of a string or template literal in a `.js` file, and element text plus `alt`, `title`, `aria-label`, `placeholder`, `value` attributes in an `.html` file. It ignores comments, regex literals, object keys, `data-*` attributes, URLs and paths, file names, single lower-case tokens (`"charter"` as a query-parameter name), and any word glued to `-`, `_`, `/`, `.`, `#`, `=` or a letter (class names, identifiers, `charter=`). It is not a JavaScript parser; the fixtures in `visible-words.test.js` pin what it does.

- [ ] **Step 1: Write the failing fixture test** `test/visible-words.test.js`.

```js
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const { scanJs, scanHtml } = require("./visible-words.js");

const words = hits => hits.map(hit => hit.text);

test("scanJs: flags visible words in string and template literals, with the line", () => {
  const hits = scanJs('const a = 1;\nconst b = "This charter has been completed.";\nconst c = `CHARTER DAY ${n}`;\nf(\'Client\');');
  assert.deepEqual(hits.map(hit => hit.line), [2, 3, 4]);
  assert.deepEqual(words(hits), ["This charter has been completed.", "CHARTER DAY", "Client"]);
});

test("scanJs: ignores comments, identifiers, object keys, classes, URLs, file names and single lower-case tokens", () => {
  const source = [
    "// the charter is here, APA too",
    "/* Agent Proposal Client */",
    "const charterName = charter.client_agent;",
    'const o = { charter: 1, "charter": 2, "proposal-x": 3 };',
    'el("div", { class: "charter-stack" });',
    'fetch("/api/charter"); fetch("/api/charter/watches");',
    'const url = "https://example.com/charter";',
    'read("charter.json"); read("charter-pack.js?v=1");',
    'params.get("charter");',
    "const q = `charter=${id}&preview=1`;",
    "const re = /\"Charter\"/g;"
  ].join("\n");
  assert.deepEqual(scanJs(source), []);
});

test("scanJs: a template literal with nested ${} still reads its text parts", () => {
  const hits = scanJs("const t = `${a ? `x ${b}` : ''} for this charter ${c}`;");
  assert.deepEqual(words(hits), ["for this charter"]);
});

test("scanJs: whole words only", () => {
  assert.deepEqual(scanJs('const a = "Agenda and Chartered and Clientele and Apathy";'), []);
  assert.deepEqual(words(scanJs('const a = "Pay the Agent (APA)";')), ["Pay the Agent (APA)"]);
});

test("scanHtml: flags visible text and attributes, not tags, data-*, classes, comments or scripts", () => {
  const html = [
    "<!-- Charter comment -->",
    '<button class="tab-btn" data-tab="charter" data-w="unit">Charter</button>',
    '<h2 class="card-heading" id="charterHeading">Active Charter</h2>',
    '<img alt="Client photo" src="/images/charter.png">',
    '<input placeholder="Agent name" value="">',
    '<script>const x = "Charter";</script>',
    "<style>.charter-stack { content: 'APA'; }</style>",
    '<div class="topbar-charter" id="charterName"></div>'
  ].join("\n");
  assert.deepEqual(words(scanHtml(html)), ["Charter", "Active Charter", "Client photo", "Agent name"]);
  assert.deepEqual(scanHtml(html).map(hit => hit.line), [2, 3, 4, 5]);
});
```

- [ ] **Step 2: Run it to see it fail.**

Run: `cd "<guest worktree>" || exit 1; node --test test/visible-words.test.js`
Expected: FAIL with `Cannot find module './visible-words.js'`.

- [ ] **Step 3: Write the scanner** `test/visible-words.js`.

```js
"use strict";

// The spec T guard scan (T-D6): finds visible commercial words typed in code instead of read from the wording map.
// Not a JavaScript parser: it walks the source once, skipping comments and regex literals, and tests only the text of
// string and template literals.

const WORD = /(?<![\w\-/.#$@])(charters?|apa|clients?|agents?|proposals?)(?![\w\-/=])/i;
const REGEX_PREV = new Set(["", "(", ",", "=", ":", "[", "!", "&", "|", "?", "{", "}", ";", "+", "-", "*", "%", "<", ">", "~", "^"]);

function lineOf(source, index) {
  let line = 1;
  for (let i = 0; i < index; i += 1) if (source.charCodeAt(i) === 10) line += 1;
  return line;
}

// A string that is not shown to a person: a URL or path, a file name, or one lower-case token (a key or id).
function isInternalLiteral(text) {
  if (/^[a-z][a-z0-9_-]*$/.test(text)) return true;
  if (/^(\/|https?:|\.\/|\.\.\/)/.test(text)) return true;
  if (/\.(json|js|css|html|png|svg|pdf)(\?|$)/.test(text)) return true;
  return false;
}

// Returns [{ line, text }] for every string/template literal whose visible text has a guarded word.
function scanJs(source) {
  const hits = [];
  const n = source.length;
  let i = 0;
  let prev = "";                       // the last significant (non-space) code character
  const stack = [];                    // template ${ } nesting: each entry is the brace depth to resume the template at
  let braceDepth = 0;

  function readString(quote) {
    const start = i;
    i += 1;
    let text = "";
    while (i < n && source[i] !== quote && source[i] !== "\n") {
      if (source[i] === "\\") { text += source.slice(i, i + 2); i += 2; continue; }
      text += source[i]; i += 1;
    }
    i += 1;
    return { text, start };
  }

  function readTemplateText() {          // from just after ` or after the } that ends a ${ }
    const start = i;
    let text = "";
    while (i < n) {
      if (source[i] === "\\") { text += source.slice(i, i + 2); i += 2; continue; }
      if (source[i] === "`") { i += 1; return { text, start, ended: true }; }
      if (source[i] === "$" && source[i + 1] === "{") { i += 2; return { text, start, ended: false }; }
      text += source[i]; i += 1;
    }
    return { text, start, ended: true };
  }

  function isKey(afterIndex) {            // "text": …  inside an object literal
    let j = afterIndex;
    while (j < n && /[ \t]/.test(source[j])) j += 1;
    return source[j] === ":" && (prev === "{" || prev === ",");
  }

  function check(text, start, isTemplate) {
    if (!isTemplate && isInternalLiteral(text)) return;
    if (WORD.test(text)) hits.push({ line: lineOf(source, start), text: text.trim().slice(0, 120) });
  }

  function continueTemplate() {
    const piece = readTemplateText();
    check(piece.text, piece.start, true);
    if (piece.ended) { prev = "`"; } else { stack.push(braceDepth); braceDepth = 0; prev = "{"; }
  }

  while (i < n) {
    const c = source[i];
    if (c === "/" && source[i + 1] === "/") { while (i < n && source[i] !== "\n") i += 1; continue; }
    if (c === "/" && source[i + 1] === "*") { const e = source.indexOf("*/", i + 2); i = e < 0 ? n : e + 2; continue; }
    if (c === "'" || c === '"') {
      const s = readString(c);
      if (!isKey(i)) check(s.text, s.start, false);
      prev = c;
      continue;
    }
    if (c === "`") { i += 1; continueTemplate(); continue; }
    if (c === "/" && REGEX_PREV.has(prev)) {
      i += 1;
      let inClass = false;
      while (i < n && source[i] !== "\n") {
        if (source[i] === "\\") { i += 2; continue; }
        if (source[i] === "[") inClass = true;
        else if (source[i] === "]") inClass = false;
        else if (source[i] === "/" && !inClass) break;
        i += 1;
      }
      i += 1;
      while (i < n && /[a-z]/.test(source[i])) i += 1;
      prev = "/";
      continue;
    }
    if (c === "{") braceDepth += 1;
    if (c === "}") {
      if (braceDepth === 0 && stack.length) { braceDepth = stack.pop(); i += 1; continueTemplate(); continue; }
      braceDepth -= 1;
    }
    if (!/\s/.test(c)) prev = c;
    i += 1;
  }
  return hits;
}

const VISIBLE_ATTRS = ["alt", "title", "aria-label", "placeholder", "value"];

// Returns [{ line, text }] for visible words in HTML: element text and the visible attributes.
function scanHtml(source) {
  const hits = [];
  const blanked = source
    .replace(/<!--[\s\S]*?-->/g, m => m.replace(/[^\n]/g, " "))
    .replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, m => m.replace(/[^\n]/g, " "));
  const tag = /<[^>]*>/g;
  let last = 0;
  let m;
  const test = (text, index) => {
    if (WORD.test(text)) hits.push({ line: lineOf(source, index), text: text.trim().slice(0, 120) });
  };
  while ((m = tag.exec(blanked))) {
    test(blanked.slice(last, m.index), last);
    const attr = /\s([a-z-]+)\s*=\s*"([^"]*)"/gi;
    let a;
    while ((a = attr.exec(m[0]))) {
      if (VISIBLE_ATTRS.includes(a[1].toLowerCase())) test(a[2], m.index + a.index);
    }
    last = m.index + m[0].length;
  }
  test(blanked.slice(last), last);
  return hits;
}

module.exports = { scanJs, scanHtml, WORD, isInternalLiteral };
```

- [ ] **Step 4: Run the fixtures to see them pass.**

Run: `cd "<guest worktree>" || exit 1; node --test test/visible-words.test.js`
Expected: `pass 5`, `fail 0`.

- [ ] **Step 5: Write the guard** `test/trip-guard.test.js` (it covers every root `.js` and `.html` file, so a new file is checked from the start).

```js
"use strict";

// Spec T guard (T-D6): visible commercial words (charter, APA, client, agent, proposal) are read from the wording map,
// never typed into the site's own files. The allow-list holds files not converted yet; it only shrinks.

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { scanJs, scanHtml } = require("./visible-words.js");

const ROOT = path.join(__dirname, "..");
const WORDING_MODULE = "wording.js";
const ALLOW_LIST = ["guest.js", "preview-mode.js"];

const sources = fs.readdirSync(ROOT)
  .filter(name => /\.(js|html)$/.test(name) && name !== WORDING_MODULE)
  .sort();

const scan = name => {
  const text = fs.readFileSync(path.join(ROOT, name), "utf8");
  return name.endsWith(".html") ? scanHtml(text) : scanJs(text);
};

test("the guard looks at the site's own files", () => {
  for (const name of ["guest.js", "index.html", "preview-mode.js", "itinerary-days.js", "sw.js"]) {
    assert.ok(sources.includes(name), name);
  }
  assert.ok(!sources.includes(WORDING_MODULE));
});

for (const name of sources) {
  test(`${name}: no visible commercial word typed in code`, () => {
    const hits = scan(name);
    if (ALLOW_LIST.includes(name)) {
      assert.ok(hits.length > 0, `${name} is clean now: remove it from ALLOW_LIST`);
      return;
    }
    assert.deepEqual(hits, [], `${name} types a visible word; read it from the wording map (w("key"))`);
  });
}

test("ALLOW_LIST names real files", () => {
  for (const name of ALLOW_LIST) assert.ok(sources.includes(name), name);
});
```

- [ ] **Step 6: Run the whole suite.**

Run: `cd "<guest worktree>" || exit 1; node --test test/*.test.js 2>&1 | grep -E '^ℹ (tests|pass|fail)|^✖'`
Expected: all pass (25 old + 11 + 5 + 8 = 49). The two allow-listed files pass because they still have hits; `index.html`, `itinerary-days.js`, `moon-phase.js`, `sw.js` pass because they are clean.

- [ ] **Step 7: CRLF and commit.**

```bash
git add test/visible-words.js test/visible-words.test.js test/trip-guard.test.js
git commit -m "test: guard against visible commercial words typed in the guest site"
```

---

### Task 3: Load the helper in the page, the service worker and the sandbox test; feed it the server's words

**Files:**
- Create: `test/wording-wiring.test.js`
- Modify: `index.html`, `sw.js`, `test/replace-node-children.test.js`, `guest.js` (three small edits)

**Interfaces:**
- Consumes: Task 1's `window.IolantheWording` (`w`, `setWording`).
- Produces in `guest.js` (inside its IIFE, top level): `const WORDING_MODULE = window.IolantheWording;` and `const w = WORDING_MODULE.w;`, used by Task 4; `applySavedCharterBundle` calls `WORDING_MODULE.setWording(charterData.wording)`; `loadJSON` hands a failed response's JSON `wording` (if any) to `setWording`.

- [ ] **Step 1: Write the failing wiring test** `test/wording-wiring.test.js`.

```js
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
```

- [ ] **Step 2: Run it to see it fail.**

Run: `cd "<guest worktree>" || exit 1; node --test test/wording-wiring.test.js`
Expected: FAIL (2 failures: no `wording.js` script tag; no hook-up in `guest.js`).

- [ ] **Step 3: Wire the page, the service worker and the sandbox test.** Save as `guest-wire.js` outside the repo and run `node <path>/guest-wire.js` from the guest worktree root. It bumps `guest-b-N` to `guest-b-(N+1)` everywhere in `index.html` and `sw.js`, adds the `wording.js` script tag before `preview-mode.js`, adds the precache entry, bumps `STATIC_CACHE_NAME`, and makes the vm sandbox test (`test/replace-node-children.test.js`, which runs `guest.js` without a page) load `wording.js` first, as the page does.

```js
"use strict";
// Run from the repo root: node <this file>. Wires wording.js into the page, the service worker and the sandbox test.
const fs = require("fs");

// Replaces one exact piece of text in a file and keeps the file's line endings (CRLF on disk in this repo).
function edit(file, oldText, newText) {
  const raw = fs.readFileSync(file, "utf8");
  const crlf = raw.includes("\r\n");
  const text = crlf ? raw.replace(/\r\n/g, "\n") : raw;
  const count = text.split(oldText).length - 1;
  if (count !== 1) throw new Error(file + ": expected exactly 1 match, found " + count + " for: " + oldText.slice(0, 70));
  const next = text.replace(oldText, () => newText);
  fs.writeFileSync(file, crlf ? next.replace(/\n/g, "\r\n") : next);
}

// The current release tag (guest-b-N) and cache version (static-vN) both go up by one.
function numberIn(file, pattern) {
  const found = fs.readFileSync(file, "utf8").match(pattern);
  if (!found) throw new Error(file + ": no match for " + pattern);
  return Number(found[1]);
}
const oldTag = numberIn("index.html", /guest-b-(\d+)/);
const oldCache = numberIn("sw.js", /static-v(\d+)/);
const tag = "guest-b-" + (oldTag + 1);

for (const file of ["index.html", "sw.js"]) {
  fs.writeFileSync(file, fs.readFileSync(file, "utf8").split("guest-b-" + oldTag).join(tag));
}
edit("index.html",
  `  <script src="/preview-mode.js?v=${tag}" defer></script>`,
  `  <script src="/wording.js?v=${tag}" defer></script>\n  <script src="/preview-mode.js?v=${tag}" defer></script>`);
edit("sw.js",
  `  "/preview-mode.js?v=${tag}",`,
  `  "/wording.js?v=${tag}",\n  "/preview-mode.js?v=${tag}",`);
edit("sw.js", "static-v" + oldCache, "static-v" + (oldCache + 1));

// The vm sandbox test loads guest.js without a page, so it loads wording.js first, as index.html does.
edit("test/replace-node-children.test.js",
  `const GUEST_SOURCE = fs.readFileSync(path.join(ROOT, "guest.js"), "utf8");`,
  `const GUEST_SOURCE = fs.readFileSync(path.join(ROOT, "guest.js"), "utf8");\nconst WORDING_SOURCE = fs.readFileSync(path.join(ROOT, "wording.js"), "utf8");`);
edit("test/replace-node-children.test.js",
  `  const context = vm.createContext(window);\n`,
  `  const context = vm.createContext(window);\n  vm.runInContext(WORDING_SOURCE, context, { filename: "wording.js" });   // index.html loads it before guest.js\n`);
console.log("wired: " + tag + ", cache v" + (oldCache + 1));
```

Expected output: `wired: guest-b-7, cache v11` (or higher numbers if `origin/main` moved).

- [ ] **Step 4: Hook the helper into `guest.js`.** Save as `guest-hookup.js` outside the repo and run it from the worktree root. It (a) declares `WORDING_MODULE` and `w` just above `PREVIEW_MODULE`, (b) stores the words in `applySavedCharterBundle` (so every 30-second refresh updates them; a fallback bundle with no `wording` keeps the last ones), (c) lets a failed JSON response (a refused preview) carry `wording`.

```js
"use strict";
// Run from the repo root: node <this file>. Gives guest.js the wording helper and feeds it the server's words.
const fs = require("fs");

// Replaces one exact piece of text in a file and keeps the file's line endings (CRLF on disk in this repo).
function edit(file, oldText, newText) {
  const raw = fs.readFileSync(file, "utf8");
  const crlf = raw.includes("\r\n");
  const text = crlf ? raw.replace(/\r\n/g, "\n") : raw;
  const count = text.split(oldText).length - 1;
  if (count !== 1) throw new Error(file + ": expected exactly 1 match, found " + count + " for: " + oldText.slice(0, 70));
  const next = text.replace(oldText, () => newText);
  fs.writeFileSync(file, crlf ? next.replace(/\n/g, "\r\n") : next);
}

edit("guest.js",
  `    const PREVIEW_MODULE = window.IolantheGuestPreview || null;`,
  `    // Spec T (Trip mode): visible "charter" words are read through the wording helper (wording.js, loaded before this file).
    const WORDING_MODULE = window.IolantheWording;
    const w = WORDING_MODULE.w;
    const PREVIEW_MODULE = window.IolantheGuestPreview || null;`);

edit("guest.js",
  `    async function loadJSON(path) {
      const res = await fetch(path, { cache: "no-store" });
      if (!res.ok) {
        const error`,
  `    // A refused preview (404, charter deleted) may carry the vessel's \`wording\` in its JSON body, so the banner uses the
    // vessel's word; with no body the words already loaded (or the built-in charter words) are kept.
    async function adoptWordingFromErrorBody(res) {
      try {
        const body = await res.json();
        WORDING_MODULE.setWording(body && body.wording);
      } catch (_) { /* no JSON body */ }
    }

    async function loadJSON(path) {
      const res = await fetch(path, { cache: "no-store" });
      if (!res.ok) {
        await adoptWordingFromErrorBody(res);
        const error`);

edit("guest.js",
  `      const charterData = charterBundle && typeof charterBundle === "object" ? charterBundle : {};
      const settings =`,
  `      const charterData = charterBundle && typeof charterBundle === "object" ? charterBundle : {};
      WORDING_MODULE.setWording(charterData.wording);
      const settings =`);
console.log("hookup applied");
```

Expected output: `hookup applied`.

- [ ] **Step 5: Run the whole suite.**

Run: `cd "<guest worktree>" || exit 1; node --test test/*.test.js 2>&1 | grep -E '^ℹ (tests|pass|fail)|^✖'`
Expected: all pass (51). That includes the existing `obs-feed-removed.test.js` checks that `index.html` and `sw.js` carry identical `?v=` tags and that every precached file exists, and `replace-node-children.test.js` loading `guest.js` with the helper.

- [ ] **Step 6: Syntax check and commit.**

```bash
node --check guest.js && node --check wording.js
file index.html sw.js guest.js test/replace-node-children.test.js test/wording-wiring.test.js
git add index.html sw.js guest.js test/replace-node-children.test.js test/wording-wiring.test.js
git commit -m "feat: load the wording helper in the guest page and feed it the server's words"
```

(`file` must say CRLF for all five; convert `test/wording-wiring.test.js` first.)

---

### Task 4: Convert every guest literal; empty the allow-list; document

**Files:**
- Create: `test/wording-keys.test.js`
- Modify: `guest.js` (5 edits), `preview-mode.js` (2 edits), `test/trip-guard.test.js` (allow-list), `test/preview-mode.test.js` (append one test), `CLAUDE.md`, `README-dev.md`

**Interfaces:**
- Consumes: Task 3's `w` in `guest.js`; Task 1's `IolantheWording` for `preview-mode.js` (`require("./wording.js")` in node, `self.IolantheWording` in the browser, loaded earlier by `index.html`).
- Produces: `preview-mode.js` `bannerText(preview, status)` unchanged in signature; its 404 text now comes from `unit_not_found`.

- [ ] **Step 1: Write the failing keys test** `test/wording-keys.test.js` (every `w("key")` in `guest.js` and `preview-mode.js` is a built-in key, and every built-in key is used).

```js
"use strict";

// Every wording key used in the site's code must exist in the built-in charter copy, and every built-in key must be used
// (no dead keys, no typos that would show a raw key on a tablet).

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
```

- [ ] **Step 2: Empty the allow-list (the guard turns red) and append the preview test.** In `test/trip-guard.test.js` change the line `const ALLOW_LIST = ["guest.js", "preview-mode.js"];` to `const ALLOW_LIST = [];`. Append this test to the end of `test/preview-mode.test.js` (keep CRLF):

```js
// ---- spec T: the refused-preview text follows the vessel's mode ----
test("bannerText: the 404 text is the vessel's word (trip), the charter word by default, 401 never changes", () => {
  const wording = require("../wording.js");
  const p = { active: true, date: "2026-11-03", charterId: "csaba" };
  try {
    wording.setWording({ unit_not_found: ["TRIP NOT FOUND", "TRIP NOT FOUND"] });
    assert.equal(pm.bannerText(p, 404), "PREVIEW · TRIP NOT FOUND");
    assert.equal(pm.bannerText(p, 401), "PREVIEW · LOG IN TO THE ADMIN AGAIN");
  } finally {
    wording.reset();
  }
  assert.equal(pm.bannerText(p, 404), "PREVIEW · CHARTER NOT FOUND");
});
```

- [ ] **Step 3: Run to see them fail.**

Run: `cd "<guest worktree>" || exit 1; node --test test/trip-guard.test.js test/wording-keys.test.js test/preview-mode.test.js 2>&1 | grep -E '^ℹ (pass|fail)|^✖'`
Expected: FAIL: `guest.js` and `preview-mode.js` "no visible commercial word typed in code", `wording-keys` ("built-in key ... is never used"), and the new preview test ("TRIP NOT FOUND" expected).

- [ ] **Step 4: Convert the literals.** Save as `guest-convert.js` outside the repo and run it from the worktree root. It makes exactly the replacements in the survey table: `guest.js` ~2662, ~5069, ~5472, ~6315, ~6318 and `preview-mode.js` ~17 (the `PROBLEMS` table becomes `problemText(status)`; the 401 text is unchanged).

```js
"use strict";
// Run from the repo root: node <this file>. Replaces every visible "charter" literal with a wording key.
const fs = require("fs");

// Replaces one exact piece of text in a file and keeps the file's line endings (CRLF on disk in this repo).
function edit(file, oldText, newText) {
  const raw = fs.readFileSync(file, "utf8");
  const crlf = raw.includes("\r\n");
  const text = crlf ? raw.replace(/\r\n/g, "\n") : raw;
  const count = text.split(oldText).length - 1;
  if (count !== 1) throw new Error(file + ": expected exactly 1 match, found " + count + " for: " + oldText.slice(0, 70));
  const next = text.replace(oldText, () => newText);
  fs.writeFileSync(file, crlf ? next.replace(/\n/g, "\r\n") : next);
}

// guest.js ~2662: the shared-track note on the Navigation tab.
edit("guest.js",
  "        ? `Shared onboard track shows ${trackPointCount} logged point${trackPointCount === 1 ? \"\" : \"s\"} for this charter and retains data for the charter plus ${retentionDays} extra day${retentionDays === 1 ? \"\" : \"s\"}.`",
  "        ? w(\"track_note\", {\n" +
  "          vars: {\n" +
  "            points: `${trackPointCount} logged point${trackPointCount === 1 ? \"\" : \"s\"}`,\n" +
  "            extra: `${retentionDays} extra day${retentionDays === 1 ? \"\" : \"s\"}`\n" +
  "          }\n" +
  "        })");

// guest.js ~5069: the idle screen's completed itinerary.
edit("guest.js",
  `renderIdleSummaryItem("Charter", "Charter completed", "This charter has been completed.", "idle-itinerary-current")`,
  `renderIdleSummaryItem(w("unit"), w("unit_completed_title"), w("unit_completed"), "idle-itinerary-current")`);

// guest.js ~5472: the menu page's day label.
edit("guest.js",
  "        ? `CHARTER DAY ${Math.round(Number(selectedMenu.charter_day))}`",
  `        ? w("unit_day", { vars: { n: Math.round(Number(selectedMenu.charter_day)) } })`);

// guest.js ~6315 and ~6318: the Guest Alcohol page (two lines, each exactly once).
edit("guest.js",
  `          copy: "Alcohol requested for this charter",`,
  `          copy: w("drinks_requested"),`);
edit("guest.js",
  `          subtitle: "Alcohol requested for this charter",`,
  `          subtitle: w("drinks_requested"),`);

// preview-mode.js ~17: the refused-preview banner.
edit("preview-mode.js",
  `  const PROBLEMS = { 401: "LOG IN TO THE ADMIN AGAIN", 404: "CHARTER NOT FOUND" };`,
  `  // Spec T: the wording helper (wording.js is loaded before this file in the page; required in node).
  const wording = typeof module === "object" && module.exports
    ? require("./wording.js")
    : (typeof self !== "undefined" ? self.IolantheWording : null);

  // The text of a refused preview (401 session expired, 404 charter deleted); "" for any other status.
  function problemText(status) {
    if (status === 401) return "LOG IN TO THE ADMIN AGAIN";
    if (status === 404) return wording.w("unit_not_found");
    return "";
  }`);
edit("preview-mode.js",
  "    if (PROBLEMS[status]) return `PREVIEW · ${PROBLEMS[status]}`;",
  "    const problem = problemText(status);\n    if (problem) return `PREVIEW · ${problem}`;");
console.log("conversions applied");
```

Expected output: `conversions applied`.

Equivalence check for the long sentence (charter mode, `trackPointCount` 12, `retentionDays` 3): the `track_note` built-in with `{points}` = `12 logged points` and `{extra}` = `3 extra days` gives `Shared onboard track shows 12 logged points for this charter and retains data for the charter plus 3 extra days.`, the same as the old template; with 1 and 1 it gives `1 logged point` and `1 extra day`.

- [ ] **Step 5: Run the whole suite.**

Run: `cd "<guest worktree>" || exit 1; node --test test/*.test.js 2>&1 | grep -E '^ℹ (tests|pass|fail)|^✖'; node --check guest.js && node --check preview-mode.js`
Expected: all pass (53 tests). Note the number printed after `tests`.

- [ ] **Step 6: Document.** Save as `guest-docs.js` outside the repo and run `node <path>/guest-docs.js <N>` from the worktree root, where `<N>` is the test count from Step 5 (53 if nothing else changed). It adds a "Wording (spec T, Trip mode)" section to `CLAUDE.md`, the `wording.js` line to the layout in `README-dev.md`, and updates its test count and test description.

```js
"use strict";
// Run from the repo root: node <this file>. Documents the wording helper in CLAUDE.md and README-dev.md.
// Argument 1: the number of tests `node --test test/*.test.js` reports after the conversion.
const fs = require("fs");
const testCount = process.argv[2];
if (!/^\d+$/.test(testCount || "")) throw new Error("pass the test count, e.g. node guest-docs.js 53");

// Replaces one exact piece of text in a file and keeps the file's line endings (CRLF on disk in this repo).
function edit(file, oldText, newText) {
  const raw = fs.readFileSync(file, "utf8");
  const crlf = raw.includes("\r\n");
  const text = crlf ? raw.replace(/\r\n/g, "\n") : raw;
  const count = text.split(oldText).length - 1;
  if (count !== 1) throw new Error(file + ": expected exactly 1 match, found " + count + " for: " + oldText.slice(0, 70));
  const next = text.replace(oldText, () => newText);
  fs.writeFileSync(file, crlf ? next.replace(/\n/g, "\r\n") : next);
}

edit("CLAUDE.md", "## moon-phase.js\n", `## Wording (spec T, Trip mode)

Every visible "charter", "APA", "client", "agent" or "proposal" word is read from the vessel's wording map, never typed
in code, so a private boat can run in \`trip\` mode. \`wording.js\` (UMD: the browser and \`node --test\` share it) is the
helper: \`w(key, { plural, lower, vars })\`. The server sends \`wording\` (the vessel's mode already resolved) and
\`vessel_mode\` in the \`/api/charter\` payload; \`applySavedCharterBundle\` hands the words to \`setWording\`, and a refused
preview's JSON body may carry them too. A missing map or key uses \`BUILT_IN\`, the charter copy of every key this site
uses, so charter mode looks exactly as before and nothing shows a raw key or a blank.

- New visible word: add the key to \`BUILT_IN\` (the charter text, exactly as it was), call \`w("key")\`, and give the server
  plan's table (iolanthe-server \`wording.json\`) all four strings. \`test/wording-keys.test.js\` fails on an unknown or
  unused key.
- \`test/trip-guard.test.js\` fails on a visible commercial word typed in any root \`.js\`/\`.html\` file (\`wording.js\`
  excepted). Its \`ALLOW_LIST\` is empty and must stay empty.
- \`wording.js\` loads before \`preview-mode.js\` and \`guest.js\` in \`index.html\`, with the same \`?v=\` tag, and \`sw.js\`
  precaches it.

## moon-phase.js
`);

edit("README-dev.md",
  "  preview-mode.js         Preview mode params, API URLs, banner text (pure, node --test)\n",
  "  preview-mode.js         Preview mode params, API URLs, banner text (pure, node --test)\n" +
  "  wording.js              Spec T wording helper w(key, opts) + built-in charter words (UMD, node --test)\n");
edit("README-dev.md", "`node --test` runs everything in `test/` (25).", "`node --test` runs everything in `test/` (" + testCount + ").");
edit("README-dev.md",
  "`sw.js` match, every precached file exists).",
  "`sw.js` match, every precached file exists). `test/trip-guard.test.js` scans the root `.js`/`.html` files for visible\n" +
  "commercial words (scanner: `test/visible-words.js`); `test/wording*.test.js` cover the helper, its keys and its wiring.");
console.log("docs updated");
```

- [ ] **Step 7: Check endings, the final scan, and commit.**

```bash
file guest.js preview-mode.js CLAUDE.md README-dev.md test/*.js | grep -v CRLF   # expect no output
git add -A
git status --short
git commit -m "feat: guest site reads its charter words from the wording map (Trip mode)"
```

(`git status --short` should list only the files named above; the guard test is the proof that no visible word is left.)

---

### Task 5: Crew wording helper

**Files:**
- Create: `test/wording.test.js`, `wording.js`

**Interfaces:**
- Consumes: nothing.
- Produces (browser global `window.IolantheWording`, node `require`): same API as Task 1, with `BUILT_IN` holding 3 keys (`unit`, `active_unit`, `watches_none`).

- [ ] **Step 1: Create the crew worktree** (the crew repo has none yet):

```bash
cd "S:/Users/David/OneDrive/Maker Space/GitHub/portal/iolanthe-crew" || exit 1
git fetch origin && mkdir -p "../../worktrees/trip-sites"
git worktree add "../../worktrees/trip-sites/iolanthe-crew" -b feat/trip-mode-sites origin/main
cd "../../worktrees/trip-sites/iolanthe-crew" || exit 1
mkdir test && git status --short
```

All later crew tasks work in `S:/Users/David/OneDrive/Maker Space/GitHub/worktrees/trip-sites/iolanthe-crew`. Crew files are LF; keep them LF.

- [ ] **Step 2: Write the failing test** `test/wording.test.js`.

```js
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const { BUILT_IN, createWording, lowerWords } = require("../wording.js");

// The trip column of every key this site uses (the "Keys this plan needs" table of the plan).
const TRIP = {
  unit: ["Trip", "Trips"],
  active_unit: ["Active Trip", "Active Trips"],
  watches_none: ["No watch schedule set for this trip.", "No watch schedule set for this trip."]
};

const placeholders = text => (text.match(/\{[a-z_]+\}/g) || []).sort().join(",");

test("BUILT_IN holds today's charter text, exactly", () => {
  assert.deepEqual(Object.keys(BUILT_IN).sort(), Object.keys(TRIP).sort());
  assert.deepEqual(BUILT_IN.unit, ["Charter", "Charters"]);
  assert.deepEqual(BUILT_IN.active_unit, ["Active Charter", "Active Charters"]);
  assert.equal(BUILT_IN.watches_none[0], "No watch schedule set for this charter.");
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
  assert.equal(w("active_unit", { lower: true }), "active charter");
});

test("w: loaded trip wording is used, plural and vars apply", () => {
  const { w, setWording } = createWording(BUILT_IN);
  setWording(TRIP);
  assert.equal(w("unit"), "Trip");
  assert.equal(w("unit", { plural: true }), "Trips");
  assert.equal(w("active_unit"), "Active Trip");
  assert.equal(w("watches_none"), "No watch schedule set for this trip.");
});

test("w: a missing key or a broken entry falls back to the charter word, never blank or raw", () => {
  const { w, setWording } = createWording(BUILT_IN);
  setWording({ unit: ["Trip", "Trips"], active_unit: ["", "Active Trips"], watches_none: "nope" });
  assert.equal(w("unit"), "Trip");
  assert.equal(w("active_unit"), "Active Charter");
  assert.equal(w("watches_none"), "No watch schedule set for this charter.");
});

test("w: placeholders are filled from vars and left visible when no var is given", () => {
  const { w } = createWording({ greet: ["Hello {name}", "Hello all {name}"] });
  assert.equal(w("greet", { vars: { name: "Ann" } }), "Hello Ann");
  assert.equal(w("greet", { plural: true, vars: { name: "Ann" } }), "Hello all Ann");
  assert.equal(w("greet"), "Hello {name}");
  assert.equal(w("greet", { lower: true, vars: { name: "ABC" } }), "hello ABC");
});

test("w: var values go in literally (no $-patterns, no second expansion)", () => {
  const { w } = createWording({ greet: ["Hello {name}", "Hello all {name}"] });
  assert.equal(w("greet", { vars: { name: "$& {name}" } }), "Hello $& {name}");
});

// Runs fn with console.warn stubbed; returns the warnings it collected.
function collectWarnings(fn) {
  const warnings = [];
  const original = console.warn;
  console.warn = message => warnings.push(message);
  try {
    fn();
  } finally {
    console.warn = original;
  }
  return warnings;
}

test("w: an unknown key warns once and returns the key text", () => {
  const { w } = createWording(BUILT_IN);
  const warnings = collectWarnings(() => {
    assert.equal(w("no_such_key"), "no_such_key");
    assert.equal(w("no_such_key", { plural: true, vars: { n: 1 } }), "no_such_key");
    assert.equal(w("other_missing_key"), "other_missing_key");
  });
  assert.equal(warnings.length, 2, "one warning per key, not per call");
  assert.match(warnings[0], /no word "no_such_key"/);
  assert.match(warnings[1], /no word "other_missing_key"/);
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
```

- [ ] **Step 3: Run it to see it fail.**

Run: `cd "<crew worktree>" || exit 1; node --test test/wording.test.js`
Expected: FAIL with `Cannot find module '../wording.js'`.

- [ ] **Step 4: Write `wording.js`** (the same semantics as the guest copy, with this site's keys).

```js
(function (root, factory) {
  const mod = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = mod;
  } else {
    root.IolantheWording = mod;
  }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  // Spec T (Trip mode): the crew site's wording helper. The server sends `wording` ({ key: [singular, plural] }, the
  // vessel's mode already resolved) in the /api/charter payload, the one fetchCharter reads. A missing map or key falls
  // back to BUILT_IN, the charter column of every key this site uses, so charter mode looks exactly as before and
  // nothing shows a raw key or a blank. The same semantics are copied into iolanthe-guest/wording.js (separate repos,
  // separate copies).

  const BUILT_IN = Object.freeze({
    unit: Object.freeze(["Charter", "Charters"]),
    active_unit: Object.freeze(["Active Charter", "Active Charters"]),
    watches_none: Object.freeze(["No watch schedule set for this charter.", "No watch schedule set for this charter."])
  });

  const STATIC_ATTRS = ["alt", "title", "aria-label", "placeholder"];

  // Lower-cases the first letter of each word except all-capital words ("APA", "TRIP" stay).
  function lowerWords(text) {
    return text.replace(/\S+/g, word => (/[A-Z]/.test(word) && word === word.toUpperCase()
      ? word
      : word.charAt(0).toLowerCase() + word.slice(1)));
  }

  function isForm(value) {
    return typeof value === "string" && value.trim() !== "";
  }

  function createWording(builtIn) {
    let loaded = null;
    const warned = new Set();

    function entryFor(key) {
      const fromServer = loaded && Object.prototype.hasOwnProperty.call(loaded, key) ? loaded[key] : null;
      if (Array.isArray(fromServer) && fromServer.length >= 2 && isForm(fromServer[0]) && isForm(fromServer[1])) {
        return fromServer;
      }
      if (Object.prototype.hasOwnProperty.call(builtIn, key)) {
        return builtIn[key];
      }
      return null;
    }

    // Never throws: a key in neither the loaded words nor builtIn is a programming mistake (the keys test catches it),
    // but one wrong key must not blank a page, so it warns once per key and returns the key text.
    // w("unit_day", { vars: { n: 3 } }) -> "TRIP DAY 3"; w("unit", { plural: true, lower: true }) -> "trips".
    function w(key, opts) {
      const options = opts || {};
      const entry = entryFor(key);
      if (entry === null) {
        if (!warned.has(key)) {
          warned.add(key);
          console.warn(`wording.js: no word "${key}"`);
        }
        return String(key);
      }
      let text = entry[options.plural ? 1 : 0];
      if (options.lower) {
        text = lowerWords(text);
      }
      const vars = options.vars || {};
      return text.replace(/\{([a-z_]+)\}/g, (match, name) => (
        Object.prototype.hasOwnProperty.call(vars, name) ? String(vars[name]) : match
      ));
    }

    // A non-object (an older server sent no `wording`, or a fallback bundle) keeps the last words that were loaded.
    function setWording(map) {
      if (map && typeof map === "object" && !Array.isArray(map)) {
        loaded = map;
      }
    }

    function reset() {
      loaded = null;
    }

    // data-w="<key>" [data-w-plural] [data-w-lower] [data-w-attr="alt|title|aria-label|placeholder"]
    function applyStatic(scope) {
      if (!scope || typeof scope.querySelectorAll !== "function") {
        return;
      }
      scope.querySelectorAll("[data-w]").forEach(node => {
        const text = w(node.getAttribute("data-w"), {
          plural: node.hasAttribute("data-w-plural"),
          lower: node.hasAttribute("data-w-lower")
        });
        const attr = node.getAttribute("data-w-attr");
        if (attr && STATIC_ATTRS.includes(attr)) {
          node.setAttribute(attr, text);
        } else {
          node.textContent = text;
        }
      });
    }

    return { w, setWording, reset, applyStatic };
  }

  return Object.assign({ BUILT_IN, createWording, lowerWords }, createWording(BUILT_IN));
});
```

- [ ] **Step 5: Run the test to see it pass.**

Run: `cd "<crew worktree>" || exit 1; node --test test/wording.test.js`
Expected: `pass 11`, `fail 0`.

- [ ] **Step 6: Commit.**

```bash
git add wording.js test/wording.test.js
git commit -m "feat: add the wording helper for spec T (Trip mode)"
```

---

### Task 6: Crew guard test

**Files:**
- Create: `test/visible-words.js`, `test/visible-words.test.js`, `test/trip-guard.test.js`

**Interfaces:**
- Consumes: nothing from Task 5 except that `wording.js` is excluded from the scan by name.
- Produces: the same scanner API as Task 2; `ALLOW_LIST` starts `["crew.js", "index.html"]`, emptied in Task 7.

- [ ] **Step 1: Write the failing fixture test** `test/visible-words.test.js` (identical to the guest's).

```js
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const { scanJs, scanHtml } = require("./visible-words.js");

const words = hits => hits.map(hit => hit.text);

test("scanJs: flags visible words in string and template literals, with the line", () => {
  const hits = scanJs('const a = 1;\nconst b = "This charter has been completed.";\nconst c = `CHARTER DAY ${n}`;\nf(\'Client\');');
  assert.deepEqual(hits.map(hit => hit.line), [2, 3, 4]);
  assert.deepEqual(words(hits), ["This charter has been completed.", "CHARTER DAY", "Client"]);
});

test("scanJs: ignores comments, identifiers, object keys, classes, URLs, file names and single lower-case tokens", () => {
  const source = [
    "// the charter is here, APA too",
    "/* Agent Proposal Client */",
    "const charterName = charter.client_agent;",
    'const o = { charter: 1, "charter": 2, "proposal-x": 3 };',
    'el("div", { class: "charter-stack" });',
    'fetch("/api/charter"); fetch("/api/charter/watches");',
    'const url = "https://example.com/charter";',
    'read("charter.json"); read("charter-pack.js?v=1");',
    'params.get("charter");',
    "const q = `charter=${id}&preview=1`;",
    "const re = /\"Charter\"/g;"
  ].join("\n");
  assert.deepEqual(scanJs(source), []);
});

test("scanJs: a template literal with nested ${} still reads its text parts", () => {
  const hits = scanJs("const t = `${a ? `x ${b}` : ''} for this charter ${c}`;");
  assert.deepEqual(words(hits), ["for this charter"]);
});

test("scanJs: whole words only", () => {
  assert.deepEqual(scanJs('const a = "Agenda and Chartered and Clientele and Apathy";'), []);
  assert.deepEqual(words(scanJs('const a = "Pay the Agent (APA)";')), ["Pay the Agent (APA)"]);
});

test("scanHtml: flags visible text and attributes, not tags, data-*, classes, comments or scripts", () => {
  const html = [
    "<!-- Charter comment -->",
    '<button class="tab-btn" data-tab="charter" data-w="unit">Charter</button>',
    '<h2 class="card-heading" id="charterHeading">Active Charter</h2>',
    '<img alt="Client photo" src="/images/charter.png">',
    '<input placeholder="Agent name" value="">',
    '<script>const x = "Charter";</script>',
    "<style>.charter-stack { content: 'APA'; }</style>",
    '<div class="topbar-charter" id="charterName"></div>'
  ].join("\n");
  assert.deepEqual(words(scanHtml(html)), ["Charter", "Active Charter", "Client photo", "Agent name"]);
  assert.deepEqual(scanHtml(html).map(hit => hit.line), [2, 3, 4, 5]);
});
```

- [ ] **Step 2: Run it to see it fail.**

Run: `cd "<crew worktree>" || exit 1; node --test test/visible-words.test.js`
Expected: FAIL with `Cannot find module './visible-words.js'`.

- [ ] **Step 3: Write the scanner** `test/visible-words.js` (identical to the guest's; see Task 2 for what it counts as visible).

```js
"use strict";

// The spec T guard scan (T-D6): finds visible commercial words typed in code instead of read from the wording map.
// Not a JavaScript parser: it walks the source once, skipping comments and regex literals, and tests only the text of
// string and template literals.

const WORD = /(?<![\w\-/.#$@])(charters?|apa|clients?|agents?|proposals?)(?![\w\-/=])/i;
const REGEX_PREV = new Set(["", "(", ",", "=", ":", "[", "!", "&", "|", "?", "{", "}", ";", "+", "-", "*", "%", "<", ">", "~", "^"]);

function lineOf(source, index) {
  let line = 1;
  for (let i = 0; i < index; i += 1) if (source.charCodeAt(i) === 10) line += 1;
  return line;
}

// A string that is not shown to a person: a URL or path, a file name, or one lower-case token (a key or id).
function isInternalLiteral(text) {
  if (/^[a-z][a-z0-9_-]*$/.test(text)) return true;
  if (/^(\/|https?:|\.\/|\.\.\/)/.test(text)) return true;
  if (/\.(json|js|css|html|png|svg|pdf)(\?|$)/.test(text)) return true;
  return false;
}

// Returns [{ line, text }] for every string/template literal whose visible text has a guarded word.
function scanJs(source) {
  const hits = [];
  const n = source.length;
  let i = 0;
  let prev = "";                       // the last significant (non-space) code character
  const stack = [];                    // template ${ } nesting: each entry is the brace depth to resume the template at
  let braceDepth = 0;

  function readString(quote) {
    const start = i;
    i += 1;
    let text = "";
    while (i < n && source[i] !== quote && source[i] !== "\n") {
      if (source[i] === "\\") { text += source.slice(i, i + 2); i += 2; continue; }
      text += source[i]; i += 1;
    }
    i += 1;
    return { text, start };
  }

  function readTemplateText() {          // from just after ` or after the } that ends a ${ }
    const start = i;
    let text = "";
    while (i < n) {
      if (source[i] === "\\") { text += source.slice(i, i + 2); i += 2; continue; }
      if (source[i] === "`") { i += 1; return { text, start, ended: true }; }
      if (source[i] === "$" && source[i + 1] === "{") { i += 2; return { text, start, ended: false }; }
      text += source[i]; i += 1;
    }
    return { text, start, ended: true };
  }

  function isKey(afterIndex) {            // "text": …  inside an object literal
    let j = afterIndex;
    while (j < n && /[ \t]/.test(source[j])) j += 1;
    return source[j] === ":" && (prev === "{" || prev === ",");
  }

  function check(text, start, isTemplate) {
    if (!isTemplate && isInternalLiteral(text)) return;
    if (WORD.test(text)) hits.push({ line: lineOf(source, start), text: text.trim().slice(0, 120) });
  }

  function continueTemplate() {
    const piece = readTemplateText();
    check(piece.text, piece.start, true);
    if (piece.ended) { prev = "`"; } else { stack.push(braceDepth); braceDepth = 0; prev = "{"; }
  }

  while (i < n) {
    const c = source[i];
    if (c === "/" && source[i + 1] === "/") { while (i < n && source[i] !== "\n") i += 1; continue; }
    if (c === "/" && source[i + 1] === "*") { const e = source.indexOf("*/", i + 2); i = e < 0 ? n : e + 2; continue; }
    if (c === "'" || c === '"') {
      const s = readString(c);
      if (!isKey(i)) check(s.text, s.start, false);
      prev = c;
      continue;
    }
    if (c === "`") { i += 1; continueTemplate(); continue; }
    if (c === "/" && REGEX_PREV.has(prev)) {
      i += 1;
      let inClass = false;
      while (i < n && source[i] !== "\n") {
        if (source[i] === "\\") { i += 2; continue; }
        if (source[i] === "[") inClass = true;
        else if (source[i] === "]") inClass = false;
        else if (source[i] === "/" && !inClass) break;
        i += 1;
      }
      i += 1;
      while (i < n && /[a-z]/.test(source[i])) i += 1;
      prev = "/";
      continue;
    }
    if (c === "{") braceDepth += 1;
    if (c === "}") {
      if (braceDepth === 0 && stack.length) { braceDepth = stack.pop(); i += 1; continueTemplate(); continue; }
      braceDepth -= 1;
    }
    if (!/\s/.test(c)) prev = c;
    i += 1;
  }
  return hits;
}

const VISIBLE_ATTRS = ["alt", "title", "aria-label", "placeholder", "value"];

// Returns [{ line, text }] for visible words in HTML: element text and the visible attributes.
function scanHtml(source) {
  const hits = [];
  const blanked = source
    .replace(/<!--[\s\S]*?-->/g, m => m.replace(/[^\n]/g, " "))
    .replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, m => m.replace(/[^\n]/g, " "));
  const tag = /<[^>]*>/g;
  let last = 0;
  let m;
  const test = (text, index) => {
    if (WORD.test(text)) hits.push({ line: lineOf(source, index), text: text.trim().slice(0, 120) });
  };
  while ((m = tag.exec(blanked))) {
    test(blanked.slice(last, m.index), last);
    const attr = /\s([a-z-]+)\s*=\s*"([^"]*)"/gi;
    let a;
    while ((a = attr.exec(m[0]))) {
      if (VISIBLE_ATTRS.includes(a[1].toLowerCase())) test(a[2], m.index + a.index);
    }
    last = m.index + m[0].length;
  }
  test(blanked.slice(last), last);
  return hits;
}

module.exports = { scanJs, scanHtml, WORD, isInternalLiteral };
```

- [ ] **Step 4: Run the fixtures to see them pass.**

Run: `cd "<crew worktree>" || exit 1; node --test test/visible-words.test.js`
Expected: `pass 5`, `fail 0`.

- [ ] **Step 5: Write the guard** `test/trip-guard.test.js`.

```js
"use strict";

// Spec T guard (T-D6): visible commercial words (charter, APA, client, agent, proposal) are read from the wording map,
// never typed into the site's own files. The allow-list holds files not converted yet; it only shrinks.

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { scanJs, scanHtml } = require("./visible-words.js");

const ROOT = path.join(__dirname, "..");
const WORDING_MODULE = "wording.js";
const ALLOW_LIST = ["crew.js", "index.html"];

const sources = fs.readdirSync(ROOT)
  .filter(name => /\.(js|html)$/.test(name) && name !== WORDING_MODULE)
  .sort();

const scan = name => {
  const text = fs.readFileSync(path.join(ROOT, name), "utf8");
  return name.endsWith(".html") ? scanHtml(text) : scanJs(text);
};

test("the guard looks at the site's own files", () => {
  for (const name of ["crew.js", "index.html", "sw.js"]) {
    assert.ok(sources.includes(name), name);
  }
  assert.ok(!sources.includes(WORDING_MODULE));
});

for (const name of sources) {
  test(`${name}: no visible commercial word typed in code`, () => {
    const hits = scan(name);
    if (ALLOW_LIST.includes(name)) {
      assert.ok(hits.length > 0, `${name} is clean now: remove it from ALLOW_LIST`);
      return;
    }
    assert.deepEqual(hits, [], `${name} types a visible word; read it from the wording map (w("key"))`);
  });
}

test("ALLOW_LIST names real files", () => {
  for (const name of ALLOW_LIST) assert.ok(sources.includes(name), name);
});
```

- [ ] **Step 6: Run the whole suite.**

Run: `cd "<crew worktree>" || exit 1; node --test test/*.test.js 2>&1 | grep -E '^ℹ (tests|pass|fail)|^✖'`
Expected: all pass (11 + 5 + 5 = 21): `crew.js` and `index.html` pass because they still have hits (the allow-list), `sw.js` because it is clean.

- [ ] **Step 7: Commit.**

```bash
git add test/visible-words.js test/visible-words.test.js test/trip-guard.test.js
git commit -m "test: guard against visible commercial words typed in the crew site"
```

---

### Task 7: Crew wiring and conversions

**Files:**
- Create: `test/wording-wiring.test.js`
- Modify: `index.html`, `crew.js`, `sw.js`, `test/trip-guard.test.js` (allow-list), `CLAUDE.md`

**Interfaces:**
- Consumes: Task 5's `window.IolantheWording` (`w`, `setWording`, `applyStatic`).
- Produces: nothing for later code; the page fills `data-w="unit"` (tab) and `data-w="active_unit"` (heading) at start-up from the built-in words and again when `/api/charter` answers.

- [ ] **Step 1: Write the failing wiring test** `test/wording-wiring.test.js`.

```js
"use strict";

// wording.js is a new shipped file: the page must load it before crew.js, and the service worker must precache it.
// Every wording key used in code or in data-w must exist in the built-in charter copy, and every built-in key is used.

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { BUILT_IN } = require("../wording.js");

const ROOT = path.join(__dirname, "..");
const read = name => fs.readFileSync(path.join(ROOT, name), "utf8");

test("index.html loads wording.js before crew.js", () => {
  const scripts = [...read("index.html").matchAll(/<script src="(\/crew\/[^"]+)"/g)].map(m => m[1]);
  const wordingAt = scripts.indexOf("/crew/wording.js");
  assert.ok(wordingAt >= 0, "wording.js script tag");
  assert.ok(wordingAt < scripts.indexOf("/crew/crew.js"), "before crew.js");
});

test("sw.js precaches wording.js and every local /crew/ file index.html loads", () => {
  const sw = read("sw.js");
  const loaded = [...read("index.html").matchAll(/(?:src|href)="(\/crew\/[^"]+)"/g)].map(m => m[1]);
  assert.ok(loaded.includes("/crew/wording.js"));
  for (const url of loaded) assert.ok(sw.includes(`'${url}'`), `sw.js STATIC lists ${url}`);
});

test("every wording key used (w('key') in crew.js, data-w in index.html) is built in, and every built-in key is used", () => {
  const used = new Set();
  for (const m of read("crew.js").matchAll(/\bw\(\s*["']([a-z0-9_]+)["']/g)) used.add(m[1]);
  for (const m of read("index.html").matchAll(/\sdata-w="([a-z0-9_]+)"/g)) used.add(m[1]);
  for (const key of used) assert.ok(Object.hasOwn(BUILT_IN, key), `unknown wording key ${key}`);
  for (const key of Object.keys(BUILT_IN)) assert.ok(used.has(key), `built-in key ${key} is never used`);
});

test("crew.js hands the loaded wording to the helper and fills the static text", () => {
  const js = read("crew.js");
  assert.match(js, /const \{ w, setWording, applyStatic \} = window\.IolantheWording;/);
  assert.match(js, /setWording\(d\.wording\);\s*applyStatic\(document\);/);
});

test("the empty-watches note carries data-w and is built with w(), so it is right whether the watches or the wording arrive first", () => {
  const note = '<p class="watch-empty" data-w="watches_none">${w(\'watches_none\')}</p>';   // as written in the template literal
  assert.ok(read("crew.js").includes(note), "crew.js builds the note");
});
```

- [ ] **Step 2: Empty the allow-list** in `test/trip-guard.test.js`: change `const ALLOW_LIST = ["crew.js", "index.html"];` to `const ALLOW_LIST = [];`.

- [ ] **Step 3: Run to see them fail.**

Run: `cd "<crew worktree>" || exit 1; node --test test/*.test.js 2>&1 | grep -E '^ℹ (pass|fail)|^✖'`
Expected: FAIL: `crew.js` and `index.html` "no visible commercial word", and all five wiring tests.

- [ ] **Step 4: Make the edits.** Save as `crew-edits.js` outside the repo and run it from the crew worktree root. It: empties the tab button and the heading and gives them `data-w`; adds the `wording.js` script tag before `crew.js`; in `crew.js` destructures the helper and calls `applyStatic(document)` at once, stores `d.wording` and re-applies when `/api/charter` answers, converts `['Charter',   d.name]` and the empty-watches note; in `sw.js` precaches `/crew/wording.js` and bumps `iolanthe-crew-v2` to `v3`.

```js
"use strict";
// Run from the repo root: node <this file>. Wires wording.js into the crew page and converts the three visible literals.
const fs = require("fs");

// Replaces one exact piece of text in a file and keeps the file's line endings (LF in this repo).
function edit(file, oldText, newText) {
  const raw = fs.readFileSync(file, "utf8");
  const crlf = raw.includes("\r\n");
  const text = crlf ? raw.replace(/\r\n/g, "\n") : raw;
  const count = text.split(oldText).length - 1;
  if (count !== 1) throw new Error(file + ": expected exactly 1 match, found " + count + " for: " + oldText.slice(0, 70));
  const next = text.replace(oldText, () => newText);
  fs.writeFileSync(file, crlf ? next.replace(/\n/g, "\r\n") : next);
}

// index.html: the tab and the heading are filled by wording.js (applyStatic); the script loads before crew.js.
edit("index.html", `data-tab="charter">Charter</button>`, `data-tab="charter" data-w="unit"></button>`);
edit("index.html", `<h2 class="card-heading">Active Charter</h2>`, `<h2 class="card-heading" data-w="active_unit"></h2>`);
edit("index.html",
  `  <script src="/crew/crew.js" defer></script>`,
  `  <script src="/crew/wording.js" defer></script>\n  <script src="/crew/crew.js" defer></script>`);

// crew.js: the helper, the server's words, the detail label and the empty-watches note.
edit("crew.js",
  `(function () {\n  'use strict';\n`,
  `(function () {\n  'use strict';\n\n` +
  `  // Spec T (Trip mode): visible "charter" words are read through the wording helper (wording.js, loaded before this file).\n` +
  `  const { w, setWording, applyStatic } = window.IolantheWording;\n` +
  `  applyStatic(document);   // the built-in words at once; the server's words replace them when /api/charter answers\n`);
edit("crew.js",
  `      const d = await res.json();\n\n      if (d.name) charterNameEl`,
  `      const d = await res.json();\n      setWording(d.wording);\n      applyStatic(document);\n\n      if (d.name) charterNameEl`);
edit("crew.js", `        ['Charter',   d.name],`, `        [w('unit'),   d.name],`);
edit("crew.js",
  `'<p class="watch-empty">No watch schedule set for this charter.</p>'`,
  "`<p class=\"watch-empty\" data-w=\"watches_none\">${w('watches_none')}</p>`");

// sw.js: precache the new file and bump the cache.
edit("sw.js", `'iolanthe-crew-v2'`, `'iolanthe-crew-v3'`);
edit("sw.js", `  '/crew/crew.js',`, `  '/crew/crew.js',\n  '/crew/wording.js',`);
console.log("crew edits applied");
```

Expected output: `crew edits applied`.

Notes for the implementer: the existing `watches.map(w => ...)` callback in `fetchWatches` has a parameter named `w` that shadows the helper inside that callback only; it never calls the helper, so leave it (renaming it is outside this plan).

- [ ] **Step 5: Run the whole suite.**

Run: `cd "<crew worktree>" || exit 1; node --test test/*.test.js 2>&1 | grep -E '^ℹ (tests|pass|fail)|^✖'; node --check crew.js && node --check wording.js && node --check sw.js`
Expected: all pass (26 tests).

- [ ] **Step 6: Document.** Save as `crew-docs.js` outside the repo and run it from the worktree root. It adds a "Wording (spec T, Trip mode)" section to `CLAUDE.md`.

```js
"use strict";
// Run from the repo root: node <this file>. Documents the wording helper and the new tests in CLAUDE.md.
const fs = require("fs");

// Replaces one exact piece of text in a file and keeps the file's line endings (LF in this repo).
function edit(file, oldText, newText) {
  const raw = fs.readFileSync(file, "utf8");
  const crlf = raw.includes("\r\n");
  const text = crlf ? raw.replace(/\r\n/g, "\n") : raw;
  const count = text.split(oldText).length - 1;
  if (count !== 1) throw new Error(file + ": expected exactly 1 match, found " + count + " for: " + oldText.slice(0, 70));
  const next = text.replace(oldText, () => newText);
  fs.writeFileSync(file, crlf ? next.replace(/\n/g, "\r\n") : next);
}

edit("CLAUDE.md", "## Service worker cache\n", `## Wording (spec T, Trip mode)

Every visible "charter", "APA", "client", "agent" or "proposal" word is read from the vessel's wording map, never typed
in code, so a private boat can run in \`trip\` mode. \`wording.js\` (UMD: the browser and \`node --test\` share it) is the
helper: \`w(key, { plural, lower, vars })\`. The server sends \`wording\` (the vessel's mode already resolved) and
\`vessel_mode\` in the \`/api/charter\` payload that \`fetchCharter\` reads; \`setWording(d.wording)\` stores it and
\`applyStatic(document)\` fills every \`data-w="<key>"\` element (the Charter tab, the "Active Charter" heading). A missing
map or key uses \`BUILT_IN\`, the charter copy of every key this site uses, so charter mode looks exactly as before and
nothing shows a raw key or a blank. The words load once per page load: a mode change shows after a reload.

- New visible word: add the key to \`BUILT_IN\` (the charter text, exactly as it was), use \`w('key')\` in code or
  \`data-w="key"\` in \`index.html\` (leave the element empty), and give the server plan's table (iolanthe-server
  \`wording.json\`) all four strings. \`test/wording-wiring.test.js\` fails on an unknown or unused key.
- \`test/trip-guard.test.js\` fails on a visible commercial word typed in any root \`.js\`/\`.html\` file (\`wording.js\`
  excepted). Its \`ALLOW_LIST\` is empty and must stay empty.
- Tests need no install: \`cd <repo> && node --test test/*.test.js\`.

## Service worker cache
`);
console.log("docs updated");
```

- [ ] **Step 7: Check and commit.**

```bash
file crew.js index.html sw.js wording.js CLAUDE.md test/*.js | grep CRLF   # expect no output (crew files are LF)
git diff --stat
git add -A
git commit -m "feat: crew site reads its charter words from the wording map (Trip mode)"
```

---

### Task 8: Live check (trip mode, then charter again)

**Files:** none changed. Needs the server half of spec T running (the branch the server plan builds; its last task names the worktree) and both site worktrees from Tasks 1 to 7.

- [ ] **Step 1: Prepare a throwaway data copy and start a dev server.** Never touch the boat or its data. In the spec T server worktree:

```bash
cd "<spec T server worktree, from the server plan>" || exit 1
rm -rf data-trip-check && cp -r data-local data-trip-check
grep -n "process.env.PORT\|GUEST_STATIC_DIR\|CREW_STATIC_DIR" server.js | head
```

Set `vessel_mode` without printing the file (it holds the dev admin secrets):

```bash
node -e "const fs=require('fs');const f='data-trip-check/settings.json';const s=JSON.parse(fs.readFileSync(f,'utf8'));s.vessel_mode='trip';fs.writeFileSync(f,JSON.stringify(s,null,2));console.log('vessel_mode set')"
```

Start the server (use the port variable the `grep` showed; 8135 is a free example) and keep it running in the background:

```bash
DATA_DIR="$PWD/data-trip-check" PORT=8135 \
GUEST_STATIC_DIR="S:/Users/David/OneDrive/Maker Space/GitHub/worktrees/trip-sites/iolanthe-guest" \
CREW_STATIC_DIR="S:/Users/David/OneDrive/Maker Space/GitHub/worktrees/trip-sites/iolanthe-crew" \
node server.js
```

Always browse as `http://trip-check.localhost:8135/` (the `<name>.localhost` form: servers on `127.0.0.1` share the admin cookie across ports). Do the first load of each site with a hard reload once, because the service worker keeps the old files until the new cache version installs.

- [ ] **Step 2: The payload.** `GET /api/charter` must carry the trip words (the server's job; this proves the sites will get them):

```bash
curl -s http://trip-check.localhost:8135/api/charter | node -e "let d='';process.stdin.on('data',c=>d+=c).on('end',()=>{const j=JSON.parse(d);console.log(j.vessel_mode,JSON.stringify(j.wording&&j.wording.unit),JSON.stringify(j.wording&&j.wording.unit_day))})"
```

Expected: `trip ["Trip","Trips"] ["TRIP DAY {n}","TRIP DAY {n}"]`.

- [ ] **Step 3: Guest, "TRIP DAY 3".** Sign in to the dev admin (the dev sign-in already set up in the data copy; do not print passwords), open the Guest view tab (it loads the guest preview in an iframe with the admin cookie), pick the date of day 3 of the data copy's active charter, open the Today's Menu tab. Expected heading: `TRIP DAY 3`. If the menu entry for that day has no `charter_day` the heading falls back to the date label; set `charter_day: 3` on that entry in the data copy and reload. Compare with charter mode in Step 7.

- [ ] **Step 4: Guest, the completed text and the track note.**
  - Set the active charter's `end_date` in the data copy to a past date (edit its `charter.json` with a node one-liner, as in Step 1), and lower the guest idle timeout in the data copy's guest settings (`timeout_seconds` of the idle screensaver settings; find it with `grep -rn timeout_seconds data-trip-check | head -3`).
  - Open `http://trip-check.localhost:8135/` (not a preview: preview mode switches idle off), leave it alone until the idle screen shows. Expected in the Itinerary section: label `Trip`, title `Trip completed`, copy `This trip has been completed.`.
  - Open the Navigation tab: the map status line reads `... for this trip and retains data for the trip plus 3 extra days.` (the status needs at least one NMEA position; if there is none, skip this line and rely on the unit tests).

- [ ] **Step 5: Guest, the refused-preview text.** In the signed-in browser open `http://trip-check.localhost:8135/?preview=2026-11-03&charter=no-such-charter`. Expected banner: `PREVIEW · TRIP NOT FOUND` **only if the server's 404 body carries `wording`**; if it shows `PREVIEW · CHARTER NOT FOUND`, the guest is correct (a first-load 404 with no words falls back to charter) and the server plan should add `wording` and `vessel_mode` to its preview 404 JSON body; record that as the open point. Then check the path that needs no server help: open a valid preview (Step 3), rename that charter's folder in the data copy, wait for the 30-second refresh: the banner must turn into `PREVIEW · TRIP NOT FOUND` (the last loaded words are kept), then rename it back.

- [ ] **Step 6: Crew.** Open `http://trip-check.localhost:8135/crew/`. Expected: the tab button reads `Trip`; after clicking it the card heading reads `Active Trip`; a detail row label reads `Trip` (if the payload has the fields `fetchCharter` reads); with no watch schedule set the Watches tab reads `No watch schedule set for this trip.` (if watches exist, skip). Reload twice: the words must be right on each load (this exercises both orders of `fetchWatches` and `fetchCharter`).

- [ ] **Step 7: Back to charter.** Set `vessel_mode` to `charter` in the data copy (same one-liner with `'charter'`), hard-reload all three pages. Expected: guest `CHARTER DAY 3`, `Charter completed` / `This charter has been completed.`, banner `PREVIEW · CHARTER NOT FOUND`; crew tab `Charter`, heading `Active Charter`, `No watch schedule set for this charter.`. Also stop the server, restart it with `settings.json` lacking `vessel_mode` and confirm the same charter text, then point `GUEST_STATIC_DIR` at an unmodified `origin/main` checkout of the guest repo against the new server to confirm an old page ignores the extra fields.

- [ ] **Step 8: Clean up.** Stop the server; delete `data-trip-check`; do not commit anything in the server worktree. Report the five observed texts and the Step 5 open point to the controller. The two site branches (`feat/trip-mode-sites`) are then ready for review; the controller releases the server first (spec T section 8).

---

## Spec coverage

- Spec section 4 (helper, built-in charter copy, `data-w`, missing map or key falls back): Tasks 1 and 5 (helper), 3 and 7 (loading), 7 (`data-w` in the crew page; the guest page has no static commercial text, so its `applyStatic` is unused and tested only).
- Spec section 5.1 (guard test with a shrinking allow-list): Tasks 2 and 6 (create), 4 and 7 (empty).
- Spec batch G, guest and crew halves: Tasks 4 and 7. The server's messages and `wording.json` are in the server plan.
- Spec section 6 (failure handling): Review Focus 1 to 3 and the tests named there.
- Spec section 7 (charter-mode suite proves text unchanged; trip-mode scan; live check): the `BUILT_IN` exactness test, the trip-column tests (no charter word in any trip string), Task 8.
- Not in this plan by design: admin batches A to F; `DEPARTMENT_LABELS`; any change to `vessel.json` categories; a mode control on screen (T-D5).

## Keys this plan needs

Charter strings are today's text exactly. Placeholders: `{n}`, `{points}`, `{extra}`. Two keys (`unit`, `active_unit`) are the contract's starting keys; the other seven are new. Each key's four strings are identical across sites that share the key (only `unit` is shared). The server plan adds the seven new rows to `wording.json`.

| Key | Used by | Charter singular | Charter plural | Trip singular | Trip plural |
|---|---|---|---|---|---|
| `unit` (starting key) | guest idle label; crew tab, detail label | Charter | Charters | Trip | Trips |
| `active_unit` (starting key) | crew card heading | Active Charter | Active Charters | Active Trip | Active Trips |
| `unit_day` | guest menu day label | CHARTER DAY {n} | CHARTER DAY {n} | TRIP DAY {n} | TRIP DAY {n} |
| `unit_completed_title` | guest idle screen | Charter completed | Charter completed | Trip completed | Trip completed |
| `unit_completed` | guest idle screen | This charter has been completed. | This charter has been completed. | This trip has been completed. | This trip has been completed. |
| `unit_not_found` | guest preview banner | CHARTER NOT FOUND | CHARTER NOT FOUND | TRIP NOT FOUND | TRIP NOT FOUND |
| `drinks_requested` | guest Guest Alcohol page | Alcohol requested for this charter | Alcohol requested for this charter | Alcohol requested for this trip | Alcohol requested for this trip |
| `track_note` | guest Navigation map status | Shared onboard track shows {points} for this charter and retains data for the charter plus {extra}. | Shared onboard track shows {points} for this charter and retains data for the charter plus {extra}. | Shared onboard track shows {points} for this trip and retains data for the trip plus {extra}. | Shared onboard track shows {points} for this trip and retains data for the trip plus {extra}. |
| `watches_none` | crew Watches tab | No watch schedule set for this charter. | No watch schedule set for this charter. | No watch schedule set for this trip. | No watch schedule set for this trip. |

Nine keys in all (2 starting, 7 new); the guest site uses 7 (`unit`, `unit_day`, `unit_completed_title`, `unit_completed`, `unit_not_found`, `drinks_requested`, `track_note`), the crew site 3 (`unit`, `active_unit`, `watches_none`). Placeholder values: `{n}` is the menu day number, `{points}` is e.g. `12 logged points`, `{extra}` is e.g. `3 extra days` (the site builds those with its own plural logic, so the sentence stays one key).
