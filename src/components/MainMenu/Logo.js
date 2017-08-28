import React from 'react';
import styled from 'styled-components';
import logo from './Logo@2x.png';

function Logo(props) {
  return (<img alt="" {...props} src={logo} />);
}

const StyledLogo = styled(Logo)`
  width: 97px;
  height: 24px;
`;

export default StyledLogo;
