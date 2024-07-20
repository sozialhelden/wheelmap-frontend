import { WheelmapFeature } from "../Feature";
import { isBuildingLike } from "./isBuildingLike";
import { isParkingFacility } from "./isParkingFacility";


export function hasDefaultOSMDescription(feature: WheelmapFeature) {
  return !isParkingFacility(feature) &&
    isBuildingLike(feature) &&
    feature.properties.wheelchair_description === null;
}
