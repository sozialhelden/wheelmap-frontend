export const databaseTableNames = [
  'admin',
  'places',
  'amenities',
  'entrances_or_exits',
  'elevators',
  'ramps',
  'pedestrian_highways',
  'conveying',
  'toilets',
  'buildings',

  'master_routes',
  'master_route_members',
  'routes',
  'route_members',
  'stop_areas',
  'stop_area_members',
  'platforms',
  'stop_positions',
  'stations',
];

const publicTransportLayerIds = new Set([
  'osm-master-routes',
  'osm-master-route-members',
  'osm-routes',
  'osm-route-members',
  'osm-stop-areas',
  'osm-stop-area-members',
  'osm-platforms',
  'osm-stop-positions',
  'osm-stations',
]);

const buildingLayerIds = new Set([
  'osm-building-wheelchair-fill',
  'osm-building-outline-defined',
  'osm-building-outline-undefined',
  'osm-wheelchair-unknown-label',
  'osm-wheelchair-no-label',
  'osm-wheelchair-limited-label',
  'osm-wheelchair-yes-label',
  'osm-poi-wheelchair-circle',
]);

const surfaceLayerIds = new Set([
  'osm-pedestrian-outline',
  'osm-surface-fill',
]);

/**
 * Filter layers from a mapbox-gl stylesheet.
 *
 * Keep only layers that have an `id` matching a 'osm-' prefix, and change sources to match the
 * table names from our OSM database.
 *
 * @param layers The layers to filter
 */
export function filterLayers(
  {
    layers, hasBuildings, hasPublicTransport, hasSurfaces,
  }: {
    layers: mapboxgl.Layer[];
    hasBuildings: boolean;
    hasPublicTransport: boolean;
    hasSurfaces: boolean;
  },
): mapboxgl.Layer[] {
  return layers
    .filter((layer) => layer.id?.startsWith('osm-'))
    .filter((layer) => {
      if (publicTransportLayerIds.has(layer.id) && !hasPublicTransport) return false;
      if (buildingLayerIds.has(layer.id) && !hasBuildings) return false;
      if (surfaceLayerIds.has(layer.id) && !hasSurfaces) return false;
      return true;
    })
    .map((layer) => {
      // In Mapbox Studio, layers have a source layer reference that uses a random string ID like
      // 'entrances_or_exits_saarbrueck-0vxz2q'. We need to replace that with the actual table name,
      // for example 'entrances_or_exits'.
      const source = databaseTableNames.find((tableName) => layer['source-layer']?.startsWith(tableName));

      return {
        ...layer,
        source,
        'source-layer': 'default',
      };
    })
    .filter((layer) => layer.source);
}
