// @flow

import { t } from 'ttag';
import * as React from 'react';
import styled from 'styled-components';

import CombinedIcon from './CombinedIcon';
import colors from '../../lib/colors';
import IconButton from '../IconButton';
import CloseIcon from '../icons/actions/Close';
import type { YesNoLimitedUnknown, YesNoUnknown } from '../../lib/Feature';
import { isFiltered } from '../../lib/Feature';

type Props = {
  name: string,
  category: string,
  className: string,
  showCloseButton: boolean,
  hasCircle?: boolean,
  accessibilityFilter?: YesNoLimitedUnknown[],
  toiletFilter?: YesNoUnknown[],
  onClick: (category: string) => void,
  onFocus?: (event: UIEvent) => void,
};

const StyledLink = styled.link`
  display: flex;
  align-items: center;
  border: none;
  border-radius: 5px;
  font: inherit;

  figure {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .circle {
    background-color: ${colors.tonedDownSelectedColor};
    margin: 2.5px;
    svg.icon {
      g,
      path,
      circle,
      rect {
        fill: white;
      }
    }
  }

  svg.icon {
    width: 21px;
    height: 21px;
  }

  &.active {
    background-color: ${colors.coldBackgroundColor};
    .circle {
      background-color: ${colors.selectedColor};
    }
  }

  &:hover,
  &:focus {
    background-color: ${colors.linkBackgroundColorTransparent};
    .circle {
      background-color: ${colors.halfTonedDownSelectedColor};
    }
    &.active {
      .circle {
        background-color: ${colors.tonedDownSelectedColor};
      }
    }
  }

  &.is-horizontal {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 0 1em 0 1.3em;
    min-height: 3rem;
    .icon-button {
      flex: 1;
      flex-direction: row;
      .accessibilities {
        width: 70px;
      }
      .caption {
        color: ${colors.darkSelectedColor};
      }
    }
  }

  &:not(.is-horizontal) {
    flex-direction: column;
    .icon-button {
      flex-direction: column;
      .accessibilities {
        justify-content: center;
      }
      .caption {
        font-size: 0.8em;
        margin-top: 0.5em;
        color: ${colors.darkSelectedColor};
      }
    }
  }
`;

export default function CategoryButton(props: Props) {
  const { category, accessibilityFilter, toiletFilter, showCloseButton } = props;

  let shownAccessibilities = accessibilityFilter;
  if (showCloseButton || !isFiltered(accessibilityFilter)) {
    shownAccessibilities = [];
  }

  const icon = (
    <CombinedIcon
      accessibilityFilter={shownAccessibilities}
      toiletFilter={toiletFilter}
      category={category || 'undefined'}
      isMainCategory
      size="medium"
      ariaHidden={true}
    />
  );

  return (
    <StyledLink
      onClick={() => props.onClick(category)}
      className={`${props.className} ${showCloseButton ? 'is-horizontal' : ''}`}
      onFocus={props.onFocus}
      role="button"
      aria-label={showCloseButton ? t`Remove ${props.name} Filter` : props.name}
    >
      <IconButton
        isHorizontal={showCloseButton}
        caption={props.name}
        className="icon-button"
        hasCircle={props.hasCircle}
      >
        {icon}
      </IconButton>
      {showCloseButton && <CloseIcon />}
    </StyledLink>
  );
}
