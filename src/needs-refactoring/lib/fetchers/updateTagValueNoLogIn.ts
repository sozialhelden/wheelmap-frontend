import { log } from "../util/logger";

export async function updateTagValueNoLogIn({
  baseUrl,
  osmType,
  osmId,
  tagName,
  newTagValue,
  postSuccessMessage,
  postErrorMessage,
}: {
  baseUrl: string;
  osmType: string;
  osmId: string;
  tagName: string;
  newTagValue: string;
  postSuccessMessage: () => void;
  postErrorMessage?: () => void;
}) {
  if (!newTagValue || !osmType || !osmId) {
    postErrorMessage?.();
    throw new Error("Missing or undefined parameters.");
  }

  log.log("makeChangeRequestToApi", osmId, tagName, newTagValue);

  postSuccessMessage();

  const response = await fetch(
    `${baseUrl}/legacy/api/${osmType}/${osmId}/${tagName}`,
    {
      body: JSON.stringify({ value: newTagValue }),
      credentials: "omit",
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      mode: "cors",
    },
  );

  if (!response.ok) {
    throw new Error("Could not update");
  }

  return response.text();
}
