// @flow

// babel-preset-react-app uses useBuiltIn "entry". We therefore need an entry
// polyfill import to be replaced with polyfills we need for our targeted browsers.
import '@babel/polyfill';

import React from 'react';
import BaseApp, { Container } from 'next/app';
import Error from 'next/error';

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
  static async getInitialProps({ Component: PageComponent, ctx }) {
    let languages;

    if (ctx.req) {
      if (ctx.req.headers['accept-language']) {
        languages = parseAcceptLanguageString(ctx.req.headers['accept-language']);
      }
    } else {
      languages = window.navigator.languages;
    }

    if (languages) {
      // @TODO Pass locales into application (controlled)
      const locales = expandedPreferredLocales(languages);

      await loadExistingLocalizationByPreference(locales);
    }

    let props = {};

    // Fetch child component props and fetch errors if anything happens.
    if (PageComponent.getInitialProps) {
      try {
        props = await PageComponent.getInitialProps(ctx);
      } catch (error) {
        if (ctx.res) {
          ctx.res.statusCode = error.statusCode || 500;
        }

        props.error = error;
      }
    }

    return props;
  }

  render() {
    const { Component: PageComponent, error, ...props } = this.props;

    return (
      <Container>
        {error ? <Error statusCode={error.statusCode} /> : <PageComponent {...props} />}
        <GlobalStyle />
        <LeafletStyle />
        <AppStyle />
        <MapStyle />
      </Container>
    );
  }
}
