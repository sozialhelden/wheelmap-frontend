// @flow

import styled from 'styled-components';
import * as React from 'react';
import type { NodeProperties } from '../lib/Feature';
import type { YesNoLimitedUnknown } from '../lib/Feature';
import { getColorForWheelchairAccessibility } from '../lib/colors';
import * as icons from './icons/categories';

import circle from './icons/circle.svg';
import circleShadowed from './icons/circleShadowed.svg';
import circleWithArrow from './icons/circleWithArrow.svg';
import circleWithArrowShadowed from './icons/circleWithArrowShadowed.svg';

import hexagon from './icons/hexagon.svg';
import hexagonShadowed from './icons/hexagonShadowed.svg';
import hexagonWithArrow from './icons/hexagonWithArrow.svg';
import hexagonWithArrowShadowed from './icons/hexagonWithArrowShadowed.svg';

import square from './icons/square.svg';
import squareShadowed from './icons/squareShadowed.svg';
import squareWithArrow from './icons/squareWithArrow.svg';
import squareWithArrowShadowed from './icons/squareWithArrowShadowed.svg';

import diamond from './icons/diamond.svg';
import diamondShadowed from './icons/diamondShadowed.svg';

const StyledIconImage = styled('figure')`
  position: relative;
  display: inline-block;
  height: 1.5em;
  width: 1.5em;
  margin: 0;
  padding: 0;
  border-radius: 1em;
  vertical-align: middle;
  margin-right: 0.5em;
  box-sizing: border-box;

  svg {
    width: 1em;
    height: 1em;
    margin: 0.25em;
    vertical-align: middle;
  }

  &.ac-marker-gray {
    box-shadow: 0 0 1px rgba(0, 0, 0, 0.7);
  }

  width: ${props => {
    if (props.isBig) {
      return '60px';
    }
    if (props.isMiddle) {
      return '40px';
    }
    return '20px';
  }} !important;
  height: ${props => {
    if (props.isBig) {
      return '60px';
    }
    if (props.isMiddle) {
      return '40px';
    }
    return '20px';
  }} !important;

  img {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
  }

  svg {
    width: 30px;
    height: 30px;
    ${'' /* opacity: 0.6; */}
    margin: 0;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    top: 45%;

    g {
      fill: white;
    }
  }
`;

type Props = {
  accessibility: YesNoLimitedUnknown,
  properties: ?NodeProperties,
  category: Category,
  overriddenColor: 'red' | 'yellow' | 'green' | 'gray' | void,
  className: ?string,
  isBig: ?boolean,
  ariaHidden: ?boolean,
};

export default function Icon({
  accessibility,
  overriddenColor,
  properties,
  category,
  className,
  isBig,
  isMiddle,
  withArrow,
  shadowed,
  ariaHidden,
}: Props) {
  const color = overriddenColor || getColorForWheelchairAccessibility(properties);
  const categoryName = category._id === '2nd_hand' ? 'second_hand' : category._id;
  const CategoryIconComponent = icons[categoryName || 'undefined'] || null;

  let iconShape;

  if (withArrow) {
    if (shadowed) {
      switch (accessibility) {
        case 'yes':
          iconShape = circleWithArrowShadowed;
          break;
        case 'limited':
          iconShape = hexagonWithArrowShadowed;
          break;
        case 'no':
          iconShape = squareWithArrowShadowed;
          break;
        default:
          iconShape = diamondShadowed;
      }
    } else {
      switch (accessibility) {
        case 'yes':
          iconShape = circleWithArrowShadowed;
          break;
        case 'limited':
          iconShape = hexagonWithArrowShadowed;
          break;
        case 'no':
          iconShape = squareWithArrowShadowed;
          break;
        default:
          iconShape = diamondShadowed;
      }
    }
  } else {
    if (shadowed) {
      switch (accessibility) {
        case 'yes':
          iconShape = circleWithArrowShadowed;
          break;
        case 'limited':
          iconShape = hexagonWithArrowShadowed;
          break;
        case 'no':
          iconShape = squareWithArrowShadowed;
          break;
        default:
          iconShape = diamondShadowed;
      }
    } else {
      switch (accessibility) {
        case 'yes':
          iconShape = circle;
          break;
        case 'limited':
          iconShape = hexagon;
          break;
        case 'no':
          iconShape = square;
          break;
        default:
          iconShape = diamond;
      }
    }
  }

  if (!CategoryIconComponent) debugger;
  return (
    <StyledIconImage
      className={`${className || ''} ${isBig ? 'ac-big-icon-marker' : ''}`}
      aria-hidden={ariaHidden}
      isBig={isBig}
      isMiddle={isMiddle}
    >
      <img src={iconShape} alt="" />
      {CategoryIconComponent ? <CategoryIconComponent /> : null}
      {/* { markerShapeElement } */}
    </StyledIconImage>
  );
}
