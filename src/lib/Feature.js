// @flow
import type { GeometryObject } from 'geojson-flow';

export type YesNoPartial = "yes" | "no" | "limited" | "unknown";


// TODO: Create flowtype definition for AC format and re-use it here

export type MinimalAccessibility = {
  accessibleWith: {
    wheelchair: boolean,
  },
  partiallyAccessibleWith: {
    wheelchair: boolean,
  },
}


export type WheelmapNodeType = {
  id: number,
  identifier: ?string,
  category: ?number,
  icon: ?string,
};


export type WheelmapProperties = {
  id: number | string,
  category_id: ?number,
  city: ?string,
  housenumber: ?string,
  lat: ?number,
  lon: ?number,
  name: ?string,
  phone: ?string,
  photo_ids: ?(number | string)[],
  postcode: ?string,
  sponsor: ?string,
  category: ?string,
  icon: ?string,
  region: ?string,
  street: ?string,
  type_id: ?number,
  type?: WheelmapNodeType,
  website: ?string,
  wheelchair: ?YesNoPartial,
  wheelchair_description: ?string,
  wheelchair_toilet: ?YesNoPartial,
};


export type WheelmapFeature = {
  type: 'Feature',
  geometry: ?GeometryObject,
  properties: ?WheelmapProperties,
  id: number,
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
