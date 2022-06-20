export function getAccessibilityCLoudFeatureAPIURL(
  ACNodeId: string | string[]
) {
  const appToken = process.env.REACT_APP_ACCESSIBILITY_CLOUD_APP_TOKEN;
  const baseUrl = process.env.REACT_APP_ACCESSIBILITY_CLOUD_BASE_URL;
  const url = `${baseUrl}/place-infos/${ACNodeId}.json?appToken=${appToken}`;
  return url;
}

export function getACFeattureFetcher() {
  const fetcher = (url: string) =>
    fetch(url, {
      method: "GET",
    }).then((r) => r.json());
  return fetcher;
}
