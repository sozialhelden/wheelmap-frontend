import type * as React from "react";
import styled, { css } from "styled-components";
import { t } from "ttag";

import { Button } from "@radix-ui/themes";
import type {
  YesNoLimitedUnknown,
  YesNoUnknown,
} from "../../lib/model/ac/Feature";
import { AppStateLink } from "../App/AppStateLink";
import CloseIcon from "../icons/actions/Close";
import CombinedIcon from "./CombinedIcon";

type Props = {
  className?: string;
  showCloseButton: boolean;
  accessibilityFilter: YesNoLimitedUnknown[];
  toiletFilter: YesNoUnknown[];
  caption: string;
  category: string;
  isMainCategory?: boolean;
  onFocus?: (event: React.FocusEvent<HTMLButtonElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLButtonElement>) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLButtonElement>) => void;
  isActive: boolean;
};

export const Caption = styled.span`
  flex: 1;
  color: var(--accent-a12);
`;

function AccessibilityFilterButton(props: Props) {
  const {
    toiletFilter,
    accessibilityFilter,
    category,
    isMainCategory,
    showCloseButton,
    caption,
    isActive,
    className,
  } = props;

  return (
    <AppStateLink
      href={{
        query: isActive
          ? { wheelchair: null, toilet: null }
          : {
              wheelchair:
                accessibilityFilter.length > 0 ? accessibilityFilter : null,
              toilet: toiletFilter.length > 0 ? toiletFilter : null,
            },
      }}
      legacyBehavior
    >
      <Button
        className={className}
        onFocus={props.onFocus}
        onBlur={props.onBlur}
        onKeyDown={props.onKeyDown}
        tabIndex={0}
        aria-label={showCloseButton ? t`Remove ${caption} Filter` : caption}
        variant="ghost"
        size="3"
      >
        <CombinedIcon
          {...{
            toiletFilter,
            accessibilityFilter,
            category,
            isMainCategory,
          }}
        />
        <Caption>{caption}</Caption>
        {showCloseButton && <CloseIcon className="close-icon" />}
      </Button>
    </AppStateLink>
  );
}

export default styled(AccessibilityFilterButton)`
  & {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 10px 1em 10px 1.3em;
    min-height: 3rem;
    cursor: pointer;

    svg.icon {
      width: 21px;
      height: 21px;
    }

    ${CombinedIcon} {
      width: 70px;
    }

    ${(props) =>
      props.isActive &&
      css`
        background-color: var(--color-panel-translucent);
      `};

    &:hover,
    &:focus {
      background-color: var(--color-surface);
    }
  }
`;
