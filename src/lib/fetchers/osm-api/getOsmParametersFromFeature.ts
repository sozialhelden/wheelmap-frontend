import { getFeatureId } from "../../model/ac/Feature";
import { getOSMType } from "../../model/osm/generateOsmUrls";

export default function getOsmParametersFromFeature(feature, tagKey) {
  const tagName = typeof tagKey === "string" ? tagKey : tagKey[0];
  const osmType = getOSMType(feature);
  const osmId = feature.id;
  return {
    tagName,
    osmType,
    osmId,
  };
}
