import type { Map as MapBoxMap } from "mapbox-gl";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { MapEvent } from "react-map-gl/mapbox";
import { useDarkMode } from "~/hooks/useTheme";
import { useMap } from "~/modules/map/hooks/useMap";
import { getBaseStyle } from "~/modules/map/utils/styles";
import { loadIcons } from "../utils/mapbox-icon-loader";

export function useMapStyle() {
  const { map, isReady } = useMap();

  const darkMode = useDarkMode();
  const mapStyle = useMemo(() => getBaseStyle(darkMode), [darkMode]);

  const [isLoadingStyle, setIsLoadingStyle] = useState(true);

  const onLoad = useCallback(
    async ({ target }: MapEvent) => {
      if (!target || !isLoadingStyle) {
        return;
      }
      await loadIcons(target, darkMode);
      setIsLoadingStyle(false);
    },
    [darkMode, loadIcons, setIsLoadingStyle],
  );

  useEffect(() => {
    if (map && isReady && !isLoadingStyle) {
      setIsLoadingStyle(true);

      // setTimeout makes sure this runs in a different loop
      setTimeout(() => {
        loadIcons(map as unknown as MapBoxMap, darkMode).finally(() => {
          setIsLoadingStyle(false);
        });
      }, 50);
    }
  }, [darkMode]);

  return {
    mapStyle,
    isLoadingStyle,
    onLoad,
  };
}
