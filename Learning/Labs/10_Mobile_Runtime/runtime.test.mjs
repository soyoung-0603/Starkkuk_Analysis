
import assert from "node:assert/strict";
import test from "node:test";
import {
  createScreenLoader,
  readPreferences,
  retry,
  watchVisibility,
  createModelSlot
} from "./runtime.mjs";
import { cacheFixture } from "./worker-strategy.mjs";

function deferred() {
  let resolve;
  let reject;
  const promise = new Promise((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
}

test("an old response cannot replace a newer screen even when cancellation is ignored", async () => {
  const first = deferred();
  const second = deferred();
  const commits = [];
  const signals = [];
  const screen = createScreenLoader((id, signal) => {
    signals.push(signal);
    return id === "A" ? first.promise : second.promise;
  }, value => commits.push(value));
  const a = screen.open("A");
  const b = screen.open("B");
  assert.equal(signals[0].aborted, true);
  second.resolve("B shown");
  assert.equal(await b, "shown");
  first.resolve("A is late");
  assert.equal(await a, "stale");
  assert.deepEqual(commits, ["B shown"]);
});

test("leaving a screen cancels requests and current failures remain visible", async () => {
  const screen = createScreenLoader((_id, signal) => new Promise((_yes, no) => {
    signal.addEventListener("abort", () => no(signal.reason), { once: true });
  }), () => assert.fail("cancelled response was committed"));
  const pending = screen.open("A");
  screen.close();
  assert.equal(await pending, "stale");

  const broken = createScreenLoader(async () => { throw Error("offline"); }, () => {});
  await assert.rejects(broken.open("B"), /offline/);
});

test("local preferences migrate valid v1 and preserve unknown or broken input", () => {
  let value = JSON.stringify({ version: 1, dark: true });
  const writes = [];
  const storage = { getItem: () => value, setItem: (key, raw) => writes.push([key, raw]) };
  assert.deepEqual(readPreferences(storage), { version: 2, theme: "dark" });
  assert.equal(writes.length, 1);
  value = "{not json";
  assert.deepEqual(readPreferences(storage), { version: 2, theme: "light" });
  value = JSON.stringify({ version: 9, theme: "dark" });
  assert.deepEqual(readPreferences(storage), { version: 2, theme: "light" });
  assert.equal(writes.length, 1);
  storage.setItem = () => { throw Error("quota"); };
  value = JSON.stringify({ version: 1, dark: false });
  assert.deepEqual(readPreferences(storage), { version: 2, theme: "light" });
});

test("temporary failure retries with delays while permanent failure stops", async () => {
  const delays = [];
  let attempts = 0;
  const options = { sleep: async ms => delays.push(ms) };
  const temporary = () => Object.assign(Error("temporary"), { transient: true });
  const value = await retry(async () => {
    if (++attempts < 3) throw temporary();
    return "recovered";
  }, options);
  assert.equal(value, "recovered");
  assert.deepEqual(delays, [50, 100]);
  await assert.rejects(retry(async () => { throw Error("permanent"); }, options), /permanent/);
  await assert.rejects(retry(async () => { throw temporary(); }, options), /temporary/);
  assert.deepEqual(delays, [50, 100, 50, 100]);
});

test("cancelled backoff prevents the following retry", async () => {
  const controller = new AbortController();
  let attempts = 0;
  await assert.rejects(retry(async () => {
    attempts++;
    throw Object.assign(Error("temporary"), { transient: true });
  }, { signal: controller.signal, sleep: async () => controller.abort() }), { name: "AbortError" });
  assert.equal(attempts, 1);
});

test("visibility changes pause/resume only on transitions and remove the listener", () => {
  const page = new EventTarget();
  const states = [];
  page.hidden = false;
  const stop = watchVisibility(page, state => states.push(state));
  page.hidden = true;
  page.dispatchEvent(new Event("visibilitychange"));
  page.dispatchEvent(new Event("visibilitychange"));
  page.hidden = false;
  page.dispatchEvent(new Event("visibilitychange"));
  stop();
  page.hidden = true;
  page.dispatchEvent(new Event("visibilitychange"));
  assert.deepEqual(states, ["active", "paused", "active"]);
});

test("out-of-order models are disposed and closing releases the displayed model", async () => {
  const slow = deferred();
  const disposed = [];
  const views = [];
  const model = id => ({ id, dispose: () => disposed.push(id) });
  const slot = createModelSlot(
    id => id === "A" ? slow.promise : Promise.resolve(model(id)),
    value => views.push(value?.id ?? "base")
  );
  const a = slot.show("A");
  await slot.show("B");
  slow.resolve(model("A"));
  assert.equal(await a, "stale");
  slot.close();
  assert.deepEqual(views, ["base", "base", "B", "base"]);
  assert.deepEqual(disposed, ["A", "B"]);
});

test("model failure restores the fallback and late completion after close is released", async () => {
  const slow = deferred();
  const views = [];
  let disposed = 0;
  const slot = createModelSlot(
    id => id === "broken" ? Promise.reject(Error("invalid model")) : slow.promise,
    (model, error) => views.push([model?.id ?? "base", error?.message])
  );
  assert.equal(await slot.show("broken"), "fallback");
  const pending = slot.show("late");
  slot.close();
  slow.resolve({ id: "late", dispose: () => disposed++ });
  assert.equal(await pending, "stale");
  assert.equal(views[1][1], "invalid model");
  assert.equal(disposed, 1);
});

test("cache-first serves a stored local fixture even if networking fails", async () => {
  const stored = new Map();
  const cache = { match: key => stored.get(key), put: (key, value) => stored.set(key, value) };
  let calls = 0;
  const get = async () => {
    if (++calls > 1) throw Error("offline");
    return new Response("fixture");
  };
  const key = "http://localhost/fixture.txt";
  assert.equal(await (await cacheFixture(cache, key, get)).text(), "fixture");
  assert.equal(await (await cacheFixture(cache, key, get)).text(), "fixture");
  assert.equal(calls, 1);
});

test("HTTP errors and offline misses are never stored", async () => {
  const cache = { match: () => undefined, put: () => assert.fail("error was cached") };
  const key = "http://localhost/fixture.txt";
  const bad = await cacheFixture(cache, key, async () => new Response("error", { status: 503 }));
  assert.equal(bad.status, 503);
  await assert.rejects(cacheFixture(cache, key, async () => { throw Error("offline"); }), /offline/);
});
