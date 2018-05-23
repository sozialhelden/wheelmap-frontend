// @flow

import * as React from 'react';
import styled from 'styled-components';
import { interpolateLab } from 'd3-interpolate';
import colors from '../lib/colors';

const Circle = styled.div.attrs({ className: 'circle' })`
  width: 35px;
  height: 35px;
  border-radius: 500px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
`;


const StyledDiv = styled.div`
  display: flex;
  flex-basis: 25%;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  padding: 10px 0;
  text-align: center;
  text-decoration: none;
  cursor: pointer;

  .circle {
    background-color: ${colors.tonedDownSelectedColor};
  }
  &.active {
    font-weight: bold;
    .circle {
      background-color: ${props => props.activeColor || colors.selectedColor};
    }
  }
  @media (hover), (-moz-touch-enabled: 0) {
    &:not(.active):hover .circle {
      background-color: ${props => props.hoverColor || interpolateLab(props.activeColor || colors.selectedColor, colors.tonedDownSelectedColor)(0.5)};
    }
  }
  &:focus {
    outline: none;
    .circle {
      background-color: ${colors.selectedColor};
    }
  }

  svg {
    width: 21px;
    height: 21px;
    opacity: 0.95;
    g {
      fill: white;
    }
  }
`;

const Caption = styled.div.attrs({ className: 'caption' })`
  font-size: 0.80em;
  color: rgba(0, 0, 0, 0.8);
  line-height: 1.2;
  margin-top: 0.5em;
`;


type Props = {
  iconComponent: React.Node,
  caption: string,
  activeColor: ?string,
  hoverColor: ?string,
  ariaLabel: ?string,
};


export default function CategoryButton(props: Props) {
  return (<StyledDiv hoverColor={props.hoverColor} activeColor={props.activeColor} aria-label={props.ariaLabel}>
    <Circle>
      {props.iconComponent}
    </Circle>
    <Caption>{props.caption}</Caption>
  </StyledDiv>);
}
