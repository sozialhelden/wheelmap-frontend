import { Geometry } from "geojson";
import { AccessibilityCloudAPIFeatureCollectionResult } from "./AccessibilityCloudAPIFeatureCollectionResult";
import { AccessibilityCloudAPIListResult } from "./AccessibilityCloudAPIListResult";
import { CollectionResultType } from "./CollectionResultType";

export type ListOrFeatureCollection<
  D,
  T extends CollectionResultType,
  G extends Geometry | null,
> =
  T extends CollectionResultType
    ? AccessibilityCloudAPIListResult<D>
    : AccessibilityCloudAPIFeatureCollectionResult<G, D>;
