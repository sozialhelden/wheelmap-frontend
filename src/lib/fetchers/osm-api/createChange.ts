import type { OSMAPIElement } from "~/lib/fetchers/osm-api/useUpdateTagValueWithLogIn";
import { log } from "~/lib/util/logger";

function escapeXML(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function getAllTagsAsXML(tags: Record<string, string>) {
  return Object.entries(tags)
    .map(
      ([key, value]) => `<tag k="${escapeXML(key)}" v="${escapeXML(value)}" />`,
    )
    .join("\n");
}

export async function createChange({
  accessToken,
  baseUrl,
  osmType,
  osmId,
  changesetId,
  tagName,
  newTagValue,
  currentOSMObjectOnServer,
}: {
  baseUrl: string;
  accessToken: string;
  osmType: string;
  osmId: number;
  changesetId: string;
  tagName: string;
  newTagValue: string;
  currentOSMObjectOnServer: OSMAPIElement;
}) {
  log.log(
    "createChange",
    osmType,
    osmId,
    changesetId,
    tagName,
    newTagValue,
    currentOSMObjectOnServer,
  );
  const { version, lat, lon, id, tags } = currentOSMObjectOnServer;
  const numericId = id;
  const currentTagsOnServer = tags;
  const newTags = {
    ...currentTagsOnServer,
    [tagName]: newTagValue,
  };

  /*const allTagsAsXML = Object.entries(newTags)
    .map(
      ([key, value]) => `<tag k="${escapeXML(key)}" v="${escapeXML(value)}" />`,
    )
    .join("\n");*/
  const allTagsAsXML = getAllTagsAsXML(newTags);

  log.log("allTagsAsXML", allTagsAsXML);

  let body: string;

  if (osmType === "node") {
    body = `<osm>
      <${osmType} id="${numericId}" changeset="${changesetId}" lat="${lat}" lon="${lon}" version="${version}">
        ${allTagsAsXML}
      </${osmType}>
    </osm>`;
  } else {
    // for way and relation exclude lat and lon
    body = `<osm>
      <${osmType} id="${numericId}" changeset="${changesetId}" version="${version}">
        ${allTagsAsXML}
      </${osmType}>
    </osm>`;
  }

  const response = await fetch(`${baseUrl}/api/0.6/${osmType}/${osmId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "text/xml",
      Authorization: `Bearer ${accessToken}`,
    },
    body,
  });

  const text = response.text();

  if (!response.ok) {
    throw new Error(`Could not update tag value on open street map: ${text}`);
  }

  log.log(text);
  return text;
}
