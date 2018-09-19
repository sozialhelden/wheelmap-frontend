// @flow
import * as React from 'react';
import styled from 'styled-components';
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
  button: ?HTMLButtonElement;

  focus() {
    if (!this.button) {
      return;
    }

    this.button.focus();
  }

  render() {
    return (
      <button
        ref={button => (this.button = button)}
        className={`close-link ${this.props.className || ''}`}
        onBlur={this.props.onBlur}
        onFocus={this.props.onFocus}
        onClick={this.props.onClick}
        onKeyDown={this.props.onKeyDown}
        aria-label={this.props.ariaLabel || t`Close`}
      >
        <CloseIcon />
      </button>
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
  border: 0;
  cursor: pointer;

  > svg {
    display: block;
  }
`;

export default StyledCloseLink;
