import FeatureCache from './FeatureCache';
import { WheelmapLightweightFeature, WheelmapLightweightFeatureCollection } from '../Feature';

export default class WheelmapLightweightFeatureCache extends FeatureCache<
  WheelmapLightweightFeature,
  WheelmapLightweightFeatureCollection
> {
  static getIdForFeature(feature: WheelmapLightweightFeature): string {
    return String(feature.id || (feature.properties && feature.properties.id));
  }
}

export const wheelmapLightweightFeatureCache = new WheelmapLightweightFeatureCache();
