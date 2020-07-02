import styled, { css } from 'styled-components';
import Toolbar from '../Toolbar';
import { ChromelessButton } from '../Button';
import colors from '../../lib/colors';

const StyledToolbar = styled(Toolbar)`
  hyphens: auto;

  padding-bottom: 0px;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);

  ${ChromelessButton}.expand-button {
    padding: 8px 10px;
    display: flex;
    justify-content: left;
    width: 100%;

    &.focus-visible {
      background-color: transparent;
    }

    &:hover {
      color: ${colors.linkColor};
      background-color: ${colors.linkBackgroundColorTransparent};
    }

    svg {
      width: 1.5rem;
      height: 1.5rem;
      fill: #89939e;
    }
  }
`;

export default StyledToolbar;
