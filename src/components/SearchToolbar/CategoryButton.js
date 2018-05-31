// @flow

import { hsl } from 'd3-color';
import * as React from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import type { YesNoLimitedUnknown } from '../../lib/Feature';

import IconButton from '../IconButton';
import Icon from '../Icon';
import CloseIcon from '../icons/actions/Close';
import colors from '../../lib/colors';
import { t } from 'c-3po';

type Props = {
  name: string,
  id: string,
  className: string,
  hidden: boolean,
  showCloseButton: boolean,
  accessibility?: YesNoLimitedUnknown,
  onFocus?: ((event: UIEvent) => void),
  onBlur?: ((event: UIEvent) => void),
  onKeyDown?: ((event: UIEvent) => void),
};


const evenMoreTransparentLinkColor = hsl(colors.linkBackgroundColorTransparent);
evenMoreTransparentLinkColor.opacity *= 0.5;

const StyledNavLink = styled(NavLink)`
  border-radius: 5px;

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


export default function CategoryButton(props: Props) {
  const url = props.showCloseButton ? `/beta` : `/beta/categories/${props.id}`;

  const icon = <Icon
    accessibility={props.accessibility}
    category={props.id || 'undefined'}
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
    >
      {icon}
    </IconButton>
    {props.showCloseButton && <CloseIcon />}
  </StyledNavLink>);
}
