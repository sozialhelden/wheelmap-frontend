import { WheelmapFeature } from "../Feature";
import { nonBuildingCategoryIds } from "./nonBuildingCategoryIds";


export function isBuildingLike(feature: WheelmapFeature) {
  return !nonBuildingCategoryIds.has(feature.properties.node_type?.identifier);
}
