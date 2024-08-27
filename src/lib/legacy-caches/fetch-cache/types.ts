// import { IOptions as ICacheOptions } from '@sozialhelden/hamster-cache';

import { IOptions } from '../hamster-cache/types'

export type State = 'running' | 'resolved' | 'rejected';

export interface IMinimalResponse {
  status: number;
}

export interface ICachedValueWithState {
  state: State;
}
export type CachedValue<ResponseT extends IMinimalResponse, ResultT> =
  | ICachedValueWithState & {
    error?: never;
    promise: Promise<ResponseT>;
    state: 'running';
    response?: never;
    result?: never;
  }
  | {
    error?: never;
    promise: Promise<ResponseT>;
    response?: ResponseT;
    result: ResultT;
    state: 'resolved';
  }
  | {
    error?: any;
    promise: Promise<ResponseT>;
    state: 'rejected';
    response?: never;
    result?: never;
  };

export type TTLFunction<ResponseT extends IMinimalResponse, ResultT> = (
  cachedValue: CachedValue<ResponseT, ResultT>
) => number;

export type ResponseTransformFunction<ResponseT, RequestInitT, ResultT> =
  (response: ResponseT, input?: string, init?: RequestInitT) => ResultT;

export interface IMandatoryOptions<
  FetchT,
  RequestInitT,
  ResponseT,
  ResponseTransformFunctionT extends ResponseTransformFunction<ResponseT, RequestInitT, ResultT>,
  ResultT,
> {
  fetch: FetchT;
  transformResult: ResponseTransformFunctionT;
}

export interface IOptionalOptions<ResponseT extends IMinimalResponse, ResultT> {
  cacheOptions: Partial<IOptions<string, CachedValue<ResponseT, ResultT>>>;
  ttl: TTLFunction<ResponseT, ResultT>;
  normalizeURL: (url: string) => string;
}

/**
 * Describes fully configured caching behavior. All fields are mandatory.
 */
export type Config<
  FetchT,
  RequestInitT,
  ResponseT extends IMinimalResponse,
  ResponseTransformFunctionT extends ResponseTransformFunction<ResponseT, RequestInitT, ResultT>,
  ResultT
> = Readonly<
IMandatoryOptions<FetchT, RequestInitT, ResponseT, ResponseTransformFunctionT, ResultT
> &
IOptionalOptions<ResponseT, ResultT>>;

export type Options<
  FetchT,
  RequestInitT,
  ResponseT extends IMinimalResponse,
  ResponseTransformFunctionT extends ResponseTransformFunction<ResponseT, RequestInitT, ResultT>,
  ResultT
> = IMandatoryOptions<FetchT, RequestInitT, ResponseT, ResponseTransformFunctionT, ResultT> &
Partial<IOptionalOptions<ResponseT, ResultT>>;
