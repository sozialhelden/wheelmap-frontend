import defaultTTL from './defaultTTL'

describe('defaultTTL', () => {
  it('returns 0 when aborting a request', () => {
    const error = { name: 'AbortError' }

    const ttl = defaultTTL({
      error,
      promise: Promise.reject(error),
      state: 'rejected',
    })

    expect(ttl).toBe(0)
  })
})
