// @flow

import styled, { css } from 'styled-components';
import * as React from 'react';
import type { NodeProperties, YesNoLimitedUnknown } from '../lib/Feature';
import getIconNameForProperties from './Map/getIconNameForProperties';

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
    width: 30px;
    height: 30px;
    left: 15px;

    top: ${props => (props.accessibility === 'unknown' ? '15px' : '12px')};
  }
`;

const mediumIconStyles = css`
  width: 30px;
  height: 30px;

  svg {
    width: 20px;
    height: 20px;
    left: 5px;

    top: ${props => (props.accessibility === 'unknown' ? '5px' : '5px')};
  }
`;

const smallIconStyles = css`
  width: ${props => (props.accessibility === 'unknown' ? '23px' : '19px')};
  height: ${props => (props.accessibility === 'unknown' ? '23px' : '19px')};

  svg {
    width: 15px;
    height: 15px;
    left: ${props => (props.accessibility === 'unknown' ? '4px' : '2px')};
    top: ${props => (props.accessibility === 'unknown' ? '4px' : '2px')};
  }
`;

const StyledIconContainer = styled('figure')`
  position: relative;
  margin: 0;

  img {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
  }

  svg {
    position: absolute;

    g {
      fill: ${props => (props.accessibility === 'unknown' ? '#69615b' : '#ffffff')};
    }
  }

  ${props => {
    if (props.isBig) {
      return bigIconStyles;
    } else if (props.isMedium) {
      return mediumIconStyles;
    } else {
      return smallIconStyles;
    }
  }};
`;

const determineIconShape = (accessibility, withArrow, shadowed) => {
  let iconShape;
  switch (accessibility) {
      case 'yes':
        if (withArrow) {
          if (shadowed) {
            iconShape = circleWithArrowShadowed;
          } else {
            iconShape = circleWithArrow;
          }
        } else {
          if (shadowed) {
            iconShape = circleShadowed;
          } else {
            iconShape = circle;
          }
        }
        break;
      case 'limited':
        if (withArrow) {
          if (shadowed) {
            iconShape = hexagonWithArrowShadowed;
          } else {
            iconShape = hexagonWithArrow;
          }
        } else {
          if (shadowed) {
            iconShape = hexagonShadowed;
          } else {
            iconShape = hexagon;
          }
        }
        break;
      case 'no':
        if (withArrow) {
          if (shadowed) {
            iconShape = squareWithArrowShadowed;
          } else {
            iconShape = squareWithArrow;
          }
        } else {
          if (shadowed) {
            iconShape = squareShadowed;
          } else {
            iconShape = square;
          }
        }
        break;
      default:
        if (shadowed) {
          iconShape = diamondShadowed;
        } else {
          iconShape = diamond;
        }
    }

  return iconShape;
}

type Props = {
  accessibility: YesNoLimitedUnknown,
  properties: ?NodeProperties,
  category: Category,
  className: ?string,
  isBig: ?boolean,
  isMedium: ?boolean,
  isSmall: ?boolean,
  withArrow: ?boolean,
  shadowed: ?boolean,
  ariaHidden: ?boolean,
};

export default function Icon({
  accessibility,
  properties,
  category,
  className,
  isBig,
  isMedium,
  isSmall,
  withArrow,
  shadowed,
  ariaHidden,
}: Props) {
  // TODO Taner: unsure if this is a clean way to do this
  const categoryName = properties
    ? getIconNameForProperties(properties)
    : category._id === '2nd_hand' ? 'second_hand' : category._id;
  const CategoryIconComponent = icons[categoryName || 'undefined'] || null;

  const iconShape = determineIconShape(accessibility, withArrow, shadowed);

  return (
    <StyledIconContainer
      className={className}
      aria-hidden={ariaHidden}
      isBig={isBig}
      isMedium={isMedium}
      isSmall={isSmall}
      accessibility={accessibility}
    >
      <img src={iconShape} alt="" />
      {CategoryIconComponent ? <CategoryIconComponent /> : null}
    </StyledIconContainer>
  );
}
