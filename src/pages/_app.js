// @flow

// babel-preset-react-app uses useBuiltIn "entry". We therefore need an entry
// polyfill import to be replaced with polyfills we need for our targeted browsers.
import '@babel/polyfill';

import React from 'react';
import BaseApp, { Container } from 'next/app';
import Error from 'next/error';
import UAParser from 'ua-parser-js';

import GlobalStyle from '../GlobalStyle';
import LeafletStyle from '../LeafletStyle';
import AppStyle from '../AppStyle';
import MapStyle from '../MapStyle';
import {
  loadExistingLocalizationByPreference,
  expandedPreferredLocales,
  parseAcceptLanguageString,
} from '../lib/i18n';
import Categories from '../lib/Categories';
import config from '../lib/config';

export default class App extends BaseApp {
  static async getInitialProps({ Component: PageComponent, ctx }) {
    let props = {};
    let categories;
    let locales;
    let userAgent;

    try {
      let languages;
      let userAgentString;

      if (ctx.req) {
        if (ctx.req.headers['accept-language']) {
          languages = parseAcceptLanguageString(ctx.req.headers['accept-language']);
        }

        userAgentString = ctx.req.headers['user-agent'];
      } else {
        languages = window.navigator.languages;
      }

      const userAgentParser = new UAParser(userAgentString);
      userAgent = userAgentParser.getResult();

      if (!languages || languages.length === 0) {
        return { error: new Error('Missing languages.') };
      }

      // @TODO Pass locales into application (controlled)
      locales = expandedPreferredLocales(languages);
      await loadExistingLocalizationByPreference(locales);

      categories = await Categories.fetchOnce({
        ...config,
        locale: locales[0],
      });

      // Fetch child component props and fetch errors if anything happens.
      if (PageComponent.getInitialProps) {
        props = await PageComponent.getInitialProps(ctx);
      }
    } catch (error) {
      if (ctx.res) {
        ctx.res.statusCode = error.statusCode || 500;
      }

      props.error = error;
    }

    return { ...props, locales, categories, userAgent };
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
