import type { LayerSpecification } from "mapbox-gl";
import { useMemo } from "react";
import { useDarkMode } from "~/hooks/useTheme";
import { useI18n } from "~/modules/i18n/context/I18nContext";
import { addLabelInOriginalLanguage } from "~/modules/map/utils/layers";
import {
  getExternalSources,
  hasExternalSource,
  removePrefixesFromLayerId,
} from "~/modules/map/utils/sources";
import { getStyle } from "~/modules/map/utils/styles";

export function useLayers() {
  const darkMode = useDarkMode();
  const { language } = useI18n();

  return useMemo(() => {
    let { layers } = getStyle(darkMode);

    // this filters out all layers that do not have an external source
    // and configures the external source accordingly
    layers = layers.reduce((acc, layer) => {
      if (!hasExternalSource(layer.id)) {
        return acc;
      }
      for (const layerSourceConfig of getExternalSources(layer.id) ?? []) {
        acc.push({ ...layer, ...layerSourceConfig } as LayerSpecification);
      }
      return acc;
    }, [] as LayerSpecification[]);

    // this adds a text label in the original language, e.g. the "Brandenburg Gate"
    // in English would receive an additional label "Brandenburger Tor" in German
    layers = addLabelInOriginalLanguage(layers, language, darkMode);

    // highlight layers are all layers that will be used for highlighting
    const highlightLayers = [];
    // data layers are all layers that are not highlight layers
    const dataLayers = [];
    // list layers are data layers, that should be included in the list view
    const listLayers = [];

    for (const layer of layers) {
      const layerId = removePrefixesFromLayerId(layer.id);

      if (layerId.startsWith("highlight-")) {
        highlightLayers.push(layer);
        continue;
      }
      if (layerId.startsWith("list-")) {
        listLayers.push(layer);
      }
      dataLayers.push(layer);
    }

    return { dataLayers, highlightLayers, listLayers };
  }, [darkMode, language]);
}
