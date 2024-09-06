import { humanize } from 'inflection'
import { getLocalizedStringTranslationWithMultipleLocales } from '../../i18n/getLocalizedStringTranslationWithMultipleLocales'
import IAccessibilityAttribute from '../ac/IAccessibilityAttribute'
import OSMFeature from './OSMFeature'

export default function getGenericCategoryDisplayName(feature: OSMFeature, attributeMap: Map<string, IAccessibilityAttribute>, languageTags: string[]) {
  const { properties } = feature
  if (!properties) {
    return { tagKeys: [], displayName: undefined }
  }
  const tagKeys: string[] = []

  const keysWithKeyAsSuffix = [
    'studio',
    'office',
    'shop',
    'room',
    'building',
    'landuse',
    'route',
  ]

  const keysWithoutKeyAsSuffix = [
    'elevator',
    'stairwell',
    'sport',
    'leisure',
    'tourism',
    'shop',
    'amenity',
    'junction',
    'railway',
    'aeroway',
    'man_made',
    'highway',
  ]

  const result = []

  keysWithoutKeyAsSuffix.forEach((key) => {
    if (properties[key] && properties[key] !== 'yes') {
      result.push(`${humanize(String(properties[key]))} ${properties.ref || ''}`)
      tagKeys.push(key)
    }
  })

  keysWithKeyAsSuffix.forEach((key) => {
    if (properties[key] && properties[key] !== 'yes') {
      const attributeId = `osm:${key}=${properties[key]}`
      const attribute = attributeMap?.get(attributeId)

      tagKeys.push(key)
      if (attribute) {
        const fullTypeName = getLocalizedStringTranslationWithMultipleLocales(attribute.shortLabel || attribute.label, languageTags)
        result.push(`${fullTypeName} ${properties.ref || ''}`)
      } else {
        const specifier = humanize(String(properties[key]))
        const typeName = key
        result.push(`${specifier} ${typeName} ${properties.ref || ''}`)
      }
    }
  })

  keysWithKeyAsSuffix.concat(keysWithoutKeyAsSuffix).find((key) => {
    if (properties[key] === 'yes') {
      tagKeys.push(key)
      const attributeId = `osm:${key}=yes`
      const attribute = attributeMap?.get(attributeId)
      if (attribute) {
        const fullTypeName = getLocalizedStringTranslationWithMultipleLocales(attribute.shortLabel || attribute.label, languageTags)
        result.push(
          properties.note
          || `${fullTypeName || humanize(key)} ${properties.ref || properties.note || ''}`,
        )
      }
      return true
    }
    return false
  })

  return { tagKeys, displayName: result.join(', ') }
}
