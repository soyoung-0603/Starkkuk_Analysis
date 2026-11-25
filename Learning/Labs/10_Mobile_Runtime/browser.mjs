
import { watchVisibility } from "./runtime.mjs";

const indicator = document.querySelector("#visibility");
const result = document.querySelector("#result");
const stop = watchVisibility(document, state => { indicator.textContent = state; });
window.addEventListener("pagehide", event => {
  if (!event.persisted) stop();
});

async function verifyWorker() {
  if (!("serviceWorker" in navigator)) throw Error("Service Worker unavailable");
  await navigator.serviceWorker.register("/demo-sw.mjs", { type: "module" });
  await navigator.serviceWorker.ready;
  if (!navigator.serviceWorker.controller) {
    await new Promise(resolve => {
      navigator.serviceWorker.addEventListener("controllerchange", resolve, { once: true });
    });
  }

  const store = await caches.open("mobile-runtime-lab-1");
  await store.delete("/fixture.txt");
  const first = await (await fetch("/fixture.txt")).text();
  const cachedResponse = await store.match("/fixture.txt");
  if (!cachedResponse) throw Error("Cache Storage entry missing");
  const saved = await cachedResponse.text();
  const second = await (await fetch("/fixture.txt")).text();
  if (!first.startsWith("local fixture request ") || first !== saved || first !== second) {
    throw Error("Cache Storage and cache-first result differ");
  }
  result.dataset.status = "passed";
  result.textContent = "등록·제어·Cache Storage·두 번째 응답 재사용 확인";
}

verifyWorker().catch(error => {
  result.dataset.status = "failed";
  result.textContent = error.message;
});
