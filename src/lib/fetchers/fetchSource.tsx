import ISource from "../model/ac/ISource";
import { accessibilityCloudCachedBaseUrl } from "./config";

export function interpretJSONResponseAsSource(json: unknown): ISource {
  return json as ISource;
}

export default async function fetchSource([appToken, _id]: [
  string | undefined,
  string | undefined
]): Promise<ISource> {
  if (!_id || !appToken) {
    return;
  }
  const baseUrl = accessibilityCloudCachedBaseUrl;
  const url = `${baseUrl}/sources/${_id}.json?appToken=${appToken}`;
  const response = await fetch(url);
  const json = await response.json();
  return interpretJSONResponseAsSource(json);
}
