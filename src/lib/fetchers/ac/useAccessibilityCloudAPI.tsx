import { useEnvContext } from "../../context/EnvContext";

export default function useAccessibilityCloudAPI({ cached = true }: { cached: boolean }) {
  const env = useEnvContext();
  const baseUrl = cached ? env.NEXT_PUBLIC_ACCESSIBILITY_CLOUD_BASE_URL : env.NEXT_PUBLIC_ACCESSIBILITY_CLOUD_UNCACHED_BASE_URL;
  const appToken = env.NEXT_PUBLIC_ACCESSIBILITY_CLOUD_APP_TOKEN;
  return { baseUrl, appToken };
}