import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const StyledNavLink = styled(Link)`
  padding: 5px;
  text-decoration: none;
  color: #2d2d2d;

  &:hover {
    text-decoration: underline;
  }
`;

export const Linkbar = () => (
  <nav className="linkbar">
    <StyledNavLink to="/">Wheelmap</StyledNavLink>
    <StyledNavLink to="/about">About</StyledNavLink>
    <StyledNavLink to="/topics">Topics</StyledNavLink>
  </nav>
);
