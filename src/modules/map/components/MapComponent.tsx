"use client";

import mapboxgl from "mapbox-gl";
import { useCallback, useMemo } from "react";
import {
  GeolocateControl,
  Layer,
  type MapEvent,
  MapProvider,
  NavigationControl,
  Map as ReactMapGL,
  Source,
} from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import styled, { createGlobalStyle } from "styled-components";
import { SpinnerOverlay } from "~/components/SpinnerOverlay";
import { useEnvironment } from "~/hooks/useEnvironment";
import { useHighlight } from "~/modules/map/hooks/useHighlight";
import { useLayers } from "~/modules/map/hooks/useLayers";
import { useMap } from "~/modules/map/hooks/useMap";
import { useMapInteraction } from "~/modules/map/hooks/useMapInteraction";
import { useMapStyle } from "~/modules/map/hooks/useMapStyle";
import { useRenderedFeatures } from "~/modules/map/hooks/useRenderedFeatures";
import { useSources } from "~/modules/map/hooks/useSources";
import { filterFeaturesOnLayerByIds } from "~/modules/map/utils/layers";

// The following is required to stop "npm build" from transpiling mapbox code.
// notice the exclamation point in the import.
mapboxgl.workerClass =
  require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;

const MapboxExtraStyles = createGlobalStyle`
  .mapboxgl-map button:not(.mapboxgl-ctrl-attrib-button) {
    min-width: 35px;
    min-height: 35px;
  }
`;
const Container = styled.div`
  position: relative;
  height: 100%;
`;

export default function MapComponent() {
  const { setMap, isReady, setIsReady } = useMap();
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
      // Expose map instance for e2e tests
      // biome-ignore lint/suspicious/noExplicitAny: e2e test helper on window
      const w = window as any;
      w.__e2eMapInstances = w.__e2eMapInstances || {};
      w.__e2eMapInstances.mainMap = event.target;
      setIsReady(true);
    },
    [setIsReady, onLoadMapStyle],
  );

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
          id="mainMap"
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
    </Container>
  );
}
