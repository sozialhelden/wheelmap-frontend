import { Entrance, EquipmentInfo, PlaceInfo } from "@sozialhelden/a11yjson";
import { SearchResultFeature } from "../../fetchers/fetchPlaceSearchResults";
import OSMFeature from "../osm/OSMFeature";

export type TypeTaggedPlaceInfo = PlaceInfo & {
  ["@type"]: "a11yjson:PlaceInfo";
};
export type TypeTaggedEquipmentInfo = EquipmentInfo & {
  ["@type"]: "a11yjson:EquipmentInfo";
};
export type TypeTaggedEntrance = Entrance & { ["@type"]: "a11yjson:Entrance" };
export type TypeTaggedSearchResultFeature = SearchResultFeature & {
  ["@type"]: "komoot:SearchResult";
};
export type TypeTaggedOSMFeature = OSMFeature & { ["@type"]: "osm:Feature" };

export type AnyFeature =
  | TypeTaggedPlaceInfo
  | TypeTaggedEquipmentInfo
  | TypeTaggedEntrance
  | TypeTaggedSearchResultFeature
  | TypeTaggedOSMFeature;
