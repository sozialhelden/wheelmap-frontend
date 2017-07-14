// @flow

import styled from 'styled-components';
import React from 'react';
import type { Category } from '../lib/Categories';
import type { NodeProperties } from '../lib/Feature';
import { getColorForWheelchairAccessibility } from '../lib/colors';


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

  img {
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
  const src = `/icons/categories/${category._id}.svg`;
  const color = getColorForWheelchairAccessibility(properties);
  return <StyledIconImage className={`ac-marker-${color}`}><img src={src} alt="" /></StyledIconImage>;
}
