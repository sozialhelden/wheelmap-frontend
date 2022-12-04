import { App } from "../model/ac/App";

export function interpretJSONResponseAsApp(json: unknown): App {
  return json as App;
}

export default function fetchApp([hostname, appToken]: [string, string]) {
  const baseUrl = process.env.REACT_APP_ACCESSIBILITY_CLOUD_UNCACHED_BASE_URL;
  const cleanedHostName = hostname
    // Allow test deployments on zeit
    .replace(/-[a-z0-9]+\.now\.sh$/, ".now.sh")
    // Allow branch test deployments
    .replace(/.*\.wheelmap\.tech$/, "wheelmap.tech")
    // Use 'localhost' as hostname for loopback IP
    .replace(/127\.0\.0\.1/, "localhost");

  const url = `${baseUrl}/apps/${cleanedHostName}.json?appToken=${appToken}`;

  return fetch(url)
    .then((response) => response.json())
    .then(interpretJSONResponseAsApp);
}
