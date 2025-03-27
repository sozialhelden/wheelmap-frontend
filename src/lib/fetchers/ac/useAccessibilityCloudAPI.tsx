import {
  type EnvironmentVariables,
  useEnvironmentContext,
} from "~/modules/app/context/EnvironmentContext";
import { useCurrentAppToken } from "../../context/AppContext";

export function getAccessibilityCloudAPI(
  env: EnvironmentVariables,
  currentAppToken: string,
  cached: boolean,
) {
  const appToken =
    currentAppToken || env.NEXT_PUBLIC_ACCESSIBILITY_CLOUD_APP_TOKEN;
  const baseUrl = cached
    ? env.NEXT_PUBLIC_ACCESSIBILITY_CLOUD_BASE_URL
    : env.NEXT_PUBLIC_ACCESSIBILITY_CLOUD_UNCACHED_BASE_URL;

  if (!appToken) {
    throw new Error("Accessibility Cloud API token not set");
  }
  if (!baseUrl) {
    throw new Error("Accessibility Cloud base url not set");
  }

  return { baseUrl, appToken };
}

export default function useAccessibilityCloudAPI({
  cached = true,
}: { cached: boolean }) {
  const env = useEnvironmentContext();
  const currentAppToken = useCurrentAppToken();
  return getAccessibilityCloudAPI(env, currentAppToken, cached);
}
