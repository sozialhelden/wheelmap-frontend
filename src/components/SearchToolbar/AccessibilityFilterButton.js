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
import { newLocationWithReplacedQueryParams, getQueryParams } from '../../lib/queryParams';

type Props = {
  history: RouterHistory,
  className: string,
  hidden: boolean,
  showCloseButton: boolean,
  accessibilityFilter: YesNoLimitedUnknown[],
  toiletFilter: YesNoUnknown[],
  caption: string,
  category: string,
  onFocus?: ((event: UIEvent) => void),
  onBlur?: ((event: UIEvent) => void),
  onKeyDown?: ((event: UIEvent) => void),
};


const evenMoreTransparentLinkColor = hsl(colors.linkBackgroundColorTransparent);
evenMoreTransparentLinkColor.opacity *= 0.5;


const StyledNavLink = styled(NavLink)`
  border-radius: 5px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0.25em 1em;

  &.active {
    background-color: ${evenMoreTransparentLinkColor};
    .circle {
      background-color: ${colors.selectedColor};
    }
  }

  &:hover, &:focus {
    background-color: ${colors.linkBackgroundColorTransparent};
    &.active {
      .circle {
        background-color: ${colors.darkSelectedColor};
      }
    }
  }
`;


function urlForFilters({ history, accessibilityFilter, toiletFilter, showCloseButton }) {
  const queryParams = getQueryParams();
  const newQueryParams: { [string]: ?string } = Object.assign({}, queryParams, {
    status: showCloseButton ? null : accessibilityFilter.sort().join('.'),
  });
  if (toiletFilter.length) {
    newQueryParams.toilet = showCloseButton ? null : toiletFilter.sort().join('.');
  }
  return newLocationWithReplacedQueryParams(history, newQueryParams);
}


export default function AccessibilityFilterButton(props: Props) {
  const caption = props.caption;
  const href = urlForFilters(props);
  const { toiletFilter, accessibilityFilter } = props;
  return (<StyledNavLink
    to={href}
    className={`${props.className} ${props.showCloseButton ? 'is-horizontal' : ''}`}
    onFocus={(props.onFocus)}
    onBlur={props.onBlur}
    onKeyDown={props.onKeyDown}
    tabIndex={props.hidden ? -1 : 0}
    role="button"
    aria-label={props.showCloseButton ? t`Remove ${caption} Filter` : caption}
  >
    <CombinedIcon {...{ toiletFilter, accessibilityFilter }} />
    <span className="caption">{caption}</span>
    {props.showCloseButton && <CloseIcon />}
  </StyledNavLink>);
}
