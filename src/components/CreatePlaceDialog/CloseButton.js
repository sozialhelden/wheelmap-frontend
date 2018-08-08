// @flow

import { t } from 'c-3po';
import * as React from 'react';
import styled from 'styled-components';
import CloseIcon from '../icons/actions/Close';

type Props = {
  className: string;
  ariaLabel: ?string;
  onClick: () => void;
  onFocus: () => void;
  onBlur: () => void;
};

class CloseButton extends React.Component<Props> {
  onClick = event => {
    if (this.props.onClick) {
      this.props.onClick();
      return;
    }
    event.preventDefault();
  };

  render() {
    return <button className={`close-link ${this.props.className || ''}`} onBlur={this.props.onBlur} onFocus={this.props.onFocus} onClick={this.onClick} aria-label={this.props.ariaLabel || t`Schließen`}>
      <CloseIcon />
    </button>;
  }
}

const StyledCloseButton = styled(CloseButton)`
  display: inline-block;
  padding: 16px;
  font-size: 30px;
  color: rgba(0, 0, 0, 0.3);
  background-color: rgba(251, 250, 249, 0.8);
  -webkit-backdrop-filter: blur(10px);
  border: none;
  border-radius: 31px;
  text-decoration: none;
  text-align: center;
  z-index: 1;
  transform: translateZ(0);
  cursor: pointer;

  > svg {
    display: block;
  }
`;

export default StyledCloseButton;