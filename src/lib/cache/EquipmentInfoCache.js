// @flow

import get from 'lodash/get';
import FeatureCache from './FeatureCache';
import type { EquipmentInfo, EquipmentInfoFeatureCollection } from '../EquipmentInfo';
import env from '../env';

export default class EquipmentInfoCache extends FeatureCache<
  EquipmentInfo,
  EquipmentInfoFeatureCollection
> {
  static fetchFeature(
    id: string | number,
    appToken: string,
    useCache: boolean = true
  ): Promise<Response> {
    const baseUrl = env.REACT_APP_ACCESSIBILITY_APPS_BASE_URL || '';
    const url = `${baseUrl}/equipment-infos/${id}.json?appToken=${appToken}`;
    return this.fetch(url);
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
    return equipmentInfosWithSameDescription.map(e => get(e, 'properties._id'));
  }
}

const indexPaths = ['properties.placeInfoId'];
export const equipmentInfoCache = new EquipmentInfoCache(indexPaths);
