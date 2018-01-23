// @flow

import FeatureCache from './FeatureCache';
import type { EquipmentInfo, EquipmentInfoFeatureCollection } from '../EquipmentInfo';
import config from '../config';

export default class EquipmentInfoCache extends FeatureCache<EquipmentInfo, EquipmentInfoFeatureCollection> {
  static fetchFeature(id): Promise<Response> {
    const url = `https://www.accessibility.cloud/equipment-infos/${id}.json&appToken=${config.accessibilityCloudAppToken}`;
    return this.fetch(url);
  }

  static getIdForFeature(feature: EquipmentInfo): string {
    return String(feature._id || (feature.properties && feature.properties._id));
  }
}

const indexPaths = [
  'properties.placeInfoId',
];
export const equipmentInfoCache = new EquipmentInfoCache(indexPaths);
