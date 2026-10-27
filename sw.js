importScripts("/scram/scramjet.all.js");

const { ScramjetServiceWorker } = $scramjetLoadWorker();
const scramjet = new ScramjetServiceWorker();

async function handleRequest(event) {
  const url = new URL(event.request.url);

  // The default Scramjet prefix is /a/. Do not invoke Scramjet at all for
  // normal app/runtime requests: on Safari, route() itself may touch its
  // IndexedDB cache and throw if that store is not initialized.
  if (url.origin !== self.location.origin || !url.pathname.startsWith("/a/")) {
    return fetch(event.request);
  }

  await scramjet.loadConfig();
  if (scramjet.route(event)) return scramjet.fetch(event);
  return fetch(event.request);
}

self.addEventListener("fetch", event => {
  event.respondWith(handleRequest(event));
});
