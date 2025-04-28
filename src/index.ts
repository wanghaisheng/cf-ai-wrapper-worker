import { fromHono } from "chanfana";
import { Hono } from "hono";
import { Ask } from "./endpoints/ask";

const app = new Hono<{ Bindings: Env }>();

const openapi = fromHono(app, {
  docs_url: "/",
});

openapi.get("/ask", Ask);

export default app;
