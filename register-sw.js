"use strict";

async function registerInterstellarSW() {
  if (!("serviceWorker" in navigator)) {
    throw new Error("Service workers are not supported by this browser.");
  }
  if (location.protocol !== "https:" && !["localhost", "127.0.0.1"].includes(location.hostname)) {
    throw new Error("Interstellar requires HTTPS to start its browser engine.");
  }

  // Remove a stale worker once. Reloading on the next task lets Safari make
  // the next navigation without the old worker controlling fetch requests.
  const resetKey = "aether:sw-reset-v1";
  if (navigator.serviceWorker.controller && !sessionStorage.getItem(resetKey)) {
    sessionStorage.setItem(resetKey, "1");
    const registrations = await navigator.serviceWorker.getRegistrations();
    await Promise.all(registrations.map(registration => registration.unregister()));
    setTimeout(() => location.reload(), 0);
    return;
  }

  await navigator.serviceWorker.register("/sw.js?v=0797455", {
    scope: "/",
    updateViaCache: "none"
  });
  await navigator.serviceWorker.ready;
  sessionStorage.removeItem(resetKey);
}
