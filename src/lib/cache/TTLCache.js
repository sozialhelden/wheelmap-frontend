// @flow
export interface TTLCacheItem<T> {
  value: T;
  expire: number;
}

export type TTLCacheOptions = {
  ttl: number,
  max: number,
};

class TTLCache<K, V> {
  cache: Map<K, TTLCacheItem<V>> = new Map<K, TTLCacheItem<V>>();
  options: TTLCacheOptions;

  constructor(options?: $Shape<TTLCacheOptions>) {
    this.options = {
      ttl: Infinity,
      max: Infinity,
      ...options,
    };

    if (this.options.ttl < 0) {
      throw new Error('Invalid ttl.');
    }

    if (this.options.max < 1) {
      throw new Error('Invalid max.');
    }
  }

  set(key: K, value: V, ttl: number = this.options.ttl, now: number = Date.now()): boolean {
    // Adding the value to the cache is not possible if ttl is zero.
    if (ttl <= 0) {
      return false;
    }

    // Check for infinity in which case the item persists forever.
    const expire = ttl < Infinity ? now + ttl : Infinity;

    const item: TTLCacheItem<V> = {
      value,
      expire,
    };

    while (this.cache.size >= this.options.max) {
      this.shift();
    }

    this.cache.set(key, item);

    return true;
  }

  shift() {
    const key = this.cache.keys().next().value;

    if (key != null) {
      this.remove(key);
    }
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
