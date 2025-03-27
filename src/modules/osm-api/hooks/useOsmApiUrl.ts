import useOsmApi, { type OsmApiProps } from "~/modules/osm-api/hooks/useOsmApi";
import {
  type NestedRecord,
  flattenToSearchParams,
} from "~/utils/search-params";

export type OsmApiUrlProps = {
  path: string;
  format?: "mvt" | "json" | "geojson";
  params?: NestedRecord<string>;
  suffix?: string;
} & OsmApiProps;

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
