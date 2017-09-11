// @flow
import get from 'lodash/get';
import flatten from 'lodash/flatten';
import includes from 'lodash/includes';

import type { GeometryObject } from 'geojson-flow';

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
  name: ?string,
  phone: ?string,
  photo_ids: ?(number | string)[],
  postcode: ?string,
  sponsor: ?string,
  category: ?string,
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

export type WheelmapFeatureCollection = {
  type: 'FeatureCollection',
  features: WheelmapFeature[],
};

export type AccessibilityCloudProperties = {
  _id: string,
  name?: string,
  accessibility?: MinimalAccessibility,
  category?: string,
  address?: { city?: string, full?: string, postal_code?: string } | string,
  infoPageUrl?: string,
};


export type AccessibilityCloudFeature = {
  type: 'Feature',
  name: ?string,
  geometry: ?GeometryObject,
  properties: ?AccessibilityCloudProperties,
}

export type Feature = AccessibilityCloudFeature | WheelmapFeature;
export type NodeProperties = AccessibilityCloudProperties | WheelmapProperties;


function isNumeric(id) {
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

export function hasAccessibleToilet(properties: WheelmapProperties | AccessibilityCloudProperties): YesNoUnknown {
  if (!properties) return 'unknown';
  if (properties && properties.wheelchair_toilet) {
    if (includes(yesNoUnknownArray, properties.wheelchair_toilet)) {
      return ((properties.wheelchair_toilet: any): YesNoUnknown);
    }
    return 'unknown';
  }

  if (!(get(properties, 'accessibility.areas') instanceof Array)) return 'unknown';

  const restroomAccessibilities = flatten(properties.accessibility.areas.map((area) => {
    if (!(area.restrooms instanceof Array)) return null;
    return area.restrooms.map(restroom => restroom.isAccessibleWithWheelchair);
  }));

  const accessibleCount = restroomAccessibilities.filter(a => a === true).length;
  const nonAccessibleCount = restroomAccessibilities.filter(a => a === false).length;
  const unknownCount = restroomAccessibilities.filter(a => a === null || typeof a === 'undefined').length;

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
    case 'yes': return 'Fully wheelchair accessible';
    case 'limited': return 'Partially wheelchair accessible';
    case 'no': return 'Not wheelchair accessible';
    case 'unknown': return 'Unknown status';
    default:
      return null;
  }
}

export function shortAccessibilityName(accessibility: YesNoLimitedUnknown): ?string {
  switch (accessibility) {
    case 'yes': return 'Fully';
    case 'limited': return 'Partially';
    case 'no': return 'Not at all';
    case 'unknown': return 'Unknown';
    default:
      return null;
  }
}

export function accessibilityDescription(accessibility: YesNoLimitedUnknown): ?string {
  switch (accessibility) {
    case 'yes': return 'Entrance without steps, all rooms without steps.';
    case 'limited': return 'Entrance has one step with max. 7 cm / 3 inch height, most rooms are without steps.';
    case 'no': return 'Entrance has a step or several steps, rooms are not accessible.';
    case 'unknown':
    default:
      return null;
  }
}

export function toiletDescription(accessibility: YesNoUnknown): ?string {
  switch (accessibility) {
    case 'yes': return 'Has a wheelchair accessible toilet.';
    case 'no': return 'No wheelchair accessible toilet.';
    case 'unknown':
    default:
      return null;
  }
}

export const accessibleToiletDescription = [
  'Doorways’ inner width ≥ 90 cm',
  'Clear floor space ≥ 150 cm wide',
  'Wheelchair-height toilet seat',
  'Folding grab rails',
  'Accessible hand basin',
];
