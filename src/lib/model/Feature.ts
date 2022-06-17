import { t } from 'ttag';
import get from 'lodash/get';
import pick from 'lodash/pick';
import flatten from 'lodash/flatten';
import includes from 'lodash/includes';
import isEqual from 'lodash/isEqual';
import isArray from 'lodash/isArray';
import uniq from 'lodash/uniq';
import isPlainObject from 'lodash/isPlainObject';
import { translatedStringFromObject } from '../i18n';

import { isEquipmentAccessible } from './EquipmentInfo';
import { Category } from './Categories';
import { categoryNameFor } from './Categories';
import { normalizeCoordinates } from '../normalizeCoordinates';
import { SearchResultFeature } from '../searchPlaces';
import { EquipmentInfo, EquipmentProperties, PlaceInfo, PlaceProperties } from '@sozialhelden/a11yjson';
import { Feature } from 'geojson';
import useImperialUnits from '../useImperialUnits';

export type YesNoLimitedUnknown = 'yes' | 'no' | 'limited' | 'unknown';
export type YesNoUnknown = 'yes' | 'no' | 'unknown';
export const yesNoLimitedUnknownArray: YesNoLimitedUnknown[] = [
  'limited',
  'yes',
  'no',
  'unknown',
];
Object.freeze(yesNoLimitedUnknownArray);
export const yesNoUnknownArray: YesNoUnknown[] = ['yes', 'no', 'unknown'];
Object.freeze(yesNoUnknownArray);

export type MappingEventFeature = SearchResultFeature;

export type FeatureCollection<T> = {
  type: 'FeatureCollection',
  features: T[],
};
export type AccessibilityCloudFeatureCollection = FeatureCollection<PlaceInfo>;

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
  _id: string;
  isoDate: string;
  url: string;
  imagePath: string;
  mimeType: string;
  dimensions: {
    width: number;
    height: number;
  };
  angle?: number;
};

export type AccessibilityCloudImages = {
  totalCount: number;
  images: AccessibilityCloudImage[];
};

// todo: case analysis for id extraction
export function getFeatureId(feature: PlaceInfo | EquipmentInfo | any): string | null {
  if (!feature) return null;
  const idProperties = [
    feature.id,
    feature._id,
    feature.properties.id,
    feature.properties._id,
    feature.properties.osm_id,
  ];
  const result = idProperties.filter(id => typeof id === 'string' || typeof id === 'number')[0];
  return result ? String(result) : null;
}

export function hrefForPlaceInfo(
  feature: PlaceInfo,
) {
  const featureId = getFeatureId(feature);
  const [, osmFeatureType, osmId] = featureId.match(/^(node|way|relation)\/(\d+)$/) || [];
  if (osmFeatureType && osmId) {
    return `/${osmFeatureType}/${osmId}`;
  }
  return `/nodes/${featureId}`;
}

export function hrefForEquipmentInfo(
  feature: EquipmentInfo,
) {
  const properties = feature.properties;
  const featureId = getFeatureId(feature);
  const placeInfoId = properties?.placeInfoId;
  if (includes(['elevator', 'escalator'], properties.category)) {
    return `/nodes/${placeInfoId}/equipment/${featureId}`;
  }
  return `/nodes/${featureId}`;
}

function isNumeric(id: string | number | null): boolean {
  return !!String(id).match(/^-?\d+$/);
}

export function isWheelmapFeatureId(id: string | number | null | void): boolean {
  return typeof id !== 'undefined' && (isNumeric(id) || !!String(id).match(/(?:node|way|relation)\/-?]d+/));
}

