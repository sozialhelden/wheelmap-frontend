import { IApp } from '../../model/ac/App.js'
import { fetchDocumentWithTypeTag } from './fetchDocument'

export function interpretJSONResponseAsApp(json: unknown): IApp {
  return json as IApp
}

export function appIdForHostnameOrIPAddress(hostnameOrIPAddress: string) {
  const cleanedHostName = hostnameOrIPAddress
    // Allow sharing a deployment with ngrok
    .replace(/.*\.ngrok(?:-free)\.app$/, 'wheelmap.tech')
    // Allow branch test deployments with a common branding
    .replace(/.*\.wheelmap\.tech$/, 'wheelmap.tech')
    // Use 'localhost' branding for loopback IPs
    .replace(/127\.0\.0\.1/, 'localhost')
    .replace(/0\.0\.0\.0/, 'localhost')
    .replace(/::1/, 'localhost')
  return cleanedHostName
}

export default function fetchApp({ baseUrl, appToken, hostname }: { baseUrl: string, appToken: string, hostname: string }) {
  return fetchDocumentWithTypeTag({
    baseUrl,
    type: 'ac:App',
    _id: appIdForHostnameOrIPAddress(hostname),
    paramsString: `appToken=${appToken}`,
  })
}
