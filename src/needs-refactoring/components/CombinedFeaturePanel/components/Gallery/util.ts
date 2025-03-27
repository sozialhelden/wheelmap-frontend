import { compact } from "lodash";
import {
  type AnyFeature,
  isOSMFeature,
  isPlaceInfo,
} from "~/needs-refactoring/lib/model/geo/AnyFeature";

const context = ["osmGeometry", "place", "surveyResult"] as const;

export const makeImageLocation = (
  baseUrl: string,
  appToken: string,
  ctx: (typeof context)[number],
  id: string,
) =>
  `${baseUrl}/images.json?context=${ctx}&objectId=${id}&appToken=${appToken}`;

export const makeImageIds = (
  feature: AnyFeature,
): { context: (typeof context)[number]; id: string }[] => {
  const combinations = compact([
    isOSMFeature(feature) &&
      ({
        context: "place",
        id: feature._id.replace(/^way\//, "-").replace(/^node\//, ""),
      } as const),
    isPlaceInfo(feature) && ({ context: "place", id: feature._id } as const),
    isOSMFeature(feature) &&
      ({ context: "osmGeometry", id: `osm:${feature._id}` } as const),
    isPlaceInfo(feature) &&
      feature.properties?.surveyResultId &&
      ({
        context: "surveyResult",
        id: feature.properties.surveyResultId,
      } as const),
  ] as const);
  return combinations;
};
