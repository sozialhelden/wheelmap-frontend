import { useEnvironment } from "~/hooks/useEnvironment";
import { useCategoryFilter } from "~/modules/categories/contexts/CategoryFilterContext";
import { useNeeds } from "~/modules/needs/contexts/NeedsContext";
import { useAppContext } from "~/needs-refactoring/lib/context/AppContext";
import {
  type NestedRecord,
  flattenToSearchParams,
} from "~/utils/search-params";

export type OsmApiProps = {
  tileNumber?: number;
  cached?: boolean;
};

/**
 * Get baseUrl and appToken to access the OSM API.
 */
export default function useOsmApi({
  tileNumber = 1,
  cached = false,
}: OsmApiProps = {}) {
  const env = useEnvironment();
  const { tokenString: appToken } = useAppContext();

  const baseUrl =
    cached || tileNumber
      ? env.NEXT_PUBLIC_OSM_API_TILE_BACKEND_URL?.replace(
          /\{n\}/,
          String(tileNumber),
        )
      : env.NEXT_PUBLIC_OSM_API_BACKEND_URL;

  if (!baseUrl) {
    throw new Error(
      "OSM base url not set. Please set NEXT_PUBLIC_ACCESSIBILITY_CLOUD_APP_TOKEN and NEXT_PUBLIC_OSM_API_BACKEND_URL.",
    );
  }

  return { baseUrl, appToken };
}

export type OsmApiUrlProps = {
  path: string;
  format?: "mvt" | "json" | "geojson";
  params?: NestedRecord<string>;
  suffix?: string;
} & OsmApiProps;

/**
 * Generates an authenticated URL for accessing a given path in the OSM API.
 */
export function useOsmApiUrl({
  path,
  format = "json",
  params = {},
  tileNumber = 1,
  cached = false,
  suffix = "",
}: OsmApiUrlProps): string {
  const { baseUrl } = useOsmApi({ cached, tileNumber });

  const queryString = new URLSearchParams(
    flattenToSearchParams(params),
  ).toString();

  return `${baseUrl}/${path}.${format}?${queryString}${suffix}`;
}

function getCategoryFilterParams(): Record<string, string> {
  const { category } = useCategoryFilter();
  if (category === "toilets") {
    return { hasToiletInfo: "true" };
  }
  return { category: String(category) };
}

function getWheelchairFilterParams(): Record<string, string> {
  const {
    selection: { mobility },
  } = useNeeds();

  if (!mobility) {
    return {};
  }

  return {
    "no-need": {},
    "fully-wheelchair-accessible": {
      wheelchair: "yes",
    },
    "partially-wheelchair-accessible": {
      wheelchair: "yes;limited",
    },
    "not-wheelchair-accessible": {
      wheelchair: "no",
    },
    "no-data": {
      wheelchair: "unknown",
    },
  }[mobility];
}

function getToiletFilterParams(): Record<string, string> {
  const {
    selection: { toilet },
  } = useNeeds();

  if (!toilet) {
    return {};
  }

  return {
    "no-need": {},
    "fully-wheelchair-accessible": {
      hasAccessibleToilet: "yes",
    },
    "toilet-present": {
      hasToiletInfo: true,
    },
  }[toilet];
}

/**
 * Generates an authenticated URL for mapbox to get mvt tiles from a specific
 * collection in the OSM API. It also includes parameters for filtering the
 * collection based on the application state.
 */
export const useOsmApiTileUrl = ({
  collection,
  tileNumber,
  params = {},
}: {
  collection: string;
  tileNumber: number;
  params?: Record<string, string>;
}) => {
  const filterParams = {
    ...getCategoryFilterParams(),
    ...getWheelchairFilterParams(),
    ...getToiletFilterParams(),
  };

  return useOsmApiUrl({
    path: collection,
    tileNumber,
    format: "mvt",
    params: {
      ...filterParams,
      ...params,
      limit: "10000",
      epsg: "3857",
    },
    suffix: "&bbox={bbox-epsg-3857}",
  });
};
