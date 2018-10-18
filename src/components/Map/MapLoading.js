// @flow
import React from 'react';
import { Dots } from 'react-activity';
import styled from 'styled-components';

function MapLoading({ className }: { className?: string }) {
  return (
    <div className={className}>
      <Dots />
    </div>
  );
}

export default styled(MapLoading)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;
`;
