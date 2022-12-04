import {
  accessibilityCloudCachedBaseUrl,
  accessibilityCloudUncachedBaseUrl,
} from "./config";

type ContextName = "place" | "equipmentInfo";

export function fetchImagesCached(
  appToken: string,
  context: ContextName,
  objectId: string
) {
  return fetch(
    `${accessibilityCloudCachedBaseUrl}/images.json?context=${context}&objectId=${objectId}&appToken=${appToken}`
  )
    .then((r) => r.json())
    .then((json) => json.images);
}

export function fetchImagesUncached(
  appToken: string,
  context: ContextName,
  objectId: string
) {
  return fetch(
    `${accessibilityCloudUncachedBaseUrl}/images.json?context=${context}&objectId=${objectId}&appToken=${appToken}`
  )
    .then((r) => r.json())
    .then((json) => json.images);
}
