// @flow

import styled from 'styled-components';

import CloseButton from '../CloseButton';

export const StyledCloseButton = styled(CloseButton)`
  position: sticky;
  top: 0px;
  float: right;
  margin-right: -10px;
  z-index: 4;
`;

export default StyledCloseButton;
