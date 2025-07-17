import type { SourceProps } from "react-map-gl/mapbox-legacy";
import { osmApiCollections } from "~/hooks/useOsmApi";

export type ExternalDataSource = {
  /**
   * Configuration of the actual map source.
   */
  config: SourceProps & { id: string };
  /**
   * Prefix in the layer name to identify the correct source.
   */
  layerNamePrefix: string;
  /**
   * Identifier of the data layer in the source.
   */
  sourceLayer: string;
  /**
   * Actual external source, will be used to create a tile url.
   */
  tileSource: "osm" | "accessibility-cloud-api";
  /**
   * This type will be added as "@type" property to features from
   * this source.
   */
  type: string;
};

/**
 * This configures all map sources. It also configures how we map layers
 * to actual sources.
 *
 * In order to work with map styles in Mapbox Studio, we uploaded a few static
 * tilesets there, because many of the quality of life features only work with
 * uploaded tilesets. (also see docs/contributing/map-styles.md for more details)
 *
 * This is why we have naming conventions for the layer name to map it to the
 * correct sources (it can have multiple ones).
 */
export const externalDataSources: ExternalDataSource[] = [
  {
    layerNamePrefix: "ac-",
    sourceLayer: "place-infos",
    tileSource: "accessibility-cloud-api",
    type: "ac:PlaceInfo",
    config: {
      id: "ac:PlaceInfo",
      type: "vector",
      scheme: "xyz",
      minzoom: 8,
    },
  },
  ...osmApiCollections.map((collection) => {
    return {
      layerNamePrefix: `osm-${collection}-`,
      sourceLayer: "default",
      tileSource: "osm" as const,
      type: "osm:Feature",
      config: {
        id: String(collection),
        name: String(collection),
        type: "vector" as const,
        minzoom: 8,
      },
    };
  }),
];
