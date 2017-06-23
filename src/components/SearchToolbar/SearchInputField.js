import React from 'react';
import styled from 'styled-components';
// import colors from '../../lib/colors';


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
  margin-bottom: 0.5em;

  background-position: 0.5em 0.5em;
  background-image: url(/icons/actions/search.svg);
  background-repeat: no-repeat;

  &:focus {
    outline: none;
  }

`;

const SearchInputField = () =>
  <StyledInput className="search-input" placeholder="Search for a place / address" />;

export default SearchInputField;
