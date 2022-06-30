import { apiBaseUrl, apiBaseUrlUncached } from "./config";

type ContextName = "place" | "equipmentInfo";

export function fetchImagesCached(
  appToken: string,
  context: ContextName,
  objectId: string
) {
  return fetch(
    `${apiBaseUrl}/images.json?context=${context}&objectId=${objectId}&appToken=${appToken}`
  ).then((r) => r.json().results);
}

export function fetchImagesUncached(
  appToken: string,
  context: ContextName,
  objectId: string
) {
  return fetch(
    `${apiBaseUrlUncached}/images.json?context=${context}&objectId=${objectId}&appToken=${appToken}`
  )
    .then((r) => r.json())
    .then((json) => json.results);
}
