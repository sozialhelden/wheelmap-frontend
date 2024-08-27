import { OSMFeatureCollection } from '../geo/AnyFeature';
import OSMFeature from '../osm/OSMFeature';

export interface OSMTypeMapping {
  'osm:Feature': OSMFeature;
  'osm:FeatureCollection': OSMFeatureCollection;
}
