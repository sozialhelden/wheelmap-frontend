import { useEnvironment } from "~/hooks/useEnvironment";
import { useCategoryFilter } from "~/modules/categories/contexts/CategoryFilterContext";
import { useNeeds } from "~/modules/needs/contexts/NeedsContext";
import { useAppContext } from "~/needs-refactoring/lib/context/AppContext";
import {
  type NestedRecord,
  flattenToSearchParams,
} from "~/utils/search-params";

type AccessibilityCloudApiProps = {
  cached?: boolean;
};

/**
 * Get baseUrl and appToken to access the Accessibility Cloud API.
 */
export default function useAccessibilityCloudApi({
  cached = true,
}: AccessibilityCloudApiProps = {}) {
  const env = useEnvironment();
  const { tokenString: appToken } = useAppContext();

  const baseUrl = cached
    ? env.NEXT_PUBLIC_ACCESSIBILITY_CLOUD_BASE_URL
    : env.NEXT_PUBLIC_ACCESSIBILITY_CLOUD_UNCACHED_BASE_URL;

  if (!baseUrl) {
    throw new Error(
      "Accessibility Cloud base url not set. Please set NEXT_PUBLIC_ACCESSIBILITY_CLOUD_BASE_URL and NEXT_PUBLIC_ACCESSIBILITY_CLOUD_UNCACHED_BASE_URL.",
    );
  }

  return { baseUrl, appToken };
}

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

export type AccessibilityCloudCollectionUrlProps = {
  collection: string;
  format?: "mvt" | "json" | "geojson";
  params?: NestedRecord<string | undefined>;
  suffix?: string;
} & AccessibilityCloudApiProps;

/**
 * Generates an authenticated URL for accessing a specific collection in the
 * Accessibility Cloud API.
 */
export function useAccessibilityCloudApiCollectionUrl({
  collection,
  format = "json",
  params = {},
  cached = false,
  suffix = "",
}: AccessibilityCloudCollectionUrlProps): string {
  const { baseUrl, appToken } = useAccessibilityCloudApi({ cached });

  const queryString = new URLSearchParams({
    ...flattenToSearchParams(params),
    ...getExcludedSourceIds(),
    ...getIncludedSourceIds(),
    appToken,
  }).toString();

  return `${baseUrl}/${collection}.${format}?${queryString}${suffix}`;
}

/**
 * Generates an authenticated URL for mapbox to get mvt tiles from a specific
 * collection in the Accessibility Cloud API. It also includes parameters for
 * filtering the collection based on the application state.
 */
export const useAccessibilityCloudApiCollectionTileUrl = ({
  collection,
  params,
}: {
  collection: string;
  params?: NestedRecord<string | undefined>;
}) => {
  const filterParams = {
    needs: useNeeds().selection,
    includeCategories: useCategoryFilter().category,
  };

  return useAccessibilityCloudApiCollectionUrl({
    collection,
    format: "mvt",
    cached: true,
    params: {
      ...filterParams,
      ...params,
      includePlacesWithoutAccessibility: "1",
    },
    suffix: "&x={x}&y={y}&z={z}",
  });
};
