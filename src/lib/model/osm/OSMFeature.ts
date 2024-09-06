type OSMFeature = {
  _id: string;
  geometry: { coordinates: any; type: 'Polygon' | 'MultiPolygon' | 'Point' };
  centroid: { coordinates: number[]; type: 'Point' };
  properties: Record<string, string | number>;
  type: 'Feature';
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
  return featureOrError.error !== undefined
}

export type OSMFeatureId = {
  source: string;
  id: string;
};

export default OSMFeature
