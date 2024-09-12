declare global {
  interface Window {
    environment?: Partial<Record<string, string | undefined>>
  }
}

export const getEnvironment = () => (global.window ? (window.environment ?? {}) : {})

export const addToEnvironment = (environment: Partial<Record<string, string | undefined>>) => {
  const systemEnvironment = getEnvironment()
  Object.keys(environment).forEach((x) => { systemEnvironment[x] = environment[x] })
  if (global.window) {
    window.environment = systemEnvironment
  }
}
