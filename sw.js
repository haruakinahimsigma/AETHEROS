importScripts("/scram/scramjet.all.js");

const { ScramjetServiceWorker } = $scramjetLoadWorker();
const scramjet = new ScramjetServiceWorker();

async function handleRequest(event) {
  const url = new URL(event.request.url);
  const sameOrigin = url.origin === self.location.origin;
  const proxyPath = url.pathname.startsWith("/scramjet/");
  if (!sameOrigin || !proxyPath) return fetch(event.request);
  await scramjet.loadConfig();
  if (scramjet.route(event)) return scramjet.fetch(event);
  return fetch(event.request);
}

self.addEventListener("fetch", event => {
  event.respondWith(handleRequest(event));
});
