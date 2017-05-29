import styled from 'styled-components';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

const FooterLink = styled(Link)`
  display: block;
  font-size: 16px;
  color: #1fabd9;
  padding: 10px;
  text-decoration: none;
  border-radius: 4px;

  &:hover {
    background-color: #f2f2f2;
  }
`;

const ShareLink = (node) => (
  <FooterLink to="/" >
    Share
  </FooterLink>
);

const ReportProblemLink = (node) => (
  <FooterLink to="/" >
    Report Problem
  </FooterLink>
);

const FooterLinkSmall = styled(Link)`
  display: block;
  margin-bottom: 10px;
  color: #1fabd9;
  font-size: 14px;
  text-decoration: none;
  padding-left: 10px;

  &:hover {
    text-decoration: underline;
  }
`;

const StyledFooter = styled.footer`
    border-top: 1px solid #ccc;
    padding-top: 10px;
`;

export default class NodeFooter extends Component {
  render() {
    return (
      <StyledFooter>
        <FooterLinkSmall to={`/de/nodes/${this.node_id}`}>
          Details
        </FooterLinkSmall>
        <FooterLinkSmall to={`/de/nodes/${this.node_id}/edit`}>
          Edit
        </FooterLinkSmall>

        <ShareLink node={this.props.node} />
        <ReportProblemLink node={this.props.node} />
      </StyledFooter>
    );
  }
}
