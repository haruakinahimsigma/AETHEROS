importScripts("/scram/scramjet.all.js");

const { ScramjetServiceWorker } = $scramjetLoadWorker();
const scramjet = new ScramjetServiceWorker();

async function handleRequest(event) {
  // Only initialize Scramjet for requests that belong to an active proxied
  // frame. Running loadConfig() for every normal request can fail in Safari's
  // IndexedDB implementation and break even requests for /sw.js itself.
  if (!scramjet.route(event)) return fetch(event.request);

  await scramjet.loadConfig();
  return scramjet.fetch(event);
}

self.addEventListener("fetch", event => {
  event.respondWith(handleRequest(event));
});
