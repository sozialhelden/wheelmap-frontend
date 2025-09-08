export async function getWhitelabelConfig(hostname: string) {
  const {
    NEXT_PUBLIC_ACCESSIBILITY_CLOUD_BASE_URL: baseUrl,
    NEXT_PUBLIC_ACCESSIBILITY_CLOUD_APP_TOKEN: appToken,
  } = process.env;

  const url = `${baseUrl}/apps/${sanitizeHostname(hostname)}.json?appToken=${appToken}`;

  const response = await fetch(url);
  return await response.json();
}

export function sanitizeHostname(hostnameOrIPAddress: string) {
  return (
    hostnameOrIPAddress
      // Allow sharing a deployment with ngrok
      .replace(/.*\.ngrok(?:-free)\.app$/, "wheelmap.tech")
      // Allow branch test deployments with a common branding
      .replace(/.*\.wheelmap\.tech$/, "wheelmap.tech")
      // Use 'localhost' branding for loopback IPs
      .replace(/127\.0\.0\.1/, "localhost")
      .replace(/0\.0\.0\.0/, "localhost")
      .replace(/::1/, "localhost")
  );
}