export function sourceIdsForFeature(feature: PlaceInfo | EquipmentInfo | any): string[] {
  if (!feature) return [];

  const properties = feature.properties;
  if (!properties) return [];

  const placeSourceId =
    properties && typeof properties.sourceId === 'string' ? properties.sourceId : null;

  return uniq([placeSourceId].filter(Boolean));
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
  properties: PlaceProperties | any
): YesNoUnknown {
  if (!properties) {
    return 'unknown';
  }

  const isPlaceWheelchairAccessible = isWheelchairAccessible(properties);
  const isToilet = properties.category === 'toilets';
  if (isToilet && isPlaceWheelchairAccessible === 'yes') {
    return 'yes';
  }

  // OSM result
  if (properties && properties['wheelchair:toilet']) {
    if (includes(yesNoUnknownArray, properties['wheelchair:toilet'])) {
      return properties['wheelchair:toilet'];
    }
    return 'unknown';
  }

  const legacyAcResult = hasAccessibleToiletLegacyAcFormat(properties);
  if (legacyAcResult !== 'unknown') {
    return legacyAcResult;
  }

  return hasAccessibleToiletAcFormat(properties);
}

// legacy format has areas & so on
function hasAccessibleToiletLegacyAcFormat(
  properties: PlaceProperties | any
): YesNoUnknown {
  if (!(get(properties, 'accessibility.areas') instanceof Array)) return 'unknown';

  if (!properties.accessibility) {
    return 'unknown';
  }

  const restroomInfos = flatten(
    properties.accessibility.areas?.map(area => {
      if (!(area.restrooms instanceof Array)) return null;
      return area.restrooms.map(restroom => restroom.isAccessibleWithWheelchair);
    }).concat(properties.accessibility.restrooms?.map(restroom => restroom.isAccessibleWithWheelchair))
  );

  const accessibleCount = restroomInfos.filter(a => a === true).length;
  const nonAccessibleCount = restroomInfos.filter(a => a === false).length;
  const unknownCount = restroomInfos.filter(a => a === null || typeof a === 'undefined').length;

  if (accessibleCount >= 1) return 'yes';
  if (nonAccessibleCount > unknownCount) return 'no';
  return 'unknown';
}

// new format has restrooms at root of a11y
function hasAccessibleToiletAcFormat(
  properties: PlaceProperties
): YesNoUnknown {
  const restrooms = get(properties, 'accessibility.restrooms');

  // no restrooms
  if (restrooms === null) {
    return 'no';
  }
  if (typeof restrooms === 'undefined' || !Array.isArray(restrooms)) {
    return 'unknown';
  }

  const restroomInfos = restrooms.map(restroom => restroom.isAccessibleWithWheelchair);

  const accessibleCount = restroomInfos.filter(a => a === true).length;
  if (accessibleCount >= 1) return 'yes';

  const nonAccessibleCount = restroomInfos.filter(a => a === false).length;
  const unknownCount = restroomInfos.filter(a => a === null || typeof a === 'undefined').length;
  if (nonAccessibleCount > unknownCount) return 'no';

  return 'unknown';
}

export function isWheelchairAccessible(properties: PlaceProperties | EquipmentProperties): YesNoLimitedUnknown {
  if (properties.category === 'elevator' || properties.category === 'escalator') {
    const result =
      // @ts-ignore
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

export function accessibilityName(accessibility: YesNoLimitedUnknown): string | null {
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

export function shortAccessibilityName(accessibility: YesNoLimitedUnknown): string | null {
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

export function accessibilityDescription(accessibility: YesNoLimitedUnknown): string | null {
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

export function toiletDescription(accessibility: YesNoUnknown): string | null {
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

export function placeNameFor(properties: PlaceProperties, category: Category | null): string {
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

// TODO: wtf
export function removeNullAndUndefinedFields(something: any): any {
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

// returns coordinates in [lon, lat] array
export function normalizedCoordinatesForFeature(feature: Feature): [number, number] | null {
  const geometry = feature ? feature.geometry : null;
  if (!(geometry instanceof Object)) return null;
  if (geometry.type === 'GeometryCollection') return null;
  const { coordinates } = geometry;
  if (!(coordinates instanceof Array) || coordinates.length !== 2) return null;
  // @ts-ignore
  return normalizeCoordinates(coordinates);
}
