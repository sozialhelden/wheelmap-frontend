import { IApp } from '../../model/ac/App';
import { fetchDocumentWithTypeTag } from './fetchDocument';

export function interpretJSONResponseAsApp(json: unknown): IApp {
  return json as IApp
}

export function appIdForHostname(hostname: string) {
  const cleanedHostName = hostname
    // Allow sharing a deployment with ngrok
    .replace(/.*\.ngrok(?:-free)\.app$/, 'wheelmap.tech')
    // Allow branch test deployments
    .replace(/.*\.wheelmap\.tech$/, 'wheelmap.tech')
    // Use 'localhost' as hostname for loopback IP
    .replace(/127\.0\.0\.1/, 'localhost')
  return cleanedHostName;
}

export default function fetchApp({ baseUrl, appToken, hostname }: { baseUrl: string, appToken: string, hostname: string }) {
  return fetchDocumentWithTypeTag<IApp>(baseUrl, 'ac:App', appIdForHostname(hostname), `appToken=${appToken}`);
}
