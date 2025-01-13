import {
  type AnyFeature,
  isOSMFeature,
  isPlaceInfo,
} from "~/lib/model/geo/AnyFeature";

export default async function uploadPhotoForFeature(
  feature: AnyFeature,
  images: FileList,
  baseUrl: string,
  appToken: string,
): Promise<void> {
  const image = images[0];

  let url;
  if (isPlaceInfo(feature)) {
    const id = feature._id;
    url = `${baseUrl}/image-upload?placeId=${id}&appToken=${appToken}`;
  } else if (isOSMFeature(feature)) {
    const uri = `osm:${feature._id}`;
    url = `${baseUrl}/image-upload/osm-geometry/photo?uri=${uri}&appToken=${appToken}`;
  }

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "image/jpeg",
    },
    body: image,
  });

  if (!response.ok) {
    const json = await response.json();
    throw new Error(json?.error?.reason);
  }
}
