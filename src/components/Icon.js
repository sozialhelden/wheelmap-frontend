// @flow

import styled from 'styled-components';
import * as React from 'react';
import type { NodeProperties } from '../lib/Feature';
import { getColorForWheelchairAccessibility } from '../lib/colors';
import * as icons from './icons/categories';


const StyledIconImage = styled('figure')`
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
`;


type Props = {
  properties: ?NodeProperties,
  category: Category,
  overriddenColor: 'red' | 'yellow' | 'green' | 'gray' | void,
  className: ?string,
  isBig: ?boolean,
  ariaHidden: ?boolean,
};


export default function Icon({ overriddenColor, properties, category, className, isBig, ariaHidden }: Props) {
  const color = overriddenColor || getColorForWheelchairAccessibility(properties);
  const categoryName = category._id === '2nd_hand' ? 'second_hand' : category._id;
  const SvgComponent = icons[categoryName || 'undefined'] || null;
  if (!SvgComponent) debugger;
  return (
    <StyledIconImage
      className={`ac-marker-${color} ${className || ''} ${isBig ? 'ac-big-icon-marker' : ''}`}
      aria-hidden={ariaHidden}
    >
      { SvgComponent ? <SvgComponent /> : null}
    </StyledIconImage>
  );
}
