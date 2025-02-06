import { log } from "../util/logger";

export async function makeChangeRequestToInhouseApi({
  baseUrl,
  osmId,
  tagName,
  newTagValue,
}: {
  baseUrl: string;
  osmId: string;
  tagName: string;
  newTagValue: string;
}) {
  log.log("makeChangeRequestToApi", osmId, tagName, newTagValue);
  const response = await fetch(`${baseUrl}/legacy/api/${osmId}/${tagName}`, {
    body: JSON.stringify({ value: newTagValue }),
    credentials: "omit",
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    mode: "cors",
  });

  if (!response.ok) {
    throw new Error("Could not update");
  }
  const text = response.text();
  return text;
}
