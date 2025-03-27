import { getOSMType } from "../../model/osm/generateOsmUrls";

export default function getOsmParametersFromFeature(feature, tagKey) {
  const tagName = typeof tagKey === "string" ? tagKey : tagKey[0];
  const osmType = getOSMType(feature);
  const prefixedId = feature._id;
  const osmId = prefixedId.replace(/^(?:[^/]+\/)?/, "");
  return {
    tagName,
    osmType,
    prefixedId,
    osmId,
  };
}
