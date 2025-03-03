import useOsmApi, { type OsmApiProps } from "~/modules/osm-api/hooks/useOsmApi";

export function useOsmApiUrl({
  path,
  format = "json",
  params = {},
  tileNumber = 1,
  cached = false,
  suffix = "",
}: {
  path: string;
  format?: "mvt" | "json" | "geojson";
  params?: Record<string, string>;
  suffix?: string;
} & OsmApiProps) {
  const { baseUrl } = useOsmApi({ cached, tileNumber });

  const queryString = new URLSearchParams(params).toString();

  return `${baseUrl}/${path}.${format}?${queryString}${suffix}`;
}
