"use client";

import mapboxgl from "mapbox-gl";
import { useCallback, useEffect, useMemo, useRef } from "react";
import {
  GeolocateControl,
  Layer,
  Map as ReactMapGL,
  type MapEvent,
  MapProvider,
  NavigationControl,
  Source,
} from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import styled, { createGlobalStyle } from "styled-components";
import { SpinnerOverlay } from "~/components/SpinnerOverlay";
import { useEnvironment } from "~/hooks/useEnvironment";
import { useUserAgent } from "~/hooks/useUserAgent";
import { useHighlight } from "~/modules/map/hooks/useHighlight";
import { useLayers } from "~/modules/map/hooks/useLayers";
import { useMap } from "~/modules/map/hooks/useMap";
import { useMapInteraction } from "~/modules/map/hooks/useMapInteraction";
import { useMapStyle } from "~/modules/map/hooks/useMapStyle";
import { useRenderedFeatures } from "~/modules/map/hooks/useRenderedFeatures";
import { useSources } from "~/modules/map/hooks/useSources";
import { useAppState } from "~/modules/app-state/hooks/useAppState";
import { filterFeaturesOnLayerByIds } from "~/modules/map/utils/layers"; // The following is required to stop "npm build" from transpiling mapbox code.

// The following is required to stop "npm build" from transpiling mapbox code.
// notice the exclamation point in the import.
mapboxgl.workerClass =
  require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;

const MapboxExtraStyles = createGlobalStyle`
  .mapboxgl-map button:not() {
    min-width: 35px;
    min-height: 35px;
  }
`;
const Container = styled.div`
  position: relative;
  height: 100%;
`;

export default function MapComponent() {
  const { map, setMap, isReady, setIsReady } = useMap();
  const { appState } = useAppState();
  const { userAgent } = useUserAgent();
  // On Mobile Safari and all iOS browsers, which use the WebKit engine,
  // geolocation permissions are session-scoped. Programmatically triggering
  // the GeolocateControl would re-show the native permission prompt on every
  // page reload, so we skip it for these browsers.
  const isMobileSafari =
    userAgent?.engine.name === "WebKit" && userAgent?.os.name === "iOS";
  const { style, onLoad: onLoadMapStyle } = useMapStyle();
  const { onSourceData } = useRenderedFeatures();

  const {
    cursor,
    interactiveLayerIds,
    onMouseClick,
    onMouseEnter,
    onMouseLeave,
    onViewStateChange,
    position,
  } = useMapInteraction();

  const { dataLayers, highlightLayers } = useLayers();
  const { sources } = useSources();

  const { highlightedFeatureIds } = useHighlight();

  const filteredHighlightLayers = useMemo(
    () =>
      highlightLayers.map((layer) =>
        filterFeaturesOnLayerByIds(layer, highlightedFeatureIds),
      ),
    [highlightLayers, highlightedFeatureIds],
  );

  const { NEXT_PUBLIC_MAPBOX_GL_ACCESS_TOKEN: mapboxAccessToken } =
    useEnvironment();

  const onLoad = useCallback(
    async (event: MapEvent) => {
      if (!event.target) return;
      await onLoadMapStyle(event);
      setIsReady(true);
    },
    [setIsReady, onLoadMapStyle],
  );

  const geoControlRef = useRef<mapboxgl.GeolocateControl | null>(null);
  // save the state of whether the user location has been focused on in a ref to not cause re-render
  const hasFocusedOnUserLocation = useRef(false);
  // Callback ref satisfies typscript compiler: react-map-gl expects a ref callback, not a mutable ref object.
  const setGeolocateControl = useCallback(
    (control: mapboxgl.GeolocateControl | null) => {
      geoControlRef.current = control;
    },
    [],
  );

  const handleGeolocate = useCallback(
    (event: GeolocationPosition) => {
      if (!map) return;
      if (hasFocusedOnUserLocation.current) return;
      if (!appState.shouldLocateUser) return;

      const { longitude, latitude } = event.coords;

      map.flyTo({
        center: [longitude, latitude],
        zoom: Math.max(map.getZoom() ?? 0, 15),
        essential: true,
      });

      hasFocusedOnUserLocation.current = true;
    },
    [map, appState.shouldLocateUser],
  );

  useEffect(() => {
    if (!isReady) return;
    if (!appState.shouldLocateUser) return;
    if (isMobileSafari) return;
    geoControlRef.current?.trigger();
  }, [isReady, appState.shouldLocateUser, isMobileSafari]);

  // TODO: implement map padding for sheet (and other things)

  return (
    <Container>
      {!isReady && (
        <>
          {/*This centers the spinner in the middle of the screen by accounting for the top bar height */}
          <SpinnerOverlay offsetTop="calc(calc(var(--topbar-height) * -1) / 2)" />
          <span data-testid="map-ready" />
        </>
      )}
      <MapboxExtraStyles />
      <MapProvider>
        <ReactMapGL
          reuseMaps
          mapboxAccessToken={mapboxAccessToken}
          interactive
          interactiveLayerIds={interactiveLayerIds}
          initialViewState={position}
          onMoveEnd={onViewStateChange}
          onZoomEnd={onViewStateChange}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          onClick={onMouseClick}
          cursor={cursor}
          mapStyle={style}
          onLoad={onLoad}
          onSourceData={onSourceData}
          ref={setMap}
        >
          {isReady && (
            <>
              {sources.map((source) => (
                <Source key={source.id} {...source} />
              ))}
              {[...dataLayers, ...filteredHighlightLayers]?.map((layer) => (
                <Layer key={layer.id} {...layer} />
              ))}
            </>
          )}
          <GeolocateControl
            ref={setGeolocateControl}
            position="bottom-right"
            positionOptions={{ enableHighAccuracy: true }}
            trackUserLocation
            onGeolocate={handleGeolocate}
          />
          <NavigationControl
            position="bottom-right"
            showZoom={true}
            visualizePitch={true}
            showCompass={true}
          />
        </ReactMapGL>
      </MapProvider>
    </Container>
  );
}
