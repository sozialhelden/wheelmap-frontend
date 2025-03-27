import { useCurrentAppToken } from "~/lib/context/AppContext";
import { useEnvironmentContext } from "~/modules/app/context/EnvironmentContext";

export type AccessibilityCloudApiProps = {
  cached?: boolean;
};

export default function useAccessibilityCloud({
  cached = true,
}: AccessibilityCloudApiProps = {}) {
  const env = useEnvironmentContext();
  const appToken = useCurrentAppToken();

  const baseUrl = cached
    ? env.NEXT_PUBLIC_ACCESSIBILITY_CLOUD_BASE_URL
    : env.NEXT_PUBLIC_ACCESSIBILITY_CLOUD_UNCACHED_BASE_URL;

  if (!baseUrl) {
    throw new Error("Accessibility Cloud base url not set");
  }

  return { baseUrl, appToken };
}
