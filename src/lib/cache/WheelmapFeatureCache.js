// @flow

import FeatureCache from './FeatureCache';
import { convertResponseToWheelmapFeature } from '../Feature';
import type { WheelmapFeature, WheelmapFeatureCollection } from '../Feature';
import env from '../env';
import { t } from 'ttag';
import ResponseError from '../ResponseError';

export default class WheelmapFeatureCache extends FeatureCache<
  WheelmapFeature,
  WheelmapFeatureCollection
> {
  static fetchFeature(
    id: number | string,
    options: { useCache: boolean } = { useCache: true }
  ): Promise<Response> {
    const wheelmapApiBaseUrl = env.public.wheelmap.baseUrl
      ? env.public.wheelmap.baseUrl
      : env.publicUrl;

    return this.fetch(
      `${wheelmapApiBaseUrl}/api/nodes/${id}?api_key=${env.public.wheelmap.apiKey}`,
      {
        cordova: true,
        ...options,
      }
    );
  }

  static getIdForFeature(feature: WheelmapFeature): string {
    return String(feature.id || (feature.properties && feature.properties.id));
  }

  static getFeatureFromResponse(response): Promise<WheelmapFeature> {
    if (!response.ok) {
      // translator: Shown when there was an error while loading a place.
      const errorText = t`Could not load this place.`;
      throw new ResponseError(errorText, response);
    }
    return response
      .json()
      .then(responseJson => convertResponseToWheelmapFeature(responseJson.node));
  }
}

export const wheelmapFeatureCache = new WheelmapFeatureCache();
