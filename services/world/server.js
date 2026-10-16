// Test service: /healthz answers 200; / reports whether each peer answers a TCP connect, by internal name.
const http = require("http"), net = require("net");
const name = process.env.SERVICE || process.env.SERVICE_NAME || "service", port = Number(process.env.PORT || 3000);
function hostPort(url, def) { try { const u = new URL(url); return [u.hostname, Number(u.port || def)]; } catch { return null; } }
function probe(target) {
  return new Promise((res) => {
    if (!target) return res("not set");
    const s = net.connect({ host: target[0], port: target[1], timeout: 2000 });
    s.on("connect", () => { s.destroy(); res("ok"); });
    s.on("timeout", () => { s.destroy(); res("timeout"); });
    s.on("error", (e) => res(e.code || "error"));
  });
}
http.createServer(async (req, rsp) => {
  if (req.url === "/healthz") { rsp.writeHead(200); return rsp.end("ok\n"); }
  const peers = {
    database: hostPort(process.env.DATABASE_URL, 5432),
    cache: hostPort(process.env.REDIS_URL, 6379),
    peer: hostPort(process.env.WORLD_URL || process.env.LOBBY_URL || "", 80),
  };
  const out = { service: name };
  for (const [k, v] of Object.entries(peers)) out[k] = await probe(v);
  rsp.writeHead(200, { "Content-Type": "application/json" });
  rsp.end(JSON.stringify(out) + "\n");
}).listen(port, () => console.log(`${name} listening on ${port}`));
