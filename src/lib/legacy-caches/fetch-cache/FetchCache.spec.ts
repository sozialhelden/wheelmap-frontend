// tslint:disable no-empty
// tslint:disable-next-line: no-implicit-dependencies
import AbortController from 'abort-controller'
// tslint:disable-next-line: no-implicit-dependencies
import express from 'express'
import * as http from 'http'
// tslint:disable-next-line: no-implicit-dependencies
import nodeFetch from 'node-fetch'
// tslint:disable-next-line: no-implicit-dependencies
import normalizeURL from 'normalize-url'

import FetchCache from './FetchCache'
import { TTLFunction } from './types'

async function createMinimalServer(): Promise<http.Server> {
  const app = express()
  // tslint:disable-next-line: variable-name
  app.get('/works', (_req, res: express.Response) => res.send('👍'))
  app.get('/timeout/:milliseconds', (req, res: express.Response) => () => {
    setTimeout(() => res.send('👍'), Number(req.params.milliseconds))
  })
  return new Promise((resolve) => {
    const server: http.Server = app.listen({ host: '127.0.0.1', port: 0 }, () => resolve(server))
  })
}

describe('FetchCache', () => {
  let dateNowSpy: jest.SpyInstance<number, []>

  beforeEach(() => {
    // Lock Time
    dateNowSpy = jest.spyOn(Date, 'now')
  })

  afterEach(() => {
    // Unlock Time
    if (dateNowSpy) dateNowSpy.mockRestore()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('Basics', () => {
    it('can be initialized', () => {
      const mockResponse = {}
      const fetch = jest.fn().mockResolvedValue(mockResponse)
      // tslint:disable-next-line: no-unused-expression
      // eslint-disable-next-line no-new
      new FetchCache({ fetch, transformResult: (r) => Promise.resolve(r) })
    })

    it('resolves when `fetch` resolves', async () => {
      const mockResponse = {}
      const fetch = jest.fn().mockResolvedValue(mockResponse)
      const cache = new FetchCache({ fetch, transformResult: (r) => Promise.resolve(r) })
      const promise = cache.fetch('url')
      expect(cache.cache.peek('url')).toMatchObject({ state: 'running' })
      await expect(promise).resolves.toBe(mockResponse)
      expect(cache.cache.peek('url')).toMatchObject({ state: 'resolved' })
    })

    it('rejects when `fetch` rejects', async () => {
      const fetch = () => Promise.reject(new Error('error'))
      const cache = new FetchCache({ fetch, transformResult: (r) => Promise.resolve(r) })
      try {
        const promise = cache.fetch('url')
        expect(cache.cache.peek('url')).toMatchObject({ state: 'running' })
        await promise
        throw new Error('This should not be reached')
      } catch (e) {
        expect(e).toMatchObject({ message: 'error' })
      }
      expect(cache.cache.peek('url')).toMatchObject({ state: 'rejected' })
    })

    it('caches results from `fetch` when requesting the same URL', async () => {
      const fetch = jest
        .fn()
        .mockResolvedValueOnce('a')
        .mockResolvedValueOnce('b')
      const cache = new FetchCache({ fetch, transformResult: (r) => Promise.resolve(r) })
      await expect(cache.fetch('url')).resolves.toBe('a')
      await expect(cache.fetch('url')).resolves.toBe('a')
      await expect(cache.fetch('url')).resolves.toBe('a')
    })
  })

  describe('TTL handling', () => {
    it('returns cached response, evicts response after TTL, and makes a second request', async () => {
      const fetch = jest
        .fn()
        .mockResolvedValueOnce('a')
        .mockResolvedValueOnce('b')
      dateNowSpy.mockReturnValue(0)
      const cache = new FetchCache({
        fetch,
        ttl: () => 10000,
        transformResult: (r) => Promise.resolve(r),
      })
      const internalCache = cache.cache
      if (!internalCache) {
        throw new Error('Internal cache must be defined.')
      }
      await expect(cache.fetch('url')).resolves.toBe('a')
      expect(fetch).toHaveBeenCalledTimes(1)
      let cachedItem = internalCache.peek('url')
      expect(cachedItem && cachedItem.promise).resolves.toBe('a')
      dateNowSpy.mockReturnValue(9999)
      await expect(cache.fetch('url')).resolves.toBe('a')
      cachedItem = internalCache.peek('url')
      expect(cachedItem && cachedItem.promise).resolves.toBe('a')
      expect(fetch).toHaveBeenCalledTimes(1)
      dateNowSpy.mockReturnValue(10000)
      expect(internalCache.getMetaInfo('url')).toBeUndefined()
      await expect(cache.fetch('url')).resolves.toBe('b')
      expect(fetch).toHaveBeenCalledTimes(2)
      cachedItem = internalCache.peek('url')
      expect(cachedItem && cachedItem.state === 'resolved' && cachedItem.response).toBe('b')
    })

    it('evicts items after different TTLs depending on response status/error', async () => {
      let resolveWith200: ((value?: unknown) => void) | undefined
      const response200 = { status: 200 }
      let resolveWith404: ((value?: unknown) => void) | undefined
      const response404 = { status: 404 }
      let rejectWithError: ((value?: unknown) => void) | undefined

      const fetch = jest.fn().mockImplementation((url: string) => {
        switch (url) {
        case '200':
          return new Promise((resolve) => { resolveWith200 = resolve })
        case '404':
          return new Promise((resolve) => { resolveWith404 = resolve })
        case 'error':
          // tslint:disable-next-line: variable-name
          return new Promise((_resolve, reject) => { rejectWithError = reject })
        default:
          throw new Error(`Unknown URL: ${url}`)
        }
      })

      const ttlFunction: TTLFunction<any, any> = (cachedValue) => {
        switch (cachedValue.state) {
        case 'running':
          return 5000
        case 'resolved': {
          if (!cachedValue.response) {
            throw new Error(
              'Cached value was marked as resolved, but has no response - this should never happen.',
            )
          }
          if (cachedValue.response && cachedValue.response.status === 200) return 6000
          return 7000
        }
        case 'rejected':
          return 10000
        default:
          throw new Error('This code should not be reached.')
        }
      }

      dateNowSpy.mockReturnValue(0)
      const cache = new FetchCache({
        fetch,
        ttl: ttlFunction,
        transformResult: (r) => Promise.resolve(r),
      })

      const promise200 = cache.fetch('200')
      expect(cache.cache.peekWithMetaInfo('200')).toMatchObject({ expireAfterTimestamp: 5000 })
      if (!resolveWith200) {
        throw new Error(
          "resolveWith200 must be defined by now. If it's not defined, that means that fetch was not called correctly.",
        )
      }
      resolveWith200(response200)
      await expect(promise200).resolves.toBe(response200)
      expect(cache.cache.peekWithMetaInfo('200')).toMatchObject({ expireAfterTimestamp: 6000 })

      const promise404 = cache.fetch('404')
      expect(cache.cache.peekWithMetaInfo('404')).toMatchObject({ expireAfterTimestamp: 5000 })
      if (!resolveWith404) {
        throw new Error(
          "resolveWith404 must be defined by now. If it's not defined, that means that fetch was not called correctly.",
        )
      }
      resolveWith404(response404)
      await expect(promise404).resolves.toMatchObject(response404)
      expect(cache.cache.peekWithMetaInfo('404')).toMatchObject({ expireAfterTimestamp: 7000 })

      const promiseWithError = cache.fetch('error')
      expect(cache.cache.peekWithMetaInfo('error')).toMatchObject({ expireAfterTimestamp: 5000 })
      if (!rejectWithError) {
        throw new Error(
          "rejectWithError must be defined by now. If it's not defined, that means that fetch was not called correctly.",
        )
      }
      rejectWithError('A timeout, for example!')
      await expect(promiseWithError).rejects.toBe('A timeout, for example!')

      expect(cache.cache.peekWithMetaInfo('error')).toMatchObject({ expireAfterTimestamp: 10000 })
    })
  })

  describe('compatibility with 3rd party implementations', () => {
    describe('with `node-fetch` NPM package', () => {
      it('fetches from a local HTTP test server', async () => {
        // tslint:disable-next-line: no-implicit-dependencies
        const app = await createMinimalServer()
        const cache = new FetchCache({
          fetch: nodeFetch,
          transformResult: (r) => Promise.resolve(r),
        })
        const address = app.address()
        const url = address
          && typeof address === 'object'
          && `http://[${address.address}]:${address.port}/works`
        const promise = url && cache.fetch(url)
        await expect(promise).resolves.toBe('👍')
        app.close()
      })

      it('works when aborting using AbortController', async () => {
        const app = await createMinimalServer()
        const cache = new FetchCache({
          fetch: nodeFetch,
          transformResult: (r) => new Promise((resolve) => setTimeout(() => resolve(r), 2000)),
        })
        const address = app.address()
        const url = address
          && typeof address === 'object'
          && `http://[${address.address}]:${address.port}/timeout/10000`
        const abortController = new AbortController()
        const { signal } = abortController
        dateNowSpy.mockReturnValue(0)
        const promise = url && cache.fetch(url, { signal })
        dateNowSpy.mockReturnValue(1000)
        abortController.abort()
        await expect(promise).rejects.toMatchObject({ message: 'The user aborted a request.' })
        // With the default TTL implementation, we expect that the response is marked for eviction.
        expect(url && cache.cache.peekWithMetaInfo(url))
          .toMatchObject({ expireAfterTimestamp: 1000 })
        app.close()
      })
    })

    describe('with `normalize-url` package', () => {
      it('returns the cached response when requesting variants of the same normalized URL', async () => {
        const urlNormalized = 'http://xn--xample-hva.com/?a=foo&b=bar'
        const urlVariant1 = 'http://êxample.com/?a=foo&b=bar'
        const urlVariant2 = 'HTTP://xn--xample-hva.com:80/?b=bar&a=foo'

        const fetch = jest.fn().mockImplementation((url) => {
          switch (url) {
          case urlNormalized:
            return Promise.resolve('👌🏽')
          case urlVariant1:
          case urlVariant2:
            // If this is returned, the requested URL was used to look the response up and the
            // URL was not normalized correctly.
            return Promise.resolve('🐞')
          default:
            // If this is returned, something else went wrong.
            return Promise.reject(
              new Error(
                `This function should be called with the normalized URL, but was called with ${url}.`,
              ),
            )
          }
        })
        const cache = new FetchCache({
          fetch,
          normalizeURL,
          transformResult: (r) => Promise.resolve(r),
        })
        await expect(cache.fetch('http://êxample.com/?a=foo&b=bar')).resolves.toBe('👌🏽')
        await expect(cache.fetch('HTTP://xn--xample-hva.com:80/?b=bar&a=foo')).resolves.toBe('👌🏽')
      })
    })
  })
})
