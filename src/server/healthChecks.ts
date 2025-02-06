export default function registerHealthChecks(app) {
  app.get("/healthy", (req, res) => {
    res.status(200).send('{ "status": "ok" }');
  });
  app.get("/healthz", (req, res) => {
    res.status(200).send('{ "status": "ok" }');
  });
  app.get("/ready", (req, res) => {
    // TODO: Add logic for overload here
    res.status(200).send('{ "status": "ok" }');
  });
}
