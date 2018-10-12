// @flow
import { t } from 'ttag';
import get from 'lodash/get';
import pick from 'lodash/pick';
import flatten from 'lodash/flatten';
import includes from 'lodash/includes';
import isEqual from 'lodash/isEqual';
import isArray from 'lodash/isArray';
import uniq from 'lodash/uniq';
import isPlainObject from 'lodash/isPlainObject';
import type { GeometryObject } from 'geojson-flow';
import { translatedStringFromObject } from './i18n';

import useImperialUnits from './useImperialUnits';
import type { EquipmentInfo } from './EquipmentInfo';
import { isEquipmentAccessible } from './EquipmentInfo';
import type { Category } from './Categories';
import { categoryNameFor } from './Categories';
import type { LocalizedString } from './i18n';
import { normalizeCoordinates } from './normalizeCoordinates';

export type YesNoLimitedUnknown = 'yes' | 'no' | 'limited' | 'unknown';
export type YesNoUnknown = 'yes' | 'no' | 'unknown';
export const yesNoLimitedUnknownArray: YesNoLimitedUnknown[] = [
  'yes',
  'limited',
  'no',
  'unknown',
].sort();
Object.freeze(yesNoLimitedUnknownArray);
export const yesNoUnknownArray: YesNoUnknown[] = ['yes', 'no', 'unknown'].sort();
Object.freeze(yesNoUnknownArray);

function sortedIsEqual(array1, array2): boolean {
  return isEqual([].concat(array1).sort(), [].concat(array2).sort());
}

function parseStatusString(statusString, allowedStatuses) {
  // Safe mutable sort as filter always returns a new array.
  return statusString
    ? statusString
        .split(',')
        .filter(s => includes(allowedStatuses, s))
        .sort()
    : [...allowedStatuses];
}

export function getAccessibilityFilterFrom(statusString: ?string): YesNoLimitedUnknown[] {
  const result = parseStatusString(statusString, yesNoLimitedUnknownArray);

  return ((result: any): YesNoLimitedUnknown[]);
}

export function getToiletFilterFrom(toiletString: ?string): YesNoUnknown[] {
  const result = parseStatusString(toiletString, yesNoUnknownArray);

  return ((result: any): YesNoUnknown[]);
}

/**
 * @returns `true` if the given array of accessibility values is actually filtering PoIs
 * (which is not the case if it just contains all existing accessibility values), `false` otherwise.
 */

export function isFiltered(accessibilities: ?(YesNoLimitedUnknown[])): boolean {
  return (
    !!accessibilities &&
    !isEqual(accessibilities, []) &&
    !sortedIsEqual(accessibilities, yesNoLimitedUnknownArray)
  );
}

// TODO: Create flowtype definition for AC format and re-use it here

export type Restroom = {
  isAccessibleWithWheelchair?: boolean,
  ratingForWheelchair: number,
};

export type Area = {
  restrooms: Restroom[],
};

export type MinimalAccessibility = {
  accessibleWith: {
    wheelchair: boolean,
  },
  partiallyAccessibleWith: {
    wheelchair: boolean,
  },
  areas?: Area[],
};

export type WheelmapCategoryOrNodeType = {
  id: ?number,
  identifier: ?string,
};

export type WheelmapProperties = {
  id: number,
  category: ?WheelmapCategoryOrNodeType,
  node_type: ?WheelmapCategoryOrNodeType,
  city: ?string,
  housenumber: ?string,
  lat: number,
  lon: number,
  name?: ?LocalizedString,
  phone: ?string,
  photo_ids: ?number | string[],
  postcode: ?string,
  sponsor: ?string,
  icon: ?string,
  region: ?string,
  street: ?string,
  website: ?string,
  wheelchair: ?YesNoLimitedUnknown,
  wheelchair_description: ?string,
  wheelchair_toilet: ?YesNoUnknown,
};

export type WheelmapFeature = {
  type: 'Feature',
  geometry: ?GeometryObject,
  properties: ?WheelmapProperties,
  id: number,
};

export type WheelmapLightweightFeature = $Supertype<WheelmapFeature>;

