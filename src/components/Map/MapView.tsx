import mapboxgl, {
  type MapLayerMouseEvent,
  type MapLayerTouchEvent,
} from "mapbox-gl";
import * as React from "react";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import {
  type MapEvent,
  MapProvider,
  NavigationControl,
  Map as ReactMapGL,
  type ViewStateChangeEvent,
} from "react-map-gl/mapbox";

import { uniq } from "lodash";
import "mapbox-gl/dist/mapbox-gl.css";
import { createGlobalStyle } from "styled-components";
import getFeatureIdsFromLocation from "../../lib/model/geo/getFeatureIdsFromLocation";

import { useEnvContext } from "~/lib/context/EnvContext";
import { StyledLoadingIndicator } from "./LoadingIndictor";

import { log } from "~/lib/util/logger";
import { useAppStateAwareRouter } from "~/lib/util/useAppStateAwareRouter";
import { useDarkMode } from "../shared/useDarkMode";
import { AcPoiLayers } from "./AcPoiLayers";
import { GeolocateButton } from "./GeolocateButton";
import { MapLayers } from "./MapLayers";
import { MapSources } from "./MapSources";
import { loadIconsInMapInstance } from "./loadIconsInMapInstance";
import { useApplyMapPadding } from "./useApplyMapPadding";
import { useMapViewInternals } from "./useMapInternals";
import { uriFriendlyPosition } from "./utils";

import { feature } from "@turf/turf";
import { isOSMFeature } from "../../lib/model/geo/AnyFeature";

// The following is required to stop "npm build" from transpiling mapbox code.
// notice the exclamation point in the import.
// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
mapboxgl.workerClass =
  require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;

interface IProps {
  width: number;
  height: number;
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

export default function MapView(props: IProps) {
  const router = useAppStateAwareRouter();
  const featureIds = getFeatureIdsFromLocation(router.pathname);

  const { width, height } = props;
  const { query } = router;
  const { setMapRef, initialViewport, onViewportUpdate, map, saveMapLocation } =
    useMapViewInternals(query);

  // Reset viewport when map size changes
  // biome-ignore lint/correctness/useExhaustiveDependencies: a changed initialViewport should not trigger a re-render
  useLayoutEffect(() => {
    const newViewport = { ...initialViewport, width, height };
    onViewportUpdate(newViewport);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width, height]);

  useApplyMapPadding();

  const updateViewportQuery = useCallback(
    ({
      longitude: lon,
      latitude: lat,
      zoom: z,
    }: { longitude: number; latitude: number; zoom: number }) => {
      const newQuery: { lon?: string; lat?: string; zoom?: string } = {};
      const { zoom, latitude, longitude } = uriFriendlyPosition({
        latitude: lat,
        longitude: lon,
        zoom: z,
      });
      newQuery.zoom = zoom;
      if (featureIds.length === 0) {
        newQuery.lat = latitude;
        newQuery.lon = longitude;
      }
      // update the initial viewport (and the local storage)
      saveMapLocation({
        type: "position",
        latitude: lat,
        longitude: lon,
        zoom: z,
      });
      router.replace({ query: newQuery });
    },
    [featureIds.length, saveMapLocation, router],
  );

  const onViewStateChange = useCallback(
    (evt: ViewStateChangeEvent) => {
      updateViewportQuery({
        longitude: evt.viewState.longitude,
        latitude: evt.viewState.latitude,
        zoom: evt.viewState.zoom,
      });
    },
    [updateViewportQuery],
  );

  const onMouseClick = useCallback(
    (evt: MapLayerMouseEvent | MapLayerTouchEvent) => {
      const features = evt.features ?? [];
      if (features.length <= 0) {
        updateViewportQuery({
          latitude: evt.lngLat.lat,
          longitude: evt.lngLat.lng,
          zoom: initialViewport.zoom,
        });
        router.replace("/");
        return;
      }
      const { latitude, longitude, zoom } = uriFriendlyPosition({
        latitude: evt.target.getCenter().lat,
        longitude: evt.target.getCenter().lng,
        zoom: evt.target.getZoom(),
      });

      if (features.length === 1) {
        const feature = features[0];
        router.push(
          `/${feature.source}/${String(feature?.properties?.id)?.replace("/", ":")}?lon=${longitude}&lat=${latitude}&zoom=${zoom}`,
        );
        return;
      }
      router.push(
        `/composite/${uniq(
          features.map((f) =>
            [f.source, String(f.properties?.id).replace("/", ":")].join(":"),
          ),
        ).join(",")}?lon=${longitude}&lat=${latitude}&zoom=${zoom}`,
      );
    },
    [router, updateViewportQuery, initialViewport.zoom],
  );

  const [mapLoaded, setMapLoaded] = useState(false);
  const onLoadCallback = useCallback((e: MapEvent) => {
    const mapInstance = e.target;

    if (!mapInstance) {
      log.warn("Expected a map instance but got nothing");
      return;
    }

    loadIconsInMapInstance(mapInstance);
    setMapLoaded(true);
  }, []);

  const [interactiveLayerIds, setInteractiveLayerIds] = useState<string[]>([]);

  const { NEXT_PUBLIC_MAPBOX_GL_ACCESS_TOKEN: mapboxAccessToken } =
    useEnvContext();

  const darkMode = useDarkMode();
  const mapStyle = darkMode
    ? "mapbox://styles/sozialhelden/cm3t8pmmt00ad01s8baje5zjy"
    : "mapbox://styles/sozialhelden/cm3t3zmix009j01r2eupc5jr7";
  const [cursor, setCursor] = useState<string>("auto");
  const onMouseEnter = React.useCallback(() => setCursor("pointer"), []);
  const onMouseLeave = React.useCallback(() => setCursor("auto"), []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    setMapLoaded(false);
  }, [darkMode]);

  return (
    <>
      <MapboxExtraStyles />
      <MapProvider>
        <ReactMapGL
          initialViewState={initialViewport}
          mapboxAccessToken={mapboxAccessToken}
          onMoveEnd={onViewStateChange}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          onClick={onMouseClick}
          onZoomEnd={onViewStateChange}
          interactive
          interactiveLayerIds={interactiveLayerIds}
          onLoad={onLoadCallback}
          mapStyle={mapStyle}
          ref={setMapRef}
          cursor={cursor}
        >
          {mapLoaded && <MapSources />}
          {mapLoaded && (
            <MapLayers onInteractiveLayersChange={setInteractiveLayerIds} />
          )}
          {mapLoaded && <AcPoiLayers />}
          <GeolocateButton />
          <NavigationControl
            position="bottom-right"
            showZoom={true}
            visualizePitch={true}
            showCompass={true}
          />
        </ReactMapGL>
      </MapProvider>
      <StyledLoadingIndicator />
    </>
  );
}
