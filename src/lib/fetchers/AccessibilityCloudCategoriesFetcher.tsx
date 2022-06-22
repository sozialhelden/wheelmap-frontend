import { apiBaseUrl } from "./config";
export function fetchAccessibilityCloudCategories(appToken) {
  // TODO const app = useCurrentApp(); config.tokenString
  const url = `${apiBaseUrl}/categories.json?appToken=${appToken}`;
  return fetch(url, {
    method: "GET",
  }).then((r) => r.json());
}
