import * as React from 'react';
import styled, { css } from 'styled-components';
import { t } from 'ttag';

import colors from '../../lib/colors';
import { YesNoLimitedUnknown, YesNoUnknown } from '../../lib/Feature';
import Button from '../Button';
import CloseIcon from '../icons/actions/Close';
import { PlaceFilter } from './AccessibilityFilterModel';
import CombinedIcon from './CombinedIcon';

type Props = {
  className?: string;
  showCloseButton: boolean;
  accessibilityFilter: YesNoLimitedUnknown[];
  toiletFilter: YesNoUnknown[];
  caption: string;
  category: string;
  isMainCategory?: boolean;
  onClick: (data: PlaceFilter) => void;
  onFocus?: (event: React.FocusEvent<HTMLButtonElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLButtonElement>) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLButtonElement>) => void;
  isActive: boolean;
};

export const Caption = styled.span`
  flex: 1;
  color: ${colors.darkSelectedColor};
`;

function AccessibilityFilterButton(props: Props) {
  const {
    toiletFilter,
    accessibilityFilter,
    category,
    isMainCategory,
    showCloseButton,
    caption,
    onClick,
    className,
  } = props;

  return (
    <Button
      className={className}
      onFocus={props.onFocus}
      onBlur={props.onBlur}
      onKeyDown={props.onKeyDown}
      tabIndex={0}
      aria-label={showCloseButton ? t`Remove ${caption} Filter` : caption}
      onClick={() =>
        onClick({
          toiletFilter: showCloseButton ? [] : toiletFilter,
          accessibilityFilter: showCloseButton ? [] : accessibilityFilter,
        })
      }
    >
      <CombinedIcon {...{ toiletFilter, accessibilityFilter, category, isMainCategory }} />
      <Caption>{caption}</Caption>
      {showCloseButton && <CloseIcon className="close-icon" />}
    </Button>
  );
}

export default styled(AccessibilityFilterButton)`
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

  @media (max-width: 375px) {
    svg.icon {
      width: 14px;
      height: 14px;
    }
    figure.wc-icon {
      width: 24px;
      height: 24px;
    }
  }

  ${props =>
    props.isActive &&
    css`
      background-color: ${colors.coldBackgroundColor};
    `};

  &:hover,
  &:focus {
    background-color: ${colors.linkBackgroundColorTransparent};
  }
`;
