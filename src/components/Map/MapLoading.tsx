import React from 'react';
import styled from 'styled-components';

import colors from '../../lib/colors';
import Spinner from '../ActivityIndicator/Spinner';

function MapLoading({ className }: { className?: string }) {
  return (
    <div className={className}>
      <Spinner size={30} color={'rgba(0, 0, 0, 0.4)'} />
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
