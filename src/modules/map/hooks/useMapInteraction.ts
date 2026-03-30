import type { GeoJSONFeature, MapMouseEvent } from "mapbox-gl";
import { usePathname } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import type { ViewStateChangeEvent } from "react-map-gl/mapbox";
import { useAppState } from "~/modules/app-state/hooks/useAppState";
import { useAppStateAwareRouter } from "~/modules/app-state/hooks/useAppStateAwareRouter";
import { useLayers } from "~/modules/map/hooks/useLayers";
import { getFeatureUrl } from "~/utils/url";

export function useMapInteraction() {
  const { appState, setAppState } = useAppState();
  const router = useAppStateAwareRouter();
  const pathname = usePathname();

  const { dataLayers } = useLayers();
  const interactiveLayerIds = useMemo(
    () => dataLayers.map((layer) => layer.id),
    [dataLayers],
  );

  const [cursor, setCursor] = useState<string>("auto");
  const onMouseEnter = useCallback(() => setCursor("pointer"), []);
  const onMouseLeave = useCallback(() => setCursor("auto"), []);

  const onViewStateChange = useCallback(
    (event: ViewStateChangeEvent) => {
      setAppState(
        {
          position: {
            longitude: event.viewState.longitude,
            latitude: event.viewState.latitude,
            zoom: event.viewState.zoom,
          },
        },
        { routerOperation: "shallow" },
      );
    },
    [setAppState],
  );

  const onMouseClick = useCallback(
    (event: MapMouseEvent) => {
      if ((event.features ?? []).length === 0) {
        router.push("/");
        return;
      }

      const url = getFeatureUrl(event.features as GeoJSONFeature[]);

      if (!url) return;

      // If clicking on the same place, emit a custom event to signal sidebar should reopen
      if (pathname === url.pathname) {
        window.dispatchEvent(new CustomEvent("place-clicked"));
      }

      return router.push(url);
    },
    [router, pathname],
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
