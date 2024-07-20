import { App } from "../App";
import {
  Feature,
  isWheelmapFeature,
  WheelmapFeature,
} from "../Feature";
import { DataSource } from "../cache/DataSourceCache";
import { isParkingFacility } from "./isParkingFacility";

export function hasEditablePlaceCategory(feature: WheelmapFeature) {
  // Parking lots have no editable accessibility, as the usual traffic light scheme can't be
  // applied to them.
  return !isParkingFacility(feature);
}

export default function isA11yEditable(
  feature: Feature,
  app?: App,
  primarySource?: DataSource,
) {
  const isDefaultSourceForPlaceEditing = primarySource && app
    ? app.defaultSourceIdForAddedPlaces === primarySource._id
    : false;
  const isA11yRatingAllowed = primarySource
    ? primarySource.isA11yRatingAllowed === true
    : false;
  const isEditingEnabled =
    (isWheelmapFeature(feature) && hasEditablePlaceCategory(feature)) ||
    isDefaultSourceForPlaceEditing || isA11yRatingAllowed;
  return isEditingEnabled;
}
