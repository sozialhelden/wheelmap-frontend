import { isWheelmapFeatureId } from '../../../lib/model/ac/Feature';
import { DataSource } from '../../../lib/cache/DataSourceCache';
import { App } from '../../../lib/App';

export default function isA11yEditable(
  featureId: string | number,
  app?: App,
  primarySource?: DataSource,
) {
  const isWheelmapFeature = isWheelmapFeatureId(featureId);
  const isDefaultSourceForPlaceEditing = primarySource && app
    ? app.defaultSourceIdForAddedPlaces === primarySource._id
    : false;
  const isA11yRatingAllowed = primarySource
    ? primarySource.isA11yRatingAllowed === true
    : false;
  const isEditingEnabled = isWheelmapFeature || isDefaultSourceForPlaceEditing || isA11yRatingAllowed;
  return isEditingEnabled;
}
