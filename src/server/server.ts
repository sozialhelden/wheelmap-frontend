import { createServer } from "http";
import next from "next";
import { parse } from "url";
import addEmbedModeResponseHeaders from "../lib/addEmbedModeResponseHeaders";
import fetchApp from "../lib/fetchers/fetchApp";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = process.env.PORT ? Number(process.env.PORT) : 3000;
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      // Be sure to pass `true` as the second argument to `url.parse`.
      // This tells it to parse the query portion of the URL.
      const parsedUrl = parse(req.url, true);
      const { pathname, query } = parsedUrl;
      const hostname = req ? req.headers["host"] : location.hostname;
      const appToken = process.env.NEXT_PUBLIC_ACCESSIBILITY_CLOUD_APP_TOKEN;
      const { embedToken } = query;
      const app = await fetchApp([hostname, appToken]);

      addEmbedModeResponseHeaders(
        app,
        res,
        typeof embedToken === "string" ? embedToken : undefined
      );

      // if (pathname === "/a") {
      //   await app.render(req, res, "/a", query);
      // } else if (pathname === "/b") {
      //   await app.render(req, res, "/b", query);
      // } else {
      // }

      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error("Error occurred handling", req.url, err);
      res.statusCode = 500;
      res.end("internal server error");
    }
  }).listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
