// @flow
import type { Feature, FeatureCollection } from 'geojson-flow';


/**
 * Base clase for a cache of GeoJSON features (cached by id). Subclass this and override the
 * `fetchFeature` method.
 */

export default class FeatureCache {
  cache: { [string]: ?Feature } = {};


  /**
   * Caches a given GeoJSON Feature by id.
   *
   * @param {Feature} feature A GeoJSON-compatible Feature to cache. Must include an id in one of
   *   the following paths:
   *     - id
   *     - properties.id
   *     - _id
   *     - properties._id
   */
  cacheFeature(feature: Feature): void {
    const featureId = String(feature.id ||
      feature._id ||
      (feature.properties && (feature.properties.id || feature.properties._id))
    );
    if (!featureId) return;
    this.cache[featureId] = feature;
  }

  /**
   * Caches all features in a given GeoJSON FeatureCollection by id.
   *
   * @param {FeatureCollection} geoJSON A GeoJSON-compatible FeatureCollection that includes all
   *   features that should be cached.
   */
  cacheGeoJSON(geoJSON: FeatureCollection): void {
    if (!geoJSON || !geoJSON.features) {
      return;
    }
    geoJSON.features.forEach(feature => this.cacheFeature(feature));
  }

  fetchFeature(id, resolve, reject) {
    this.constructor.fetchFeature(id).then(
      (response: Response) => {
        if (response.status === 200) {
          return this.constructor.getFeatureFromResponse(response).then((fetchedFeature) => {
            this.cacheFeature(fetchedFeature);
            resolve(fetchedFeature);
          }, reject);
        }
        if (response.status === 404) {
          this.cache[id] = null;
        }
        return reject(response);
      },
      reject,
    );
  }

  /**
   * Gets a feature from cache or fetches it from the web.
   * @param {string} id
   */
  getFeature(id: string): Promise<?Feature> {
    const feature = this.getCachedFeature(id);
    return new Promise((resolve, reject) => {
      if (feature || feature === null) {
        resolve(feature);
        return;
      }
      this.fetchFeature(id, resolve, reject);
    });
  }


  /** @private */ getCachedFeature(id: string): Feature {
    return this.cache[id];
  }


  static getFeatureFromResponse(response: Response): Promise<Feature> {
    return response.json();
  }


  /**
   * Fetches a non-cached feature from its store, using `fetch`.
   * @param {string} id
   */
  // eslint-disable-next-line
  /** @protected @abstract */ static fetchFeature(id: string): Promise<Response> {
    throw new Error('Not implemented. Please override this method in your subclass.');
  }
}
