// @flow

import styled from 'styled-components';
import * as React from 'react';
import type { NodeProperties, YesNoLimitedUnknown } from '../lib/Feature';
import type { Category } from '../lib/Categories';
import getIconNameForProperties from './Map/getIconNameForProperties';
import colors from '../lib/colors';
import * as icons from './icons/categories';
import * as markers from './icons/markers';

type Size = 'big' | 'medium' | 'small';


type Props = {
  accessibility: ?YesNoLimitedUnknown,
  properties?: ?NodeProperties,
  category: ?string,
  className?: ?string,
  size: Size,
  withArrow?: ?boolean,
  centered?: ?boolean,
  shadowed?: ?boolean,
  ariaHidden?: ?boolean,
};


function width(size: Size) {
  return {
    big: 60,
    medium: 40,
    small: 25,
  }[size];
}


const StyledIconContainer = styled('figure')`
  position: relative;
  margin: 0;

  width: ${props => width(props.size)}px;
  min-width: ${props => width(props.size)}px;
  height: ${props => width(props.size)}px;
  font-size: ${props => width(props.size)}px;
  line-height: 1;

  ${props => props.centered ? `left: calc(50% - ${width(props.size) / 2}px);` : ''}
  ${props => props.centered ? `top: calc(50% - ${width(props.size) / 2}px);` : ''}

  svg {
    position: absolute;
    &.background {
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      g, polygon, path, circle, rect {
        fill: ${props => (props.accessibility ? colors.markers.background[props.accessibility] : 'white')};
      }
    }
    &.icon {
      width: 60%;
      height: 60%;
      top: 20%;
      left: 20%;
      g, polygon, path, circle, rect {
        fill: ${props => (props.accessibility ? colors.markers.foreground[props.accessibility] : '#888')};
      }
    }
  }
`;


export default function Icon({
  accessibility,
  properties,
  category,
  className,
  size,
  withArrow,
  shadowed,
  ariaHidden,
  centered,
}: Props) {
  let iconName = properties ? getIconNameForProperties(properties) : category;
  if (iconName === '2nd_hand') {
    iconName = 'second_hand';
  }

  const CategoryIconComponent = icons[iconName || 'undefined'] || icons['undefined'];
  const MarkerComponent = markers[`${String(accessibility)}${withArrow ? 'With' : 'Without'}Arrow`];
  if (typeof CategoryIconComponent === 'object') {
    debugger;
  }
  return (
    <StyledIconContainer
      size={size}
      className={className}
      aria-hidden={ariaHidden}
      accessibility={accessibility}
      centered={centered}
    >
      {(accessibility && MarkerComponent) ? <MarkerComponent className="background" /> : null}
      {CategoryIconComponent ? <CategoryIconComponent className="icon"/> : null}
    </StyledIconContainer>
  );
}

StyledIconContainer.displayName = 'StyledIconContainer';
