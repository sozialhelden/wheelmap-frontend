import useSWR from "swr";
import { TypeTaggedPlaceInfo } from "../model/shared/AnyFeature";
import { accessibilityCloudCachedBaseUrl } from "./config";

export async function fetchOnePlaceInfo(
  appToken: string,
  _id?: string
): Promise<TypeTaggedPlaceInfo> {
  if (!_id || !appToken) {
    return Promise.resolve(undefined);
  }
  const url = `${accessibilityCloudCachedBaseUrl}/place-infos/${_id}.json?appToken=${appToken}`;
  const r = await fetch(url);
  const json = await r.json();
  return { "@type": "a11yjson:PlaceInfo", ...json };
}

export const usePlaceInfo = (appToken?: string, _id?: string) =>
  useSWR([appToken, _id], fetchOnePlaceInfo);
