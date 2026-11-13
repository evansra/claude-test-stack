// Scaling Phase 0 (home-lab research/024 § 7): one image, run as several replicas behind one proxy route.
// Every answer names the replica, so a test can see which one served it. Nothing here is secret or public.
const http = require("http"), os = require("os"), crypto = require("crypto");
const id = process.env.INSTANCE_ID || os.hostname();
const started = new Date().toISOString();
let sick = false, scaleMode = "valid";

const server = http.createServer((req, res) => {
  const u = req.url;
  if (u === "/healthz") { res.statusCode = sick ? 500 : 200; res.end(sick ? "sick\n" : "ok\n"); return; }
  if (u === "/admin/sick") { sick = true; res.end(`${id} sick\n`); return; }
  if (u === "/admin/well") { sick = false; res.end(`${id} well\n`); return; }
  if (u.startsWith("/admin/scale/")) { scaleMode = u.slice(13); res.end(`${id} scale=${scaleMode}\n`); return; }
  if (u.startsWith("/burn")) {                       // /burn?ms=5000: one core busy, for a CPU reading
    const ms = Math.min(parseInt((u.split("ms=")[1] || "2000"), 10) || 2000, 30000), end = Date.now() + ms;
    while (Date.now() < end) crypto.createHash("sha256").update("x").digest();
    res.end(`${id} burned ${ms} ms\n`); return;
  }
  if (u === "/scale") {
    if (scaleMode === "redirect") { res.writeHead(302, { Location: "http://127.0.0.1:8000/" }); res.end(); return; }
    if (scaleMode === "slow") { setTimeout(() => res.end('{"v":1,"want":{"world":[1,2]}}\n'), 5000); return; }
    if (scaleMode === "big") { res.end(JSON.stringify({ v: 1, want: { world: [1, 2] }, pad: "x".repeat(8192) }) + "\n"); return; }
    if (scaleMode === "junk") { res.end("want world 1,2,3,4; rm -rf /\n"); return; }
    if (scaleMode === "greedy") { res.end('{"v":1,"want":{"world":[1,2,3,4,5,6,7,8,9],"../etc":[1]}}\n'); return; }
    res.setHeader("content-type", "application/json"); res.end('{"v":1,"want":{"world":[1,2]}}\n'); return;
  }
  res.end(`id=${id} url=${u} started=${started} build=3\n`);
});

// A minimal WebSocket: complete the handshake, send one text frame naming the replica, close.
server.on("upgrade", (req, sock) => {
  const key = req.headers["sec-websocket-key"];
  if (!key) { sock.destroy(); return; }
  const accept = crypto.createHash("sha1").update(key + "258EAFA5-E914-47DA-95CA-C5AB0DC85B11").digest("base64");
  sock.write(`HTTP/1.1 101 Switching Protocols\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Accept: ${accept}\r\n\r\n`);
  const msg = Buffer.from(`ws id=${id} url=${req.url}`).subarray(0, 120);   // one short frame: length fits 7 bits
  sock.write(Buffer.concat([Buffer.from([0x81, msg.length]), msg]));
  setTimeout(() => { sock.write(Buffer.from([0x88, 0x00])); sock.end(); }, 300);
});

process.on("SIGTERM", () => { console.log(`SIGTERM received by ${id}: closing`); server.close(() => process.exit(0)); setTimeout(() => process.exit(0), 2000); });
server.listen(3000, "0.0.0.0", () => console.log(`${id} listening on 3000`));
