import { EquipmentInfo, PlaceInfo, Restroom } from '@sozialhelden/a11yjson'
import flatten from 'lodash/flatten'
import includes from 'lodash/includes'
import uniq from 'lodash/uniq'
import { isOSMFeature } from '../geo/AnyFeature'
import OSMFeature from '../osm/OSMFeature'
import { KomootPhotonResultFeature } from '../../fetchers/fetchPlacesOnKomootPhoton'

export type YesNoLimitedUnknown = 'yes' | 'no' | 'limited' | 'unknown';
export type YesNoUnknown = 'yes' | 'no' | 'unknown';
export const yesNoLimitedUnknownArray: readonly YesNoLimitedUnknown[] = [
  'limited',
  'yes',
  'no',
  'unknown',
]
Object.freeze(yesNoLimitedUnknownArray)
export const yesNoUnknownArray: readonly YesNoUnknown[] = ['yes', 'no', 'unknown']
Object.freeze(yesNoUnknownArray)

export type MappingEventFeature = KomootPhotonResultFeature;

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
  if (!feature) return null
  const idProperties = [
    feature.id,
    feature._id,
    feature.properties.id,
    feature.properties._id,
    feature.properties.osm_id,
  ]
  const result = idProperties.filter((id) => typeof id === 'string' || typeof id === 'number')[0]
  return result ? String(result) : null
}

export function hrefForPlaceInfo(
  feature: PlaceInfo,
) {
  const featureId = getFeatureId(feature)
  const [, osmFeatureType, osmId] = featureId?.match(/^(node|way|relation)\/(\d+)$/) || []
  if (osmFeatureType && osmId) {
    return `/${osmFeatureType}/${osmId}`
  }
  return `/nodes/${featureId}`
}

export function hrefForEquipmentInfo(
  feature: EquipmentInfo,
) {
  const { properties } = feature
  const featureId = getFeatureId(feature)
  const placeInfoId = properties?.placeInfoId
  if (includes(['elevator', 'escalator'], properties?.category)) {
    return `/nodes/${placeInfoId}/equipment/${featureId}`
  }
  return `/nodes/${featureId}`
}

export function sourceIdsForFeature(feature: PlaceInfo | EquipmentInfo | any): string[] {
  if (!feature) return []

  const { properties } = feature
  if (!properties) return []

  const placeSourceId = properties && typeof properties.sourceId === 'string' ? properties.sourceId : null

  return uniq([placeSourceId].filter(Boolean))
}

function hasAccessibleToiletOSM(feature: OSMFeature): YesNoUnknown {
  const wheelchairToiletTag = feature.properties['toilets:wheelchair']
    || feature.properties['wheelchair:toilets']
    || feature.properties['wheelchair:toilet']
    || feature.properties['toilet:wheelchair']
  if (['yes', 'no'].includes(String(wheelchairToiletTag))) {
    return wheelchairToiletTag as 'yes' | 'no'
  }
  return 'unknown'
}

export function hasAccessibleToilet(
  feature: PlaceInfo | OSMFeature | any,
): YesNoUnknown {
  if (isOSMFeature(feature)) {
    return hasAccessibleToiletOSM(feature)
  }

  const { properties } = feature

  if (!properties.accessibility) {
    return 'unknown'
  }

  const restrooms: Restroom[] = flatten(
    properties.accessibility.areas?.map((area) => {
      if (!(area.restrooms instanceof Array)) return null
      return area.restrooms
    }).concat(properties.accessibility.restrooms),
  )

  const accessibleCount = restrooms.filter((r) => r.isAccessibleWithWheelchair === true).length
  const nonAccessibleCount = restrooms.filter((r) => r.isAccessibleWithWheelchair === false).length
  const unknownCount = restrooms.filter((r) => r.isAccessibleWithWheelchair === null || r.isAccessibleWithWheelchair === undefined).length

  if (accessibleCount >= 1) return 'yes'
  if (nonAccessibleCount > unknownCount) return 'no'
  return 'unknown'
}
