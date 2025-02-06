import { log } from "../util/logger";

export async function callBackendToUpdateInhouseDb({
  baseUrl,
  osmId,
  osmType,
  tagName,
}: {
  baseUrl: string;
  osmId: string;
  osmType: string;
  tagName: string;
}) {
  log.log("writeChangesToInhouseDb", osmType, osmId);
  const osmIdAsNumber = osmId.replace(/\D/g, "");
  const response = await fetch(
    `${baseUrl}/legacy/api/${osmType}/${osmIdAsNumber}/refresh`,
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
