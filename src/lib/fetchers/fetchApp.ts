import { IApp } from '../model/ac/App';

export function interpretJSONResponseAsApp(json: unknown): IApp {
  return json as IApp;
}

export default function fetchApp([hostname, appToken]: [string, string]) {
  const baseUrl = process.env.NEXT_PUBLIC_ACCESSIBILITY_CLOUD_UNCACHED_BASE_URL;
  const cleanedHostName = hostname
    // Allow sharing a deployment with ngrok
    .replace(/.*\.ngrok(?:-free)\.app$/, 'wheelmap.tech')
    // Allow branch test deployments
    .replace(/.*\.wheelmap\.tech$/, 'wheelmap.tech')
    // Use 'localhost' as hostname for loopback IP
    .replace(/127\.0\.0\.1/, 'localhost');

  const url = `${baseUrl}/apps/${cleanedHostName}.json?appToken=${appToken}`;

  return fetch(url)
    .then((response) => response.json())
    .then(interpretJSONResponseAsApp);
}
