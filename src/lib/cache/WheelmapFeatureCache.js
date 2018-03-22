// @flow

import FeatureCache from './FeatureCache';
import { convertResponseToWheelmapFeature } from '../Feature';
import type { WheelmapFeature, WheelmapFeatureCollection } from '../Feature';
import config from '../config';

export default class WheelmapFeatureCache extends FeatureCache<WheelmapFeature, WheelmapFeatureCollection> {
  static fetchFeature(id): Promise<Response> {
    return this.fetch(`/api/nodes/${id}?api_key=${config.wheelmapApiKey}`, { cordova: true });
  }

  static getIdForFeature(feature: WheelmapFeature): string {
    return String(feature.id || (feature.properties && feature.properties.id));
  }

  static getFeatureFromResponse(response): Promise<WheelmapFeature> {
    return response.json().then(responseJson => convertResponseToWheelmapFeature(responseJson.node));
  }
}

export const wheelmapFeatureCache = new WheelmapFeatureCache();
