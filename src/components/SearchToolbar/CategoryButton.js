// @flow

import { t } from 'c-3po';
import { hsl } from 'd3-color';
import * as React from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { interpolateLab } from 'd3-interpolate';
import type { RouterHistory } from 'react-router-dom';

import CombinedIcon from './CombinedIcon';
import colors from '../../lib/colors';
import IconButton from '../IconButton';
import CloseIcon from '../icons/actions/Close';
import type { YesNoLimitedUnknown, YesNoUnknown } from '../../lib/Feature';
import { getQueryParams, newLocationWithReplacedQueryParams } from '../../lib/queryParams';
import { isFiltered } from '../../lib/Feature';


type Props = {
  name: string,
  id: string,
  className: string,
  hidden: boolean,
  showCloseButton: boolean,
  hasCircle?: boolean,
  accessibilityFilter?: YesNoLimitedUnknown[],
  toiletFilter?: YesNoUnknown[],
  onFocus?: ((event: UIEvent) => void),
  onBlur?: ((event: UIEvent) => void),
  onKeyDown?: ((event: UIEvent) => void),
  history: RouterHistory,
};


const evenMoreTransparentLinkColor = hsl(colors.linkBackgroundColorTransparent);
evenMoreTransparentLinkColor.opacity *= 0.5;

const halfTonedDownSelectedColor = interpolateLab(colors.tonedDownSelectedColor, colors.selectedColor)(0.5);


const StyledNavLink = styled(NavLink)`
  border-radius: 5px;

  figure {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .circle {
    background-color: ${colors.tonedDownSelectedColor};
  }

  .icon-button .accessibilities {
    justify-content: center;
  }

  .circle {
    svg.icon {
      g, path, circle, rect {
        fill: white;
      }
    }
  }
  
  svg.icon {
    width: 21px;
    height: 21px;
    top: initial;
    left: initial;
  }

  &.active {
    background-color: ${evenMoreTransparentLinkColor};
    .circle {
      background-color: ${colors.selectedColor};
    }
  }

  &:hover, &:focus {
    background-color: ${colors.linkBackgroundColorTransparent};
    .circle {
      background-color: ${halfTonedDownSelectedColor};
    }
    &.active {
      .circle {
        background-color: ${colors.darkSelectedColor};
      }
    }
  }

  &.is-horizontal {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 0 1em;
    .icon-button {
      flex: 1;
      .caption {
        margin-left: 1em;
      }
    }
  }

  &:not(.is-horizontal) {
    flex-direction: column;
    .icon-button {
      flex-direction: column;
      .caption {
        font-size: 0.80em;
        margin-top: 0.5em;
      }
    }
  }
`;


function urlForFilters({ history, id, accessibilityFilter, toiletFilter, showCloseButton }) {
  const queryParams = getQueryParams();
  const hasStatusParameter = isFiltered(accessibilityFilter);
  const hasToiletParameter = toiletFilter && toiletFilter.length;
  const status = hasStatusParameter ? (accessibilityFilter || []).sort().join('.') : null;
  const toilet = hasToiletParameter ? (toiletFilter || []).sort().join('.') : null;
  const newQueryParams: { [string]: ?string } = Object.assign({}, queryParams, { status, toilet });
  const location = newLocationWithReplacedQueryParams(history, newQueryParams);
  location.pathname = showCloseButton ? `/beta` : `/beta/categories/${id}`;
  return location;
}


export default function CategoryButton(props: Props) {
  // const url = props.showCloseButton ? `/beta` : `/beta/categories/${props.id}`;
  const url = urlForFilters(props);

  const shownAccessibilities = isFiltered(props.accessibilityFilter) ? props.accessibilityFilter : [];

  const icon = <CombinedIcon
    accessibilityFilter={shownAccessibilities}
    toiletFilter={props.toiletFilter}
    category={props.id || 'undefined'}
    isMainCategory
    size="medium"
    ariaHidden={true}
  />

  return (<StyledNavLink
    activeClassName="active"
    to={url}
    className={`${props.className} ${props.showCloseButton ? 'is-horizontal' : ''}`}
    onFocus={(props.onFocus)}
    onBlur={props.onBlur}
    onKeyDown={props.onKeyDown}
    tabIndex={props.hidden ? -1 : 0}
    role="button"
    aria-label={props.showCloseButton ? t`Remove ${props.name} Filter` : props.name}
  >
    <IconButton
      isHorizontal={props.showCloseButton}
      caption={props.name}
      className="icon-button"
      hasCircle={props.hasCircle}
    >
      {icon}
    </IconButton>
    {props.showCloseButton && <CloseIcon />}
  </StyledNavLink>);
}
