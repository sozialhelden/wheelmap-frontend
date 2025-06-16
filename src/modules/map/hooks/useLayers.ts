import { useMemo } from "react";
import type { SourceProps } from "react-map-gl/mapbox-legacy";
import { useAccessibilityCloudApiCollectionTileUrl } from "~/hooks/useAccessibilityCloudApi";
import { osmApiCollections, useOsmApiTileUrl } from "~/hooks/useOsmApi";
import { useDarkMode } from "~/hooks/useTheme";
import { useI18nContext } from "~/modules/i18n/context/I18nContext";
import {
  isSelectionLayer,
  localizeLayers,
  setLayerSource,
} from "~/modules/map/utils/layers";
import { getStyle } from "~/modules/map/utils/map-styles";

export function useLayers() {
  const darkMode = useDarkMode();
  const { language } = useI18nContext();

  const sources: SourceProps[] = osmApiCollections.map((collection) => {
    return {
      id: collection,
      name: collection,
      type: "vector",
      minzoom: 8,
      tiles: [0, 1, 2, 3].map((tileNumber) => {
        return useOsmApiTileUrl({ collection, tileNumber });
      }),
    };
  });

  return useMemo(() => {
    let { layers } = getStyle(darkMode);
    layers = setLayerSource(localizeLayers(layers, language, darkMode));

    const dataLayers = [];
    const selectionLayers = [];

    for (const layer of layers) {
      if (isSelectionLayer(layer)) {
        selectionLayers.push(layer);
      } else {
        dataLayers.push(layer);
      }
    }

    // sources.push({
    //   id: "ac:PlaceInfo",
    //   type: "vector",
    //   scheme: "xyz",
    //   minzoom: 8,
    //   tiles: [
    //     useAccessibilityCloudApiCollectionTileUrl({
    //       collection: "place-infos",
    //     }),
    //   ],
    // });

    return { dataLayers, selectionLayers, sources };
  }, [darkMode, language, sources]);
}
