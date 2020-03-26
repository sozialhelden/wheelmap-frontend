// @flow
import * as React from 'react';
import styled from 'styled-components';

export default styled.div`
  display: flex;
  flex-direction: column;
  background: white;
  padding-left: 24px;
  padding-right: 24px;
  flex: 1;
  border-radius: 8px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
  max-width: 600px;
  height: 100%;

  overflow-y: auto;
  overflow-x: hidden;
`;
