// @flow
import get from 'lodash/get';
import flatten from 'lodash/flatten';
import includes from 'lodash/includes';
import isArray from 'lodash/isArray';
import isPlainObject from 'lodash/isPlainObject';

import type { GeometryObject } from 'geojson-flow';
import { t, translatedStringFromObject } from './i18n';

import type { EquipmentInfo } from './EquipmentInfo';
import type { Disruption } from './Disruption';
import type { Category } from './Categories';
import type { LocalizedString } from './i18n';

export type YesNoLimitedUnknown = "yes" | "no" | "limited" | "unknown";
export type YesNoUnknown = "yes" | "no" | "unknown";
export const yesNoLimitedUnknownArray = ['yes', 'limited', 'no', 'unknown'];
Object.freeze(yesNoLimitedUnknownArray);
export const yesNoUnknownArray = ['yes', 'no', 'unknown'];
Object.freeze(yesNoUnknownArray);


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
}


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
  photo_ids: ?(number | string)[],
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
  address?: { city?: string, full?: string, postal_code?: string } | string,
  infoPageUrl?: string,
  editPageUrl?: string,
};


export type AccessibilityCloudFeature = {
  type: 'Feature',
  name: ?string,
  geometry: ?GeometryObject,
  properties: AccessibilityCloudProperties,
  equipmentInfos: EquipmentInfo[],
  disruptions: Disruption[],
}

export type FeatureCollection<T> = {
  type: 'FeatureCollection',
  features: T[],
};
export type AccessibilityCloudFeatureCollection = FeatureCollection<AccessibilityCloudFeature>;
export type WheelmapFeatureCollection = FeatureCollection<WheelmapFeature>;
export type WheelmapLightweightFeatureCollection = FeatureCollection<WheelmapLightweightFeature>;

export type Feature = AccessibilityCloudFeature | WheelmapFeature;
export type NodeProperties = AccessibilityCloudProperties | WheelmapProperties;

export function getFeatureId(feature: Feature) {
  if (!feature) return null;
  if (feature.id) return feature.id;
  if (!feature.properties) return null;
  const result = feature.properties.id || feature.properties._id;
  if (result) return String(result);
  return null;
}

function isNumeric(id: string | number | null) {
  return String(id).match(/^-?\d+$/);
}

export function isWheelmapFeatureId(id: string | number | null) {
  return isNumeric(id);
}

export function isWheelmapFeature(feature: Feature) {
  return feature && feature.properties && feature.properties.id && isNumeric(feature.id);
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
  response: WheelmapPropertiesResponse,
): WheelmapFeatureCollection {
  return {
    type: 'FeatureCollection',
    features: response.nodes.map(convertResponseToWheelmapFeature),
  };
}

export function hasAccessibleToilet(
  properties: WheelmapProperties | AccessibilityCloudProperties,
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

  const restroomInfos = flatten(properties.accessibility.areas.map((area) => {
    if (!(area.restrooms instanceof Array)) return null;
    return area.restrooms.map(restroom => restroom.isAccessibleWithWheelchair);
  }));

  const accessibleCount = restroomInfos.filter(a => a === true).length;
  const nonAccessibleCount = restroomInfos.filter(a => a === false).length;
  const unknownCount = restroomInfos.filter(a => a === null || typeof a === 'undefined').length;

  if (accessibleCount >= 1) return 'yes';
  if (nonAccessibleCount > unknownCount) return 'no';
  return 'unknown';
}

export function isWheelchairAccessible(properties: NodeProperties): YesNoLimitedUnknown {
  const isAccessible = get(properties, 'wheelchair') ||
    get(properties, 'accessibility.accessibleWith.wheelchair');
  const isPartiallyAccessible = get(properties, 'accessibility.partiallyAccessibleWith.wheelchair');
  switch (isAccessible) {
    case 'yes':
    case true: return 'yes';
    case 'limited': return 'limited';
    case 'no':
    case false: return isPartiallyAccessible ? 'limited' : 'no';
    default: return 'unknown';
  }
}


