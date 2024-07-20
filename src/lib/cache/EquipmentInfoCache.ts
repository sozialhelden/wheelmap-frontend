import { isEqual } from 'lodash';
import get from 'lodash/get';
import { EquipmentInfo, EquipmentInfoFeatureCollection } from '../EquipmentInfo';
import env from '../env';
import FeatureCache from './FeatureCache';

export default class EquipmentInfoCache extends FeatureCache<
  EquipmentInfo,
  EquipmentInfoFeatureCollection
> {
  static fetchFeature(
    id: string | number,
    appToken: string,
    useCache: boolean = true
  ): Promise<Response> {
    const baseUrl = env.REACT_APP_ACCESSIBILITY_CLOUD_UNCACHED_BASE_URL || '';
    const url = `${baseUrl}/equipment-infos/${id}.json?appToken=${appToken}`;
    return FeatureCache.fetch(url);
  }

  static getIdForFeature(feature: EquipmentInfo): string {
    // @ts-ignore
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
    // @ts-ignore
    const equipmentInfos = [...this.findAllNeighborEquipmentInfos(equipmentInfo)];
    const equipmentInfosWithSameDescription = equipmentInfos.filter(e => {
      return isEqual(get(e, ['properties', 'description']), description);
    });
    const result = equipmentInfosWithSameDescription.map(e => get(e, 'properties._id'));
    console.log(equipmentInfos.map(e => get(e, 'properties.description')));
    return result;
  }
}

const indexPaths = ['properties.placeInfoId'];
export const equipmentInfoCache = new EquipmentInfoCache(indexPaths);
