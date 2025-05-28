import * as React from "react";
import { Source } from "react-map-gl/mapbox";
import { useOsmApiFilterQuery } from "~/modules/osm-api/hooks/useOsmApiFilterQuery";
import { useOsmApiTileUrl } from "~/modules/osm-api/hooks/useOsmApiTileUrl";

export const osmApiCollections = [
  "admin",
  "amenities",
  "buildings",
  "conveying",
  "elevators",
  "entrances_or_exits",
  "master_route_members",
  "master_routes",
  "pedestrian_highways",
  "places",
  "platforms",
  "ramps",
  "route_members",
  "routes",
  "stations",
  "stop_area_members",
  "stop_areas",
  "stop_positions",
  "toilets",
];

export const OsmApiSources = () => {
  const params = useOsmApiFilterQuery();

  const sources = osmApiCollections.map((collection) => {
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
