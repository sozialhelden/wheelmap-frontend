import useSWR from "swr";
import { useEnvContext } from "../../components/shared/EnvContext";
import { useCurrentApp } from "../context/AppContext";
import { TypeTaggedPlaceInfo } from "../model/shared/AnyFeature";

export async function fetchOnePlaceInfo(
  appToken: string,
  baseUrl: string,
  _id?: string
): Promise<TypeTaggedPlaceInfo> {
  if (!_id || !appToken) {
    return Promise.resolve(undefined);
  }
  const url = `${baseUrl}/place-infos/${_id}.json?appToken=${appToken}`;
  const r = await fetch(url);
  const json = await r.json();
  return { "@type": "a11yjson:PlaceInfo", ...json };
}

export const usePlaceInfo = (_id?: string | string[]) => {
  const app = useCurrentApp();
  const appToken = app.tokenString;
  const env = useEnvContext();
  const baseUrl = env.NEXT_PUBLIC_ACCESSIBILITY_CLOUD_API_URL;
  return useSWR(appToken && baseUrl && _id && [appToken, baseUrl, _id], fetchOnePlaceInfo);
}

