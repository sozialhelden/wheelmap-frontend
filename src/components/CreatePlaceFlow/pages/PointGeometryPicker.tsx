import * as React from 'react';
import styled from 'styled-components';
import { t } from 'ttag';
import ReactMapGL, { GeolocateControl } from 'react-map-gl';

import env from '../../../lib/env';
import colors from '../../../lib/colors';
import savedState from '../../../lib/savedState';

import Icon from '../../Icon';
import { ChromelessButton, PrimaryButton } from '../../Button';

import VerticalPage from '../components/VerticalPage';
import PageHeader from '../components/PageHeader';

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
      <PageHeader>
        <ChromelessButton onClick={onCancel}>{t`Back`}</ChromelessButton>
        <h2>{t`Define main entry`}</h2>
      </PageHeader>
      <div className="mapContainer">
        <ReactMapGL
          latitude={props.latitude}
          longitude={props.longitude}
          {...viewport}
          mapboxApiAccessToken={env.REACT_APP_MAPBOX_GL_ACCESS_TOKEN}
          width="100%"
          height="100%"
          onViewportChange={applyViewport}
          onLoad={p => {
            if (geoLocateRef.current && geoLocateRef.current['_mapboxGeolocateControl']) {
              geoLocateRef.current['_mapboxGeolocateControl'].trigger();
            }
          }}
          ref={r => {
            if (r) {
              // prevent keyboard focus of canvas
              r.getMap().getCanvas().tabIndex = -1;
            }
          }}
        >
          <GeolocateControl
            className="geolocateControl"
            ref={geoLocateRef}
            positionOptions={{ enableHighAccuracy: true }}
            trackUserLocation={false}
            showUserLocation={true}
          />
        </ReactMapGL>
        <Icon
          className="mapCenterIndicator"
          withArrow={true}
          category={props.category || 'other'}
          ariaHidden={true}
          size="medium"
          accessibility={'yes'}
          backgroundColor={colors.darkLinkColor}
        />
      </div>
      <footer>
        <div className="hint">{t`Move the map to place the entry as correct as possible.`}</div>
        <PrimaryButton
          disabled={!canSubmit}
          onClick={() =>
            onSelected({
              type: 'Point',
              coordinates: [viewport.longitude || 0, viewport.latitude || 0],
            })
          }
        >
          {t`Confirm Position`}
        </PrimaryButton>
      </footer>
    </VerticalPage>
  );
};

export default styled(PointGeometryPicker)`
  padding: 0px;

  > footer,
  > header {
    padding: 20px;
  }

  .mapContainer {
    flex: 1;
    position: relative;

    .geolocateControl {
      position: absolute;
      top: 8px;
      right: 8px;
    }

    .mapCenterIndicator {
      position: absolute;
      left: calc(50% - 20px);
      bottom: 50%;
      z-index: 1000;
    }

    > div::after {
      content: '';
      position: absolute;
      box-shadow: inset 0px 0px 0px 4px transparent;
      transition: box-shadow 0.2s;
      user-select: none;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
    }

    > div.focus-visible::after {
      box-shadow: inset 0px 0px 0px 4px ${colors.focusOutline};
      transition: box-shadow 0.2s;
    }
  }

  footer > div.hint {
    text-align: center;
    margin-bottom: 12px;
    color: ${colors.textMuted};
    font-weight: bold;
  }

  ${ChromelessButton} {
    font-weight: bold;
    color: ${colors.linkColor};
  }
`;
