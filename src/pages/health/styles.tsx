import styled from "styled-components";

export const StyledColors = {
  green: "#76b82a",
  grey: "silver",
};

export const StyledLegend = styled.legend`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
`;

export const StyledButton = styled.button`
  background-color: transparent;
  border: 1px solid ${StyledColors.green};
  color: ${StyledColors.green};
  border-radius: 2rem;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 700;
  padding: 0.5rem 1rem !important;
  text-transform: uppercase;
  transition: all 0.2s ease-in-out;
`;

export const StyledCheckbox = styled.input`
  opacity: 1;
  height: var(--switch-height);
  width: calc(3rem + 2px);
  appearance: inherit;
  background-color: transparent;
  border-radius: 2rem;
  box-shadow: inset 0 0.5px 1px rgba(0, 0, 0, 0.2),
    inset 0 0.5px 1px rgba(0, 0, 0, 0.2), inset 0 -0.5px 1px rgba(0, 0, 0, 0.2);
  transition: 0.2s;
  position: relative;
  outline: none;
  cursor: pointer;
  ::before {
    height: var(--switch-height);
    width: var(--switch-height);
    position: absolute;
    top: 0;
    left: 0;
    content: "";
    background: ${StyledColors.grey};
    border-radius: 2rem;
    transform: scale(0.75);
    transition: 0.2s;
    box-shadow: 0 0.5px 0.5px rgba(0, 0, 0, 0.5),
      inset 0.5px 0.5px rgba(255, 255, 255, 0.2),
      inset -0.5px 0.5px rgba(255, 255, 255, 0.2);
  }

  :not(focus):focus-visible {
    outline: 1px dotted #212121;
    outline: 5px auto -webkit-focus-ring-color;
    transition: 0s;
  }

  :checked {
    background-color: #fff;
    box-shadow: inset 0 0.2px 1px rgba(0, 0, 0, 0.2),
      inset 0 0.2px 1px rgba(0, 0, 0, 0.2),
      inset 0 -0.2px 1px rgba(0, 0, 0, 0.2);
  }

  :checked::before {
    left: calc(2rem - 6px);
    background: ${StyledColors.green};
  }
`;
