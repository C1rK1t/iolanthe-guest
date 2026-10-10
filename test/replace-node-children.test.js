"use strict";

// On the idle screen the weather panel showed the text "null" under the moon whenever there was no weather error
// (2026-10-10). syncIdleWeatherSection() hands replaceNodeChildren() the notice from idleWeatherNoticeNode(), which is
// null when there is nothing to say, and replaceNodeChildren() passed it straight on to node.replaceChildren(), which
// writes a null as the text "null". el() leaves such a child out, and replaceNodeChildren() has to do the same. These
// run guest.js in a vm sandbox, as the admin's startup-order.test.js does, with a small working DOM for the elements
// they check.

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const ROOT = path.join(__dirname, "..");
const GUEST_SOURCE = fs.readFileSync(path.join(ROOT, "guest.js"), "utf8");

// A stand-in for any DOM object these tests don't check: every property is another stand-in, calling one returns one,
// writes are ignored.
function standIn() {
  return new Proxy(function () {}, {
    get(target, prop) {
      if (prop === Symbol.toPrimitive) return () => "";
      if (prop === Symbol.iterator) return function* () {};
      if (prop === "then") return undefined;
      return standIn();
    },
    set: () => true,
    apply: () => standIn(),
    construct: () => standIn()
  });
}

function fakeText(text) {
  return { nodeType: 3, textContent: String(text) };
}

// Just enough of an element for el(), replaceNodeChildren() and the idle weather render; it has no classList, style or
// dataset, so a load path that starts using one needs it added here. Its replaceChildren() does what a browser's does
// with an argument that is not a node: it writes String(value) as a text node, so a null becomes the text "null".
// { modern: false } leaves replaceChildren() out, for the fallback path.
function fakeElement(tagName, { modern = true } = {}) {
  let childNodes = [];
  const element = {
    nodeType: 1,
    tagName: String(tagName).toUpperCase(),
    className: "",
    hidden: false,
    attributes: {},
    get childNodes() { return childNodes; },
    get firstChild() { return childNodes[0] || null; },
    get textContent() { return childNodes.map(node => node.textContent).join(""); },
    set textContent(text) { childNodes = text === "" ? [] : [fakeText(text)]; },
    setAttribute(name, value) { element.attributes[name] = String(value); },
    addEventListener() {},
    appendChild(child) { childNodes.push(child); return child; },
    removeChild(child) { childNodes = childNodes.filter(node => node !== child); return child; }
  };
  if (modern) {
    element.replaceChildren = (...nodes) => {
      childNodes = nodes.map(node => (node && node.nodeType ? node : fakeText(node)));
    };
  }
  return element;
}

// Loads guest.js as the browser does, with the idle weather elements of index.html working and every other element a
// stand-in. Requests never answer and timers never fire, so after the load only the tests change the page.
function loadGuest() {
  const elements = {
    idleDashboardWeatherSection: fakeElement("section"),
    idleDashboardWeatherBody: fakeElement("div"),
    idleDashboardWeatherMeta: fakeElement("div")
  };
  const document = new Proxy(standIn(), {
    get(target, prop) {
      if (prop === "getElementById") return id => elements[id] || standIn();
      if (prop === "createElement") return tagName => fakeElement(tagName);
      if (prop === "createTextNode") return text => fakeText(text);
      return target[prop];
    }
  });
  const window = {
    document,
    location: { search: "", hash: "", pathname: "/", origin: "http://guest.test", href: "http://guest.test/" },
    navigator: {},
    localStorage: standIn(),
    matchMedia: () => ({ matches: false, addEventListener: () => {} }),
    addEventListener: () => {},
    fetch: () => new Promise(() => {}),
    setTimeout: () => 0,
    clearTimeout: () => {},
    setInterval: () => 0,
    clearInterval: () => {},
    console,
    URL,
    URLSearchParams
  };
  window.window = window;
  window.self = window;
  const context = vm.createContext(window);
  vm.runInContext(GUEST_SOURCE, context, { filename: "guest.js" });
  return { elements, run: code => vm.runInContext(code, context) };
}

function label(node) {
  return node.nodeType === 3 ? `#text ${node.textContent}` : `${node.tagName}.${node.className}`;
}

// The moon picture is what puts the idle weather in its layout, as on the boat.
const FIRST_QUARTER = { phase: 0.25, phase_name: "First Quarter", image: "/assets/moon/first-quarter.png" };

function showIdleWeather(guest, error) {
  guest.run(`
    idleWeatherState = { ...idleWeatherState, moon: ${JSON.stringify(FIRST_QUARTER)}, error: ${JSON.stringify(error)} };
    syncIdleWeatherSection();
  `);
  return guest.elements.idleDashboardWeatherBody;
}

test("the idle weather panel shows nothing under the moon when there is no weather error", () => {
  const body = showIdleWeather(loadGuest(), "");
  assert.deepEqual(body.childNodes.map(label), ["DIV.idle-weather-layout"]);
});

test("a weather error still shows as a notice under the moon", () => {
  const body = showIdleWeather(loadGuest(), "Weather is offline.");
  assert.deepEqual(body.childNodes.map(label), ["DIV.idle-weather-layout", "DIV.idle-dashboard__footer-note"]);
  assert.equal(body.childNodes[1].textContent, "Weather is offline.");
});

test("replaceNodeChildren leaves out the children el() leaves out, with or without replaceChildren()", () => {
  const replaceNodeChildren = loadGuest().run("replaceNodeChildren");
  [true, false].forEach(modern => {
    const node = fakeElement("div", { modern });
    replaceNodeChildren(node, fakeElement("p"), null, "text", undefined, false, fakeElement("span"));
    assert.deepEqual(node.childNodes.map(label), ["P.", "#text text", "SPAN."], modern ? "replaceChildren()" : "fallback");
  });
});
