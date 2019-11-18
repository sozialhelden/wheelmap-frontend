import L, { IconOptions } from 'leaflet';
import * as React from 'react';
import * as markers from '../icons/markers';
import MarkerIcon from './MarkerIcon';
import styled from 'styled-components';
import { t } from 'ttag';

type Options = IconOptions & {
  onClick: () => void,
  href: string,
  highlighted?: boolean,
};

const MappingEventMarkerSVG = markers['mappingEvent'];

const ICON_SIZES = { small: 25, medium: 40, big: 60 };

const StyledMappingEventMarkerSVG = styled(MappingEventMarkerSVG)`
  position: relative;
  left: calc(50% - ${props => ICON_SIZES[props.size] / 2}px);
  top: calc(50% - ${props => ICON_SIZES[props.size]}px);
  width: ${props => ICON_SIZES[props.size]}px;
  height: ${props => ICON_SIZES[props.size]}px;
`;

export default class MappingEventMarkerIcon extends MarkerIcon {
  constructor(options: Options) {
    const { eventName, highlighted, ...restOptions } = options;

    const iconAnchorOffset = L.point(0, 0);
    // translator: Screenreader description for a map marker showing a mapping event meeting point
    const accessibleName = t`${eventName} Mapping Event Map Marker`;

    super({ iconAnchorOffset, highlighted, accessibleName, ...restOptions });

    this.iconSvgElement = (
      <StyledMappingEventMarkerSVG size={highlighted ? 'big' : 'small'} aria-hidden={highlighted} />
    );
  }
}
