/**
 * OSM API collection names. This is in a separate file to avoid circular
 * dependencies and ensure the array is always available when imported.
 */
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
] as const;

export type OsmApiCollection = (typeof osmApiCollections)[number];
