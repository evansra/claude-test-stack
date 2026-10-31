// T50 test service: the repo-root Dockerfile (path: .) and the stack's MongoDB through DATABASE_URL.
const http = require("http");
const { MongoClient } = require("mongodb");
const client = new MongoClient(process.env.DATABASE_URL || "mongodb://missing", { serverSelectionTimeoutMS: 3000 });
const db = () => client.db();   // the database named in the URL
client.connect().then(() => console.log("connected to", db().databaseName)).catch(e => console.log("connect failed:", e.message));
http.createServer(async (req, res) => {
  try {
    if (req.url === "/healthz") { await db().command({ ping: 1 }); res.end("ok"); return; }
    if (req.url === "/count") {
      await db().collection("visits").insertOne({ at: new Date() });
      res.end(String(await db().collection("visits").countDocuments())); return;
    }
    res.end("claude-test-mongo");
  } catch (e) { res.statusCode = 503; res.end(e.message); }
}).listen(3000, "0.0.0.0", () => console.log("listening on 3000"));
process.on("SIGTERM", () => client.close().finally(() => process.exit(0)));
