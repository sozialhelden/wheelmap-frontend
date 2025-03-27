import { useHotkeys } from "@blueprintjs/core";
import { t } from "@transifex/native";
import * as React from "react";
import { useEffect, useState } from "react";
import type { LayerProps } from "react-map-gl/mapbox";
import { MapLayer } from "./MapLayer";
import { useI18nContext } from "~/modules/i18n/context/I18nContext";
import { fallbackLanguageTag } from "~/modules/i18n/i18n";
import { getLanguage } from "~/modules/i18n/utils/language-tags";
import { filterLayers } from "./filterLayers";
import useMapStyle from "./useMapStyle";

export const MapLayers = ({
  onInteractiveLayersChange,
}: {
  onInteractiveLayersChange: (layerIds: string[]) => void;
}) => {
  const mapStyle = useMapStyle();

  const [hasBuildings, setHasBuildings] = useState(true);
  const [hasPublicTransport, setHasPublicTransport] = useState(false);
  const [hasSurfaces, setHasSurfaces] = useState(false);

  const hotkeys = React.useMemo(
    () => [
      {
        combo: "1",
        global: true,
        label: t("Toggle building focus"),
        onKeyDown: () => setHasBuildings(!hasBuildings),
      },
      {
        combo: "2",
        global: true,
        label: t("Toggle public transport focus"),
        onKeyDown: () => setHasPublicTransport(!hasPublicTransport),
      },
      {
        combo: "3",
        global: true,
        label: t("Toggle surfaces"),
        onKeyDown: () => setHasSurfaces(!hasSurfaces),
      },
    ],
    [hasBuildings, hasPublicTransport, hasSurfaces],
  );

  useHotkeys(hotkeys);

  const { language } = useI18nContext();
  const primaryLanguage = language;
  const secondaryLanguage = getLanguage(fallbackLanguageTag);

  const [layers, highlightLayers] = React.useMemo(() => {
    if (mapStyle.data?.layers) {
      return filterLayers({
        layers: mapStyle.data.layers,
        hasBuildings,
        hasPublicTransport,
        hasSurfaces,
        primaryLanguage,
        secondaryLanguage,
      });
    }
    return [[], []];
  }, [
    mapStyle.data?.layers,
    hasBuildings,
    hasPublicTransport,
    hasSurfaces,
    primaryLanguage,
    secondaryLanguage,
  ]);

  useEffect(() => {
    const layerIds = layers.map((layer) => layer.id);
    onInteractiveLayersChange(layerIds);
  }, [onInteractiveLayersChange, layers]);

  return (
    <>
      {layers?.map((layer) => (
        <MapLayer key={layer.id} {...(layer as LayerProps)} />
      ))}
      {highlightLayers?.map((layer) => (
        <MapLayer key={layer.id} {...(layer as LayerProps)} asFilterLayer />
      ))}
    </>
  );
};
