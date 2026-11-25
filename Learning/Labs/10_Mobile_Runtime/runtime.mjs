
export function createScreenLoader(load, commit) {
  let generation = 0;
  let controller;

  function close() {
    generation++;
    controller?.abort();
    controller = undefined;
  }

  async function open(screenId) {
    close();
    const ticket = generation;
    const request = new AbortController();
    controller = request;

    try {
      const value = await load(screenId, request.signal);
      if (generation !== ticket) return "stale";
      commit(value);
      return "shown";
    } catch (error) {
      if (generation !== ticket) return "stale";
      throw error;
    } finally {
      if (generation === ticket) controller = undefined;
    }
  }

  return { open, close };
}

const preferencesKey = "runtime-lab:preferences";

export function readPreferences(storage) {
  const defaults = { version: 2, theme: "light" };
  let stored;
  try {
    stored = JSON.parse(storage.getItem(preferencesKey));
  } catch {
    return defaults;
  }

  if (stored?.version === 2 && ["light", "dark"].includes(stored.theme)) {
    return { version: 2, theme: stored.theme };
  }
  if (stored?.version !== 1 || typeof stored.dark !== "boolean") return defaults;

  const migrated = { version: 2, theme: stored.dark ? "dark" : "light" };
  try {
    storage.setItem(preferencesKey, JSON.stringify(migrated));
  } catch {
    // The current session can still use the validated value.
  }
  return migrated;
}

function wait(milliseconds, signal) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(signal.reason);
      return;
    }

    const onAbort = () => {
      clearTimeout(timer);
      reject(signal.reason);
    };
    const timer = setTimeout(() => {
      signal?.removeEventListener("abort", onAbort);
      resolve();
    }, milliseconds);
    signal?.addEventListener("abort", onAbort, { once: true });
  });
}

export async function retry(operation, { signal, sleep = wait } = {}) {
  const delays = [50, 100];
  for (let attempt = 0; ; attempt++) {
    signal?.throwIfAborted();
    try {
      const value = await operation(signal);
      signal?.throwIfAborted();
      return value;
    } catch (error) {
      signal?.throwIfAborted();
      if (error?.transient !== true || attempt >= delays.length) throw error;
      await sleep(delays[attempt], signal);
    }
  }
}

export function watchVisibility(page, render) {
  let previous;
  function sync() {
    const state = page.hidden ? "paused" : "active";
    if (state === previous) return;
    previous = state;
    render(state);
  }
  page.addEventListener("visibilitychange", sync);
  sync();
  return () => page.removeEventListener("visibilitychange", sync);
}

export function createModelSlot(load, render) {
  let generation = 0;
  let controller;
  let attached;

  function close() {
    generation++;
    controller?.abort();
    controller = undefined;
    attached?.dispose();
    attached = undefined;
    render(null);
  }

  async function show(id) {
    close();
    const ticket = generation;
    controller = new AbortController();

    let model;
    try {
      model = await load(id, controller.signal);
    } catch (error) {
      if (generation !== ticket) return "stale";
      controller = undefined;
      render(null, error);
      return "fallback";
    }

    if (generation !== ticket) {
      model.dispose();
      return "stale";
    }
    controller = undefined;
    attached = model;
    render(model);
    return "shown";
  }

  return { show, close };
}
