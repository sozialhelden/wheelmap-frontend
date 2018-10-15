// @flow
import debounce from 'lodash/debounce';

function debouncePromise<T>(
  fn: (...args: any[]) => Promise<T>,
  delay: number
): (...args: any[]) => Promise<T> {
  let promise;
  const debouncer = debounce((...args) => {
    if (promise == null) {
      return;
    }

    Promise.resolve(fn(...args)).then(promise.resolve, promise.reject);
    promise = null;
  }, delay);

  return (...args: any[]) => {
    if (promise == null) {
      promise = {};
      promise.promise = new Promise((resolve, reject) => {
        if (promise == null) {
          return;
        }

        promise.resolve = resolve;
        promise.reject = reject;
      });
    }

    debouncer(...args);

    return promise.promise;
  };
}

export default debouncePromise;
