import type { GeoJsonObject } from "geojson";

type ExtraAPIResultFields = {
  related: Record<string, Record<string, unknown>>;
};

export interface CustomFeatureCollection<F> extends GeoJsonObject {
  type: "FeatureCollection";
  features: Array<F>;
}

export type AccessibilityCloudAPIFeatureCollectionResult<F> =
  CustomFeatureCollection<F> & ExtraAPIResultFields;
