import { IOptions as ICacheOptions } from '@sozialhelden/hamster-cache';

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

export interface IMandatoryOptions<FetchT, ResponseTransformFunctionT> {
  fetch: FetchT;
  transformResult: ResponseTransformFunctionT;
}

export interface IOptionalOptions<ResponseT extends IMinimalResponse, ResultT> {
  cacheOptions: Partial<ICacheOptions<string, CachedValue<ResponseT, ResultT>>>;
  ttl: TTLFunction<ResponseT, ResultT>;
  normalizeURL: (url: string) => string;
}

/**
 * Describes fully configured caching behavior. All fields are mandatory.
 */
export type Config<FetchT, ResponseT extends IMinimalResponse, ResponseTransformFunctionT, ResultT> = Readonly<
  IMandatoryOptions<FetchT, ResponseTransformFunctionT> & IOptionalOptions<ResponseT, ResultT>
>;

export type Options<FetchT, ResponseT extends IMinimalResponse, ResponseTransformFunctionT, ResultT> = IMandatoryOptions<FetchT, ResponseTransformFunctionT> &
  Partial<IOptionalOptions<ResponseT, ResultT>>;
