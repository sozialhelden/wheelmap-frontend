import get from 'lodash/get';
import includes from 'lodash/includes';
import { isEquipmentAccessible } from '../ac/EquipmentInfo';
import { YesNoLimitedUnknown, yesNoLimitedUnknownArray } from '../ac/Feature';
import { AnyFeature } from '../geo/AnyFeature';

export function isWheelchairAccessible(
  feature: AnyFeature,
): YesNoLimitedUnknown {
  const featureType = feature['@type'];

  if (featureType === 'a11yjson:EquipmentInfo') {
    // See https://sozialhelden.github.io/a11yjson/3-interfaces/#EquipmentProperties
    return isEquipmentAccessible(feature.properties) || 'unknown';
  }

  if (featureType === 'a11yjson:PlaceInfo') {
    // Hopefully we can replace this with something nicer soon.
    // See https://sozialhelden.github.io/a11yjson/3-interfaces/
    const { properties } = feature;
    const isFullyAccessible = get(
      properties,
      'accessibility.accessibleWith.wheelchair',
    );
    const isPartiallyAccessible = get(
      properties,
      'accessibility.partiallyAccessibleWith.wheelchair',
    );

    if (isFullyAccessible === true) {
      return 'yes';
    }

    if (isPartiallyAccessible === true) {
      return 'limited';
    }

    if (isFullyAccessible === false) {
      return 'no';
    }

    return 'unknown';
  }

  if (featureType === 'osm:Feature') {
    // See https://wiki.openstreetmap.org/wiki/Key:wheelchair
    const { wheelchair } = feature.properties;
    if (includes(yesNoLimitedUnknownArray, wheelchair)) {
      return wheelchair;
    }
    if (wheelchair === 'designated') {
      return 'yes';
    }

    const wheelchairUserCapacity = feature.properties['capacity:disabled'];
    if (wheelchairUserCapacity && wheelchairUserCapacity > 0) {
      return 'yes';
    }

    return 'unknown';
  }

  return 'unknown';
}
