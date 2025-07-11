import { useAccessibilityCloudApiCollectionTileUrl } from "~/hooks/useAccessibilityCloudApi";
import { type OsmApiCollection, useOsmApiTileUrl } from "~/hooks/useOsmApi";

import { externalDataSources } from "~/modules/map/sources";

export function useSources() {
  const sources = externalDataSources.map(({ config, tileSource }) => {
    let tiles: string[] = [];
    if (tileSource === "osm") {
      tiles = [0, 1, 2, 3].map((tileNumber) =>
        useOsmApiTileUrl({
          collection: config.id as OsmApiCollection,
          tileNumber,
        }),
      );
    }
    if (tileSource === "accessibility-cloud-api") {
      tiles = [
        useAccessibilityCloudApiCollectionTileUrl({
          collection: "place-infos",
        }),
      ];
    }
    return { ...config, tiles };
  });

  return { sources };
}
