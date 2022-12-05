export const databaseTableNames = [
  "admin",
  "places",
  "amenities",
  "entrances_or_exits",
  "elevators",
  "ramps",
  "pedestrian_highways",
  "conveying",
  "toilets",
  "buildings",
  "master_routes",
  "master_route_members",
  "routes",
  "route_members",
  "stop_areas",
  "stop_area_members",
  "platforms",
  "stop_positions",
  "stations",
];

/**
 * Filter layers from a mapbox-gl stylesheet.
 *
 * Keep only layers that have an `id` matching a 'osm-' prefix, and change sources to match the
 * table names from our OSM database.
 *
 * @param layers The layers to filter
 */
export function filterLayers(layers: mapboxgl.Layer[]): mapboxgl.Layer[] {
  return layers
    .filter((layer) => layer.id?.startsWith("osm-"))
    .map((layer) => {
      // In Mapbox Studio, layers have a source layer reference that uses a random string ID like
      // 'entrances_or_exits_saarbrueck-0vxz2q'. We need to replace that with the actual table name,
      // for example 'entrances_or_exits'.
      const source = databaseTableNames.find((tableName) =>
        layer["source-layer"]?.startsWith(tableName)
      );

      return {
        ...layer,
        source,
        "source-layer": "default",
      };
    })
    .filter((layer) => layer.source);
}
