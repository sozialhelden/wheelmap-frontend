// @flow
export interface TTLCacheItem<T> {
  value: T;
  expire: number;
}

export type TTLCacheOptions = {
  ttl: number,
};

class TTLCache<K, V> {
  cache: Map<K, TTLCacheItem<V>> = new Map<K, TTLCacheItem<V>>();
  options: TTLCacheOptions;

  constructor(options?: TTLCacheOptions) {
    this.options = {
      ttl: Infinity,
      ...options,
    };
  }

  set(key: K, value: V, ttl: number = this.options.ttl, now: number = Date.now()): boolean {
    // Adding the value to the cache is not possible if ttl is zero.
    if (ttl === 0) {
      return false;
    }

    // Check for infinity in which case the item persists forever.
    const expire = ttl < Infinity ? now + ttl : Infinity;

    const item: TTLCacheItem<V> = {
      value,
      expire,
    };

    this.cache.set(key, item);

    return true;
  }

  get(key: K, remove: boolean = false, now?: number): ?V {
    const value = this.touch(key, now);

    if (value == null) {
      return null;
    }

    if (remove) {
      this.remove(key);
    }

    return value;
  }

  has(key: K): boolean {
    return this.cache.has(key);
  }

  remove(key: K): boolean {
    return this.cache.delete(key);
  }

  touch(key: K, now: number = Date.now()): ?V {
    const item = this.cache.get(key);

    if (item == null) {
      return null;
    }

    if (item.expire < now) {
      this.remove(key);

      return null;
    }

    return item.value;
  }

  touchAll(now?: number): void {
    for (const key of this.cache.keys()) {
      this.touch(key, now);
    }
  }

  clear(): void {
    this.cache.clear();
  }
}

export default TTLCache;
