import { Geometry, FeatureCollection } from "geojson";

export type AccessibilityCloudAPIFeatureCollectionResult<G extends Geometry | null, D> = FeatureCollection<G, D>;
