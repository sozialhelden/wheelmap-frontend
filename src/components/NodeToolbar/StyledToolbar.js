import styled from 'styled-components';
import Toolbar from '../Toolbar';

const StyledToolbar = styled(Toolbar)`
  hyphens: auto;

  top: 110px;
  max-height: calc(100% - 120px);
  max-height: calc(100% - 120px - constant(safe-area-inset-top));
  max-height: calc(100% - 120px - env(safe-area-inset-top));
  padding-top: 0;

  @media (max-width: 512px), (max-height: 512px) {
    top: 50px;
    top: calc(50px + constant(safe-area-inset-top));
    top: calc(50px + env(safe-area-inset-top));

    @media (orientation: landscape) {
      max-height: calc(100% - 80px);
      max-height: calc(100% - 80px - constant(safe-area-inset-top));
      max-height: calc(100% - 80px - env(safe-area-inset-top));
    }
  }
`;

export default StyledToolbar;