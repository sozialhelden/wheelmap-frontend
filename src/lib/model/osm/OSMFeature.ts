import type { Geometry } from "geojson";

type OSMFeature = GeoJSON.Feature<Geometry, Record<string, string | number>> & {
  _id: string;
  centroid: { coordinates: number[]; type: "Point" };
  source: string;
  sourceLayer: string;
  error?: never;
};

export type OSMAPIErrorResponse = {
  _id: never;
  error: string;
};

export type OSMFeatureOrError = OSMFeature | OSMAPIErrorResponse;

export function isErrorResponse(
  featureOrError: OSMFeatureOrError,
): featureOrError is OSMAPIErrorResponse {
  return featureOrError.error !== undefined;
}

export type OSMFeatureId = {
  source: string;
  id: string;
};

export default OSMFeature;
