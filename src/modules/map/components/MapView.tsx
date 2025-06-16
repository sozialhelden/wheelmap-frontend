import mapboxgl, { type MapMouseEvent } from "mapbox-gl";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  GeolocateControl,
  type LayerProps,
  type MapEvent,
  MapProvider,
  NavigationControl,
  Map as ReactMapGL,
  Source,
  type ViewStateChangeEvent,
} from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import { createGlobalStyle } from "styled-components";
import { useEnvironment } from "~/hooks/useEnvironment";
import { useDarkMode } from "~/hooks/useTheme";
import { useAppState } from "~/modules/app-state/hooks/useAppState";
import { useAppStateAwareRouter } from "~/modules/app-state/hooks/useAppStateAwareRouter";
import { useLayers } from "~/modules/map/hooks/useLayers";
import { getBaseStyle } from "~/modules/map/utils/map-styles";
import { loadIcons } from "~/modules/map/utils/mapbox-icon-loader";
import { MapLayer } from "~/needs-refactoring/components/Map/MapLayer";
import { useMap } from "~/needs-refactoring/components/Map/useMap";

// The following is required to stop "npm build" from transpiling mapbox code.
// notice the exclamation point in the import.
mapboxgl.workerClass =
  require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;

interface IProps {
  width: number;
  height: number;
  onLoadingChange?: (loading: boolean) => void;
}

const MapboxExtraStyles = createGlobalStyle`
  .mapboxgl-ctrl-top-left, .mapboxgl-ctrl-top-right {
    top: 56px;
  }

  .mapboxgl-ctrl-top-left {
    left: 4px;
  }
  .mapboxgl-ctrl-top-right {
    right: 4px;
  }

  .mapboxgl-map button:not(.mapboxgl-ctrl-attrib-button) {
    min-width: 44px;
    min-height: 44px;
  }
`;

export default function MapView({ onLoadingChange }: IProps) {
  const { dataLayers, selectionLayers, sources } = useLayers();
  const interactiveLayerIds = useMemo(
    () => dataLayers.map((layer) => layer.id),
    [dataLayers],
  );

  const { map, setMapRef } = useMap();
  const { appState, setAppState } = useAppState();

  const router = useAppStateAwareRouter();

  const { NEXT_PUBLIC_MAPBOX_GL_ACCESS_TOKEN: mapboxAccessToken } =
    useEnvironment();

  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [isLoadingIcons, setIsLoadingIcons] = useState(true);

  const darkMode = useDarkMode();
  const mapStyle = useMemo(() => getBaseStyle(darkMode), [darkMode]);

  const [cursor, setCursor] = useState<string>("auto");
  const onMouseEnter = useCallback(() => setCursor("pointer"), []);
  const onMouseLeave = useCallback(() => setCursor("auto"), []);

  const onViewStateChange = useCallback(
    async (evt: ViewStateChangeEvent) => {
      await setAppState({
        position: {
          longitude: evt.viewState.longitude,
          latitude: evt.viewState.latitude,
          zoom: evt.viewState.zoom,
        },
      });
    },
    [setAppState],
  );

  const onMouseClick = useCallback(
    (evt: MapMouseEvent) => {
      const features = evt.features ?? [];
      if (features.length <= 0) {
        return router.replace("/");
      }
      if (features.length === 1) {
        return router.push(
          `/${features[0].source}/${String(features[0]?.properties?.id)?.replace("/", ":")}`,
        );
      }
      router.push(
        `/composite/${Array.from(
          new Set(
            features.map((f) =>
              [f.source, String(f.properties?.id).replace("/", ":")].join(":"),
            ),
          ),
        ).join(",")}`,
      );
    },
    [router],
  );

  const onLoad = useCallback(
    async ({ target: mapInstance }: MapEvent) => {
      if (!mapInstance) {
        return;
      }
      await loadIcons(mapInstance, darkMode);
      setIsMapLoaded(true);
      setIsLoadingIcons(false);
    },
    [darkMode],
  );

  useEffect(() => {
    onLoadingChange?.(isLoadingIcons);
  }, [isLoadingIcons]);

  useEffect(() => {
    if (map && isMapLoaded && !isLoadingIcons) {
      setIsLoadingIcons(true);
      // setTimeout makes sure this runs in a different loop
      setTimeout(() => {
        loadIcons(map, darkMode).finally(() => {
          setIsLoadingIcons(false);
        });
      }, 50);
    }
  }, [darkMode]);

  return (
    <>
      <MapboxExtraStyles />
      <MapProvider>
        <ReactMapGL
          initialViewState={appState.position}
          mapboxAccessToken={mapboxAccessToken}
          onMoveEnd={onViewStateChange}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          onClick={onMouseClick}
          onZoomEnd={onViewStateChange}
          interactive
          interactiveLayerIds={interactiveLayerIds}
          onLoad={onLoad}
          mapStyle={mapStyle}
          ref={setMapRef}
          cursor={cursor}
        >
          {isMapLoaded && (
            <>
              {sources.map(({ id, ...props }) => (
                <Source key={id} id={id} {...props} />
              ))}
              {dataLayers?.map((layer) => (
                <MapLayer key={layer.id} {...(layer as LayerProps)} />
              ))}
              {selectionLayers?.map((layer) => (
                <MapLayer
                  key={layer.id}
                  {...(layer as LayerProps)}
                  asFilterLayer
                />
              ))}
            </>
          )}
          <GeolocateControl
            position="bottom-right"
            positionOptions={{ enableHighAccuracy: true }}
            trackUserLocation
          />
          <NavigationControl
            position="bottom-right"
            showZoom={true}
            visualizePitch={true}
            showCompass={true}
          />
        </ReactMapGL>
      </MapProvider>
    </>
  );
}
