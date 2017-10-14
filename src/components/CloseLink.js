// @flow
import * as React from 'react';
import styled from 'styled-components';
import queryString from 'query-string';
import { Link } from 'react-router-dom';
import CloseIcon from './icons/actions/Close';
import { getQueryParams } from '../lib/queryParams';

type ClickHandler = (el: HTMLElement, ev: MouseEvent) => void;
type FocusHandler = (el: HTMLElement, ev: MouseEvent) => void;
type BlurHandler = (el: HTMLElement, ev: MouseEvent) => void;

const CloseLink = (props: { className: string, onClick: ClickHandler, onFocus: FocusHandler, onBlur: BlurHandler }) => (
  <Link
    to="/beta/"
    className={props.className}
    onBlur={props.onBlur}
    onFocus={props.onFocus}
    onClick={(event) => {
      if (props.onClick) {
        props.onClick(event);
        return;
      }
      event.preventDefault();
      const params = getQueryParams();
      props.history.push(`/beta#?${queryString.stringify(params)}`);
    }}
  >
    <CloseIcon />
  </Link>
);

const StyledCloseLink = styled(CloseLink)`
  display: block;
  position: absolute;
  padding: 16px;
  font-size: 30px;
  color: rgba(0, 0, 0, 0.3);
  text-decoration: none;
  text-align: center;
  z-index: 1;

  > svg {
    display: block;
  }
`;

export default StyledCloseLink;
