// @flow
import React from 'react';
import styled from 'styled-components';
import type { AnyReactElement } from 'react-flow-types';
import colors from '../lib/colors';

type Props = {
  className: string,
  children: AnyReactElement,
};


function Toolbar(props: Props) {
  return (<nav className={['node-toolbar', props.className].filter(Boolean).join(' ')}>
    {props.children}
  </nav>);
}

const StyledToolbar = styled(Toolbar)`
  position: absolute;
  z-index: 1000;
  max-height: calc(100% - 20px);
  overflow: scroll;
  box-sizing: border-box;
  left: 0;
  margin: 10px;
  padding: 10px 15px;
  width: 270px;
  top: 0;

  font-size: 16px;
  background-color: ${colors.colorizedBackgroundColor};
  border-radius: 5px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);

  @media (max-width: 512px) {
    width: calc(100% - 20px);
    top: calc(100% - 80px);
  }
`;

export default StyledToolbar;
