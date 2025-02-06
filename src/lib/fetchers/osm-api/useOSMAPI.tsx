import { useCurrentAppToken } from "../../context/AppContext";
import {
  type EnvironmentVariables,
  useEnvContext,
} from "../../context/EnvContext";

export function getOSMAPI(
  env: EnvironmentVariables,
  currentAppToken: string,
  cached: boolean,
) {
  const appToken =
    currentAppToken || env.NEXT_PUBLIC_ACCESSIBILITY_CLOUD_APP_TOKEN;
  const baseUrl = cached
    ? env.NEXT_PUBLIC_OSM_API_TILE_BACKEND_URL?.replace(/\{n\}/, "1")
    : env.NEXT_PUBLIC_OSM_API_BACKEND_URL;
  if (!baseUrl) {
    throw new Error(
      "OSM base url not set. Please set NEXT_PUBLIC_ACCESSIBILITY_CLOUD_APP_TOKEN and NEXT_PUBLIC_OSM_API_BACKEND_URL.",
    );
  }

  return { baseUrl, appToken };
}

export default function useOSMAPI({ cached = true }: { cached: boolean }) {
  const env = useEnvContext();
  const appToken = useCurrentAppToken();
  return getOSMAPI(env, appToken, cached);
}
