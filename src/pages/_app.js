// @flow

// babel-preset-react-app uses useBuiltIn "entry". We therefore need an entry
// polyfill import to be replaced with polyfills we need for our targeted browsers.
import '@babel/polyfill';

import React from 'react';
import BaseApp, { Container } from 'next/app';

import GlobalStyle from '../GlobalStyle';
import LeafletStyle from '../LeafletStyle';
import AppStyle from '../AppStyle';
import MapStyle from '../MapStyle';
import {
  loadExistingLocalizationByPreference,
  expandedPreferredLocales,
  parseAcceptLanguageString,
} from '../lib/i18n';

export default class App extends BaseApp {
  static async getInitialProps({ req, ctx }) {
    let languages;

    if (ctx.req) {
      if (ctx.req.headers['accept-language']) {
        languages = parseAcceptLanguageString(ctx.req.headers['accept-language']);
      }
    } else {
      languages = window.navigator.languages;
    }

    if (languages) {
      const locals = expandedPreferredLocales(languages);

      await loadExistingLocalizationByPreference(locals);
    }

    return {};
  }

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
