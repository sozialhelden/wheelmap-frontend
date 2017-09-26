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
  ref: ((input: HTMLInputElement) => void),
  searchQuery: ?string,
  className: string,
  placeholder: ?string,
  disabled: ?boolean,
};


function hasBigViewport() {
  return window.innerHeight > 512 && window.innerWidth > 512;
}


const SearchInputField = (props: Props) => {
  // translator: Placeholder for search input field
  const defaultPlaceholder = t`Search place or address`;

  return (<input
    ref={props.ref}
    value={props.searchQuery ? props.searchQuery : ''}
    autoFocus={hasBigViewport()}
    onChange={props.onChange}
    disabled={props.disabled}
    onFocus={props.onFocus}
    onBlur={props.onBlur}
    className={`search-input ${props.className}`}
    placeholder={props.placeholder ? props.placeholder : defaultPlaceholder}
  />);
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

  &:focus {
    outline: none;
    background-color: ${interpolateLab('#eee', colors.linkColor)(0.1)};
  }
`;

export default StyledSearchInputField;
