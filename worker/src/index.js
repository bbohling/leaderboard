import { Hono } from "hono";
import { cors } from "hono/cors";
import { PrismaClient } from "@prisma/client";
import { PrismaD1 } from "@prisma/adapter-d1";

// Cloudflare Workers port of the Express leaderboard API (../index.js).
// Serves api.brycebohling.com/* — Caddy proxied the full path, so no
// prefix stripping. Same three routes, same response shapes.
const app = new Hono();

app.use("*", cors()); // Express used cors() with defaults: allow any origin

app.use("*", async (c, next) => {
  c.set("prisma", new PrismaClient({ adapter: new PrismaD1(c.env.DB) }));
  await next();
});

app.get("/leaderboards", async (c) => {
  const rawLimit = c.req.query("limit");
  const limit = rawLimit ? Number(rawLimit) : undefined;
  const version = c.req.query("version");
  const difficulty = c.req.query("difficulty");

  const query = {
    where: { version, difficulty },
    take: limit,
    orderBy: [{ score: "desc" }, { createdAt: "desc" }],
  };
  const prisma = c.get("prisma");
  const leaderboards = await prisma.leaderboard.findMany(query);
  return c.json({
    results: leaderboards?.length,
    data: leaderboards,
  });
});

app.post("/leaderboards", async (c) => {
  const body = await c.req.json();
  const prisma = c.get("prisma");
  const newEntry = await prisma.leaderboard.create({ data: body });
  return c.json(newEntry);
});

app.delete("/leaderboards/:id", async (c) => {
  const token = c.req.query("lbToken");
  // LB_TOKEN is not configured in production (matching the droplet), so this
  // guard 404s every delete unless the secret is set later.
  if (c.env.LB_TOKEN && token === c.env.LB_TOKEN) {
    const id = Number(c.req.param("id"));
    const prisma = c.get("prisma");
    const leader = await prisma.leaderboard.delete({ where: { id } });
    return c.json(leader);
  }
  return c.text("Not Found", 404);
});

// Express (no error middleware, NODE_ENV unset) answered errors with a
// 500 and a plain-text-ish body; mirror that rather than leaking details.
app.onError((err, c) => {
  console.error(`[Error] ${c.req.method} ${c.req.path}:`, err.message);
  return c.text("Internal Server Error", 500);
});

// Express's default 404 is a small HTML page; mirror it byte-for-byte.
app.notFound((c) => {
  const body = `<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<title>Error</title>\n</head>\n<body>\n<pre>Cannot ${c.req.method} ${c.req.path}</pre>\n</body>\n</html>\n`;
  return c.html(body, 404);
});

export default app;
