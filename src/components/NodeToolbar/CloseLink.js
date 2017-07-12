// @flow
import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const CloseLink = (props: { className: string }) => (<Link to="/" className={props.className}>
  <svg width="17px" height="17px" viewBox="0 0 17 17" version="1.1">
    <polygon id="×" fill="#000000" opacity="0.6" points="15.2311234 17 8.51565378 10.174954 1.76887661 17 0 15.2467772 6.80939227 8.53130755 0 1.67495396 1.76887661 0 8.51565378 6.73112339 15.2311234 0 17 1.67495396 10.2375691 8.53130755 17 15.2467772" />
  </svg>
</Link>);

const StyledCloseLink = styled(CloseLink)`
  display: block;
  position: absolute;
  top: 9px;
  right: 0;
  padding: 14px;
  font-size: 30px;
  color: rgba(0, 0, 0, 0.3);
  text-decoration: none;
  text-align: center;
  z-index: 1;

  > svg {
    display: block;
  }
`;

export default StyledCloseLink;
