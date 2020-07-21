// @flow

import * as React from 'react';
import styled from 'styled-components';
import { interpolateLab } from 'd3-interpolate';
import colors from '../../lib/colors';
import { t } from 'ttag';

type Props = {
  onSubmit: ?(event: SyntheticEvent<HTMLInputElement>) => void,
  onChange: (value: string) => void,
  onBlur: ?(event: SyntheticEvent<>) => void,
  onFocus: ?(event: SyntheticEvent<>) => void,
  onClick: ?(event: SyntheticEvent<>) => void,
  ref: (input: HTMLInputElement) => void,
  searchQuery: ?string,
  className?: string,
  disabled: ?boolean,
  hidden: boolean,
  ariaRole: string,
};

type State = {
  value: string,
};

const StyledSearchInputField = styled.input`
  display: block;
  flex: 1;
  box-sizing: border-box;
  font-size: 1em;
  padding: 0px 0 0 2.5em;
  border: none;
  border-radius: 0;
  background-color: transparent;
  margin: 0;

  ${props => (props.disabled ? 'cursor: pointer;' : '')}

  transition: width 0.3s ease-out, height 0.3s ease-out;

  &:focus, &.focus-visible {
    outline: none;
    box-shadow: none;
    /* background-color: ${interpolateLab('#eee', colors.linkColor)(0.1)}; */
  }

  &::-webkit-input-placeholder,
  &::-moz-placeholder,
  &:-moz-placeholder,
  &::-ms-input-placeholder,
  &:-ms-input-placeholder {
    color: #333;
    opacity: 1;
  }

  &:disabled {
    opacity: 1;
  }
`;

export default class SearchInputField extends React.Component<Props, State> {
  input: ?HTMLInputElement;

  constructor(props) {
    super(props);

    this.state = {
      value: props.searchQuery || '',
    };
  }

  focus() {
    if (!this.input) return;
    this.input.focus();
  }

  blur() {
    if (!this.input) return;
    this.input.blur();
  }

  keyPressed = (event: SyntheticKeyboardEvent<HTMLInputElement>) => {
    if (event.which === 13 && this.props.onSubmit) {
      this.props.onSubmit(event);
      event.preventDefault();
    }
  };

  onChange = event => {
    const value = event.target.value;
    this.setState({ value });
    this.props.onChange(value);
  };

  render() {
    const { disabled, hidden, onFocus, onBlur, onClick, className, ariaRole } = this.props;
    const { value } = this.state;
    // translator: Placeholder for search input field
    const defaultPlaceholder = t`Search for place or address`;

    return (
      <StyledSearchInputField
        ref={input => (this.input = input)}
        value={value}
        name="search"
        onChange={this.onChange}
        disabled={disabled}
        tabIndex={hidden ? -1 : 0}
        onFocus={onFocus}
        onBlur={onBlur}
        onClick={onClick}
        onKeyPress={this.keyPressed}
        className={`search-input ${className || ''}`}
        placeholder={defaultPlaceholder}
        aria-label={defaultPlaceholder}
        role={ariaRole}
        autoComplete="off"
      />
    );
  }
}
