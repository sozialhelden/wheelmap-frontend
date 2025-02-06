import styled from "styled-components";

import colors from "../../lib/util/colors";

export const UnstyledButton = styled.button`
  appearance: none;
  font: inherit;
  background: none;
  padding: 0;
  margin: 0;
  border-radius: 0;
  border: 0;
  display: block;
  text-align: left;
  width: 100%;

  &[disabled] {
    pointer-events: none;
    opacity: 0.75;
  }
`;

export const PrimaryButton = styled(UnstyledButton)`
  color: #ffffff;
  background-color: ${colors.linkColor};
  font-size: 1rem;
  font-weight: 700;
  line-height: 1.75;
  padding: 0.375rem 0.3125em;
  border-radius: 0.25rem;
  cursor: pointer;
  text-align: center;

`;

export const SecondaryButton = styled(UnstyledButton)`
  color: #22262d;
  background-color: #0000;
  font-size: 1rem;
  font-weight: 700;
  line-height: 1.75;
  padding: 0.375rem 0.3125em;
  border: 1px solid #a5a8b0;
  border-radius: 0.25rem;
  cursor: pointer;
  text-align: center;

  &:hover {
    background-color: ${colors.neutralBackgroundColorTransparent};
  }
`;

export const DangerButton = styled(SecondaryButton)`
  color: ${colors.negativeColorDarker};
  border: none;
  &:hover {
    background-color: ${colors.negativeBackgroundColorTransparent};
  }
`;

export const ChromelessButton = styled.button`
  padding: 0.375rem 0.75rem;
  border: none;
  box-shadow: 0px 0px 0px 1px transparent;
  border-radius: 0.25rem;
  @media (max-width: 768px) {
    box-shadow: 0px 0px 0px 1px transparent;
  }
  font-size: 1rem;
  line-height: 1.75;
  @media (max-height: 320px), (max-width: 320px) {
    font-size: 0.9rem;
  }
  background-color: transparent;
  color: ${colors.textColorTonedDown};
  cursor: pointer;
  &:hover {
    background-color: ${colors.neutralBackgroundColorTransparent};
  }
`;

export const CallToActionButton = styled.button`
  border: none;
  color: white;
  background-color: ${colors.linkColor};
  font-size: 1.25em;
  line-height: 1;
  padding: 0.5em 0.75em;
  border-radius: 0.5rem;
  cursor: pointer;
  display: inline-flex;
  justify-content: space-between;

  > svg {
    margin-left: 10px;
    vertical-align: bottom;
    path,
    polygon {
      fill: rgba(255, 255, 255, 0.75);
    }
  }

`;

export const CallToActionLink = styled.a`
  border: none;
  color: white !important;
  background-color: ${colors.linkColor};
  font-size: 1.25em;
  line-height: 1;
  padding: 0.5em 0.75em;
  border-radius: 0.5rem;
  cursor: pointer;
  display: inline-flex;
  justify-content: space-between;

  > svg {
    margin-left: 10px;
    vertical-align: bottom;
    path,
    polygon {
      fill: rgba(255, 255, 255, 0.75);
    }
  }
`;

export default UnstyledButton;
