import crypto from "node:crypto";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import { createBareServer } from "@nebula-services/bare-server-node";
import { scramjetPath } from "@mercuryworkshop/scramjet/path";
import { libcurlPath } from "@mercuryworkshop/libcurl-transport";
import { baremuxPath } from "@mercuryworkshop/bare-mux/node";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT || 8080);
const PASSWORD = process.env.PROXY_PASSWORD || "";
if (process.env.NODE_ENV === "production" && !PASSWORD) {
  console.error("Set PROXY_PASSWORD before deploying: an unauthenticated public proxy is unsafe.");
  process.exit(1);
}
if (!PASSWORD) console.warn("PROXY_PASSWORD is not set; proxy routes are unprotected in this development run.");

const app = express();
const server = http.createServer();
const bare = createBareServer("/ca/");
app.set("trust proxy", 1);
app.use(express.urlencoded({ extended: false, limit: "8kb" }));

// Serve the Interstellar engine's browser-side runtime from installed packages.
// Keep these routes ahead of the general static handler so package files are
// available at the stable URLs expected by Scramjet and BareMux.
app.use("/scram/", express.static(scramjetPath, { fallthrough: false, index: false }));
app.use("/libcurl/", express.static(libcurlPath, { fallthrough: false, index: false }));
app.use("/baremux/", express.static(baremuxPath, { fallthrough: false, index: false }));

function token() { return crypto.createHmac("sha256", PASSWORD).update("aetheros-interstellar-session").digest("hex"); }
function authorized(req) {
  if (!PASSWORD) return true;
  const cookie = (req.headers.cookie || "").split(";").map(v => v.trim()).find(v => v.startsWith("aether_proxy="));
  const actual = cookie?.slice("aether_proxy=".length) || "", expected = token();
  return actual.length === expected.length && crypto.timingSafeEqual(Buffer.from(actual), Buffer.from(expected));
}
function loginPage(next = "/") {
  const safeNext = next.startsWith("/") && !next.startsWith("//") ? next : "/";
  return `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Unlock Interstellar</title><style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#0a0d17;color:#eef3ff;font:15px system-ui}form{width:min(360px,calc(100vw - 48px));padding:28px;border:1px solid #ffffff20;border-radius:20px;background:#121a2b;box-sizing:border-box}h1{font-size:23px}p{color:#9baac4;font-size:13px}input,button{box-sizing:border-box;width:100%;padding:12px;border-radius:9px;margin-top:10px}input{background:#080e1b;border:1px solid #ffffff24;color:white}button{background:#76a8ff;color:#07101f;border:0;font-weight:700;cursor:pointer}</style><form method="post" action="/proxy-login"><h1>Unlock Interstellar</h1><p>This proxy is password-protected by its owner.</p><input type="password" name="password" required autofocus placeholder="Proxy password"><input type="hidden" name="next" value="${safeNext.replace(/&/g,"&amp;").replace(/"/g,"&quot;")}"><button>Continue</button></form></html>`;
}
app.get("/proxy-login", (req, res) => res.status(200).type("html").send(loginPage(String(req.query.next || "/"))));
app.post("/proxy-login", (req, res) => {
  if (!PASSWORD) return res.redirect("/");
  const supplied = String(req.body.password || "");
  const valid = supplied.length === PASSWORD.length && crypto.timingSafeEqual(Buffer.from(supplied), Buffer.from(PASSWORD));
  if (!valid) return res.status(401).type("html").send(loginPage(String(req.body.next || "/")).replace("<p>This proxy is password-protected by its owner.</p>", "<p>Incorrect password. Please try again.</p>"));
  const secure = req.secure || req.headers["x-forwarded-proto"] === "https";
  res.setHeader("Set-Cookie", `aether_proxy=${token()}; Path=/; HttpOnly; SameSite=Lax; Max-Age=43200${secure ? "; Secure" : ""}`);
  const next = String(req.body.next || "/");
  res.redirect(next.startsWith("/") && !next.startsWith("//") ? next : "/");
});
app.get("/proxy-auth-status", (req, res) => res.json({ required: Boolean(PASSWORD), authorized: authorized(req) }));
app.use((req, res, next) => {
  if (req.path.startsWith("/a/") && !authorized(req)) return res.redirect("/proxy-login?next=" + encodeURIComponent(req.originalUrl));
  next();
});
app.use(express.static(__dirname, { index: false, dotfiles: "ignore", fallthrough: true, setHeaders(res, filePath) {
  if (filePath.endsWith(".js")) res.setHeader("X-Content-Type-Options", "nosniff");
}}));
app.get("/", (_req, res) => res.sendFile(path.join(__dirname, "index.html")));
app.get("/a/*", (_req, res) => res.status(404).type("html").send("<!doctype html><title>Interstellar</title><p>Open Interstellar from the AETHER OS browser so the proxy service worker can start.</p>"));
app.use((req, res) => res.status(404).type("text").send("Not found"));

server.on("request", (req, res) => {
  if (bare.shouldRoute(req)) {
    if (!authorized(req)) { res.writeHead(401, { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" }); return res.end("Proxy authentication required. Open /proxy-login first."); }
    return bare.routeRequest(req, res);
  }
  app(req, res);
});
server.on("upgrade", (req, socket, head) => {
  if (!bare.shouldRoute(req) || !authorized(req)) return socket.destroy();
  bare.routeUpgrade(req, socket, head);
});
server.listen(PORT, "0.0.0.0", () => console.log(`AETHER OS listening on port ${PORT}`));
