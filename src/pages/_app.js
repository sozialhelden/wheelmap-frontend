import React from 'react';
import BaseApp, { Container } from 'next/app';

import GlobalStyle from '../GlobalStyle';
import LeafletStyle from '../LeafletStyle';
import AppStyle from '../AppStyle';
import MapStyle from '../MapStyle';

export default class App extends BaseApp {
  render() {
    const { Component } = this.props;

    return (
      <Container>
        <Component />
        <GlobalStyle />
        <LeafletStyle />
        <AppStyle />
        <MapStyle />
      </Container>
    );
  }
}
