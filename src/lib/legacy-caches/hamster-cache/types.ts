/** Signature of a function to call when a cache item is disposed. */
export type DisposeFunction = () => void;

/** Defines how the cache should react when an item is added that would exceed its limit. */
export type CacheStrategy = 'age' | 'lru';

/**
 * An item in the cache, stored with metadata.
 */
export interface IItem<T> {
  /**
   * The cached value.
   */
  value: T;
  /**
   * Timestamp after which the cache should regard the item as expired.
   */
  expireAfterTimestamp: number;
  /**
   * Timestamp when the item was added to the cache.
   */
  storageTimestamp: number;
  /**
   * References a function to call when the item is deleted or evicted from the cache.
   */
  dispose?: DisposeFunction;
}

/**
 * Defines caching behavior.
 */
export interface IOptions<K, V> {
  /**
   * Time after which a cached object is regarded as stale. After this
   * time, the object will be evicted when you call `evictExpiredItems()` or try to `get()` it
   * again. By default, the TTL is set to `Infinity`, keeping all objects cached until you
   * delete them manually.
   *
   * Given in milliseconds.
   */
  defaultTTL: number;
  /**
   * Limits the maximum number of cached items. When you add a
   *   value that would exceed the maximum, the cache removes either the oldest or the least
   *   recently used item, depending on the policy set in `options.evictExceedingItemsBy`.
   */
  maximalItemCount: number;

  /**
   * Decides which items to remove first when adding items
   * that would exceed the cache size limit. Set to `"lru"` to remove the least recently used item
   * first, `"age"` to remove the oldest items first. Defaults to `"lru"`.
   */
  evictExceedingItemsBy: CacheStrategy;
  /**
   * Use this to wrap this cache around your own cache map. Must comply to
   * the [ES6 `Map` interface](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map).
   */
  cache: Map<K, IItem<V>>;
}

/**
 * Defines an individual caching behavior for a cached item.
 */
export interface ISetItemOptions {
  /*
   * Sets an individual TTL (time-to-live). After this time, the cache will regard the item as
   * stale / expired. It evicts a stale item when 1) you try to fetch it via `get()` or
   * `getMetaInfo()`, 2) when you call `evictExpiredItems()`.
   */
  ttl?: number;
  /*
   * Sets an individual caching configuration for the added item.
   */
  storageTimestamp?: number;
  /*
   * A function that the cache will call back after deleting/evicting
   *   this item. This is useful to clean up resources, e.g. to close cached file handles or network
   *   connections.
   */
  dispose?: DisposeFunction;
}
