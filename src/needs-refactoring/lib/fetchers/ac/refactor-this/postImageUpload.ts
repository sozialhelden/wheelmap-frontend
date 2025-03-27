import {
  type AnyFeature,
  isOSMFeature,
  isPlaceInfo,
} from "~/needs-refactoring/lib/model/geo/AnyFeature";

export default async function uploadPhotoForFeature(
  feature: AnyFeature,
  images: FileList,
  baseUrl: string,
  appToken: string,
): Promise<void> {
  const image = images[0];

  let url: string;
  if (isPlaceInfo(feature)) {
    const id = feature._id;
    url = `${baseUrl}/image-upload?placeId=${id}&appToken=${appToken}`;
  } else if (isOSMFeature(feature)) {
    const uri = `osm:${feature._id}`;
    url = `${baseUrl}/image-upload/osm-geometry/photo?uri=${uri}&appToken=${appToken}`;
  } else {
    throw new Error(
      "Uploading photos is only supported for places from accessibility.cloud or OSM.",
    );
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
