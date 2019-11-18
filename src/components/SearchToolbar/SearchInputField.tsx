import * as React from 'react';
import styled from 'styled-components';
import { interpolateLab } from 'd3-interpolate';
import colors from '../../lib/colors';
import { t } from 'ttag';

type Props = {
  onSubmit: (event: React.FormEvent<HTMLInputElement>) => void | null,
  onChange: (value: string) => void,
  onBlur: () => void | null,
  onFocus: (event: React.FocusEvent<HTMLInputElement>) => void | null,
  onClick: (event: React.MouseEvent<HTMLInputElement>) => void | null,
  ref: (input: HTMLInputElement) => void | null,
  searchQuery: string | null,
  className?: string,
  disabled?: boolean | null,
  hidden: boolean,
  ariaRole: string,
};

type State = {
  value: string,
};

export class SearchInputField extends React.Component<Props, State> {
  input = React.createRef<HTMLInputElement>();

  constructor(props) {
    super(props);

    this.state = {
      value: props.searchQuery || '',
    };
  }

  focus() {
    if (this.input.current) {
      this.input.current.focus();
    }
  }

  blur() {
    if (this.input.current) {
      this.input.current.blur();
    }
  }

  keyPressed = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.which === 13 && this.props.onSubmit) {
      this.props.onSubmit(event);
      event.preventDefault();
    }
  };

  onChange = (event: any) => {
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
      <input
        ref={this.input}
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
