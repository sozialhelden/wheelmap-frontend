import styled from "styled-components";
import Toolbar from "../shared/Toolbar";

const StyledToolbar = styled(Toolbar)`
  hyphens: auto;

  padding-bottom: 0px;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);

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
`;

export default StyledToolbar;
