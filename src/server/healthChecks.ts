export default function registerHealthChecks(app) {
  app.get('/healthy', (req, res) => {
    res.status(200).send('OK!');
  });

  app.get('/ready', (req, res) => {
    // TODO: Add logic for overload here
    res.status(200).send('OK!');
  });
}
