/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * `assert()` behaves in the following environments if `value` is [falsy](https://developer.mozilla.org/en-US/docs/Glossary/Falsy) or omitted.
 * - in `env.PROD` it does **not check anything**
 * - in `env.DEV` it prints a message and **causes an exception**
 * - otherwise it just prints a message
 * The output always starts with `"Assertion failed"`. If provided, `message` is formatted using
 * [`util.format()`](https://nodejs.org/docs/latest-v20.x/api/util.html#utilformatformat-args).
 *
 * If `value` is [truthy](https://developer.mozilla.org/en-US/docs/Glossary/Truthy), nothing happens.
 *
 * ```js
 * assert(true, 'does nothing');
 *
 * assert(false, 'Whoops %s work', 'didn\'t');
 * // Assertion failed: Whoops didn't work
 *
 * assert();
 * // Assertion failed
 * ```
 * @param value The value tested for being truthy.
 * @param reason All arguments besides `value` are used as error message.
 */
export const assert = <T>(value: T, reason?: string) => {
  if ((global.window && window.environment?.NODE_ENV === 'production')
    || (global.process.env && process.env?.NODE_ENV === 'production')) {
    return
  }

  console.assert(value, reason)
  if ((global.window && window.environment?.NODE_ENV === 'development')
    || (global.process.env && process.env?.NODE_ENV === 'development')) {
    throw new Error(reason)
  }
}
export default assert

export const fail = (reason?: string) => {
  assert(false, reason)
}

export const expression = (func: () => unknown, reason?: string) => {
  assert(func(), reason)
}

/** Asserts a strict equality (`===`) of `actual` and `expected` */
export const equal = (actual: any, expected: any, message?: string) => {
  assert(actual === expected, message)
}

/** Asserts a strict non-equality (`!==`) of `actual` and `expected` */
export const notEqual = (actual: any, expected: any, message?: string) => {
  assert(actual !== expected, message)
}

/** Asserts a non-strict equality (`==`) of `actual` and `expected` */
export const nonStrictEqual = (actual: any, expected: any, message?: string) => {
  // eslint-disable-next-line eqeqeq
  assert(actual == expected, message)
}

/** Asserts a non-strict inequality (`!=`) of `actual` and `expected` */
export const nonStrictNotEqual = (actual: any, expected: unknown, message?: string) => {
  // eslint-disable-next-line eqeqeq
  assert(actual != expected, message)
}
