import { humanize } from "inflection";
import { getLocalizedStringTranslationWithMultipleLocales } from "../../i18n/getLocalizedStringTranslationWithMultipleLocales";
import IAccessibilityAttribute from "../ac/IAccessibilityAttribute";
import OSMFeature from "./OSMFeature";

export default function getGenericCategoryDisplayName(feature: OSMFeature, attributeMap: Map<string, IAccessibilityAttribute>, languageTags: string[]) {
  const properties = feature.properties;

  const keysWithKeyAsSuffix = [
    "studio",
    "office",
    "shop",
    "room",
    "building",
    "landuse",
    "route",
  ];

  const keysWithoutKeyAsSuffix = [
    "sport",
    "leisure",
    "tourism",
    "shop",
    "amenity",
    "junction",
    "railway",
    "aeroway",
    "man_made",
    "highway",
  ];

  for (const key of keysWithoutKeyAsSuffix) {
    if (properties[key] && properties[key] !== "yes") {
      return `${humanize(properties[key])} ${properties.ref || ""}`;
    }
  }

  for (const key of keysWithKeyAsSuffix) {
    if (properties[key] && properties[key] !== "yes") {
      const attributeId = `osm:${key}=${properties[key]}`;
      const attribute = attributeMap?.get(attributeId);

      if (attribute) {
        const fullTypeName = getLocalizedStringTranslationWithMultipleLocales(attribute.shortLabel || attribute.label, languageTags);
        return `${fullTypeName} ${properties.ref || ""}`;
      }
      const specifier = humanize(properties[key]);
      const typeName = key;
      return `${specifier} ${typeName} ${properties.ref || ""}`;
    }
  }

  for (const key of keysWithKeyAsSuffix) {
    if (properties[key] === "yes") {
      return (
        properties.note ||
        `${humanize(key)} ${properties.ref || properties.note || ""}`
      );
    }
  }
}
