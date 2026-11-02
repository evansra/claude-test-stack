// D148 test: /hang makes /healthz fail while the process keeps running (a hang Docker cannot see). Only a restart clears it.
const http = require("http");
let hung = false;
const started = new Date().toISOString();
http.createServer((req, res) => {
  if (req.url === "/hang") { hung = true; res.end("hung\n"); return; }
  if (req.url === "/healthz") { res.statusCode = hung ? 500 : 200; res.end(hung ? "hung\n" : "ok\n"); return; }
  res.end(`claude-test-heal, started ${started}, hung=${hung}\n`);
}).listen(3000, "0.0.0.0", () => console.log("listening on 3000"));
