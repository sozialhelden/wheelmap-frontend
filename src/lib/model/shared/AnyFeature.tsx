import { Entrance, EquipmentInfo, PlaceInfo } from "@sozialhelden/a11yjson";
import { SearchResultFeature } from "../../fetchers/fetchPlaceSearchResults";
import OSMFeature, { OSMAPIErrorResponse } from "../osm/OSMFeature";

export type TypeTaggedPlaceInfo = PlaceInfo & {
  ["@type"]: "a11yjson:PlaceInfo";
  _id: string;
};
export type TypeTaggedEquipmentInfo = EquipmentInfo & {
  ["@type"]: "a11yjson:EquipmentInfo";
  _id: string;
};
export type TypeTaggedEntrance = Entrance & {
  ["@type"]: "a11yjson:Entrance";
  _id: string;
};
export type TypeTaggedSearchResultFeature = SearchResultFeature & {
  ["@type"]: "komoot:SearchResult";
};
export type TypeTaggedOSMFeature = OSMFeature & { ["@type"]: "osm:Feature" };

export type TypeTaggedOSMFeatureOrError = TypeTaggedOSMFeature | OSMAPIErrorResponse;

export type AnyFeature =
  | TypeTaggedPlaceInfo
  | TypeTaggedEquipmentInfo
  | TypeTaggedEntrance
  | TypeTaggedSearchResultFeature
  | TypeTaggedOSMFeature;

export function isPlaceInfo(feature: AnyFeature): feature is TypeTaggedPlaceInfo {
  return feature?.["@type"] === "a11yjson:PlaceInfo";
}

export function isEquipmentInfo(feature: AnyFeature): feature is TypeTaggedEquipmentInfo {
  return feature?.["@type"] === "a11yjson:EquipmentInfo";
}

export function isEntrance(feature: AnyFeature): feature is TypeTaggedEntrance {
  return feature?.["@type"] === "a11yjson:Entrance";
}

export function isSearchResultFeature(feature: AnyFeature): feature is TypeTaggedSearchResultFeature {
  return feature?.["@type"] === "komoot:SearchResult";
}

export function isOSMFeature(feature: AnyFeature): feature is TypeTaggedOSMFeature {
  return feature?.["@type"] === "osm:Feature";
}