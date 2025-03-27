export async function createChangeset({
  baseUrl,
  tagName,
  newValue,
  accessToken,
}: {
  baseUrl: string;
  tagName: string;
  newValue: string;
  accessToken: string;
}): Promise<string> {
  // Comments cannot be longer than 255 chars
  const truncatedNewValue = newValue.substring(0, 100);
  const response = await fetch(`${baseUrl}/api/0.6/changeset/create`, {
    method: "PUT",
    headers: {
      "Content-Type": "text/xml; charset=UTF-8",
      Authorization: `Bearer ${accessToken}`,
    },

    body: `<osm>
      <changeset>
        <tag k="created_by" v="https://wheelmap.org" />
        <tag k="comment" v="Change ${tagName} tag to '${truncatedNewValue}'" />
      </changeset>
    </osm>`,
  });

  return response.text();
}
