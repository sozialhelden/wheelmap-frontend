import { useOsmApiUrl } from "~/modules/osm-api/hooks/useOsmApiUrl";

export const useOsmApiTileUrl = ({
  collection,
  tileNumber,
  params = {},
}: {
  collection: string;
  tileNumber: number;
  params?: Record<string, string>;
}) => {
  return useOsmApiUrl({
    path: collection,
    tileNumber,
    format: "mvt",
    params: {
      ...params,
      limit: "10000",
      epsg: "3857",
    },
    suffix: "&bbox={bbox-epsg-3857}",
  });
};
