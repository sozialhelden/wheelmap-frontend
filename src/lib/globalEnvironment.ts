import { pick } from "lodash";

declare global {
  interface Window {
    environment?: Partial<Record<string, string | undefined>>
  }
}

function getPublicEnvironmentVariablesOnServer() {
  return pick(
    process.env,
    Object.keys(process.env).filter((key) => key.startsWith("NEXT_PUBLIC_"))
  );
}

export const getEnvironment = () => (global.window ? (window.environment ?? {}) : getPublicEnvironmentVariablesOnServer())

export const addToEnvironment = (environment: Partial<Record<string, string | undefined>>) => {
  const systemEnvironment = getEnvironment()
  Object.keys(environment).forEach((x) => { systemEnvironment[x] = environment[x] })
  if (global.window) {
    window.environment = systemEnvironment
  }
}
