import defaultTTL from './defaultTTL'
import {
  CachedValue, Config, IMinimalResponse, Options, ResponseTransformFunction,
} from './types'
import Cache from '../hamster-cache/Cache'

/**
 * A HTTP cache for WhatWG fetch.
 */
export default class FetchCache<
  RequestInitT extends {},
  ResponseT extends IMinimalResponse,
  FetchT extends (url: string, init?: RequestInitT) => Promise<ResponseT>,
  ResultT extends PromiseLike<any>,
  ResponseTransformFunctionT extends ResponseTransformFunction<ResponseT, RequestInitT, ResultT>,
> {
  public readonly options: Config<
  FetchT, RequestInitT, ResponseT, ResponseTransformFunctionT, ResultT
  >

  public readonly cache: Cache<string, CachedValue<ResponseT, ResultT>>

  constructor({
    cacheOptions = {},
    fetch,
    normalizeURL = (url) => url,
    ttl = defaultTTL,
    transformResult,
  }: Options<FetchT, RequestInitT, ResponseT, ResponseTransformFunctionT, ResultT>) {
    this.cache = new Cache(cacheOptions)
    this.options = Object.freeze({
      cacheOptions, fetch, normalizeURL, ttl, transformResult,
    })
  }

  public async fetch(input: string, init?: RequestInitT, dispose?: () => void): Promise<ResponseT> {
    const normalizedURL = this.options.normalizeURL(input)
    const existingItem = this.cache.get(normalizedURL)
    if (existingItem) {
      return existingItem.promise
    }
    return this.createFetchCacheItem(normalizedURL, init, dispose).promise
  }

  public async fetchResult(
    input: string,
    init?: RequestInitT,
    dispose?: () => void,
  ): Promise<{ response: ResponseT | undefined, result: ResultT | undefined }> {
    const normalizedURL = this.options.normalizeURL(input)
    const existingItem = this.cache.get(normalizedURL)
    if (existingItem) {
      const { response, result } = existingItem
      return { response, result }
    }
    const newItem = this.createFetchCacheItem(normalizedURL, init, dispose)
    await newItem.promise
    const { response, result } = newItem
    return { response, result }
  }

  private createFetchCacheItem(
    url: string,
    init?: RequestInitT,
    dispose?: () => void,
  ): CachedValue<ResponseT, ResultT> {
    const { cache } = this
    const { options } = this
    const value: CachedValue<ResponseT, ResultT> = {
      promise: this.options
        .fetch(url, init)
        .then((response) => {
          Object.assign(value, { response, state: 'resolved', result: options.transformResult(response, url, init) })
          const ttl = options.ttl(value)
          cache.setTTL(url, ttl === undefined ? defaultTTL(value) : ttl)
          return response
        })
        .catch((error) => {
          Object.assign(value, { error, state: 'rejected' })
          const ttl = options.ttl(value)
          cache.setTTL(url, ttl === undefined ? defaultTTL(value) : ttl)
          throw error
        }) as ReturnType<FetchT>,
      state: 'running',
    }
    this.cache.set(url, value, { dispose, ttl: options.ttl(value) })
    return value
  }
}
