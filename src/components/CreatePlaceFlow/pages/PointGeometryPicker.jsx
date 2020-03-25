// @flow
import * as React from 'react';
import styled from 'styled-components';
import ReactMapGL, { GeolocateControl } from 'react-map-gl';

import env from '../../../lib/env';
import savedState from '../../../lib/savedState';

import VerticalPage from '../components/VerticalPage';
import Icon from '../../Icon';
import colors from '../../../lib/colors';

export type PointGeometry = {
  type: 'Point',
  coordinates: [number, number],
};

type Props = {
  className?: string,
  visible: boolean,
  category?: string,
  latitude?: number,
  longitude?: number,
  onSelected: (geometry: PointGeometry) => void,
  onCancel: () => void,
};

type Viewport = {
  longitude?: number,
  latitude?: number,
  zoom?: number,
};

export function viewportFromSavedState() {
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
          latitude={props.latitude}
          longitude={props.longitude}
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
        <Icon
          className="mapCenterIndicator"
          withArrow={true}
          category={props.category}
          ariaHidden={true}
          size="medium"
          accessibility={'yes'}
          backgroundColor={colors.darkLinkColor}
        />
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
      left: calc(50% - 20px);
      bottom: 50%;
      z-index: 1000;
    }
  }
`;
