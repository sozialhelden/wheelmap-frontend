// @flow

import get from 'lodash/get';
import FeatureCache from './FeatureCache';
import type { EquipmentInfo, EquipmentInfoFeatureCollection } from '../EquipmentInfo';
import env from '../env';

export default class EquipmentInfoCache extends FeatureCache<
  EquipmentInfo,
  EquipmentInfoFeatureCollection
> {
  static fetchFeature(id: string | number): Promise<Response> {
    const url = `${
      env.public.accessibilityCloud.baseUrl.cached
    }/equipment-infos/${id}.json?appToken=${env.public.accessibilityCloud.appToken}`;
    return this.fetch(url, { cordova: true });
  }

  static getIdForFeature(feature: EquipmentInfo): string {
    return String(feature._id || (feature.properties && feature.properties._id));
  }

  findAllNeighborEquipmentInfos(equipmentInfo: EquipmentInfo): Set<EquipmentInfo> {
    const placeInfoId = get(equipmentInfo, ['properties', 'placeInfoId']);
    if (!placeInfoId) return new Set([]);
    return this.getIndexedFeatures('properties.placeInfoId', placeInfoId);
  }

  findSimilarEquipmentIds(equipmentInfoId: string): string[] {
    const equipmentInfo = this.getCachedFeature(equipmentInfoId);
    if (!equipmentInfo) return [equipmentInfoId];
    const description = get(equipmentInfo, ['properties', 'description']);
    const equipmentInfos = [...this.findAllNeighborEquipmentInfos(equipmentInfo)];
    const equipmentInfosWithSameDescription = equipmentInfos.filter(e => {
      return get(e, ['properties', 'description']) === description;
    });
    return equipmentInfosWithSameDescription.map(e => get(e, '_id'));
  }
}

const indexPaths = ['properties.placeInfoId'];
export const equipmentInfoCache = new EquipmentInfoCache(indexPaths);
