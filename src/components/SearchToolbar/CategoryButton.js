// @flow

import { t } from 'ttag';
import * as React from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import type { RouterHistory } from 'react-router-dom';

import CombinedIcon from './CombinedIcon';
import colors from '../../lib/colors';
import IconButton from '../IconButton';
import CloseIcon from '../icons/actions/Close';
import type { YesNoLimitedUnknown, YesNoUnknown } from '../../lib/Feature';
import { isFiltered } from '../../lib/Feature';
import urlForFilters from './urlForFilters';


type Props = {
  name: string,
  category: string,
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

const StyledNavLink = styled(NavLink)`
  border-radius: 5px;

  figure {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .circle {
    background-color: ${colors.tonedDownSelectedColor};
    margin: 2.5px;
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
    background-color: ${colors.coldBackgroundColor};
    .circle {
      background-color: ${colors.selectedColor};
    }
  }

  &:hover, &:focus {
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
        font-size: 0.80em;
        margin-top: 0.5em;
        color: ${colors.darkSelectedColor};
      }
    }
  }
`;


export default function CategoryButton(props: Props) {
  const { history, category, accessibilityFilter, toiletFilter, showCloseButton } = props;
  const url = urlForFilters({ history, accessibilityFilter, toiletFilter, category: showCloseButton ? null : category });

  let shownAccessibilities = accessibilityFilter;
  if (showCloseButton || !isFiltered(accessibilityFilter)) {
    shownAccessibilities = [];
  }

  const icon = <CombinedIcon
    accessibilityFilter={shownAccessibilities}
    toiletFilter={toiletFilter}
    category={category || 'undefined'}
    isMainCategory
    size="medium"
    ariaHidden={true}
  />

  return (<StyledNavLink
    activeClassName="active"
    to={url}
    className={`${props.className} ${showCloseButton ? 'is-horizontal' : ''}`}
    onFocus={(props.onFocus)}
    onBlur={props.onBlur}
    onKeyDown={props.onKeyDown}
    tabIndex={props.hidden ? -1 : 0}
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
  </StyledNavLink>);
}
