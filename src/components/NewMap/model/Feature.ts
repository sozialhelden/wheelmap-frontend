type Feature = {
  _id: string;
  geometry: { coordinates: any; type: "Polygon" | "MultiPolygon" | "Point" };
  centroid: { coordinates: number[]; type: "Point" };
  properties: Record<string, string>;
  type: "Feature";
  source: string;
  sourceLayer: string;
  error: never;
};

export type ErrorResponse = {
  _id: never;
  error: string;
};

export type FeatureOrError = Feature | ErrorResponse;

export function isErrorResponse(
  featureOrError: FeatureOrError
): featureOrError is ErrorResponse {
  return featureOrError.error !== undefined;
}

export type FeatureId = {
  source: string;
  id: string;
};

export default Feature;
