export type QueryParameters = {
  baseUrl: string;
  placeInfoId: string;
  appToken: string;
};

export function generateGetPlaceInfoURL(options: QueryParameters): string {
  const { baseUrl, placeInfoId, appToken } = options;
  if (baseUrl && placeInfoId && appToken) {
    return `${baseUrl}/place-infos/${placeInfoId}.json?appToken=${appToken}`;
  }
  return undefined;
}

export const fetchJSON = async (url: RequestInfo | URL) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Network response was not OK (${response.status}).`);
  }
  const json = await response.json();
  return json;
};
