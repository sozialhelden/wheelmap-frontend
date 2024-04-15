import { App } from "../model/ac/App";

export function interpretJSONResponseAsApp(json: unknown): App {
  return json as App;
}

export default function fetchApp([baseUrl, hostname, appToken]: [string, string, string]) {
  const cleanedHostName = hostname
    // Allow sharing a deployment with ngrok
    .replace(/.*\.ngrok(?:-free)\.app$/, "wheelmap.tech")
    // Allow branch test deployments
    .replace(/.*\.wheelmap\.tech$/, "wheelmap.tech")
    // Use 'localhost' as hostname for loopback IP
    .replace(/127\.0\.0\.1/, "localhost");

  const url = `${baseUrl}/apps/${cleanedHostName}.json?appToken=${appToken}`;

  return fetch(url)
    .then((response) => response.json())
    .then(interpretJSONResponseAsApp);
}
