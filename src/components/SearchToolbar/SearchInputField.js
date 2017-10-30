// @flow

import * as React from 'react';
import styled from 'styled-components';
import { interpolateLab } from 'd3-interpolate';
import colors from '../../lib/colors';
import { t } from '../../lib/i18n';




type Props = {
  onChange: ?((event: UIEvent) => void),
  onBlur: ?((event: UIEvent) => void),
  onFocus: ?((event: UIEvent) => void),
  onClick: ?((event: UIEvent) => void),
  ref: ((input: HTMLInputElement) => void),
  searchQuery: ?string,
  className: string,
  placeholder: ?string,
  disabled: ?boolean,
  hidden: boolean,
  ariaRole: string,
};

class SearchInputField extends React.Component<Props> {
  focus() {
    this.input.focus();
  }

  blur() {
    this.input.blur();
  }

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
    const defaultPlaceholder = t`Search place or address`;
    const value = placeholder || searchQuery || '';

    return (<input
      ref={input => this.input = input}
      value={value}
      onChange={onChange}
      disabled={disabled}
      tabIndex={hidden ? -1 : 0}
      onFocus={onFocus}
      onBlur={onBlur}
      onClick={onClick}
      className={`search-input ${className}`}
      placeholder={value === '' ? defaultPlaceholder : null}
      aria-label={defaultPlaceholder}
      role={ariaRole}
      />);
  }
}

const StyledSearchInputField = styled(SearchInputField)`
  display: block;
  width: 100%;
  box-sizing: border-box;
  font-size: 1em;
  line-height: 2em;
  padding: 0 0 0 1.8em;
  border: none;
  background-color: #ddd;
  border-radius: 0.3em;
  margin: 0 0 0.5em 0;

  transition: width 0.3s ease-out, height 0.3s ease-out;

  &:focus, &.focus-ring {
    outline: none;
    box-shadow: none;
    background-color: ${interpolateLab('#eee', colors.linkColor)(0.1)};
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
