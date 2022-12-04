import { accessibilityCloudUncachedBaseUrl } from "./config";

export default async function postImageReport(
  appToken: string,
  imageId: string,
  reason: string
) {
  const response = await fetch(
    `${accessibilityCloudUncachedBaseUrl}/images/report?imageId=${imageId}&reason=${reason}&appToken=${appToken}`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    }
  );

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.error.reason);
  }

  return json;
}
