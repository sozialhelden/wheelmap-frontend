import type {
  EquipmentInfo,
  PlaceInfo,
  Restroom,
} from "@sozialhelden/a11yjson";
import flatten from "lodash/flatten";
import includes from "lodash/includes";
import uniq from "lodash/uniq";
import type { PhotonResultFeature } from "../../fetchers/fetchPhotonFeatures";
import { isOSMFeature } from "../geo/AnyFeature";
import type OSMFeature from "../osm/OSMFeature";

export type YesNoLimitedUnknown = "yes" | "no" | "limited" | "unknown";
export type YesNoUnknown = "yes" | "no" | "unknown";
export const yesNoLimitedUnknownArray: readonly YesNoLimitedUnknown[] = [
  "limited",
  "yes",
  "no",
  "unknown",
];
Object.freeze(yesNoLimitedUnknownArray);
export const yesNoUnknownArray: readonly YesNoUnknown[] = [
  "yes",
  "no",
  "unknown",
];
Object.freeze(yesNoUnknownArray);

export type MappingEventFeature = PhotonResultFeature;

export type FeatureCollection<T> = {
  type: "FeatureCollection";
  features: T[];
};
export type AccessibilityCloudFeatureCollection = FeatureCollection<PlaceInfo>;

export type WheelmapImage = {
  type: string;
  width: number;
  height: number;
  url: string;
};

export type WheelmapPhoto = {
  id: number;
  taken_on: number;
  images: WheelmapImage[];
};

export type WheelmapFeaturePhotos = {
  photos: WheelmapPhoto[];
};

export type AccessibilityCloudImage = {
  _id: string;
  isoDate: string;
  url: string;
  imagePath: string;
  mimeType: string;
  dimensions: {
    width: number;
    height: number;
  };
  angle?: number;
  placeholder?: string;
};

export type AccessibilityCloudImages = {
  totalCount: number;
  images: AccessibilityCloudImage[];
};

function hasAccessibleToiletOSM(feature: OSMFeature): YesNoUnknown {
  const wheelchairToiletTag =
    feature.properties["toilets:wheelchair"] ||
    feature.properties["wheelchair:toilets"] ||
    feature.properties["wheelchair:toilet"] ||
    feature.properties["toilet:wheelchair"];
  if (["yes", "no"].includes(String(wheelchairToiletTag))) {
    return wheelchairToiletTag as "yes" | "no";
  }
  return "unknown";
}

export function hasAccessibleToilet(
  feature: PlaceInfo | OSMFeature,
): YesNoUnknown {
  if (isOSMFeature(feature)) {
    return hasAccessibleToiletOSM(feature);
  }

  const { properties } = feature;

  if (!properties.accessibility) {
    return "unknown";
  }

  const restrooms: Restroom[] = flatten(
    properties.accessibility.areas
      ?.map((area) => {
        if (!Array.isArray(area.restrooms)) return null;
        return area.restrooms;
      })
      .concat(properties.accessibility.restrooms),
  );

  const accessibleCount = restrooms.filter(
    (r) => r.isAccessibleWithWheelchair === true,
  ).length;
  const nonAccessibleCount = restrooms.filter(
    (r) => r.isAccessibleWithWheelchair === false,
  ).length;
  const unknownCount = restrooms.filter(
    (r) =>
      r.isAccessibleWithWheelchair === null ||
      r.isAccessibleWithWheelchair === undefined,
  ).length;

  if (accessibleCount >= 1) return "yes";
  if (nonAccessibleCount > unknownCount) return "no";
  return "unknown";
}
