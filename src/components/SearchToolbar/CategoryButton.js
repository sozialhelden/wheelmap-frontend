// @flow

import { hsl } from 'd3-color';
import * as React from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';

import IconButton from '../../lib/IconButton';
import * as icons from '../icons/mainCategories';
import colors from '../../lib/colors';

type Props = {
  name: string,
  id: string,
  className: string,
};


const evenMoreTransparentLinkColor = hsl(colors.linkBackgroundColorTransparent);
evenMoreTransparentLinkColor.opacity *= 0.5;

const StyledNavLink = styled(NavLink)`
  border-radius: 5px;

  &.active {
    background-color: ${evenMoreTransparentLinkColor};
    .circle {
      background-color: ${colors.selectedColor};
    }
  }
  &:hover {
    background-color: ${colors.linkBackgroundColorTransparent};
    &.active {
      .circle {
        background-color: ${colors.darkSelectedColor};
      }
    }
  }
`;


export default function CategoryButton(props: Props) {
  const url = `/beta/categories/${props.id}`;
  const SvgComponent = icons[props.id || 'undefined'];

  return (<StyledNavLink activeClassName="active" to={url} className={props.className} onFocus={props.onFocus} onBlur={props.onBlur}>
    <IconButton iconComponent={<SvgComponent />} caption={props.name} />
  </StyledNavLink>);
}
