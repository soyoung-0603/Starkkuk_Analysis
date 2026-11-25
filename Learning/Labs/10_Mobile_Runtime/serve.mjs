
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";

const port = Number(process.argv[2] ?? 47261);
const files = new Map([
  ["/browser.mjs", "browser.mjs"],
  ["/runtime.mjs", "runtime.mjs"],
  ["/demo-sw.mjs", "demo-sw.mjs"],
  ["/worker-strategy.mjs", "worker-strategy.mjs"]
]);
let fixtureRequests = 0;

const server = createServer(async (request, response) => {
  response.setHeader("Cache-Control", "no-store");
  if (request.method !== "GET") {
    response.writeHead(405).end();
    return;
  }
  if (request.url === "/fixture.txt") {
    response.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("local fixture request " + ++fixtureRequests);
    return;
  }
  if (request.url === "/") {
    response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    response.end(`<!doctype html><html lang="ko"><meta charset="utf-8">
      <title>모바일 런타임 독립 실습</title>
      <h1>Service Worker 실습</h1>
      <p>탭 상태 <output id="visibility"></output></p>
      <p id="result" data-status="running" role="status">확인 중</p>
      <script type="module" src="/browser.mjs"></script>`);
    return;
  }
  const path = files.get(request.url);
  if (!path) {
    response.writeHead(404).end();
    return;
  }
  try {
    const body = await readFile(new URL(path, import.meta.url));
    response.writeHead(200, { "Content-Type": "text/javascript; charset=utf-8" });
    response.end(body);
  } catch {
    response.writeHead(500).end();
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log("Lab ready at http://127.0.0.1:" + server.address().port + "/");
});
