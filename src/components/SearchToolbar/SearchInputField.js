// @flow

import * as React from 'react';
import styled from 'styled-components';
import { interpolateLab } from 'd3-interpolate';
import debounce from 'lodash/debounce';
import { t } from 'ttag';

import colors from '../../lib/colors';

type Props = {
  onChange: (value: string, submit: boolean) => void,
  onBlur: ?(event: UIEvent) => void,
  onFocus: ?(event: UIEvent) => void,
  onClick: ?(event: UIEvent) => void,
  ref: (input: HTMLInputElement) => void,
  defaultValue: ?string,
  className: string,
  placeholder: ?string,
  disabled: ?boolean,
  hidden: boolean,
  ariaRole: string,
};

type State = {
  value: string,
};

class SearchInputField extends React.Component<Props, State> {
  input: ?HTMLInputElement;

  constructor(props) {
    super(props);

    this.state = {
      value: props.defaultValue,
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

  handleChange = (event: KeyboardEvent, submit = false) => {
    if (event.target instanceof HTMLInputElement) {
      const { value } = event.target;

      this.setState({ value });
      this.propagateChange(value, submit);
    }
  };

  propagateChange = debounce((value, submit = false) => {
    this.props.onChange(value, submit);
  }, 500);

  handleKeyPress = (event: KeyboardEvent) => {
    if (event.which === 13) {
      this.handleChange(event, true);
      event.preventDefault();
    }
  };

  render() {
    const {
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
    const value = placeholder || this.state.value;

    return (
      <input
        ref={input => (this.input = input)}
        value={value}
        name="search"
        onChange={this.handleChange}
        onKeyPress={this.handleKeyPress}
        disabled={disabled}
        tabIndex={hidden ? -1 : 0}
        onFocus={onFocus}
        onBlur={onBlur}
        onClick={onClick}
        className={`search-input ${className}`}
        placeholder={!value ? defaultPlaceholder : null}
        aria-label={defaultPlaceholder}
        role={ariaRole}
        autoComplete="off"
      />
    );
  }
}

export default styled(SearchInputField)`
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
