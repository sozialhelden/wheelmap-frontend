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

Circle.displayName = 'Circle';


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

Caption.displayName = 'Caption';


type Props = {
  caption: string,
  activeColor?: ?string,
  hoverColor?: ?string,
  ariaLabel?: ?string,
  hasCircle?: boolean,
  isHorizontal?: boolean,
  className?: string,
  children?: React.Node,
};


export default function IconButton(props: Props) {
  const icon = props.hasCircle ? <Circle>{props.children}</Circle> : props.children;
  return (<StyledDiv className={`icon-button ${props.className || ''}`} hoverColor={props.hoverColor} activeColor={props.activeColor} aria-label={props.ariaLabel}>
    {icon}
    <Caption isHorizontal={props.isHorizontal}>{props.caption}</Caption>
  </StyledDiv>);
}
