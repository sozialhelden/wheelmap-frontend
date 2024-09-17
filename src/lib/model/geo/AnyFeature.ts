import { LocalizedString, PlaceInfo, PlaceProperties } from '@sozialhelden/a11yjson'
import OSMFeature, { OSMAPIErrorResponse } from '../osm/OSMFeature'
import {
  HasTypeTag, TypeMapping, TypeTagged, TypeTaggedWithId,
} from '../typing/TypeTaggedWithId'

export type TypeTaggedEquipmentInfo = TypeTaggedWithId<'ac:EquipmentInfo'>
export type TypeTaggedEntrance = TypeTaggedWithId<'ac:Entrance'>
export type TypeTaggedPlaceInfo = TypeTaggedWithId<'ac:PlaceInfo'> & PlaceInfo & {
  properties: PlaceProperties & {
    parentPlaceInfoName?: string | LocalizedString;
    _id: string;
  };
}

export type TypeTaggedSearchResultFeature = TypeTaggedWithId<'komoot:SearchResult'>
export type TypeTaggedOSMFeature = TypeTaggedWithId<'osm:Feature'>

const isTypeTagged = <S extends keyof TypeMapping>(type: S) => (obj: unknown): obj is TypeTagged<S> => obj?.['@type'] === type

const isTypeTaggedWithId = <S extends keyof TypeMapping>(type: S) => (obj: unknown): obj is TypeTaggedWithId<S> => obj?.['@type'] === type

export const isPlaceInfo = isTypeTaggedWithId('ac:PlaceInfo')
export const isEquipmentInfo = isTypeTaggedWithId('ac:EquipmentInfo')
export const isEntrance = isTypeTaggedWithId('ac:Entrance')
export const isSearchResultFeature = isTypeTagged('komoot:SearchResult')
export const isOSMFeature = isTypeTaggedWithId('osm:Feature')

export type TypeTaggedOSMFeatureOrError =
  | TypeTaggedOSMFeature
  | OSMAPIErrorResponse

export type AnyFeature =
  | TypeTaggedPlaceInfo
  | TypeTaggedEquipmentInfo
  | TypeTaggedEntrance
  | TypeTaggedSearchResultFeature
  | TypeTaggedOSMFeature

export type AnyFeatureCollection = {
  features: AnyFeature[];
}

export type OSMFeatureCollection = HasTypeTag<'osm:FeatureCollection'> & {
  features: OSMFeature[];
}

export function getKey(feature: AnyFeature) {
  return isSearchResultFeature(feature) ? `osm:${feature.properties.osm_type}:${feature.properties.osm_id}` : feature._id
}
