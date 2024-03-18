import * as React from "react";
import styled from "styled-components";

import colors from "../../lib/colors";
import { YesNoLimitedUnknown } from "../../lib/model/ac/Feature";
import CombinedIcon from "../SearchPanel/CombinedIcon";
import Button from "../shared/Button";

type Props = {
  className?: string;
  accessibilityFilter: YesNoLimitedUnknown[];
  caption: string;
  onFocus?: (event: React.FocusEvent<HTMLButtonElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLButtonElement>) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLButtonElement>) => void;
};

export const Caption = styled.span`
  flex: 1;
  color: ${colors.darkSelectedColor};
`;

function AccessibilityFilterButton(props: Props) {
  const { accessibilityFilter, caption, className } = props;

  return (
    <Button className={className} onFocus={props.onFocus} onBlur={props.onBlur} onKeyDown={props.onKeyDown} tabIndex={0} aria-label={caption}>
      <CombinedIcon {...{ accessibilityFilter }} category="health" />
      <Caption>{caption}</Caption>
    </Button>
  );
}

export default styled(AccessibilityFilterButton)`
  & {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem;
    cursor: pointer;

    svg.icon {
      width: 21px;
      height: 21px;
    }

    ${CombinedIcon} {
      width: 60px;
    }

    &:hover,
    &:focus {
      background-color: ${colors.linkBackgroundColorTransparent};
    }
  }
`;