export type AccessibilityCloudProperties = {
  _id: string,
  name?: ?LocalizedString,
  accessibility?: MinimalAccessibility,
  category?: string,
  address?:
    | {
        full?: string,
        postcode?: string,
        city?: string,
        postal_code?: string,
        street?: string,
        housenumber?: number | string,
        city?: string,
        county?: string,
        country?: string,
      }
    | string,
  infoPageUrl?: string,
  editPageUrl?: string,
  equipmentInfos: { [key: string]: EquipmentInfo },
  isWorking?: boolean,
  phone: ?string,
  phoneNumber: ?string,
  phoneNumber: ?string,
};

export type AccessibilityCloudFeature = {
  type: 'Feature',
  name: ?string,
  geometry: ?GeometryObject,
  properties: AccessibilityCloudProperties,
};

export type FeatureCollection<T> = {
  type: 'FeatureCollection',
  features: T[],
};
export type AccessibilityCloudFeatureCollection = FeatureCollection<AccessibilityCloudFeature>;
export type WheelmapFeatureCollection = FeatureCollection<WheelmapFeature>;
export type WheelmapLightweightFeatureCollection = FeatureCollection<WheelmapLightweightFeature>;

export type WheelmapImage = {
  type: string,
  width: number,
  height: number,
  url: string,
};

export type WheelmapPhoto = {
  id: number,
  taken_on: number,
  images: WheelmapImage[],
};

export type WheelmapFeaturePhotos = {
  photos: WheelmapPhoto[],
};

export type AccessibilityCloudImage = {
  _id: string,
  isoDate: string,
  url: string,
  imagePath: string,
  mimeType: string,
  dimensions: {
    width: number,
    height: number,
  },
};

export type AccessibilityCloudImages = {
  totalCount: number,
  images: AccessibilityCloudImage[],
};

export type Feature = AccessibilityCloudFeature | WheelmapFeature;
export type NodeProperties = AccessibilityCloudProperties | WheelmapProperties;

export function getFeatureId(feature: Feature) {
  if (!feature) return null;
  const idProperties = [
    typeof feature.id === 'number' && feature.id,
    typeof feature._id === 'string' && feature._id,
    feature.properties && typeof feature.properties.id === 'number' && feature.properties.id,
    feature.properties && typeof feature.properties._id === 'string' && feature.properties._id,
  ];
  const result = idProperties.filter(Boolean)[0];
  return result ? String(result) : null;
}

function isNumeric(id: string | number | null): boolean {
  return !!String(id).match(/^-?\d+$/);
}

export function isWheelmapFeatureId(id: string | number | null | void): boolean {
  return typeof id !== 'undefined' && isNumeric(id);
}

export function isWheelmapFeature(feature: Feature): boolean {
  return feature && feature.properties && feature.properties.id && isNumeric(feature.id);
}

// This is just for typecasting.
export function wheelmapFeatureFrom(feature: ?Feature): ?WheelmapFeature {
  if (feature && isWheelmapFeature(feature)) {
    return ((feature: any): WheelmapFeature);
  }
  return null;
}

// This is just for typecasting.
export function accessibilityCloudFeatureFrom(feature: ?Feature): ?AccessibilityCloudFeature {
  if (feature && !isWheelmapFeature(feature)) {
    return ((feature: any): AccessibilityCloudFeature);
  }
  return null;
}

export function sourceIdsForFeature(feature: ?Feature): string[] {
  if (!feature) return [];

  const properties = feature.properties;
  if (!properties) return [];

  const idsToEquipmentInfos =
    typeof properties.equipmentInfos === 'object' ? properties.equipmentInfos : null;
  const equipmentInfos = idsToEquipmentInfos
    ? Object.keys(idsToEquipmentInfos).map(_id => idsToEquipmentInfos[_id])
    : [];
  const equipmentInfoSourceIds = equipmentInfos.map(equipmentInfo =>
    get(equipmentInfo, 'properties.sourceId')
  );
  const disruptionSourceIds = equipmentInfos.map(equipmentInfo =>
    get(equipmentInfo, 'properties.lastDisruptionProperties.sourceId')
  );
  const placeSourceId =
    properties && typeof properties.sourceId === 'string' ? properties.sourceId : null;

  return uniq([placeSourceId, ...equipmentInfoSourceIds, ...disruptionSourceIds].filter(Boolean));
}

