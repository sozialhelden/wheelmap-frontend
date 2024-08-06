import LRUQueue from './LRUQueue';
import { IItem, IOptions, ISetItemOptions } from './types';

export default class Cache<K, V> {
  public options: Readonly<IOptions<K, V>>;

  public lruQueue = new LRUQueue<K>();

  /**
   * A cache! 🐹
   *
   * - Can limit number of cached items
   * - Can evic exceeding items by least recent use ('LRU')
   * - Supports individual time-to-live (TTL) for single items
   * - Gives you meta information about cached objects, for stats generation or debugging
   * - Allows you to bring your own internal cache (if it supports the ES6 `Map` interface)
   * - Lets you define a custom function to clean up (e.g. to close file handles or open
   *   connections) when it evicts an item
   *
   * You can find more examples on [GitHub](https://github.com/sozialhelden/hamster-cache/blob/master/README.md).
   *
   * @param [options] - An object to configure the caching behavior.
   * @param [options.defaultTTL] - Time after which a cached object is regarded as stale. After this
   *   time, the object will be evicted when you call `evictExpiredItems()` or try to `get()` it
   *   again. By default, the TTL is set to `Infinity`, keeping all objects cached until you
   *   delete them manually. Given in milliseconds.
   * @param [options.maximalItemCount] - Limits the maximum number of cached items. When you add a
   *   value that would exceed the maximum, the cache removes either the oldest or the least
   *   recently used item, depending on the policy set in `options.evictExceedingItemsBy`.
   * @param [options.cache] - Decides which items to remove first when adding items
   *   that would exceed the cache size limit. Set to `"lru"` to remove the least recently used item
   *   first, `"age"` to remove the oldest items first. Defaults to `"lru"`.
   * @param [options.evictExceedingItemsBy] - Use this to wrap this cache around your own cache map.
   *   Must comply to the [ES6 `Map` interface](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map).
   *
   * @example
   *   const cache = new Cache<string, string>({
   *     evictExceedingItemsBy: 'lru', // or 'age'
   *     defaultTTL: 5000,
   *     maximalItemCount: 100,
   *   });
   */

  constructor({
    defaultTTL = Infinity,
    maximalItemCount = Infinity,
    cache = new Map<K, IItem<V>>(),
    evictExceedingItemsBy = 'lru',
  }: Partial<IOptions<K, V>> = {}) {
    if (defaultTTL <= 0) {
      throw new Error('Please supply a `defaultTTL` value greater than zero.');
    }

    if (maximalItemCount <= 0) {
      throw new Error(
        'Please supply a `maximalItemCount` parameter that is greater than zero. Supply no parameter or `Infinity` as value to allow an infinite number of items.',
      );
    }

    this.options = Object.freeze({
      cache,
      defaultTTL,
      evictExceedingItemsBy,
      maximalItemCount,
    });
  }

  /**
   * Adds an item to the cache.
   *
   * @param key - A unique key of the added item. If you derive this from a source where multiple
   *   keys can refer to the the same cached resource, it is a good idea to normalize the key to
   *   save resources. If you cache HTTP responses, for example, it might be a good idea to sort
   *   the URL query parameters in some cases.
   * @param value - the value to cache.
   * @param [options] - Defines individual caching options for the added item
   * @param [options.dispose] - A function that the cache will call back after deleting/evicting
   *   this item. This is useful to clean up resources, e.g. to close cached file handles or network
   *   connections.
   * @param [options.storageTimestamp] - Allows to use your own method to determine the current
   *   time. Uses `Date.now()` by default.
   * @param [options.ttl] - Sets an individual TTL (time-to-live). After this time, the cache will
   *   regard the item as stale / expired. It evicts a stale item when 1) you try to fetch it via
   *   `get()` or `getMetaInfo()`, 2) when you call `evictExpiredItems()`.
   */
  public set(
    key: K,
    value: V,
    { dispose, storageTimestamp = Date.now(), ttl = this.options.defaultTTL }: ISetItemOptions = {},
  ): boolean {
    // Check for infinity in which case the item persists forever.
    const expireAfterTimestamp = ttl < Infinity ? storageTimestamp + ttl : Infinity;

    const item: IItem<V> = {
      dispose,
      expireAfterTimestamp,
      storageTimestamp,
      value,
    };

    while (this.options.cache.size >= this.options.maximalItemCount) {
      switch (this.options.evictExceedingItemsBy) {
        case 'age':
          this.deleteOldestItem();
          break;
        case 'lru':
          this.deleteLeastRecentlyUsedItem();
          break;
        default:
          throw new Error('Must define "age" or "lru" as "evictExceedingItemsBy" strategy.');
      }
    }

    if (this.options.evictExceedingItemsBy === 'lru') {
      this.lruQueue.push(key);
    }
    this.options.cache.set(key, item);
    return true;
  }

