import React from 'react';
import styled from 'styled-components';
import logo from './Logo@2x.png';

function Logo(props) {
  return (<img alt="" {...props} src={logo} />);
}

const StyledLogo = styled(Logo)`
  position: fixed;
  bottom: 10px;
  left: 50%;
  margin-left: -66px;
  z-index: 100000000000;
  width: 97px;
  height: 24px;
  pointer-events: none;
  @media (max-width: 512px) {
    display: none;
  }
`;

export default StyledLogo;