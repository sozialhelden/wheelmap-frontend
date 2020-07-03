// @flow

// import * as React from 'react';
import styled from 'styled-components';

const FullscreenBackdrop = styled.div.attrs({ className: 'fullscreen-backdrop' })`
  /* backdrop-filter: blur(10px); */
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(44, 85, 103, 0.67);
  transition: opacity 0.3s ease-out;
  opacity: ${props => (props.isActive ? '1' : '0')};
  pointer-events: ${props => (props.isActive ? 'inherit' : 'none')} !important;
  z-index: 1;
  transform: none !important;
  backdrop-filter: blur(5px);
`;

export default FullscreenBackdrop;
