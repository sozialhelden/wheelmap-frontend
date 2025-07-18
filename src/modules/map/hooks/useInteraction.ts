import type { MapMouseEvent } from "mapbox-gl";
import { useCallback, useMemo, useState } from "react";
import type { ViewStateChangeEvent } from "react-map-gl/mapbox";
import { useAppState } from "~/modules/app-state/hooks/useAppState";
import { useAppStateAwareRouter } from "~/modules/app-state/hooks/useAppStateAwareRouter";
import { useLayers } from "~/modules/map/hooks/useLayers";
import { getFeatureUrl } from "~/utils/url";

export function useInteraction() {
  const { appState, setAppState } = useAppState();
  const router = useAppStateAwareRouter();

  const { dataLayers } = useLayers();
  const interactiveLayerIds = useMemo(
    () => dataLayers.map((layer) => layer.id),
    [dataLayers],
  );

  const [cursor, setCursor] = useState<string>("auto");
  const onMouseEnter = useCallback(() => setCursor("pointer"), []);
  const onMouseLeave = useCallback(() => setCursor("auto"), []);

  const onViewStateChange = useCallback(
    async (event: ViewStateChangeEvent) => {
      await setAppState(
        {
          position: {
            longitude: event.viewState.longitude,
            latitude: event.viewState.latitude,
            zoom: event.viewState.zoom,
          },
        },
        { routerOperation: "replace" },
      );
    },
    [setAppState],
  );

  const onMouseClick = useCallback(
    (event: MapMouseEvent) => {
      const url = getFeatureUrl(event.features ?? []);
      return url && router.push(url);
    },
    [router],
  );

  return {
    cursor,
    position: appState.position,
    interactiveLayerIds,
    onViewStateChange,
    onMouseEnter,
    onMouseLeave,
    onMouseClick,
  };
}
