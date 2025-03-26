import * as React from "react";
import { Source } from "react-map-gl/mapbox";
import { useOsmApiFilterQuery } from "~/modules/osm-api/hooks/useOsmApiFilterQuery";
import { useOsmApiTileUrl } from "~/modules/osm-api/hooks/useOsmApiTileUrl";
import { databaseTableNames } from "./filterLayers";

export const MapSources = () => {
  const params = useOsmApiFilterQuery();

  const sources = databaseTableNames.map((collection) => {
    return {
      name: collection,
      tiles: [0, 1, 2, 3].map((tileNumber) => {
        return useOsmApiTileUrl({ collection, tileNumber, params });
      }),
    };
  });

  return (
    <>
      {sources.map(({ name, tiles }) => (
        <Source type="vector" tiles={tiles} id={name} key={name} />
      ))}
    </>
  );
};
