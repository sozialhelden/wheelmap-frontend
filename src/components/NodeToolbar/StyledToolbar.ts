import styled from 'styled-components'
import colors from '../../lib/util/colors'
import { ChromelessButton } from '../shared/Button'
import Toolbar from '../shared/Toolbar'

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

  &.toolbar-is-scrollable {
    > div > header {
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06), 0 5px 10px rgba(0, 0, 0, 0.1);
    }

    .styled-frame:before {
      z-index: 0;
    }
  }

  > div > header {
    transition: box-shadow 0.3s ease-out;
  }
`

export default StyledToolbar
