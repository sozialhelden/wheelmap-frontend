import { humanize } from "inflection";
import OSMFeature from "./OSMFeature";

export default function getFeatureCategoryDisplayName(feature: OSMFeature) {
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
      return `${humanize(properties[key])} ${key} ${properties.ref || ""}`;
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
