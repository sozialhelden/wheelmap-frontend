import { useAppContext } from "~/lib/context/AppContext";
import useAccessibilityCloud, {
  type AccessibilityCloudApiProps,
} from "~/modules/accessibility-cloud/hooks/useAccessibilityCloud";

function getExcludedSourceIds(): Record<string, string> {
  const { clientSideConfiguration } = useAppContext();

  // TODO add explanation what this is and why it is excluded by default
  const wheelmapSourceId = "LiBTS67TjmBcXdEmX";

  return {
    excludeSourceIds: [
      ...(clientSideConfiguration.excludeSourceIds || []),
      wheelmapSourceId,
    ].join(","),
  };
}

function getIncludedSourceIds(): Record<string, string> {
  const { clientSideConfiguration } = useAppContext();
  const sourceIds = clientSideConfiguration.includeSourceIds || [];

  if (sourceIds.length === 0) {
    return {};
  }

  return {
    includeSourceIds: sourceIds.join(","),
  };
}

export type AccessibilityCloudCollectionProps = {
  collection: string;
  format?: "mvt" | "json" | "geojson";
  params?: Record<string, string>;
  suffix?: string;
} & AccessibilityCloudApiProps;

export function useAccessibilityCloudCollectionUrl({
  collection,
  format = "json",
  params = {},
  cached = false,
  suffix = "",
}: AccessibilityCloudCollectionProps): string {
  const { baseUrl, appToken } = useAccessibilityCloud({ cached });

  const queryString = new URLSearchParams({
    ...params,
    ...getExcludedSourceIds(),
    ...getIncludedSourceIds(),
    appToken,
  }).toString();

  return `${baseUrl}/${collection}.${format}?${queryString}${suffix}`;
}