export function convertResponseToWheelmapFeature(node: WheelmapProperties): WheelmapFeature {
  return {
    type: 'Feature',
    properties: node,
    id: node.id,
    geometry: {
      type: 'Point',
      coordinates: [node.lon, node.lat],
    },
  };
}

type WheelmapPropertiesResponse = { nodes: WheelmapProperties[] };

export function wheelmapFeatureCollectionFromResponse(
  response: WheelmapPropertiesResponse
): WheelmapFeatureCollection {
  return {
    type: 'FeatureCollection',
    features: response.nodes.map(convertResponseToWheelmapFeature),
  };
}

export function accessibilityCloudFeatureCollectionFromResponse(response: any) {
  if (!response) return;
  if (response.features instanceof Array) {
    if (response && response.related && response.related.equipmentInfos) {
      response.features = response.features.concat(
        Object.keys(response.related.equipmentInfos).map(
          _id => response.related.equipmentInfos[_id]
        )
      );
    }
    const equipmentInfosEmbeddedInFeatures = response.features
      .map(feature => feature.properties.equipmentInfos)
      .filter(Boolean)
      .reduce((prev, next) => Object.assign(prev, next), {});
    response.features = response.features.concat(
      Object.keys(equipmentInfosEmbeddedInFeatures)
        .map(key => equipmentInfosEmbeddedInFeatures[key])
        .map(feature => Object.assign(feature, { type: 'Feature' }))
    );
  }
  return response;
}

export function hasAccessibleToilet(
  properties: WheelmapProperties | AccessibilityCloudProperties
): YesNoUnknown {
  if (!properties) return 'unknown';
  if (properties && properties.wheelchair_toilet) {
    if (includes(yesNoUnknownArray, properties.wheelchair_toilet)) {
      return ((properties.wheelchair_toilet: any): YesNoUnknown);
    }
    return 'unknown';
  }

  if (!(get(properties, 'accessibility.areas') instanceof Array)) return 'unknown';

  if (!properties.accessibility) {
    return 'unknown';
  }

  if (!(properties.accessibility.areas instanceof Array)) {
    return 'unknown';
  }

  const restroomInfos = flatten(
    properties.accessibility.areas.map(area => {
      if (!(area.restrooms instanceof Array)) return null;
      return area.restrooms.map(restroom => restroom.isAccessibleWithWheelchair);
    })
  );

  const accessibleCount = restroomInfos.filter(a => a === true).length;
  const nonAccessibleCount = restroomInfos.filter(a => a === false).length;
  const unknownCount = restroomInfos.filter(a => a === null || typeof a === 'undefined').length;

  if (accessibleCount >= 1) return 'yes';
  if (nonAccessibleCount > unknownCount) return 'no';
  return 'unknown';
}

export function isWheelchairAccessible(properties: NodeProperties): YesNoLimitedUnknown {
  if (properties.category === 'elevator' || properties.category === 'escalator') {
    const result =
      isEquipmentAccessible(pick(properties, ['lastUpdate', 'isWorking'])) || 'unknown';
    // debugger
    return result;
  }

  const isAccessible =
    get(properties, 'wheelchair') || get(properties, 'accessibility.accessibleWith.wheelchair');
  const isPartiallyAccessible = get(properties, 'accessibility.partiallyAccessibleWith.wheelchair');

  switch (isAccessible) {
    case 'yes':
    case true:
      return 'yes';
    case 'limited':
      return 'limited';
    case 'no':
    case false:
      return isPartiallyAccessible ? 'limited' : 'no';
    default:
      return isPartiallyAccessible ? 'limited' : 'unknown';
  }
}

export function accessibilityName(accessibility: YesNoLimitedUnknown): ?string {
  switch (accessibility) {
    // translator: Long accessibility description for full wheelchair accessibility
    case 'yes':
      return t`Fully wheelchair accessible`;
    // translator: Long accessibility description for partial wheelchair accessibility
    case 'limited':
      return t`Partially wheelchair accessible`;
    // translator: Long accessibility description for no wheelchair accessibility
    case 'no':
      return t`Not wheelchair accessible`;
    // translator: Long accessibility description for unknown wheelchair accessibility
    case 'unknown':
      return t`Unknown accessibility`;
    default:
      return null;
  }
}

