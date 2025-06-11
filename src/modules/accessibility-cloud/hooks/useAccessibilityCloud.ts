import { useEnvironment } from "~/hooks/useEnvironment";
import { useAppContext } from "~/needs-refactoring/lib/context/AppContext";

export type AccessibilityCloudApiProps = {
  cached?: boolean;
};

export default function useAccessibilityCloud({
  cached = true,
}: AccessibilityCloudApiProps = {}) {
  const { tokenString: appToken } = useAppContext();
  const env = useEnvironment();

  const baseUrl = cached
    ? env.NEXT_PUBLIC_ACCESSIBILITY_CLOUD_BASE_URL
    : env.NEXT_PUBLIC_ACCESSIBILITY_CLOUD_UNCACHED_BASE_URL;

  return { baseUrl, appToken };
}
