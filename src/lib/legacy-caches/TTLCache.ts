export interface TTLCacheItem<T> {
  value: T;
  expire: number;
  storageTimestamp: number;
  isReloading: boolean;
}

export type TTLCacheOptions = {
  ttl: number,
  max: number,
};

class TTLCache<K, V> {
  cache: Map<K, TTLCacheItem<V>> = new Map<K, TTLCacheItem<V>>()

  options: TTLCacheOptions

  constructor(options?: Partial<TTLCacheOptions>) {
    this.options = {
      ttl: Infinity,
      max: Infinity,
      ...options,
    }

    if (this.options.ttl < 0) {
      throw new Error('Invalid ttl.')
    }

    if (this.options.max < 1) {
      throw new Error('Invalid max.')
    }
  }

  set(key: K, value: V, ttl: number = this.options.ttl, now: number = Date.now()): boolean {
    // Adding the value to the cache is not possible if ttl is zero.
    if (ttl <= 0) {
      return false
    }

    // Check for infinity in which case the item persists forever.
    const expire = ttl < Infinity ? now + ttl : Infinity

    const item: TTLCacheItem<V> = {
      value,
      expire,
      isReloading: false,
      storageTimestamp: now,
    }

    while (this.cache.size >= this.options.max) {
      this.shift()
    }

    this.cache.set(key, item)

    return true
  }

  shift() {
    const key = this.cache.keys().next().value

    if (key != null) {
      this.remove(key)
    }
  }

  get(key: K, remove: boolean = false, now?: number): V | null {
    const value = this.touch(key, now)

    // Test against null and undefined
    if (value == null) {
      return null
    }

    if (remove) {
      this.remove(key)
    }

    return value
  }

  getCacheItem(key: K): TTLCacheItem<V> | null {
    const item = this.cache.get(key)

    // Test against null and undefined
    if (item == null) {
      return null
    }

    return item
  }

  has(key: K): boolean {
    return this.cache.has(key)
  }

  remove(key: K): boolean {
    return this.cache.delete(key)
  }

  touch(key: K, now: number = Date.now()): V | null {
    const item = this.cache.get(key)

    // Test against null and undefined
    if (item == null) {
      return null
    }

    if (item.expire < now) {
      this.remove(key)

      return null
    }

    return item.value
  }

  touchAll(now?: number): void {
    // @ts-ignore
    // todo why does it complain, seems to be correct
    for (const key of this.cache.keys()) {
      this.touch(key, now)
    }
  }

  clear(): void {
    this.cache.clear()
  }
}

export default TTLCache
