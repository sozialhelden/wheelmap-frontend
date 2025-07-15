import type { Map as MapBoxMap } from "mapbox-gl";
import { useCallback, useEffect, useMemo } from "react";
import type { MapEvent } from "react-map-gl/mapbox";
import { useDarkMode } from "~/hooks/useTheme";
import { useMap } from "~/modules/map/hooks/useMap";
import { getBaseStyle } from "~/modules/map/utils/styles";
import { loadIcons } from "../utils/mapbox-icon-loader";

export function useMapStyle() {
  const { map, isReady, setIsReady } = useMap();

  const darkMode = useDarkMode();
  const style = useMemo(() => getBaseStyle(darkMode), [darkMode]);

  const onLoad = useCallback(
    async ({ target: map }: MapEvent) => {
      // when is isReady is true, icons have already been loaded
      if (!map || isReady) return;
      await loadIcons(map, darkMode);
    },
    [map, isReady, darkMode, loadIcons],
  );

  useEffect(() => {
    if (map && isReady) {
      setIsReady(false);
      // setTimeout makes sure this runs in a different loop
      setTimeout(() => {
        loadIcons(map as unknown as MapBoxMap, darkMode).finally(() => {
          setIsReady(true);
        });
      }, 50);
    }
  }, [darkMode]);

  return { style, onLoad };
}
