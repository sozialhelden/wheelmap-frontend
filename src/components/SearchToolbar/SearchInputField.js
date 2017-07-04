// @flow

import React from 'react';
import styled from 'styled-components';


const StyledInput = styled.input`
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

  background-position: 0.5em 0.5em;
  background-image: url(/icons/actions/search.svg);
  background-repeat: no-repeat;

  &:focus {
    outline: none;
  }

  &.search-input-spinner:after {
    content: 'Loading…';
  }
`;

type Props = {
  showSpinner: boolean;
  onChange: ?((event: UIEvent) => void),
};

const SearchInputField = (props: Props) =>
  <StyledInput
    onChange={props.onChange}
    className={`search-input ${props.showSpinner ? 'search-input-spinner' : ''}`}
    placeholder="Search for a place / address"
  />;

export default SearchInputField;
