import get from 'lodash/get';
import set from 'lodash/set';
import { t } from 'ttag';
import { globalFetchManager } from '../fetchers/legacy/FetchManager';
import EventTarget, { CustomEvent } from '../util/EventTarget';
import ResponseError from '../util/ResponseError';

type FeatureCacheEvent<T> = CustomEvent & {
  target: FeatureCache<any, any>; // eslint-disable-line no-use-before-define
  feature: T;
};

type PropertyPath = string;
type PropertyValue = any;

/**
 * Base clase for a cache of GeoJSON features (cached by id). Subclass this and override the
 * `fetchFeature` method.
 */

export default class FeatureCache<
  FeatureType,
  FeatureCollectionType
> extends EventTarget<FeatureCacheEvent<FeatureType>> {
  cache: { [key: string]: FeatureType | undefined } = {};

  // For each indexed property path, this object saves an index map.
  // For each value that is found in an object at the given path, this index saves a set
  // of objects that have this value at the given path.
  indexMaps: { [key: string]: { [key: string]: Set<any> } } = {};

  constructor(indexedPropertyPaths: string[] = []) {
    super();

    indexedPropertyPaths.forEach((indexedPath) => {
      this.indexMaps[indexedPath] = {};
    });
  }

  /**
   * Injects a given GeoJSON Feature into the cache, firing add &
   *
   * @param {Feature} feature A GeoJSON-compatible Feature to cache. Must include an id in one of
   *   the following paths:
   *     - id
   *     - properties.id
   *     - _id
   *     - properties._id
   */
  injectFeature(feature: FeatureType): void {
    // @ts-ignore
    const featureId = this.constructor.getIdForFeature(feature);
    if (!featureId) return;
    let event: CustomEvent;
    const oldFeature = this.cache[featureId];
    const eventName = oldFeature ? 'change' : 'add';
    event = new CustomEvent(eventName, {
      target: this,
      feature,
    });
    this.cache[featureId] = feature;
    this.updateIndexMap(feature, oldFeature);

    // @ts-ignore
    this.dispatchEvent(event);
  }

  /**
   * Caches a given GeoJSON Feature by id. Will not fire change/add events.
   *
   * @param {Feature} feature A GeoJSON-compatible Feature to cache. Must include an id in one of
   *   the following paths:
   *     - id
   *     - properties.id
   *     - _id
   *     - properties._id
   * @param response
   */
  cacheFeature(feature: FeatureType, response?: any): void {
    // @ts-ignore
    const featureId = this.constructor.getIdForFeature(feature);
    if (!featureId) return;
    const oldFeature = this.cache[featureId];
    this.cache[featureId] = feature;
    this.updateIndexMap(feature, oldFeature);
  }

  updateIndexMap(feature: FeatureType, oldFeature: FeatureType | undefined) {
    Object.keys(this.indexMaps).forEach((path) => {
      const value = get(feature, path);
      if (this.indexMaps[path][value] instanceof Set) {
        if (oldFeature) {
          this.indexMaps[path][value].delete(oldFeature);
        }
      } else {
        this.indexMaps[path][value] = new Set();
      }

      this.indexMaps[path][value].add(feature);
    });
  }

  // todo: why is this static?
  static getIdForFeature(feature: any): string {
    // eslint-disable-line no-unused-vars
    throw new Error('Please implement this in your subclass.');
  }

  /**
   * Caches all features in a given GeoJSON FeatureCollection by id. Will not fire change/add events.
   *
   * @param {FeatureCollection} geoJSON A GeoJSON-compatible FeatureCollection that includes all
   *   features that should be cached.
   */
  cacheGeoJSON(geoJSON: FeatureCollectionType | any, response: any): void {
    if (!geoJSON || !geoJSON.features) {
      return;
    }
    geoJSON.features.forEach((feature) => this.cacheFeature(feature, response));
  }

  async fetchFeature(
    id: string,
    appToken: string,
    useCache: boolean = true,
  ): Promise<FeatureType> {
    // check if have already downloaded a feature with this id
    if (useCache && this.cache[id]) {
      return this.cache[id];
    }

    // @ts-ignore
    const response = await this.constructor.fetchFeature(
      id,
      appToken,
      useCache,
    );

    if (response.status === 200) {
      // @ts-ignore
      const feature = await this.constructor.getFeatureFromResponse(response);

      if (useCache) {
        this.cacheFeature(feature, response);
      }

      const changeEvent = new CustomEvent('change', {
        target: this,
        feature,
      });

      // @ts-ignore
      this.dispatchEvent(changeEvent);

      return feature;
    }

    if (response.status === 404) {
      this.cache[id] = null;
    }

    throw response;
  }

  getIndexedFeatures(
    propertyPath: PropertyPath,
    value: PropertyValue,
  ): Set<FeatureType> {
    const indexMap = this.indexMaps[propertyPath];
    if (!indexMap) return new Set();
    return indexMap[value];
  }

  /**
   * Gets a feature from cache or fetches it from the web.
   * @param {string} id
   */
  async getFeature(
    id: string,
    appToken: string,
    useCache: boolean = true,
  ): Promise<FeatureType | null> {
    const feature = this.getCachedFeature(id);

    if (feature || feature === null) {
      return feature;
    }

    return this.fetchFeature(id, appToken, useCache);
  }

  /** @protected */ getCachedFeature(id: string): FeatureType | null {
    return this.cache[id];
  }

  static getFeatureFromResponse(response: Response): Promise<any> {
    if (!response.ok) {
      // translator: Shown when there was an error while loading a place.
      const errorText = t`Could not load this place.`;
      throw new ResponseError(errorText, response);
    }
    return response.json();
  }

  updateFeatureAttribute(id: string, newProperties: any) {
    const feature = this.cache[id] as any;
    if (!feature) throw new Error('Cannot update a feature that is not in cache.');

    const existingProperties = feature.properties || {};
    Object.keys(newProperties).forEach((key) => {
      set(existingProperties, key, newProperties[key]);
    });

    // clone object
    this.cache[id] = { ...feature };

    const changeEvent = new CustomEvent('change', {
      target: this,
      feature: this.cache[id],
    });
    // @ts-ignore
    this.dispatchEvent(changeEvent);
  }

  /**
   * Fetches a non-cached feature from its store, using `fetch`.
   * @param {string} id
   */
  // eslint-disable-next-line
  /** @protected @abstract */ static fetchFeature(
    id: string,
    appToken: string,
    useCache: boolean = true,
  ): Promise<Response> {
    throw new Error(
      'Not implemented. Please override this method in your subclass.',
    );
  }

  /**
   * Fetches a non-cached feature from its store, using WhatWG `fetch`.
   * @param {string} url
   */
  /** @protected @abstract */ static fetch(
    url: string,
    options?: {},
  ): Promise<Response> {
    return globalFetchManager.fetch(url, options);
  }
}
