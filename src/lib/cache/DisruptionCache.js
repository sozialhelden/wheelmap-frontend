// @flow

import FeatureCache from './FeatureCache';
import type { Disruption, DisruptionFeatureCollection } from '../Disruption';
import config from '../config';

export default class DisruptionCache extends FeatureCache<Disruption, DisruptionFeatureCollection> {
  static fetchFeature(id): Promise<Response> {
    const url = `https://www.accessibility.cloud/equipment-infos/${id}.json&appToken=${config.accessibilityCloudAppToken}`;
    return this.fetch(url);
  }

  static getIdForFeature(feature: Disruption): string {
    return String(feature._id || (feature.properties && feature.properties._id));
  }
}

const indexPaths = [
  'properties.equipmentInfoId',
  'properties.placeInfoId',
];
export const disruptionCache = new DisruptionCache(indexPaths);
