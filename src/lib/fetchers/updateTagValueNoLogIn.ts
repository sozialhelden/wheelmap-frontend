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
    // if the request cannot be made at all, the user gets an error toast
    postErrorMessage();
    throw new Error("Missing or undefined parameters.");
  }

  log.log("makeChangeRequestToApi", osmId, tagName, newTagValue);

  // user gets success message regardless of actual success
  // problem: the call to osm backend happens in the api
  // if there is an error in the osm route, the user can not be notified in the frontend
  // and will falsely think the edit was successful
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

  const text = response.text();
  return text;
}
