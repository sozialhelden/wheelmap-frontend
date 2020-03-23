// @flow
import * as React from 'react';
import ReactMapGL, { GeolocateControl } from 'react-map-gl';

import env from '../../../lib/env';
import savedState from '../../../lib/savedState';

import VerticalPage from '../components/VerticalPage';
import styled from 'styled-components';

export type PointGeometry = {
  type: 'Point',
  coordinates: [number, number],
};

type Props = {
  className?: string,
  visible: boolean,
  onSelected: (geometry: PointGeometry) => void,
  onCancel: () => void,
};

type Viewport = {
  longitude?: number,
  latitude?: number,
  zoom?: number,
};

function viewportFromSavedState() {
  const stringValues = {
    zoom: savedState.map.lastZoom || undefined,
    latitude: (savedState.map.lastCenter && savedState.map.lastCenter[0]) || undefined,
    longitude: (savedState.map.lastCenter && savedState.map.lastCenter[1]) || undefined,
  };

  return {
    zoom: stringValues.zoom === undefined ? undefined : parseFloat(stringValues.zoom),
    latitude: stringValues.latitude === undefined ? undefined : parseFloat(stringValues.latitude),
    longitude:
      stringValues.longitude === undefined ? undefined : parseFloat(stringValues.longitude),
  };
}

const PointGeometryPicker = (props: Props) => {
  const { visible, onCancel, onSelected } = props;

  const [viewport, setViewport] = React.useState<Viewport>(viewportFromSavedState());

  const geoLocateRef = React.useRef<GeolocateControl>();

  // snap to current position on mount
  const applyViewport = React.useCallback(viewport => setViewport(viewport), [setViewport]);

  if (!visible) {
    return null;
  }

  const canSubmit = !!viewport.latitude && !!viewport.longitude;

  return (
    <VerticalPage className={props.className}>
      Define main entry
      <button onClick={onCancel}>Cancel</button>
      <div className="mapContainer">
        <ReactMapGL
          {...viewport}
          mapboxApiAccessToken={env.REACT_APP_MAPBOX_ACCESS_TOKEN}
          width="100%"
          height="100%"
          onViewportChange={applyViewport}
          onLoad={p => {
            if (geoLocateRef.current && geoLocateRef.current._mapboxGeolocateControl) {
              geoLocateRef.current._mapboxGeolocateControl.trigger();
            }
          }}
        >
          <GeolocateControl
            ref={geoLocateRef}
            positionOptions={{ enableHighAccuracy: true }}
            trackUserLocation={false}
            showUserLocation={true}
          />
        </ReactMapGL>
        <span className="mapCenterIndicator" />
      </div>
      <button
        disabled={!canSubmit}
        onClick={() =>
          onSelected({
            type: 'Point',
            coordinates: [viewport.longitude || 0, viewport.latitude || 0],
          })
        }
      >
        Confirm Position
      </button>
    </VerticalPage>
  );
};

export default styled(PointGeometryPicker)`
  .mapContainer {
    flex: 1;
    position: relative;
    overflow: hidden;

    .mapCenterIndicator {
      position: absolute;
      left: calc(50% - 10px);
      top: calc(50% - 10px);
      width: 20px;
      height: 20px;
      transform-origin: center center;
      transform: rotate(45deg);
      z-index: 1000;
      background: blue;
    }
  }
`;
