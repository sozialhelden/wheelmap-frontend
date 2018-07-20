// @flow

import type { FeatureCollection } from '../Feature';
import { globalFetchManager } from '../FetchManager';
import EventTarget, { CustomEvent } from '../EventTarget';
import get from 'lodash/get';
import { t } from 'c-3po';
import ResponseError from '../ResponseError';

type FeatureCacheEvent<T> = CustomEvent & {
  target: FeatureCache, // eslint-disable-line no-use-before-define
  feature: T,
};

type PropertyPath = string;
type PropertyValue = any;

/**
 * Base clase for a cache of GeoJSON features (cached by id). Subclass this and override the
 * `fetchFeature` method.
 */

export default class FeatureCache<
  FeatureType: Class<*>,
  FeatureCollectionType: Class<FeatureCollection<FeatureType>>,
> extends EventTarget<FeatureCacheEvent<FeatureType>> {
  cache: { [string]: ?FeatureType } = {};

  // For each indexed property path, this object saves an index map.
  // For each value that is found in an object at the given path, this index saves a set
  // of objects that have this value at the given path.
  indexMaps: { [PropertyPath]: { [PropertyValue]: Set<any> } } = {};

  constructor(indexedPropertyPaths: string[] = []) {
    super();

    indexedPropertyPaths.forEach(indexedPath => {
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
    const featureId = this.constructor.getIdForFeature(feature);
    if (!featureId) return;
    let event: CustomEvent;
    const oldFeature = this.cache[featureId];
    const eventName = oldFeature ? "change" : "add";
    event = new CustomEvent(eventName, {
      target: this,
      feature
    });
    this.cache[featureId] = feature;
    this.updateIndexMap(feature, oldFeature);
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
   */
  cacheFeature(feature: FeatureType, response: ?{}): void {
    const featureId = this.constructor.getIdForFeature(feature);
    if (!featureId) return;
    const oldFeature = this.cache[featureId];
    this.cache[featureId] = feature;
    this.updateIndexMap(feature, oldFeature);
  }

  updateIndexMap(feature: FeatureType, oldFeature: ?FeatureType) {
    Object.keys(this.indexMaps).forEach(path => {
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

  static getIdForFeature(feature: FeatureType): string {
    // eslint-disable-line no-unused-vars
    throw new Error("Please implement this in your subclass.");
  }

  /**
   * Caches all features in a given GeoJSON FeatureCollection by id. Will not fire change/add events.
   *
   * @param {FeatureCollection} geoJSON A GeoJSON-compatible FeatureCollection that includes all
   *   features that should be cached.
   */
  cacheGeoJSON(geoJSON: FeatureCollectionType, response: ?{}): void {
    if (!geoJSON || !geoJSON.features) {
      return;
    }
    geoJSON.features.forEach(feature => this.cacheFeature(feature, response));
  }

  fetchFeature(
    id: string,
    resolve: FeatureType => void,
    reject: (response: any) => void
  ) {
    this.constructor.fetchFeature(id).then((response: Response) => {
      if (response.status === 200) {
        return this.constructor
          .getFeatureFromResponse(response)
          .then(feature => {
            this.cacheFeature(feature, response);
            resolve(feature);
            const changeEvent = new CustomEvent("change", {
              target: this,
              feature
            });
            this.dispatchEvent(changeEvent);
          }, reject);
      }
      if (response.status === 404) {
        this.cache[id] = null;
      }
      return reject(response);
    }, reject);
  }

  getIndexedFeatures(propertyPath: PropertyPath, value: PropertyValue): Set<FeatureType> {
    const indexMap = this.indexMaps[propertyPath];
    if (!indexMap) return new Set();
    return indexMap[value];
  }

  /**
   * Gets a feature from cache or fetches it from the web.
   * @param {string} id
   */
  getFeature(id: string): Promise<?FeatureType> {
    const feature = this.getCachedFeature(id);
    return new Promise((resolve, reject) => {
      if (feature || feature === null) {
        resolve(feature);
        return;
      }
      this.fetchFeature(id, resolve, reject);
    });
  }

  reloadFeature(id: string): Promise<?FeatureType> {
    delete this.cache[id];
    return this.getFeature(id);
  }

  /** @protected */ getCachedFeature(id: string): ?FeatureType {
    return this.cache[id];
  }

  static getFeatureFromResponse(response: Response): Promise<FeatureType> {
    if (!response.ok) {
      // translator: Shown when there was an error while loading a place.
      const errorText = t`Could not load this place.`;
      throw new ResponseError(errorText, response);
    }
    return response.json();
  }

  updateFeatureAttribute(
    id: string,
    newProperties: $Shape<$PropertyType<FeatureType, "properties">>
  ) {
    const feature = this.cache[id];
    if (!feature)
      throw new Error("Cannot update a feature that is not in cache.");

    const existingProperties = feature.properties;
    if (existingProperties) {
      Object.assign(existingProperties, newProperties);
    } else {
      feature.properties = Object.assign({}, newProperties);
    }
    const changeEvent = new CustomEvent("change", { target: this, feature });
    this.dispatchEvent(changeEvent);
    console.log("Updated feature", feature);
  }

  /**
   * Fetches a non-cached feature from its store, using `fetch`.
   * @param {string} id
   */
  // eslint-disable-next-line
  /** @protected @abstract */ static fetchFeature(
    id: string
  ): Promise<Response> {
    throw new Error(
      "Not implemented. Please override this method in your subclass."
    );
  }

  /**
   * Fetches a non-cached feature from its store, using WhatWG `fetch`.
   * @param {string} url
   */
  /** @protected @abstract */ static fetch(url: string, options?: {}): Promise<Response> {
    return globalFetchManager.fetch(url, options);
  }
}