  /**
   * Looks up a cached value + metadata without deleting it if expired.
   *
   * @param key - The key to look up
   * @returns the looked up value + metadata, or `undefined` if the value is not cached.
   */

  public peekWithMetaInfo(key: K): IItem<V> | undefined {
    return this.options.cache.get(key);
  }

  /**
   * Looks up a cached value without deleting it if expired.
   *
   * @param key - The key to look up
   * @returns the looked up value, or `undefined` if the value is not cached.
   */

  public peek(key: K): V | undefined {
    const item = this.peekWithMetaInfo(key);
    return item && item.value;
  }

  /**
   * Looks up a cached value + metadata, deleting it if its older than the given timestamp.
   *
   * @param key - The key to look up
   * @returns the looked up value + metadata, or `undefined` if the value is expired or not cached.
   */

  public getMetaInfo(key: K, ifNotExpiredOnTimestamp: number = Date.now()): IItem<V> | undefined {
    const item = this.options.cache.get(key);
    if (item !== undefined && item.expireAfterTimestamp <= ifNotExpiredOnTimestamp) {
      this.delete(key);
      return undefined;
    }
    if (this.options.evictExceedingItemsBy === 'lru') {
      // Move the key to the end of the LRU deletion queue
      this.lruQueue.touch(key);
    }
    return item;
  }

  /**
   * Looks up a value in the cache, marking it as used or removing it if expired.
   *
   * @param key - The key to look up
   * @param [ifNotExpiredOnTimestamp] - If an item is older than this timestamp, it expires.
   * @returns the looked up value, or `undefined` if the value has expired or is not cached.
   */

  public get(key: K, ifNotExpiredOnTimestamp: number = Date.now()): V | undefined {
    const item = this.getMetaInfo(key, ifNotExpiredOnTimestamp);
    return item && item.value;
  }

  /**
   * Sweeps the cache and evicts all items that are expired, calling their `dispose()` method if it
   * was set on insertion.
   *
   * @param [ifNotOlderThanTimestamp] - If an item is older than this timestamp, it expires.
   */

  public evictExpiredItems(ifOlderThanTimestamp: number = Date.now()) {
    // eslint-disable-next-line no-restricted-syntax
    const keysToEvict: K[] = [];
    this.options.cache.forEach((item, key) => {
      if (item.expireAfterTimestamp <= ifOlderThanTimestamp) {
        keysToEvict.push(key);
      }
    });
    keysToEvict.forEach(key => {
      this.delete(key);
    });
  }

  /**
   * Looks up an item in the cache without marking it as used.
   *
   * @param key The key to look up.
   */

  public has(key: K): boolean {
    return this.options.cache.has(key);
  }

  /**
   * Deletes an item from the cache, calling its `dispose()` method if it was set on insertion.
   *
   * @param key - The unique key refering to the object to delete.
   */

  public delete(key: K): boolean {
    if (this.options.evictExceedingItemsBy === 'lru') {
      this.lruQueue.delete(key);
    }
    const item = this.peekWithMetaInfo(key);
    if (item !== undefined) {
      const result = this.options.cache.delete(key);
      if (item.dispose) {
        item.dispose();
      }
      return result;
    }
    return false;
  }

  /**
   * Removes all items from the cache.
   */

  public clear(): void {
    this.options.cache.clear();
    if (this.options.evictExceedingItemsBy === 'lru') {
      this.lruQueue.clear();
    }
  }

  /**
   * Returns the number of items kept in the cache, including items that might be expired but not
   * pruned yet.
   */

  public size(): number {
    return this.options.cache.size;
  }

  /**
   * Changes the TTL (time-to-live) for an individual item in the cache.
   *
   * @param key - Unique key refering to the cached item whose .
   * @param ttl - The new time-to-live, in milliseconds.
   * @param [now] - Allows to use a custom method to determine the current time. Uses `Date.now()`
   *   by default.
   *
   * @returns the new expiry timestamp, or `undefined`.
   */

  public setTTL(key: K, ttl: number, now: number = Date.now()): number | undefined {
    const item = this.options.cache.get(key);
    if (item) {
      item.expireAfterTimestamp = now + ttl;
      return item.expireAfterTimestamp;
    }
    return undefined;
  }

  public deleteLeastRecentlyUsedItem(): IItem<V> | undefined {
    if (this.options.evictExceedingItemsBy !== 'lru') {
      throw new Error(
        'Can only use this function if the cache is initialized to watch LRU of items.',
      );
    }
    const key = this.lruQueue.shift();
    if (!key) {
      return undefined;
    }
    const item = this.peekWithMetaInfo(key);
    this.lruQueue.delete(key);
    this.options.cache.delete(key);
    if (item && item.dispose) {
      item.dispose();
    }
    return item;
  }

  public deleteOldestItem() {
    // This works because the insertion order is maintained when iterating keys.
    const key = this.options.cache.keys().next().value;
    if (key !== undefined) {
      this.delete(key);
    }
  }
}
