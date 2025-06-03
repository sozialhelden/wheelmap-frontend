import * as React from "react";
import { useEffect } from "react";
import type { LayerProps } from "react-map-gl/mapbox";
import { useLayers } from "~/modules/map/hooks/useLayers";
import { MapLayer } from "~/needs-refactoring/components/Map/MapLayer";

export const MapLayers = ({
  onInteractiveLayersChange,
}: {
  onInteractiveLayersChange: (layerIds: string[]) => void;
}) => {
  const { dataLayers, selectionLayers } = useLayers();

  useEffect(() => {
    onInteractiveLayersChange(dataLayers.map((layer) => layer.id));
  }, [onInteractiveLayersChange, dataLayers]);

  return (
    <>
      {dataLayers?.map((layer) => (
        <MapLayer key={layer.id} {...(layer as LayerProps)} />
      ))}
      {selectionLayers?.map((layer) => (
        <MapLayer key={layer.id} {...(layer as LayerProps)} asFilterLayer />
      ))}
    </>
  );
};
