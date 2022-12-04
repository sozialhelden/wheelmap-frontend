import { fetchOnePlaceInfo } from "./fetchOnePlaceInfo";
import { fetchOneOSMFeature } from "./fetchOneOSMFeature";
import { AnyFeature } from "../model/shared/AnyFeature";

export async function fetchMultipleFeatures(
  appToken: string,
  idsAsString?: string
): Promise<AnyFeature[]> {
  const ids = idsAsString.split(",");

  const promises = ids.map((id) => {
    if (id.startsWith("ac:")) {
      return fetchOnePlaceInfo(appToken, id.slice(3)).then(
        (feature) =>
          ({ ["@type"]: "a11yjson:PlaceInfo", ...feature } as AnyFeature)
      );
    }

    return fetchOneOSMFeature(id).then(
      (feature) =>
        ({
          ["@type"]: "osm:Feature",
          ...feature,
        } as AnyFeature)
    );
  });

  return Promise.all(promises);
}
