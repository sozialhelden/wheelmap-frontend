const environment = process.env.NODE_ENV
const development = environment.toLowerCase() === "development"

export const logger = (prefix?: string) => {
  return {
    log: (...args: Parameters<typeof console.log>) => {
      if (!development) {
        return
      }

      const elements = prefix ? [prefix, ...args] : args
      console.log(...elements)
    },
    warn: (...args: Parameters<typeof console.log>) => {
      if (!development) {
        return
      }
      const elements = prefix ? [prefix, ...args] : args
      console.warn(...elements)
    },
    error: (...args: Parameters<typeof console.error>) => {
      if (!development) {
        return
      }
      const elements = prefix ? [prefix, ...args] : args
      console.error(...elements)
    },
    debug: (...args: Parameters<typeof console.debug>) => {
      if (!development) {
        return
      }
      const elements = prefix ? [prefix, ...args] : args
      console.debug(...elements)
    },
    trace: (...args: Parameters<typeof console.trace>) => {
      if (!development) {
        return
      }
      const elements = prefix ? [prefix, ...args] : args
      console.trace(...elements)
    }
  }
}

export const log = logger()
