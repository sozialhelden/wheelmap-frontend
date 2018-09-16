// @flow

import * as React from 'react';
import styled from 'styled-components';
import { interpolateLab } from 'd3-interpolate';
import colors from '../../lib/colors';
import { t } from 'ttag';

type Props = {
  onSubmit: ?(event: UIEvent) => void,
  onChange: ?(event: UIEvent) => void,
  onBlur: ?(event: UIEvent) => void,
  onFocus: ?(event: UIEvent) => void,
  onClick: ?(event: UIEvent) => void,
  ref: (input: HTMLInputElement) => void,
  searchQuery: ?string,
  className: string,
  placeholder: ?string,
  disabled: ?boolean,
  hidden: boolean,
  ariaRole: string,
};

class SearchInputField extends React.Component<Props> {
  input: ?HTMLInputElement;

  focus() {
    if (!this.input) return;
    this.input.focus();
  }

  blur() {
    if (!this.input) return;
    this.input.blur();
  }

  keyPressed = (event: UIEvent) => {
    if (event.which === 13 && this.props.onSubmit) {
      this.props.onSubmit(event);
      event.preventDefault();
    }
  };

  render() {
    const {
      searchQuery,
      onChange,
      disabled,
      hidden,
      onFocus,
      onBlur,
      onClick,
      className,
      placeholder,
      ariaRole,
    } = this.props;
    // translator: Placeholder for search input field
    const defaultPlaceholder = t`Search for place or address`;
    const value = placeholder || searchQuery || '';

    return (
      <input
        ref={input => (this.input = input)}
        value={value}
        name="search"
        onChange={onChange}
        disabled={disabled}
        tabIndex={hidden ? -1 : 0}
        onFocus={onFocus}
        onBlur={onBlur}
        onClick={onClick}
        onKeyPress={this.keyPressed}
        className={`search-input ${className}`}
        placeholder={!value ? defaultPlaceholder : null}
        aria-label={defaultPlaceholder}
        role={ariaRole}
        autoComplete="off"
      />
    );
  }
}

const StyledSearchInputField = styled(SearchInputField)`
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

export default StyledSearchInputField;
