import { createServer } from "node:http";
import next from "next";
import fetchApp from "../lib/fetchers/ac/fetchApp";
import addEmbedModeResponseHeaders from "../lib/util/addEmbedModeResponseHeaders";
import { log } from "../lib/util/logger";

const dev = process.env.NODE_ENV !== "production";
const defaultHostname = "localhost";
const port = process.env.PORT ? Number(process.env.PORT) : 3000;
const app = next({ dev, hostname: defaultHostname, port });
const handle = app.getRequestHandler();

log.log("Preparing app...");
app.prepare().then(() => {
  log.log("Creating server...");
  const server = createServer(async (req, res) => {
    try {
      const url = new URL(req.url);
      const hostname =
        req && global.window
          ? req.headers.host
          : global.window.location.hostname;
      const appToken = process.env.NEXT_PUBLIC_ACCESSIBILITY_CLOUD_APP_TOKEN;
      const baseUrl = process.env.NEXT_PUBLIC_ACCESSIBILITY_CLOUD_BASE_URL;
      const customizedApp = await fetchApp({ baseUrl, appToken, hostname });
      if (!customizedApp) {
        throw new Error(`No app found for hostname ${hostname}`);
      }
      const embedToken = url.searchParams.get("embedToken");

      addEmbedModeResponseHeaders(
        customizedApp,
        res,
        typeof embedToken === "string" ? embedToken : undefined,
      );

      await handle(req, res);
    } catch (err) {
      log.error("Error occurred handling", req.url, err);
      res.statusCode = 500;
      res.end("internal server error");
    }
  });
  log.log("Start listening...");
  server.listen(port, () => {
    log.log(`> Ready on http://${defaultHostname}:${port}`);
  });
});
