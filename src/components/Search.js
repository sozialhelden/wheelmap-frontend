import React, { Component } from 'react';
import styled from 'styled-components';

export SearchInput = styled.input`
  position: absolute;
  z-index: 1000;
  top: 0px;
  left: 0px;

  height: 50px;
  width: 100%;
  box-sizing: border-box;
  padding: 10px 20px;

  font-size: 18px;
  background-color: #f2f2f2;
  background: -webkit-linear-gradient(top, #f2f2f2 0%,#ededed 100%);
`;
