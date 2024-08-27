import debounce from 'lodash/debounce'

function debouncePromise<T>(
  fn: (...args: any[]) => Promise<T>,
  delay: number,
): (...args: any[]) => Promise<T> {
  let promiseCache

  const debouncer = debounce((...args) => {
    if (promiseCache == null) {
      return
    }

    Promise.resolve(fn(...args)).then(promiseCache.resolve, promiseCache.reject)
    promiseCache = null
  }, delay)

  return (...args: any[]) => {
    if (promiseCache == null) {
      promiseCache = {}
      promiseCache.promise = new Promise((resolve, reject) => {
        if (promiseCache == null) {
          return
        }

        promiseCache.resolve = resolve
        promiseCache.reject = reject
      })
    }

    debouncer(...args)

    return promiseCache.promise
  }
}

export default debouncePromise
