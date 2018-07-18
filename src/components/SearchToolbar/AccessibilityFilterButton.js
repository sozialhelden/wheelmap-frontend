// @flow

import { t } from 'c-3po';
import { hsl } from 'd3-color';
import * as React from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import type { RouterHistory } from 'react-router-dom';
import type { YesNoLimitedUnknown, YesNoUnknown } from '../../lib/Feature';

import colors from '../../lib/colors';
import CombinedIcon from './CombinedIcon';
import CloseIcon from '../icons/actions/Close';
import urlForFilters from './urlForFilters';


type Props = {
  history: RouterHistory,
  className: string,
  showCloseButton: boolean,
  accessibilityFilter: YesNoLimitedUnknown[],
  toiletFilter: YesNoUnknown[],
  caption: string,
  category: string,
  isMainCategory?: boolean,
  onFocus?: ((event: UIEvent) => void),
  onBlur?: ((event: UIEvent) => void),
  onKeyDown?: ((event: UIEvent) => void),
};


const StyledNavLink = styled(NavLink)`
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
    top: initial;
    left: initial;
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

  &:hover, &:focus {
    background-color: ${colors.linkBackgroundColorTransparent};
    &.is-active {
      .circle {
        background-color: ${colors.darkSelectedColor};
      }
    }
  }
`;


export default function AccessibilityFilterButton(props: Props) {
  const caption = props.caption;
  const { history, toiletFilter, accessibilityFilter, category, isMainCategory, showCloseButton } = props;
  const href = urlForFilters({
    history,
    category,
    toiletFilter: showCloseButton ? null : toiletFilter,
    accessibilityFilter: showCloseButton ? null : accessibilityFilter,
  });

  return (<StyledNavLink
    to={href}
    className={`${props.className} ${showCloseButton ? 'is-horizontal' : ''} ${props.isActive ? 'is-active' : ''}`}
    onFocus={(props.onFocus)}
    onBlur={props.onBlur}
    onKeyDown={props.onKeyDown}
    tabIndex={0}
    role="button"
    aria-label={showCloseButton ? t`Remove ${caption} Filter` : caption}
  >
    <CombinedIcon {...{ toiletFilter, accessibilityFilter, category, isMainCategory }} />
    <span className="caption">{caption}</span>
    {showCloseButton && <CloseIcon className='close-icon' />}
  </StyledNavLink>);
}
