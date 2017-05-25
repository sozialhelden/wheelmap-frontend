import React from 'react';
import styled from 'styled-components';

const StyledInput = styled.input`
  height: 30px;
  width: 200px;
  box-sizing: border-box;
  padding: 10px 10px;
  margin-left: 10px;

  font-size: 18px;
  border: none;
  border-left: 2px solid #aaa;
`;

export const SearchInput = () =>
  <StyledInput className="search-input" placeholder="🔍 Search Wheelmap"></StyledInput>;
