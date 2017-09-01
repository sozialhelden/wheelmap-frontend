// @flow

import React from 'react';
import styled from 'styled-components';


type Props = {
  showSpinner: boolean;
  onChange: ?((event: UIEvent) => void),
  onBlur: ?((event: UIEvent) => void),
  onFocus: ?((event: UIEvent) => void),
  ref: ((input: HTMLInputElement) => void),
};

const SearchInputField = (props: Props) =>
  <input
    ref={props.ref}
    onChange={props.onChange}
    onFocus={props.onFocus}
    onBlur={props.onBlur}
    className={`search-input ${props.showSpinner ? 'search-input-spinner' : ''} ${props.className}`}
    placeholder="Search place or address"
  />;


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
  }

  &.search-input-spinner:after {
    content: 'Loading…';
  }
`;

export default StyledSearchInputField;
