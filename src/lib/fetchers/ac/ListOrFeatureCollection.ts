import type { Geometry } from "geojson";
import type { AccessibilityCloudAPIFeatureCollectionResult } from "./AccessibilityCloudAPIFeatureCollectionResult";
import type { AccessibilityCloudAPIListResult } from "./AccessibilityCloudAPIListResult";
import type { CollectionResultType } from "./CollectionResultType";

export type ListOrFeatureCollection<
  D,
  T extends CollectionResultType,
  G extends Geometry | null,
> = T extends "List"
  ? AccessibilityCloudAPIListResult<D>
  : AccessibilityCloudAPIFeatureCollectionResult<G, D>;
