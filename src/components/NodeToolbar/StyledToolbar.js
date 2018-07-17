import styled from 'styled-components';
import Toolbar from '../Toolbar';

const StyledToolbar = styled(Toolbar)`
  hyphens: auto;

  top: 110px;
  max-height: calc(100% - 135px);

  @media (max-width: 512px), (max-height: 512px) {
    top: 50px;
  }
`;

export default StyledToolbar;
