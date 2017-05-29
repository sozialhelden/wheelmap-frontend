import styled from 'styled-components';
import React, { Component } from 'react';


const StyledAccHeader = styled.header`
  height: 80px;
`;

export default class WheelmapAccessibilityHeader extends Component {
  render() {
    return (
      <StyledAccHeader>
      <p>
        (Accessibility Cloud Snippet)
      </p>
      </StyledAccHeader>
    );
  }
};
