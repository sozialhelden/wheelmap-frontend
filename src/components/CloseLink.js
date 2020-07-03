// @flow
import * as React from 'react';
import styled from 'styled-components';
import CloseIcon from './icons/actions/Close';
import { t } from 'ttag';
import colors from '../lib/colors';

type Props = {
  className?: string,
  ariaLabel?: string,
  onClick: (event: SyntheticMouseEvent<HTMLButtonElement>) => void,
  onFocus?: (event: SyntheticEvent<>) => void,
  onBlur?: (event: SyntheticEvent<>) => void,
  onKeyDown?: (event: SyntheticKeyboardEvent<>) => void,
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
  @media (hover), (-moz-touch-enabled: 0) {
    &:hover {
      background-color: ${colors.negativeBackgroundColorTransparent};
    }
  }
  > svg {
    display: block;
  }
`;

export default StyledCloseLink;
