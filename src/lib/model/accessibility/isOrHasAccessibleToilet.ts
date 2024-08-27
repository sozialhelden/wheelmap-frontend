import includes from 'lodash/includes';
import {
  YesNoUnknown,
  hasAccessibleToilet,
  yesNoUnknownArray,
} from '../ac/Feature';
import { AnyFeature } from '../geo/AnyFeature';
import { isToiletFeature } from './isToiletFeature';
import { isWheelchairAccessible } from './isWheelchairAccessible';

export function isOrHasAccessibleToilet(
  feature: AnyFeature | any,
): YesNoUnknown {
  if (!feature.properties) {
    return 'unknown';
  }

  const isToilet = isToiletFeature(feature);
  const isPlaceWheelchairAccessible = isWheelchairAccessible(feature);
  if (isToilet && isPlaceWheelchairAccessible === 'yes') {
    return 'yes';
  }

  if (feature['@type'] === 'a11yjson:PlaceInfo') {
    return hasAccessibleToilet(feature.properties);
  }

  if (feature['@type'] === 'osm:Feature') {
    // https://wiki.openstreetmap.org/wiki/Proposed_features/toilets:wheelchair
    const wheelchairToiletTag = feature.properties['wheelchair:toilet']
      || feature.properties['toilets:wheelchair'];
    if (includes(yesNoUnknownArray, wheelchairToiletTag)) {
      return wheelchairToiletTag;
    }
    return 'unknown';
  }

  return 'unknown';
}
