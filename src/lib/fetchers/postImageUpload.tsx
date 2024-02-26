import { readAndCompressImage } from "../ImageResizer";

const imageResizeConfig = {
  quality: 0.7,
  maxWidth: 1024,
  maxHeight: 1024,
  autoRotate: true,
  debug: true,
};

export default async function postImageUpload(
  featureId: string,
  baseUrl: string,
  context: "place" | "equipment",
  images: FileList,
  appToken: string
): Promise<any> {
  const image = images[0];
  const url = `${baseUrl}/image-upload?${context}Id=${featureId}&appToken=${appToken}`;
  const resizedImage = await readAndCompressImage(image, imageResizeConfig);
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "image/jpeg",
    },
    body: resizedImage,
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.error.reason);
  }

  return json;
}
