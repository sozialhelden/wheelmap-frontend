// @flow

import styled from 'styled-components';
import * as React from 'react';
import type { YesNoLimitedUnknown } from '../lib/Feature';
import colors from '../lib/colors';
import * as categoryIcons from './icons/categories';
import * as mainCategoryIcons from './icons/mainCategories';
import * as markers from './icons/markers';

type Size = 'big' | 'medium' | 'small';

type Props = {
  accessibility: ?YesNoLimitedUnknown,
  category: ?string,
  isMainCategory?: boolean,
  className?: ?string,
  size: Size,
  withArrow?: ?boolean,
  centered?: ?boolean,
  shadowed?: ?boolean,
  ariaHidden?: ?boolean,
  foregroundColor?: ?string,
  backgroundColor?: ?string,
  onClick?: () => void,
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
  display: flex;
  align-items: center;
  justify-content: center;

  ${props => (props.centered ? `left: calc(50% - ${width(props.size) / 2}px);` : '')} ${props =>
      props.centered ? `top: calc(50% - ${width(props.size) / 2}px);` : ''} svg {
    &.background {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      g,
      polygon,
      path,
      circle,
      rect {
        fill: ${props =>
          props.accessibility
            ? colors.markers.background[props.accessibility]
            : props.backgroundColor || 'white'};
      }
    }

    &.icon {
      position: relative;
      width: 60%;
      height: 60%;

      g,
      polygon,
      path,
      circle,
      rect {
        fill: ${props =>
          props.accessibility
            ? colors.markers.foreground[props.accessibility]
            : props.foregroundColor || '#888'};
      }
    }
  }
`;

// @TODO Rename it to CategoryIcon
export default function Icon({
  accessibility,
  category,
  isMainCategory,
  className,
  size,
  withArrow,
  shadowed,
  ariaHidden,
  centered,
  onClick,
}: Props) {
  let iconName = category;

  if (iconName === '2nd_hand') {
    iconName = 'second_hand';
  }

  const icons = isMainCategory ? mainCategoryIcons : categoryIcons;
  const CategoryIconComponent = icons[iconName || 'undefined'] || icons['undefined'];
  const MarkerComponent = markers[`${String(accessibility)}${withArrow ? 'With' : 'Without'}Arrow`];

  if (typeof CategoryIconComponent === 'object') {
    // eslint-disable-next-line no-console
    console.log('Found a CategoryIconComponent that was an object, but should not be.');
  }

  return (
    <StyledIconContainer
      size={size}
      className={className}
      aria-hidden={ariaHidden}
      accessibility={accessibility}
      centered={centered}
      onClick={onClick}
    >
      {accessibility && MarkerComponent ? <MarkerComponent className="background" /> : null}
      {CategoryIconComponent ? <CategoryIconComponent className="icon" /> : null}
    </StyledIconContainer>
  );
}

StyledIconContainer.displayName = 'StyledIconContainer';
