// @flow

import styled from 'styled-components';
import React from 'react';
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
};


export default function Icon({ properties, category }: Props) {
  const color = getColorForWheelchairAccessibility(properties);
  const SvgComponent = icons[category._id || 'undefined'];
  return (<StyledIconImage className={`ac-marker-${color}`}>
    <SvgComponent />
  </StyledIconImage>);
}
