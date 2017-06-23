// @flow
import type { Feature, FeatureCollection } from 'geojson-flow';


export default class FeatureCache {
  cache: { [string]: Feature } = {};


  cacheFeature(feature: Feature) {
    const featureId = String(feature.id ||
      feature._id ||
      (feature.properties && (feature.properties.id || feature.properties._id))
    );
    this.cache[featureId] = feature;
    console.log('Cached', feature);
  }


  cacheGeoJSON(geoJSON: FeatureCollection) {
    if (!geoJSON || !geoJSON.features) {
      return;
    }
    geoJSON.features.forEach(feature => this.cacheFeature(feature));
  }


  getCachedFeature(id: string) {
    return this.cache[id];
  }


  getFeature(id: string): Promise<Feature> {
    return new Promise((resolve, reject) => {
      const feature = this.getCachedFeature(id);
      if (feature) {
        resolve(feature);
        return;
      }
      return this.fetchFeature(id).then(feature => {
        this.cacheFeature(feature);
      });
    });
  }


  fetchFeature(id: string): Promise<Feature> {
    throw new Error('Not implemented. Please override this method in your subclass.');
  }
}
