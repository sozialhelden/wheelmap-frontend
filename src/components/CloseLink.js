// @flow
import * as React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import CloseIcon from './icons/actions/Close';
import { t } from 'ttag';

type ClickHandler = (el: HTMLElement, ev: MouseEvent) => void;
type FocusHandler = (el: HTMLElement, ev: MouseEvent) => void;
type BlurHandler = (el: HTMLElement, ev: MouseEvent) => void;
type KeyDownHandler = (el: HTMLElement, ev: KeyboardEvent) => void;

type Props = {
  className: string,
  ariaLabel: ?string,
  onClick: ClickHandler,
  onFocus: FocusHandler,
  onBlur: BlurHandler,
  onKeyDown: KeyDownHandler,
};

class CloseLink extends React.Component<Props> {
  focus() {
    const linkElement = ReactDOM.findDOMNode(this.linkInstance);
    linkElement.focus();
  }

  render() {
    return (
      <Link
        to="/beta/"
        ref={linkInstance => (this.linkInstance = linkInstance)}
        className={`close-link ${this.props.className || ''}`}
        onBlur={this.props.onBlur}
        onFocus={this.props.onFocus}
        onClick={this.props.onClick}
        onKeyDown={this.props.onKeyDown}
        role="button"
        aria-label={this.props.ariaLabel || t`Close`}
      >
        <CloseIcon />
      </Link>
    );
  }
}

const StyledCloseLink = styled(CloseLink)`
  display: inline-block;
  position: sticky;
  float: right;
  padding: 16px;
  font-size: 30px;
  color: rgba(0, 0, 0, 0.3);
  background-color: rgba(251, 250, 249, 0.8);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 31px;
  text-decoration: none;
  text-align: center;
  z-index: 1;
  transform: translateZ(0);

  > svg {
    display: block;
  }
`;

export default StyledCloseLink;
