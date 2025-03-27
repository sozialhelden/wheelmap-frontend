import styled from "styled-components";
import colors from "~/needs-refactoring/lib/util/colors";

const StyledIconButtonList = styled.ul`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  margin: .5rem 0 0 0;
  padding: 0;

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

    a {
      display: flex;
      flex-direction: row;
      align-items: center;
      min-height: 2.5rem;
      overflow: hidden;
      text-overflow: ellipsis;
      font-weight: 500;
      text-decoration: none;
    }

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
