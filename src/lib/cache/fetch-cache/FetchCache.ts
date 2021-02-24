import { defaultTTL } from './defaultTTL';
import { CachedValue, Config, IMinimalResponse, Options } from './types';
import Cache from '../hamster-cache';


/**
 * A HTTP cache for WhatWG fetch.
 */
export default class FetchCache<
  RequestInitT extends {},
  ResponseT extends IMinimalResponse,
  FetchT extends (url: string, init?: RequestInitT) => Promise<ResponseT>,
  ResultT extends PromiseLike<any>,
  ResponseTransformFunctionT extends (response: ResponseT) => ResultT,
> {
  public readonly options: Config<FetchT, ResponseT, ResponseTransformFunctionT, ResultT>;
  public readonly cache: Cache<string, CachedValue<ResponseT, ResultT>>;

  constructor({
    cacheOptions = {},
    fetch,
    normalizeURL = url => url,
    ttl = defaultTTL,
    transformResult,
  }: Options<FetchT, ResponseT, ResponseTransformFunctionT, ResultT>) {
    this.cache = new Cache(cacheOptions);
    this.options = Object.freeze({ cacheOptions, fetch, normalizeURL, ttl, transformResult });
  }

  public async fetch(input: string, init?: RequestInitT, dispose?: () => void): Promise<ResponseT> {
    const normalizedURL = this.options.normalizeURL(input);
    const existingItem = this.cache.get(normalizedURL);
    if (existingItem) {
      return existingItem.promise;
    }
    return this.createFetchCacheItem(normalizedURL, init, dispose).promise;
  }

  public async fetchResult(input: string, init?: RequestInitT, dispose?: () => void): Promise<{ response: ResponseT, result: ResultT }> {
    const normalizedURL = this.options.normalizeURL(input);
    const existingItem = this.cache.get(normalizedURL);
    if (existingItem) {
      const { response, result } = existingItem;
      return { response, result };
    }
    const newItem = this.createFetchCacheItem(normalizedURL, init, dispose);
    await newItem.promise;
    const { response, result } = newItem;
    return { response, result };
  }

  private createFetchCacheItem(
    url: string,
    init?: RequestInitT,
    dispose?: () => void
  ): CachedValue<ResponseT, ResultT> {
    const cache = this.cache;
    const options = this.options;
    const promise = this.options
      .fetch(url, init)
      .then(response => {
        Object.assign(value, { response, state: 'resolved', result: options.transformResult(response)});
        const ttl = options.ttl(value);
        cache.setTTL(url, ttl === undefined ? defaultTTL(value) : ttl);
        return response;
      })
      .catch(error => {
        Object.assign(value, { error, state: 'rejected' });
        const ttl = options.ttl(value);
        cache.setTTL(url, ttl === undefined ? defaultTTL(value) : ttl);
        throw error;
      }) as ReturnType<FetchT>;
    const value: CachedValue<ResponseT, ResultT> = {
      promise,
      state: 'running',
    };
    this.cache.set(url, value, { dispose, ttl: options.ttl(value) });
    return value;
  }
}
