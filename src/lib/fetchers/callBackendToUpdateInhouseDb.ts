import { log } from "../util/logger";

export async function callBackendToUpdateInhouseDb({
  baseUrl,
  osmId,
  osmType,
  tagName,
}: {
  baseUrl: string;
  osmId: number;
  osmType: string;
  tagName: string;
}) {
  log.log("writeChangesToInhouseDb", osmType, osmId);
  const response = await fetch(
    `${baseUrl}/legacy/api/${osmType}/${osmId}/refresh`,
    {
      credentials: "omit",
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      mode: "cors",
      body: tagName,
    },
  );

  if (!response.ok) {
    throw new Error("Could not update inhouse DB");
  }
  const text = response.text();
  return text;
}
