
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdtemp, readFile, realpath, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { basename, dirname, join } from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import { fileURLToPath } from "node:url";

const chromePath = process.argv[2];
if (!chromePath) throw Error("Pass the path to an existing Chrome executable.");

const root = await realpath(tmpdir());
const profile = await mkdtemp(join(root, "mobile-runtime-lab-"));
const serverPath = fileURLToPath(new URL("./serve.mjs", import.meta.url));
const server = spawn(process.execPath, [serverPath, "0"], { windowsHide: true });
let serverOutput = "";
server.stdout.setEncoding("utf8");
server.stdout.on("data", data => { serverOutput += data; });

let chrome;
let socket;
let send;

async function waitFor(read, timeout = 12000) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    const result = await read();
    if (result) return result;
    await delay(100);
  }
  throw Error("Local test timed out waiting for readiness.");
}

function cdp(socket) {
  const pending = new Map();
  let sequence = 0;
  socket.addEventListener("message", event => {
    const response = JSON.parse(event.data);
    const handlers = pending.get(response.id);
    if (!handlers) return;
    pending.delete(response.id);
    if (response.error) handlers.reject(Error(response.error.message));
    else handlers.resolve(response.result);
  });
  return (method, params = {}) => new Promise((resolve, reject) => {
    const id = ++sequence;
    const timer = setTimeout(() => {
      pending.delete(id);
      reject(Error("Chrome did not answer " + method));
    }, 5000);
    const finish = callback => value => { clearTimeout(timer); callback(value); };
    pending.set(id, { resolve: finish(resolve), reject: finish(reject) });
    socket.send(JSON.stringify({ id, method, params }));
  });
}

try {
  const url = await waitFor(() => serverOutput.match(/http:\/\/127\.0\.0\.1:\d+\//)?.[0]);
  chrome = spawn(chromePath, [
    "--headless", "--disable-gpu", "--disable-background-networking",
    "--disable-component-update", "--no-first-run", "--no-default-browser-check",
    "--no-proxy-server", "--remote-debugging-address=127.0.0.1",
    "--remote-debugging-port=0", "--user-data-dir=" + profile, "about:blank"
  ], { windowsHide: true, stdio: "ignore" });

  const port = await waitFor(async () => {
    try {
      const value = await readFile(join(profile, "DevToolsActivePort"), "utf8");
      return value.match(/^\d+/)?.[0];
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
      return null;
    }
  });

  const target = await waitFor(async () => {
    const tabs = await (await fetch("http://127.0.0.1:" + port + "/json/list")).json();
    return tabs.find(tab => tab.type === "page" && tab.url === "about:blank");
  });
  socket = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    socket.addEventListener("open", resolve, { once: true });
    socket.addEventListener("error", reject, { once: true });
  });
  send = cdp(socket);
  const navigation = await send("Page.navigate", { url });
  assert.equal(navigation.errorText, undefined);

  const status = await waitFor(async () => {
    const evaluation = await send("Runtime.evaluate", {
      expression: "document.querySelector('#result')?.dataset.status",
      returnByValue: true
    });
    const value = evaluation.result?.value;
    return value === "running" ? null : value;
  }, 20000);
  const detail = await send("Runtime.evaluate", {
    expression: "document.querySelector('#result')?.textContent",
    returnByValue: true
  });
  assert.equal(status, "passed", detail.result?.value);
  console.log("PASS: browser registered and used the worker and verified Cache Storage reuse.");
} finally {
  if (send && socket?.readyState === WebSocket.OPEN) {
    // Closing the browser can cut the connection before the command replies.
    const closed = new Promise(resolve => socket.addEventListener("close", resolve, { once: true }));
    await Promise.race([send("Browser.close").catch(() => {}), closed]);
  }
  socket?.close();
  if (chrome && chrome.exitCode === null) chrome.kill();
  if (server.exitCode === null) server.kill();

  const resolvedProfile = await realpath(profile).catch(() => null);
  if (resolvedProfile && dirname(resolvedProfile) === root &&
      basename(resolvedProfile).startsWith("mobile-runtime-lab-")) {
    await rm(resolvedProfile, { recursive: true, force: true, maxRetries: 4, retryDelay: 250 });
  }
}