export function accessibilityName(accessibility: YesNoLimitedUnknown): ?string {
  switch (accessibility) {
    // translator: Long accessibility description for full wheelchair accessibility
    case 'yes': return t`Fully wheelchair accessible`;
    // translator: Long accessibility description for partial wheelchair accessibility
    case 'limited': return t`Partially wheelchair accessible`;
    // translator: Long accessibility description for no wheelchair accessibility
    case 'no': return t`Not wheelchair accessible`;
    // translator: Long accessibility description for unknown wheelchair accessibility
    case 'unknown': return t`Unknown status`;
    default:
      return null;
  }
}

export function shortAccessibilityName(accessibility: YesNoLimitedUnknown): ?string {
  switch (accessibility) {
    // translator: Shortened accessibility description for full wheelchair accessibility (imagine as short answer to the question ‘how accessible is this place?’)
    case 'yes': return t`Fully`;
    // translator: Shortened accessibility description for partial wheelchair accessibility (imagine as short answer to the question ‘how accessible is this place?’)
    case 'limited': return t`Partially`;
    // translator: Shortened accessibility description for no wheelchair accessibility (imagine as short answer to the question ‘how accessible is this place?’)
    case 'no': return t`Not at all`;
    // translator: Shortened accessibility description for unknown wheelchair accessibility (imagine as short answer to the question ‘how accessible is this place?’)
    case 'unknown': return t`Unknown`;
    default:
      return null;
  }
}

export function accessibilityDescription(accessibility: YesNoLimitedUnknown): ?string {
  switch (accessibility) {
    // translator: Describes criteria for marking places as fully wheelchair accessible on Wheelmap
    case 'yes': return t`Entrance without steps, all rooms without steps.`;
    case 'limited':
      // translator: Describes criteria for marking places as partially wheelchair accessible on Wheelmap
      return t`Entrance has one step with max. 7 cm / 3 inch height, most rooms are without steps.`;
    // translator: Describes criteria for marking places as not wheelchair accessible on Wheelmap
    case 'no': return t`Entrance has a step or several steps, rooms are not accessible.`;
    case 'unknown':
    default:
      return null;
  }
}

export function toiletDescription(accessibility: YesNoUnknown): ?string {
  switch (accessibility) {
    // translator: Long toilet accessibility description on place toolbar if the toilet IS accessible
    case 'yes': return t`Has a wheelchair accessible toilet.`;
    // translator: Long toilet accessibility description on place toolbar if the toilet is NOT accessible
    case 'no': return t`No wheelchair accessible toilet.`;
    case 'unknown':
    default:
      return null;
  }
}

export const accessibleToiletDescription = (useImperialUnits: boolean) => [
  useImperialUnits ? t`Doorways’ inner width ≥ 35 inch` : t`Doorways’ inner width ≥ 90 cm`,
  useImperialUnits ? t`Clear floor space ≥ 59 inch wide` : t`Clear floor space ≥ 150 cm wide`,
  t`Wheelchair-height toilet seat`,
  t`Folding grab rails`,
  t`Accessible hand basin`,
];

export function categoryNameFor(category: Category): ?string {
  if (!category) return null;
  const translationsObject = category.translations;
  const idObject = translationsObject ? translationsObject._id : null;
  return translatedStringFromObject(idObject);
}

export function placeNameFor(properties: NodeProperties, category: Category): string {
  return translatedStringFromObject(properties.name) || categoryNameFor(category) || t`Unnamed place`;
}


function isDefined(x): boolean {
  return typeof x !== 'undefined' &&
    x !== null &&
    !(isArray(x) && x.length === 0) &&
    !(isPlainObject(x) && Object.keys(x).length === 0);
}

export function removeNullAndUndefinedFields<T: {} | {}[]>(something: T): ?T {
  if (isPlainObject(something) && something instanceof Object) {
    const result = {};
    Object.keys(something)
      .filter(key => isDefined(something[key]))
      .filter(key => !(key.match(/Localized$/) && !isDefined(something[key.replace(/Localized$/, '')])))
      .forEach((key) => {
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

