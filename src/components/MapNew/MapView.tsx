import mapboxgl, { MapLayerMouseEvent } from "mapbox-gl";
import { useRouter } from "next/router";
import * as React from "react";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import {
  Layer,
  MapRef,
  NavigationControl,
  Source,
  ViewState,
  ViewStateChangeEvent,
} from "react-map-gl";
import { MapProvider, Map, useMap } from "react-map-gl";

import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css";
import useMeasure from "react-use-measure";
// import FeatureListPopup from "../feature/FeatureListPopup";
import getFeatureIdsFromLocation from "../../lib/model/shared/getFeatureIdsFromLocation";
import { databaseTableNames, filterLayers } from "./filterLayers";
import useMapStyle from "./useMapStyle";
import "mapbox-gl/dist/mapbox-gl.css";
import MapboxLanguage from "@mapbox/mapbox-gl-language";
import { createGlobalStyle } from "styled-components";
import { uniq } from "lodash";

// The following is required to stop "npm build" from transpiling mapbox code.
// notice the exclamation point in the import.
// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
mapboxgl.workerClass = require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;

interface IProps {
  featureId?: string;
  timestamp?: number;
  visible?: boolean;
  width: number;
  height: number;
  containerRef: (element: HTMLOrSVGElement | null) => void;
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

  button {
    min-width: 44px;
    min-height: 44px;
  }
`;

export default function MapView(props: IProps) {
  const mapRef = useRef<MapRef>(null);
  const { width, height } = props;
  const router = useRouter();
  const featureIds = getFeatureIdsFromLocation(router.pathname);
  const query = router.query;
  const latitude = typeof query.lat === "string" ? query.lat : undefined;
  const longitude = typeof query.lon === "string" ? query.lon : undefined;
  const zoom = typeof query.zoom === "string" ? query.zoom : undefined;

  const [viewport, setViewport] = useState<
    Partial<ViewState> & { width: number; height: number }
  >({
    width: 100,
    height: 100,
    latitude: (latitude && parseFloat(latitude)) || 52.5,
    longitude: (longitude && parseFloat(longitude)) || 13.3,
    zoom: (zoom && parseFloat(zoom)) || (latitude && longitude ? 18 : 10),
  });

  // Reset viewport when map size changes
  useLayoutEffect(() => {
    const newViewport = { ...viewport, width, height };
    setViewport(newViewport);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width, height]);

  React.useEffect(() => {
    if (["unavailable", "error"].includes(mapboxgl.getRTLTextPluginStatus())) {
      mapboxgl.setRTLTextPlugin(
        "https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.3/mapbox-gl-rtl-text.js",
        null,
        true // Lazy load the plugin
      );
    }
    const language = new MapboxLanguage();
    mapRef.current?.getMap().addControl(language);
  }, [mapRef]);

  // const featureLayer = React.useMemo(() => {
  //   return generateSelectedFeatureLayer(props.featureId);
  // }, [props.featureId]);

  // const featureDetailsLayer = useMemo(() => {
  //   return generateFeatureDetailsLayer(props.featureId);
  // }, [props.featureId]);

  // const unclusteredPointLabelLayer = useMemo(() => {
  //   return generateUnclusteredPointLabelLayer(lastImportType, languageTagsStrings, props.featureId);
  // }, [lastImportType, props.featureId]);

  const handleMapClick = useCallback<(event: MapLayerMouseEvent) => void>(
    (event) => {
      console.log(event);

      const selectedFeatureCount = event?.features?.length;
      if (!selectedFeatureCount) {
        // Clicked outside of a clickable map feature
        router.push("/");
      }

      if (selectedFeatureCount === 1) {
        const feature = event.features?.[0];
        // Show source overview again if user just clicks/taps on the map
        feature &&
          router.push(
            `/${feature.source}/${feature.properties.id}?lon=${event.lngLat.lng}&lat=${event.lngLat.lat}&zoom=${zoom}`
          );
        return;
      }
      if (event.features?.length) {
        router.push(
          `/composite/${uniq(event.features?.map((f) => [f.source, f.properties.id].join(":")))
            .join(",")}?lon=${event.lngLat.lng}&lat=${
            event.lngLat.lat
          }&zoom=${zoom}`
        );
      }
    },
    [router, zoom]
  );

  const updateViewportQuery = useCallback(() => {
    const newQuery = { ...query };

    if (viewport.zoom) {
      newQuery.zoom = viewport.zoom.toString();
    }

    if (featureIds.length === 0) {
      if (viewport.latitude) {
        newQuery.lat = viewport.latitude.toString();
      }
      if (viewport.longitude) {
        newQuery.lon = viewport.longitude.toString();
      }
    }
    router.replace({ query: newQuery });
  }, [viewport, query, featureIds]);

  const closePopup = useCallback(() => {
    router.push(`/`);
    updateViewportQuery();
  }, [router, updateViewportQuery]);

  const setViewportCallback = useCallback(
    (event: ViewStateChangeEvent) => {
      console.log("Setting viewport because of callback:", event);
      setViewport({ ...viewport, ...event.viewState });
    },
    [setViewport, viewport]
  );

  // const onLoadCallback = useCallback(() => {
  // const map = mapRef.current?.getMap();
  // }, [mapRef.current]);

  const mapStyle = useMapStyle();
  const layers = React.useMemo(
    () => mapStyle.data?.layers && filterLayers(mapStyle.data?.layers),
    [mapStyle]
  );

  return (
    <>
      <MapboxExtraStyles />
      <MapProvider>
        <Map
          {...viewport}
          mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
          onMove={setViewportCallback}
          onTransitionEnd={updateViewportQuery}
          onTouchEnd={updateViewportQuery}
          onMouseUp={updateViewportQuery}
          interactive={true}
          interactiveLayerIds={mapStyle.data?.layers
            ?.map((l) => l.id)
            .filter((id) => id.startsWith("osm-"))}
          onClick={handleMapClick}
          // onLoad={onLoadCallback}
          mapStyle="mapbox://styles/mapbox/light-v10"
          ref={mapRef}
        >
          {databaseTableNames.map((name) => (
            <Source
              type="vector"
              tiles={[0, 1, 2, 3].map(
                (n) =>
                  `${process.env.REACT_APP_OSM_API_TILE_BACKEND_URL?.replace(
                    /{n}/,
                    n.toString()
                  )}/${name}.mvt?limit=10000&bbox={bbox-epsg-3857}&epsg=3857`
              )}
              id={name}
              key={name}
            />
          ))}
          {layers?.map((layer) => (
            <Layer key={layer.id} {...(layer as any)} />
          ))}
          {/* {latitude && longitude && featureIds.length > 0 && (
        <FeatureListPopup
          featureIds={featureIds}
          latitude={Number.parseFloat(latitude)}
          longitude={Number.parseFloat(longitude)}
          onClose={closePopup}
        />
      )} */}
          {/* <ZoomToDataOnLoad /> */}
          <NavigationControl style={{ right: "1rem", top: "1rem" }} />
        </Map>
      </MapProvider>
    </>
  );
}
