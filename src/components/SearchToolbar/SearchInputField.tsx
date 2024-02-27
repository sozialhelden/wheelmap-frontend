import * as React from 'react';
import { useCallback, useState, KeyboardEvent, forwardRef } from 'react';
import styled from 'styled-components';
import { interpolateLab } from 'd3-interpolate';
import colors from '../../lib/colors';
import { t } from 'ttag';
import _ from 'lodash';

// (ms)
const DEBOUNCE_THRESHOLD = 500;

type SearchInputFieldProps = {
  onSubmit: (event: React.FormEvent<HTMLInputElement>) => void | null;
  onChange: (value: string) => void;
  onBlur: () => void | null;
  onFocus: (event: React.FocusEvent<HTMLInputElement>) => void | null;
  onClick: (event: React.MouseEvent<HTMLInputElement>) => void | null;
  searchQuery: string | null;
  hidden: boolean;
  ariaRole: string;
  disabled?: boolean | null;
  className?: string;
};

const SearchInputField = forwardRef(
  (
    {
      searchQuery,
      className,
      disabled,
      hidden,
      ariaRole,
      onSubmit,
      onChange,
      onBlur,
      onFocus,
      onClick,
    }: SearchInputFieldProps,
    ref: { current: null | HTMLInputElement }
  ): JSX.Element => {
    // translator: Placeholder for search input field
    const defaultPlaceholder = t`Search for place or address`;
    const [currentSearchQuery, setCurrentSearchQuery] = useState(searchQuery || '');

    const onKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
      /* Enter */
      if (event.key === '13' && onSubmit && typeof onSubmit === 'function') {
        event.preventDefault();
        onSubmit(event);
      }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debouncedInternalOnChange = useCallback(
      _.debounce(searchTerm => {
        onChange(searchTerm);
      }, DEBOUNCE_THRESHOLD),
      [onChange]
    );

    const updateSearchQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
      const searchTerm = event.target.value;
      setCurrentSearchQuery(searchTerm);
      debouncedInternalOnChange(searchTerm);
    };

    return (
      <StyledSearchInputField
        ref={ref}
        value={currentSearchQuery}
        name="search"
        onChange={updateSearchQuery}
        disabled={disabled}
        tabIndex={hidden ? -1 : 0}
        onFocus={onFocus}
        onBlur={onBlur}
        onClick={onClick}
        onKeyPress={onKeyPress}
        className={`search-input ${className || ''}`}
        placeholder={defaultPlaceholder}
        aria-label={defaultPlaceholder}
        role={ariaRole}
        autoComplete="off"
      />
    );
  }
);

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

export default SearchInputField;
