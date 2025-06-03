import { useMemo } from "react";
import { useDarkMode } from "~/hooks/useDarkMode";
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

    return { dataLayers, selectionLayers };
  }, [darkMode, language]);
}
