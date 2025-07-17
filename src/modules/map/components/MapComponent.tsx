import mapboxgl from "mapbox-gl";
import { useCallback } from "react";
import {
  GeolocateControl,
  type LayerProps,
  type MapEvent,
  MapProvider,
  NavigationControl,
  Map as ReactMapGL,
  Source,
} from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import { Spinner } from "@radix-ui/themes";
import styled, { createGlobalStyle } from "styled-components";
import { SpinnerOverlay } from "~/components/SpinnerOverlay";
import { useEnvironment } from "~/hooks/useEnvironment";
import { useInteraction } from "~/modules/map/hooks/useInteraction";
import { useLayers } from "~/modules/map/hooks/useLayers";
import { useMap } from "~/modules/map/hooks/useMap";
import { useMapStyle } from "~/modules/map/hooks/useMapStyle";
import { useRenderedFeatures } from "~/modules/map/hooks/useRenderedFeatures";
import { useSources } from "~/modules/map/hooks/useSources";
import { MapLayer } from "~/needs-refactoring/components/Map/MapLayer";

// The following is required to stop "npm build" from transpiling mapbox code.
// notice the exclamation point in the import.
mapboxgl.workerClass =
  require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;

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
  } = useInteraction();

  const { dataLayers, highlightLayers } = useLayers();
  const { sources } = useSources();

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

  return (
    <>
      <Container>
        {!isReady && <SpinnerOverlay />}
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
                {sources.map(({ id, ...props }) => (
                  <Source key={id} id={id} {...props} />
                ))}
                {dataLayers?.map((layer) => (
                  <MapLayer key={layer.id} {...(layer as LayerProps)} />
                ))}
                {highlightLayers?.map((layer) => (
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
      </Container>
    </>
  );
}
