import * as React from 'react';
import { StaticMap } from 'react-map-gl';
import styled from 'styled-components';
import { t } from 'ttag';

import env from '../../../lib/env';
import colors from '../../../lib/colors';

import { PrimaryButton } from '../../Button';
import Icon from '../../Icon';

type Props = {
  className?: string,
  category?: string,
  latitude: number,
  longitude: number,
  onClick: () => void,
};

const MapButton = (props: Props) => {
  const { className, category, latitude, longitude, onClick } = props;

  return (
    <section className={className}>
      <StaticMap
        latitude={latitude}
        longitude={longitude}
        zoom={18}
        mapboxApiAccessToken={env.REACT_APP_MAPBOX_GL_ACCESS_TOKEN}
        width="100%"
        height="300px"
        ref={r => {
          if (r) {
            // prevent keyboard focus of canvas
            r.getMap().getCanvas().tabIndex = -1;
          }
        }}
      />
      <Icon
        withArrow={true}
        category={category || 'other'}
        ariaHidden={true}
        size="medium"
        accessibility={'yes'}
        backgroundColor={colors.darkLinkColor}
      />
      <PrimaryButton onClick={onClick}>{t`Define main entry`}</PrimaryButton>
    </section>
  );
};

export default styled(MapButton)`
  position: relative;

  .mapboxgl-map {
    border-radius: 4px;
  }

  .mapboxgl-ctrl-attrib {
    display: none;
  }

  > figure {
    position: absolute;
    bottom: 50%;
    left: calc(50% - 20px);
  }

  > ${PrimaryButton} {
    position: absolute;
    bottom: 0px;
    right: 0px;
    left: 0px;
    width: 100%;
    display: block;
    z-index: 100;

    &:not(:hover) {
      color: ${colors.linkColorDarker};
      background: ${colors.neutralBackgroundColorTransparent};
    }
  }
`;
