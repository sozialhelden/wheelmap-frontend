// tslint:disable-next-line: import-name
import Cache from './Cache'
import { CacheStrategy } from './types'

describe('Cache', () => {
  describe('constructor', () => {
    it('throws with wrong parameters', () => {
      expect(() => new Cache({ defaultTTL: 0 })).toThrowError(/defaultTTL/)
      expect(() => new Cache({ maximalItemCount: 0 })).toThrowError(/maximalItemCount/)
    })
  })

  it('caches items', () => {
    const cache = new Cache()
    cache.set('foo', 'bar')
    cache.set('qoo', 'qux')
    expect(cache.get('foo')).toBe('bar')
    expect(cache.get('qoo')).toBe('qux')
    expect(cache.size()).toBe(2)
  })

  it('evicts exceeding items by age', () => {
    const cache = new Cache<string, string>({
      evictExceedingItemsBy: 'age',
      maximalItemCount: 2,
    })

    let xIsDisposed = false
    let yIsDisposed = false
    let zIsDisposed = false

    cache.set('old', 'X', { dispose: () => { xIsDisposed = true } })
    cache.set('new', 'Y', { dispose: () => { yIsDisposed = true } })
    expect(cache.size()).toBe(2)

    // Mark the item as used to keep it in the cache on reaching the maximal number of items
    cache.get('old')
    cache.set('evenNewer', 'Z', { dispose: () => { zIsDisposed = true } })

    expect(cache.size()).toBe(2)
    expect(cache.get('old')).toBeUndefined()
    expect(xIsDisposed).toBe(true)
    expect(cache.get('new')).toBe('Y')
    expect(yIsDisposed).toBe(false)
    expect(cache.get('evenNewer')).toBe('Z')
    expect(zIsDisposed).toBe(false)
    expect(() => {
      cache.deleteLeastRecentlyUsedItem()
    }).toThrowError(/LRU/)
  })

  it('evicts exceeding items by LRU', () => {
    const cache = new Cache<string, string>({
      evictExceedingItemsBy: 'lru',
      maximalItemCount: 2,
    })

    let xIsDisposed = false
    let yIsDisposed = false
    let zIsDisposed = false
    const x = { dispose: () => { xIsDisposed = true } }
    const y = { dispose: () => { yIsDisposed = true } }
    const z = { dispose: () => { zIsDisposed = true } }

    cache.set('old', 'X', x)
    cache.set('new', 'Y', y)
    expect(cache.size()).toBe(2)
    expect(cache.lruQueue.lruRemovalQueue).toEqual(['old', 'new'])

    // Mark the item as used to keep it in the cache on reaching the maximal number of items
    cache.get('old')
    expect(cache.lruQueue.lruRemovalQueue).toEqual(['new', 'old'])
    cache.set('evenNewer', 'Z', z)
    expect(cache.lruQueue.lruRemovalQueue).toEqual(['old', 'evenNewer'])

    expect(cache.size()).toBe(2)
    expect(cache.peek('old')).toBe('X')
    expect(xIsDisposed).toBe(false)
    expect(cache.peek('new')).toBeUndefined()
    expect(yIsDisposed).toBe(true)
    expect(cache.peek('evenNewer')).toBe('Z')
    expect(zIsDisposed).toBe(false)
    expect(cache.deleteLeastRecentlyUsedItem()).toMatchObject({ value: 'X' })
    expect(cache.lruQueue.lruRemovalQueue).toEqual(['evenNewer'])
    expect(cache.size()).toBe(1)
    expect(cache.deleteLeastRecentlyUsedItem()).toMatchObject({ value: 'Z' })
    expect(cache.lruQueue.lruRemovalQueue).toEqual([])
    expect(cache.size()).toBe(0)
    expect(cache.deleteLeastRecentlyUsedItem()).toBeUndefined()
    expect(cache.size()).toBe(0)
  })

  describe('methods', () => {
    let dateNowSpy: jest.SpyInstance<number, []>

    beforeEach(() => {
      // Lock Time
      dateNowSpy = jest.spyOn(Date, 'now')
    })

    afterEach(() => {
      // Unlock Time
      if (dateNowSpy) dateNowSpy.mockRestore()
    })

    const createCache = (strategy: CacheStrategy) => new Cache<string, string>({
      defaultTTL: 5000,
      evictExceedingItemsBy: strategy,
      maximalItemCount: 4,
    });

    (['lru', 'age'] as CacheStrategy[]).forEach((strategy) => {
      describe(`using ${strategy} as eviction policy`, () => {
        describe('peekWithMetaInfo', () => {
          it('returns an item\'s meta info without evicting it, even after TTL', () => {
            const cache = createCache(strategy)
            dateNowSpy.mockReturnValueOnce(10000)
            const dispose = jest.fn()
            cache.set('x', 'y', { dispose })
            dateNowSpy.mockReturnValueOnce(14999)
            const expectedItem = {
              dispose,
              expireAfterTimestamp: 15000,
              storageTimestamp: 10000,
              value: 'y',
            }
            expect(cache.peekWithMetaInfo('x')).toEqual(expectedItem)
            expect(dispose).toBeCalledTimes(0)
            dateNowSpy.mockReturnValueOnce(15000)
            expect(cache.peekWithMetaInfo('x')).toEqual(expectedItem)
            expect(dispose).toBeCalledTimes(0)
          })
        })

        describe('peek', () => {
          it('returns a cached value without evicting the item, even after TTL', () => {
            const cache = createCache(strategy)
            dateNowSpy.mockReturnValueOnce(10000)
            cache.set('x', 'y')
            dateNowSpy.mockReturnValueOnce(14999)
            expect(cache.peek('x')).toEqual('y')
            dateNowSpy.mockReturnValueOnce(15000)
            expect(cache.peek('x')).toEqual('y')
          })
        })

        describe('getMetaInfo', () => {
          it('returns an item\'s meta info before TTL, but evicts the item after TTL (and returns undefined)', () => {
            const cache = createCache(strategy)
            dateNowSpy.mockReturnValue(10000)
            // tslint:disable-next-line: no-empty
            const dispose = jest.fn()
            cache.set('x', 'y', { dispose })
            dateNowSpy.mockReturnValue(14999)
            expect(cache.getMetaInfo('x')).toEqual({
              dispose,
              expireAfterTimestamp: 15000,
              storageTimestamp: 10000,
              value: 'y',
            })
            dateNowSpy.mockReturnValue(15000)
            // TTL reached, item should be evicted as side effect
            expect(cache.getMetaInfo('x')).toBeUndefined()
            expect(dispose).toBeCalledTimes(1)
            expect(cache.options.cache.get('x')).toBeUndefined()
            expect(cache.getMetaInfo('x')).toBeUndefined()
          })
        })

        describe('get', () => {
          it('returns a cached value before TTL, but evicts the item after TTL (and returns undefined)', () => {
            const cache = createCache(strategy)
            dateNowSpy.mockReturnValue(10000)
            cache.set('x', 'y')
            dateNowSpy.mockReturnValue(14999)
            expect(cache.get('x')).toBe('y')
            dateNowSpy.mockReturnValue(15000)
            expect(cache.get('x')).toBeUndefined()
          })
        })

        describe('expireItems', () => {
          it('evicts expired items and leaves the rest untouched', () => {
            const cache = createCache(strategy)
            dateNowSpy.mockReturnValue(10000)
            cache.set('a', 'x')
            cache.set('b', 'x')
            cache.set('c', 'x')
            dateNowSpy.mockReturnValue(11000)
            cache.set('d', 'x')
            cache.set('e', 'x')
            dateNowSpy.mockReturnValue(14999)
            expect(cache.peek('a')).toBeUndefined()
            expect(cache.peek('b')).toBe('x')
            expect(cache.peek('c')).toBe('x')
            expect(cache.peek('d')).toBe('x')
            expect(cache.peek('e')).toBe('x')
            dateNowSpy.mockReturnValue(15000)
            expect(cache.peek('a')).toBeUndefined()
            expect(cache.peek('b')).toBe('x')
            expect(cache.peek('c')).toBe('x')
            expect(cache.peek('d')).toBe('x')
            expect(cache.peek('e')).toBe('x')
            cache.evictExpiredItems()
            expect(cache.peek('a')).toBeUndefined()
            expect(cache.peek('b')).toBeUndefined()
            expect(cache.peek('c')).toBeUndefined()
            expect(cache.peek('d')).toBe('x')
            expect(cache.peek('e')).toBe('x')
          })
        })

        describe('has', () => {
          it('returns `true`', () => {
            const cache = createCache(strategy)
            cache.set('a', 'x')
            expect(cache.has('a')).toBe(true)
          })
          it('returns `false`', () => {
            const cache = createCache(strategy)
            cache.set('a', 'x')
            expect(cache.has('b')).toBe(false)
          })
        })

        describe('clear', () => {
          it('removes all items from the cache', () => {
            const cache = createCache(strategy)
            cache.set('a', 'x')
            cache.set('b', 'x')
            expect(cache.has('a')).toBe(true)
            expect(cache.has('b')).toBe(true)
            cache.set('a', 'x')
            cache.set('b', 'x')
            cache.clear()
            expect(cache.has('a')).toBe(false)
            expect(cache.has('b')).toBe(false)
          })
        })

        describe('delete', () => {
          it('deletes an existing key and returns true', () => {
            const cache = createCache(strategy)
            cache.set('a', 'x')
            cache.set('b', 'x')
            expect(cache.delete('a')).toBe(true)
          })
          it('returns false when deleting a non-existing key', () => {
            const cache = createCache(strategy)
            cache.set('a', 'x')
            cache.set('b', 'x')
            expect(cache.delete('c')).toBe(false)
          })
          it('can be called twice', () => {
            const cache = createCache(strategy)
            cache.set('a', 'x')
            expect(cache.delete('a')).toBe(true)
            expect(cache.delete('a')).toBe(false)
          })
          it('actually removes the cached item', () => {
            const cache = createCache(strategy)
            cache.set('a', 'x')
            cache.delete('a')
            expect(cache.get('a')).toBeUndefined()
          })
        })

        describe('setTTL', () => {
          it('changes the TTL of an existing item', () => {
            const cache = createCache(strategy)
            cache.set('a', 'x')
            cache.setTTL('a', 100, 100)
            const item = cache.peekWithMetaInfo('a')
            expect(item && item.expireAfterTimestamp).toBe(200)
          })

          it('does not crash if trying to set a ttl for a non-existing item', () => {
            const cache = createCache(strategy)
            cache.set('a', 'x')
            cache.setTTL('b', 100, 100)
          })
        })

        describe('deleteOldestItem', () => {
          it('deletes the oldest item', () => {
            const cache = createCache(strategy)
            cache.set('a', 'x')
            cache.set('b', 'y')
            cache.deleteOldestItem()
            expect(cache.size()).toBe(1)
            expect(cache.get('a')).toBeUndefined()
            expect(cache.get('b')).toBe('y')
          })

          it('is a no-op if the cache is empty', () => {
            const cache = createCache(strategy)
            cache.deleteOldestItem()
            expect(cache.size()).toBe(0)
          })
        })
      })
    })
  })
})
