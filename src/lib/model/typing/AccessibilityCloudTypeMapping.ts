import { Entrance, EquipmentInfo, PlaceInfo } from '@sozialhelden/a11yjson'
import { IApp } from '../ac/App'
import ISource from '../ac/ISource'
import { MappingEvent } from '../ac/MappingEvent'
import IAccessibilityAttribute from '../ac/IAccessibilityAttribute'
import { memoizedKebabCase } from '../../util/strings/memoizedKebabCase'
import { memoizedPluralize } from '../ac/pluralize'

export interface A11yJSONTypeMapping {
  'a11yjson:EquipmentInfo': EquipmentInfo;
  'a11yjson:PlaceInfo': PlaceInfo;
}

export interface AccessibilityCloudTypeMapping {
  'ac:EquipmentInfo': EquipmentInfo;
  'ac:Entrance': Entrance;
  'ac:PlaceInfo': PlaceInfo;
  'ac:App': IApp;
  'ac:MappingEvent': MappingEvent;
  'ac:Source': ISource;
  'ac:AccessibilityAttribute': IAccessibilityAttribute;
}

export type AccessibilityCloudRDFType = keyof AccessibilityCloudTypeMapping

/**
 * Returns the kebab-cased plural name (example: `"place-infos"`) of the collection for a given RDF
 * type (e.g. `"ac:PlaceInfo"`).
 */
export function getAccessibilityCloudCollectionName(rdfType: AccessibilityCloudRDFType) {
  const nameWithoutPrefix = rdfType.match(/[^:]+:(.*)$/)?.[1]
  if (nameWithoutPrefix === undefined) {
    throw new Error(`Could not extract name from rdfType ${rdfType}.`)
  }
  const kebabName = memoizedKebabCase(nameWithoutPrefix)
  const kebabPluralName = memoizedPluralize(kebabName)
  return kebabPluralName
}
