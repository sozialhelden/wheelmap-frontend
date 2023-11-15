import { Feature, isWheelmapFeature, isWheelmapFeatureId, WheelmapFeature } from '../../../lib/Feature';
import { DataSource } from '../../../lib/cache/DataSourceCache';
import { App } from '../../../lib/App';
import { t } from 'ttag';


export function isParkingFacility(feature: WheelmapFeature) {
  return feature.properties.node_type?.identifier === 'parking' || feature.properties.tags?.parking;
}

export function hasDefaultOSMDescription(feature: WheelmapFeature) {
  return !isParkingFacility(feature) && feature.properties.wheelchair_description === null;
}

export function hasEditablePlaceCategory(feature: WheelmapFeature) {
  // Parking lots have no editable accessibility, as the usual traffic light scheme can't be
  // applied to them.
  return !isParkingFacility(feature);
}

export default function isA11yEditable(
  feature: Feature,
  app?: App,
  primarySource?: DataSource
) {
  const isDefaultSourceForPlaceEditing =
    primarySource && app ? app.defaultSourceIdForAddedPlaces === primarySource._id : false;
  const isA11yRatingAllowed = primarySource ? primarySource.isA11yRatingAllowed === true : false;
  const isEditingEnabled =
    isWheelmapFeature(feature) && hasEditablePlaceCategory(feature) || isDefaultSourceForPlaceEditing || isA11yRatingAllowed;
  return isEditingEnabled;
}
