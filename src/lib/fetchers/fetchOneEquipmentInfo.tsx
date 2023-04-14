import useSWR from "swr";
import { TypeTaggedEquipmentInfo } from "../model/shared/AnyFeature";
import { accessibilityCloudCachedBaseUrl } from "./config";

export async function fetchOneEquipmentInfo(
  appToken: string,
  _id?: string
): Promise<TypeTaggedEquipmentInfo> {
  if (!_id || !appToken) {
    return Promise.resolve(undefined);
  }
  const url = `${accessibilityCloudCachedBaseUrl}/equipment-infos/${_id}.json?appToken=${appToken}`;
  const r = await fetch(url);
  const json = await r.json();
  return { "@type": "a11yjson:EquipmentInfo", ...json };
}

export const useEquipmentInfo = (appToken?: string, _id?: string) =>
  useSWR([appToken, _id], fetchOneEquipmentInfo);
