import { LocalizedString, PlaceInfo, PlaceProperties } from '@sozialhelden/a11yjson'
import OSMFeature, { OSMAPIErrorResponse } from '../osm/OSMFeature'
import {
  HasTypeTag, TypeMapping, TypeTagged, TypeTaggedWithId,
} from '../typing/TypeTaggedWithId'

export type TypeTaggedEquipmentInfo = TypeTaggedWithId<'ac:EquipmentInfo'> | TypeTaggedWithId<'a11yjson:EquipmentInfo'>
export type TypeTaggedEntrance = TypeTaggedWithId<'ac:Entrance'> | TypeTaggedWithId<'a11yjson:Entrance'>
export type TypeTaggedPlaceInfo = (TypeTaggedWithId<'ac:PlaceInfo'> | TypeTaggedWithId<'a11yjson:PlaceInfo'>) & PlaceInfo & {
  properties: PlaceProperties & {
    parentPlaceInfoName?: string | LocalizedString;
    _id: string;
  };
}

export type TypeTaggedPhotonSearchResultFeature = TypeTagged<'photon:SearchResult'>
export type TypeTaggedOSMFeature = TypeTaggedWithId<'osm:Feature'>

const isTypeTagged = <S extends keyof TypeMapping>(type: S) => (obj: unknown): obj is TypeTagged<S> => obj?.['@type'] === type

const isTypeTaggedWithId = <S extends keyof TypeMapping>(...types: S[]) => (obj: unknown): obj is TypeTaggedWithId<S> => types.includes(obj?.['@type'])

export const isPlaceInfo = isTypeTaggedWithId('ac:PlaceInfo', 'a11yjson:PlaceInfo')
export const isEquipmentInfo = isTypeTaggedWithId('ac:EquipmentInfo', 'a11yjson:EquipmentInfo')
export const isEntrance = isTypeTaggedWithId('ac:Entrance', 'a11yjson:Entrance')
export const isSearchResultFeature = isTypeTagged('photon:SearchResult')
export const isOSMFeature = isTypeTaggedWithId('osm:Feature')

export type TypeTaggedOSMFeatureOrError =
  | TypeTaggedOSMFeature
  | OSMAPIErrorResponse

export type AnyFeature =
  | TypeTaggedPlaceInfo
  | TypeTaggedEquipmentInfo
  | TypeTaggedEntrance
  | TypeTaggedPhotonSearchResultFeature
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
