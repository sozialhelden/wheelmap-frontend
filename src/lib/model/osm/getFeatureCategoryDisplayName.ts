import { humanize } from 'inflection';
import { getLocalizedStringTranslationWithMultipleLocales } from '../../i18n/getLocalizedStringTranslationWithMultipleLocales';
import IAccessibilityAttribute from '../ac/IAccessibilityAttribute';
import OSMFeature from './OSMFeature';

export default function getGenericCategoryDisplayName(feature: OSMFeature, attributeMap: Map<string, IAccessibilityAttribute>, languageTags: string[]) {
  const { properties } = feature;
  const tagKeys: string[] = [];

  const keysWithKeyAsSuffix = [
    'studio',
    'office',
    'shop',
    'room',
    'building',
    'landuse',
    'route',
  ];

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
  ];

  const result = [];

  for (const key of keysWithoutKeyAsSuffix) {
    if (properties[key] && properties[key] !== 'yes') {
      result.push(`${humanize(properties[key])} ${properties.ref || ''}`);
      tagKeys.push(key);
      break;
    }
  }

  for (const key of keysWithKeyAsSuffix) {
    if (properties[key] && properties[key] !== 'yes') {
      const attributeId = `osm:${key}=${properties[key]}`;
      const attribute = attributeMap?.get(attributeId);

      tagKeys.push(key);
      if (attribute) {
        const fullTypeName = getLocalizedStringTranslationWithMultipleLocales(attribute.shortLabel || attribute.label, languageTags);
        result.push(`${fullTypeName} ${properties.ref || ''}`);
        break;
      }
      const specifier = humanize(properties[key]);
      const typeName = key;
      result.push(`${specifier} ${typeName} ${properties.ref || ''}`);
      break;
    }
  }

  for (const key of [...keysWithKeyAsSuffix, ...keysWithoutKeyAsSuffix]) {
    if (properties[key] === 'yes') {
      tagKeys.push(key);
      const attributeId = `osm:${key}=yes`;
      const attribute = attributeMap?.get(attributeId);
      if (attribute) {
        const fullTypeName = getLocalizedStringTranslationWithMultipleLocales(attribute.shortLabel || attribute.label, languageTags);
        result.push(
          properties.note
          || `${fullTypeName || humanize(key)} ${properties.ref || properties.note || ''}`,
        );
      }
      break;
    }
  }

  return { tagKeys, displayName: result.join(', ') };
}