export function shortAccessibilityName(accessibility: YesNoLimitedUnknown): ?string {
  switch (accessibility) {
    // translator: Shortened accessibility description for full wheelchair accessibility (imagine as short answer to the question ‘how accessible is this place?’)
    case 'yes':
      return t`Fully`;
    // translator: Shortened accessibility description for partial wheelchair accessibility (imagine as short answer to the question ‘how accessible is this place?’)
    case 'limited':
      return t`Partially`;
    // translator: Shortened accessibility description for no wheelchair accessibility (imagine as short answer to the question ‘how accessible is this place?’)
    case 'no':
      return t`Not at all`;
    // translator: Shortened accessibility description for unknown wheelchair accessibility (imagine as short answer to the question ‘how accessible is this place?’)
    case 'unknown':
      return t`Unknown`;
    default:
      return null;
  }
}

export function accessibilityDescription(accessibility: YesNoLimitedUnknown): ?string {
  switch (accessibility) {
    // translator: Describes criteria for marking places as fully wheelchair accessible on Wheelmap
    case 'yes':
      return t`Entrance has no steps, and all rooms are accessible without steps.`;
    case 'limited':
      return useImperialUnits()
        ? // translator: Describes criteria for marking places as partially wheelchair accessible on Wheelmap, using imperial units
          t`Entrance has one step with max. 3 inches height, most rooms are without steps.`
        : // translator: Describes criteria for marking places as partially wheelchair accessible on Wheelmap, using metric units
          t`Entrance has one step with max. 7 cm height, most rooms are without steps.`;
    // translator: Describes criteria for marking places as not wheelchair accessible on Wheelmap
    case 'no':
      return t`Entrance has a high step or several steps, none of the rooms are accessible.`;
    case 'unknown':
    default:
      return null;
  }
}

export function toiletDescription(accessibility: YesNoUnknown): ?string {
  switch (accessibility) {
    // translator: Long toilet accessibility description on place toolbar if the toilet IS accessible
    case 'yes':
      return t`Wheelchair accessible toilet`;
    // translator: Long toilet accessibility description on place toolbar if the toilet is NOT accessible
    case 'no':
      return t`No wheelchair accessible toilet`;
    case 'unknown':
    default:
      return null;
  }
}

export const accessibleToiletDescription = (useImperialUnits: boolean) => [
  useImperialUnits ? t`Doorways' inner width ≥ 35 inches` : t`Doorways' inner width ≥ 90 cm`,
  useImperialUnits ? t`Clear turning space ≥ 59 inches wide` : t`Clear turning space ≥ 150 cm wide`,
  t`Wheelchair-height toilet seat`,
  t`Foldable grab rails`,
  t`Accessible sink`,
];

export function placeNameFor(properties: NodeProperties, category: ?Category): string {
  return (
    (properties && translatedStringFromObject(properties.name)) ||
    (category && categoryNameFor(category)) ||
    t`Unnamed place`
  );
}

function isDefined(x): boolean {
  return (
    typeof x !== 'undefined' &&
    x !== null &&
    !(isArray(x) && x.length === 0) &&
    !(isPlainObject(x) && Object.keys(x).length === 0)
  );
}

export function removeNullAndUndefinedFields<T: {} | {}[]>(something: T): ?T {
  if (isPlainObject(something) && something instanceof Object) {
    const result = {};
    Object.keys(something)
      .filter(key => isDefined(something[key]))
      .filter(
        key => !(key.match(/Localized$/) && !isDefined(something[key.replace(/Localized$/, '')]))
      )
      .forEach(key => {
        const value = removeNullAndUndefinedFields(something[key]);
        if (isDefined(value)) result[key] = value;
      });
    return Object.keys(result).length > 0 ? result : undefined;
  } else if (something instanceof Array) {
    const result = something.filter(isDefined).map(removeNullAndUndefinedFields);
    return result.length ? result : undefined; // filter out empty arrays
  }
  return something;
}

export function normalizedCoordinatesForFeature(feature: Feature): ?[number, number] {
  const geometry = feature ? feature.geometry : null;
  if (!(geometry instanceof Object)) return null;
  const coordinates = geometry ? geometry.coordinates : null;
  if (!(coordinates instanceof Array) || coordinates.length !== 2) return null;
  return normalizeCoordinates(coordinates);
}
