import { apiBaseUrl } from "./config";

export function fetchOneAccessibilityCloudFeature(
  appToken: string,
  _id?: string
) {
  // TODO const app = useCurrentApp(); config.tokenString
  const url = `${apiBaseUrl}/place-infos/${_id}.json?appToken=${appToken}`;

  return fetch(url, {
    method: "GET",
  }).then((r) => r.json());
}
