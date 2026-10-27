importScripts("/scram/scramjet.all.js");

const { ScramjetServiceWorker } = $scramjetLoadWorker();
const scramjet = new ScramjetServiceWorker();

async function handleRequest(event) {
  const url = new URL(event.request.url);
  const isSameOrigin = url.origin === self.location.origin;
  const isProxyRequest = url.pathname.startsWith("/scramjet/");

  if (!isSameOrigin || !isProxyRequest) {
    return fetch(event.request);
  }

  await scramjet.loadConfig();
  if (scramjet.route(event)) return scramjet.fetch(event);
  return fetch(event.request);
}

self.addEventListener("fetch", event => {
  event.respondWith(handleRequest(event));
});
