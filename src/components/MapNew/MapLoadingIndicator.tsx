import styled from 'styled-components';

import colors from '../../lib/util/colors';
import Spinner from '../ActivityIndicator/Spinner';

const StyledDiv = styled.div`
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

export default function MapLoadingIndicator({ className }: { className?: string }) {
  return (
    <StyledDiv className={className}>
      <Spinner size={30} color="rgba(0, 0, 0, 0.4)" />
    </StyledDiv>
  );
}
