import { PlaceInfo, PlaceProperties, PointGeometry } from '@sozialhelden/a11yjson';
import { FeatureCollection } from 'geojson';
import { t } from 'ttag';
import ResponseError from '../util/ResponseError';
import config from '../util/config';
import FeatureCache from './FeatureCache';

export default class WheelmapFeatureCache extends FeatureCache<
  PlaceInfo,
  FeatureCollection<PointGeometry, PlaceProperties>
> {
  static fetchFeature(id: number | string): Promise<Response> {
    return this.fetch(
      `${config.wheelmapApiBaseUrl}/api/v1/amenities/${id}.geojson?geometryTypes=centroid`,
    );
  }

  static getIdForFeature(feature: PlaceInfo): string {
    return String(feature._id);
  }

  static getFeatureFromResponse(response): Promise<PlaceInfo> {
    if (!response.ok) {
      // translator: Shown when there was an error while loading a place.
      const errorText = t`Could not load this place.`;
      throw new ResponseError(errorText, response);
    }
    return response.json();
  }
}

export const wheelmapFeatureCache = new WheelmapFeatureCache();
