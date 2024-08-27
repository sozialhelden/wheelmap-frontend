import { CachedValue, IMinimalResponse } from './types'

export default function defaultTTL<ResponseT extends IMinimalResponse, ResultT>(
  cachedValue: CachedValue<ResponseT, ResultT>,
) {
  switch (cachedValue.state) {
  case 'running':
    // Evict running promises after 30s if they are not resolved to allow re-requesting.
    // This leaves it up to the fetch implementation to clean up resources if requests are not
    // aborted and the same URL is requested multiple times.
    return 30000

  case 'resolved': {
    const { response } = cachedValue
    // Keep successful or 'resource missing' responses in the cache for 120 minutes
    if (response && (response.status === 200 || response.status === 404)) {
      return 120 * 60 * 1000
    }
    // Allow retrying all other responses after 10 seconds
    return 10000
  }

  case 'rejected': {
    const { error } = cachedValue
    if (typeof error.name !== 'undefined' && error.name === 'AbortError') {
      return 0
    }
    // Allow reattempting failed requests after 10 seconds
    return 10000
  }
  default:
    throw new Error('Unknown state.')
  }
}
