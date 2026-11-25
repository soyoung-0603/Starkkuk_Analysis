
import { cacheFixture } from "./worker-strategy.mjs";

const prefix = "mobile-runtime-lab-";
const version = prefix + "1";
const fixture = "/fixture.txt";

self.addEventListener("install", event => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    const outdated = names.filter(name => name.startsWith(prefix) && name !== version);
    await Promise.all(outdated.map(name => caches.delete(name)));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", event => {
  const { request } = event;
  const url = new URL(request.url);
  if (request.method !== "GET" ||
      url.origin !== self.location.origin ||
      url.pathname !== fixture ||
      url.search) return;

  event.respondWith((async () => {
    const cache = await caches.open(version);
    return cacheFixture(cache, request);
  })());
});
