export function getAccessibilityCLoudCategoriesAPIURL() {}

// TODO rewrite all "get"... to fetch...
export function fetchAccessibilityCloudCategories() {
  const appToken = process.env.REACT_APP_ACCESSIBILITY_CLOUD_APP_TOKEN;
  const baseUrl = process.env.REACT_APP_ACCESSIBILITY_CLOUD_BASE_URL;

  const url = `${baseUrl}/categories.json?appToken=${appToken}`;
  return fetch(url, {
    method: "GET",
  }).then((r) => r.json());
}
