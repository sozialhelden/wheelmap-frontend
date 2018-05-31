// @flow

import * as React from 'react';
import styled from 'styled-components';

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
  align-items: center;
  box-sizing: border-box;
  padding: 10px 0;
  text-align: center;
  text-decoration: none;
  cursor: pointer;
`;

const Caption = styled.div.attrs({ className: 'caption' })`
  color: rgba(0, 0, 0, 0.8);
  line-height: 1.2;
`;


type Props = {
  caption: string,
  activeColor: ?string,
  hoverColor: ?string,
  ariaLabel: ?string,
  isHorizontal: boolean,
  className: string,
  children?: React.Node,
};


export default function CategoryButton(props: Props) {
  return (<StyledDiv className={`icon-button ${props.className}`} hoverColor={props.hoverColor} activeColor={props.activeColor} aria-label={props.ariaLabel}>
    {props.children}
    <Caption isHorizontal={props.isHorizontal}>{props.caption}</Caption>
  </StyledDiv>);
}
