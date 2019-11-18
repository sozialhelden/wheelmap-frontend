import React from 'react';
import { Dots } from 'react-activity';
import styled from 'styled-components';

import colors from '../../lib/colors';

function MapLoading({ className }: { className?: string }) {
  return (
    <div className={className}>
      <Dots size={30} color={'rgba(0, 0, 0, 0.4)'} />
    </div>
  );
}

export default styled(MapLoading)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: ${colors.neutralBackgroundColor};
  display: flex;
  justify-content: center;
  align-items: center;
`;
