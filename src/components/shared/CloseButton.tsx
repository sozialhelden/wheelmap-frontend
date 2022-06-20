import { t } from "ttag";
import * as React from "react";
import styled from "styled-components";
import CloseIcon from "../icons/actions/Close";
import colors from "../../lib/colors";

type Props = React.HTMLProps<HTMLButtonElement> & {};

const StyledButton = styled.button`
  display: inline-block;
  padding: 16px;
  font-size: 30px;
  color: rgba(0, 0, 0, 0.3);
  background-color: rgba(251, 250, 249, 0.8);
  backdrop-filter: blur(10px);
  border: none;
  border-radius: 31px;
  text-decoration: none;
  text-align: center;
  z-index: 1;
  transform: translateZ(0);
  cursor: pointer;

  @media (hover), (-moz-touch-enabled: 0) {
    &:hover {
      background-color: ${colors.negativeBackgroundColorTransparent};
    }
  }

  > svg {
    display: block;
  }
`;

export default function CloseButton(props: Props) {
  return (
    <StyledButton
      {...props}
      className={`close-link ${props.className || ""}`}
      aria-label={props["aria-label"] || t`Close`}
    >
      <CloseIcon />
    </StyledButton>
  );
}
