// @flow

import { t } from 'ttag';
import * as React from 'react';
import styled from 'styled-components';
import type { YesNoLimitedUnknown, YesNoUnknown } from '../../lib/Feature';

import colors from '../../lib/colors';
import CombinedIcon from './CombinedIcon';
import CloseIcon from '../icons/actions/Close';
import type { PlaceFilter } from './AccessibilityFilterModel';

type Props = {
  className: string,
  showCloseButton: boolean,
  accessibilityFilter: YesNoLimitedUnknown[],
  toiletFilter: YesNoUnknown[],
  caption: string,
  category: string,
  isMainCategory?: boolean,
  onClick: (data: PlaceFilter) => void,
  onFocus?: (event: UIEvent) => void,
  onBlur?: (event: UIEvent) => void,
  onKeyDown?: (event: UIEvent) => void,
  isActive: boolean,
};

const StyledLink = styled.a`
  border-radius: 5px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0.5em 1em 0.5em 1.3em;
  min-height: 3rem;

  svg.icon {
    width: 21px;
    height: 21px;
  }

  .accessibilities {
    width: 70px;
  }

  .caption {
    flex: 1;
    color: ${colors.darkSelectedColor};
  }

  &.is-active {
    background-color: ${colors.coldBackgroundColor};

    .circle {
      background-color: ${colors.selectedColor};
    }
  }

  &:hover,
  &:focus {
    background-color: ${colors.linkBackgroundColorTransparent};

    &.is-active {
      .circle {
        background-color: ${colors.darkSelectedColor};
      }
    }
  }
`;

export default function AccessibilityFilterButton(props: Props) {
  const {
    toiletFilter,
    accessibilityFilter,
    category,
    isMainCategory,
    showCloseButton,
    caption,
    isActive,
    onClick,
  } = props;

  return (
    <StyledLink
      className={`${props.className} ${showCloseButton ? 'is-horizontal' : ''} ${
        isActive ? 'is-active' : ''
      }`}
      onFocus={props.onFocus}
      onBlur={props.onBlur}
      onKeyDown={props.onKeyDown}
      tabIndex={0}
      role="button"
      aria-label={showCloseButton ? t`Remove ${caption} Filter` : caption}
      onClick={() =>
        onClick({
          toiletFilter: showCloseButton ? [] : toiletFilter,
          accessibilityFilter: showCloseButton ? [] : accessibilityFilter,
        })
      }
    >
      <CombinedIcon {...{ toiletFilter, accessibilityFilter, category, isMainCategory }} />
      <span className="caption">{caption}</span>
      {showCloseButton && <CloseIcon className="close-icon" />}
    </StyledLink>
  );
}
