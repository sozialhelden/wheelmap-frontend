import { renderToString } from "react-dom/server";
import { icons } from "../../src/modules/map/icons";
import { getIconComponent } from "../../src/modules/map/utils/mapbox-icon-renderer";

export const accessToken = process.env.MAPBOX_DEVELOPMENT_ACCESS_TOKEN;
export const account = process.env.NEXT_PUBLIC_MAPBOX_ACCOUNT_ID;

export const brightStyleName = `A11yMap Dev Bright - ${(new Date()).toTimeString()}`;
export const darkStyleName = `A11yMap Dev Dark - ${(new Date()).toTimeString()}`;

async function api(
  url: string,
  params: Record<string, string> = {},
  options: RequestInit = {},
) {
  if (!accessToken) {
    throw new Error(
      "Please set the MAPBOX_DEVELOPMENT_ACCESS_TOKEN environment variable.",
    );
  }
  if (!account) {
    throw new Error(
      "Please set the NEXT_PUBLIC_MAPBOX_ACCOUNT_ID environment variable.",
    );
  }

  const query = new URLSearchParams({
    ...params,
    access_token: accessToken ?? "",
  }).toString();
  const response = await fetch(
    `https://api.mapbox.com${url}?${query}`,
    options,
  );
  if (!response.ok) {
    throw new Error(
      `Mapbox API request (${url}) failed: ${JSON.stringify(await response.json())}`,
    );
  }
  return await response.json();
}

export async function styleExists(id: string) {
  const response = await fetch(
    `https://api.mapbox.com/styles/v1/${account}/${id}?access_token=${accessToken}`,
  );
  return response.ok;
}

export async function createStyle(name: string, body: object) {
  return await api(
    `/styles/v1/${account}`,
    {},
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...body,
        name,
      }),
    },
  );
}

export async function getStyle(id: string) {
  return await api(`/styles/v1/${account}/${id}/draft`);
}

export async function updateStyle(id: string, name: string, body: object) {
  return await api(
    `/styles/v1/${account}/${id}/draft`,
    {},
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...body,
        name,
        id,
      }),
    },
  );
}

export async function deleteStyle(id: string) {
  return await api(
    `/styles/v1/${account}/${id}`,
    {},
    {
      method: "DELETE",
    },
  );
}

function renderIcons(darkMode: boolean) {
  return Object.entries(icons).map(([identifier, icon]) => ({
    html: renderToString(getIconComponent(icon, darkMode)),
    identifier,
  }));
}

export async function uploadIcons(styleId: string, darkMode: boolean) {
  // mapbox sprites only support 1000 icons, lol
  const icons = renderIcons(darkMode).slice(0, 900);
  const batchSize = 20;

  for (let i = 0; i < icons.length; i += batchSize) {
    const batch = icons.slice(i, i + batchSize);

    try {
      await api(
        `/styles/v1/${account}/${styleId}/draft/sprite`,
        {},
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(batch.map(({ identifier }) => identifier)),
        },
      );
    } catch (error) {}

    const data = new FormData();
    for (const { html, identifier } of batch) {
      data.append(
        "images",
        new Blob([html], { type: "image/svg+xml" }),
        `${identifier}.svg`,
      );
    }

    await api(
      `/styles/v1/${account}/${styleId}/draft/sprite`,
      {},
      { method: "POST", body: data },
    );
  }

  return;
}
