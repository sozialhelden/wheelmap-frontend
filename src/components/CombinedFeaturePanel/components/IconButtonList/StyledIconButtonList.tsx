import styled from "styled-components";
import colors from "../../../../lib/colors";

const StyledIconButtonList = styled.ul`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  margin: 0 -8px;

  li {
    svg {
      margin-left: 0.3rem;
      margin-right: 0.7rem;
    }
  }

  li {
    display: flex;
    flex-direction: row;
    align-items: center;

    svg {
      width: 1.5rem;
      height: 1.5rem;
      min-width: 1.5rem;

      g,
      rect,
      circle,
      path {
        fill: ${colors.tonedDownSelectedColor};
      }
    }

    &:not(:hover) {
      color: ${colors.textColorTonedDown};
    }
  }
`;

export default StyledIconButtonList;
