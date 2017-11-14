// @flow

import styled, { css } from 'styled-components';
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

const bigIconStyles = css`
  width: 60px;
  height: 60px;

  svg {
    position: absolute;
    width: 30px;
    height: 30px;
    left: 15px;

    top: ${props => props.accessibility === 'unknown' ? '15px' : '12px'}
  }
`;

const middleIconStyles = css`
  width: 30px;
  height: 30px;

  svg {
    position: absolute;
    width: 20px;
    height: 20px;
    left: 5px;

    top: ${props => props.accessibility === 'unknown' ? '5px' : '5px'}
  }
`;

const StyledIconImage = styled('figure')`
  position: relative;
  display: inline-block;
  height: 1.5em;
  width: 1.5em;
  margin: 0;
  padding: 0;
  border-radius: 1em;
  vertical-align: middle;
  box-sizing: border-box;

  img {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
  }

  svg {
    g {
      fill: ${props => props.accessibility === 'unknown' ? '#69615b' : '#ffffff'}
    }
  }

  ${'' /* svg {
    width: 1em;
    height: 1em;
    margin: 0.25em;
    vertical-align: middle;
  } */}

  ${'' /* &.ac-marker-gray {
    box-shadow: 0 0 1px rgba(0, 0, 0, 0.7);
  } */}

  ${props => {
    if (props.isBig) {
      return bigIconStyles;
    } else if (props.isMiddle) {
      return middleIconStyles;
    } else {
      return bigIconStyles;
    }
  }}
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
      className={`${className || ''}`}
      aria-hidden={ariaHidden}
      isBig={isBig}
      isMiddle={isMiddle}
      accessibility={accessibility}
    >
      <img src={iconShape} alt="" />
      {CategoryIconComponent ? <CategoryIconComponent /> : null}
      {/* { markerShapeElement } */}
    </StyledIconImage>
  );
}
