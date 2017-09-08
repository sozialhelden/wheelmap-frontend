// @flow

import type { Feature } from 'geojson-flow';
import FeatureCache from './FeatureCache';
import { convertResponseToWheelmapFeature } from '../Feature';
import config from '../config';

export default class WheelmapFeatureCache extends FeatureCache {
  static fetchFeature(id): Promise<Feature> {
    return this.fetch(`/api/nodes/${id}?api_key=${config.wheelmapApiKey}`);
  }

  static getFeatureFromResponse(response): Promise<Feature> {
    return response.json().then((responseJson) => {
      return convertResponseToWheelmapFeature(responseJson.node);
    });
  }
}

export const wheelmapFeatureCache = new WheelmapFeatureCache();
