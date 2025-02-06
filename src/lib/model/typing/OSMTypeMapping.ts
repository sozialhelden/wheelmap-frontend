import type { OSMFeatureCollection } from "../geo/AnyFeature";
import type OSMFeature from "../osm/OSMFeature";

export interface OSMTypeMapping {
  "osm:Feature": OSMFeature;
  "osm:FeatureCollection": OSMFeatureCollection;
}
