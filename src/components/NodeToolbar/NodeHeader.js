// @flow

import styled from 'styled-components';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

type Props = {
  className: string,
};

const NodePath = (props: Props) => (
  <p className={props.className}>
    <span className="city">Berlin </span>
    &gt;
    <span className="category"> Essen </span>
    &gt;
    <span className="subcategory"> Bar</span>
  </p>
);

const StyledNodeHeader = styled.header`
  border-bottom: 1px solid #ccc;
  color: rgba(0, 0, 0, 0.8);
`;

const StyledNodePath = styled(NodePath)`
  font-size: 14px;
  color: rgba(0, 0, 0, 0.6);
  display: inline-block;
`;

const Close = styled(Link)`
  color: rgba(0, 0, 0, 0.3);
  font-size: 36px;
  text-decoration: none;
  position: absolute;
  top: -13px;
  left: 246px;
`;

const LocationName = styled.h1`
  font-size: 20px;
  line-height: 0.5;
  margin: 0px;
`;
const Address = styled.p``;
const Source = styled.p`
  font-size: 14px;
  color: rgba(0, 0, 0, 0.6);
`;
const SourceName = styled(Link)`
  color: rgba(0, 0, 0, 0.6);
`;

export default class NodeHeader extends Component {
  render() {
    return (
      <StyledNodeHeader>
        <StyledNodePath />
        <Close to="/">&#10799;</Close>
        <LocationName>Chaostheorie</LocationName>
        <Address>Schliemannstraße 123 <br /> 10437 Berlin</Address>
        <Source> Source: <SourceName to="supersource.org">Supersource</SourceName></Source>
      </StyledNodeHeader>
    );
  }
}
