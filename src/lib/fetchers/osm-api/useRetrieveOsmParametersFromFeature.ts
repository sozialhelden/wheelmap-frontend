import { useRouter } from "next/router";
import useSWR from "swr";
import { getFeatureId } from "../../model/ac/Feature";
import type OSMFeature from "../../model/osm/OSMFeature";
import { getOSMType } from "../../model/osm/generateOsmUrls";

export default function useRetrieveOsmParametersFromFeature(
  feature: OSMFeature,
) {
  const router = useRouter();
  const { tagKey } = router.query;
  const tagName = typeof tagKey === "string" ? tagKey : tagKey[0];
  const osmType = getOSMType(feature);
  const osmId = feature._id;
  return {
    tagName,
    osmType,
    osmId,
  };
}
