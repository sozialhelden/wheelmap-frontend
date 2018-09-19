// @flow

// babel-preset-react-app uses useBuiltIn "entry". We therefore need an entry
// polyfill import to be replaced with polyfills we need for our targeted browsers.
import '@babel/polyfill';

import React from 'react';
import BaseApp, { Container } from 'next/app';
import Router from 'next/router';
import Error from 'next/error';
import UAParser from 'ua-parser-js';

import GlobalStyle from '../GlobalStyle';
import LeafletStyle from '../LeafletStyle';
import AppStyle from '../AppStyle';
import MapStyle from '../MapStyle';
import {
  currentLocales,
  expandedPreferredLocales,
  loadExistingLocalizationByPreference,
  parseAcceptLanguageString,
  type Translations,
} from '../lib/i18n';
import Categories, { type CategoryLookupTables } from '../lib/Categories';
import { type UAResult } from '../lib/userAgent';
import router from '../router';

let clientCachedCategories: ?CategoryLookupTables = null;
let clientCachedTranslations: ?(Translations[]) = null;

export default class App extends BaseApp {
  static async getInitialProps({ Component: PageComponent, ctx }) {
    let props = {};
    let categories: CategoryLookupTables, userAgent: UAResult, translations: Translations[];

    const isServer = !!(ctx && ctx.req);

    // handle 404 before the app is rendered, as we otherwise render the whole app again
    // this is very relevant for missing static files like translations
    if (isServer && ctx.res.statusCode === 404) {
      const error = new Error('Could not load');
      error.statusCode = 404;
      return { error };
    }

    // pass on errors
    if (ctx.err) {
      return { error: ctx.err };
    }

    try {
      // user agent
      const userAgentString = isServer ? ctx.req.headers['user-agent'] : undefined;
      const userAgentParser = new UAParser(userAgentString);
      userAgent = userAgentParser.getResult();

      // translations
      let locales = currentLocales;
      if (clientCachedTranslations) {
        translations = clientCachedTranslations;
      } else {
        let languages = ['en'];
        if (ctx.req) {
          if (ctx.req.headers['accept-language']) {
            languages = parseAcceptLanguageString(ctx.req.headers['accept-language']);
          }
        } else {
          languages = window.navigator.languages;
        }

        locales = expandedPreferredLocales(languages);
        translations = await loadExistingLocalizationByPreference(locales);
      }

      // categories
      if (clientCachedCategories) {
        categories = clientCachedCategories;
      } else {
        categories = await Categories.generateLookupTables({
          locale: locales[0],
        });
      }

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

    return { ...props, translations, categories, userAgent, isServer };
  }

  pushRoute(name: string, params: { [name: string]: any } = {}) {
    const route = router.getRoute(name, true);
    const path = router.generate(name, params);

    if (!route.nextPage) {
      throw new Error('Route is missing next page.');
    }

    Router.push({ pathname: route.nextPage, query: params }, path);
  }

  render() {
    const { Component: PageComponent, error, ...props } = this.props;

    if (error && error.statusCode !== 404) {
      console.error(error);
    }

    // cache categories & locales & translations on the client
    if (!props.isServer) {
      clientCachedCategories = props.categories;
      clientCachedTranslations = props.translations;
    }


    return (
      <Container>
        {error ? (
          <div>
            {error.message}
            <Error statusCode={error.statusCode} />
          </div>
        ) : (
          <PageComponent pushRoute={this.pushRoute} {...props} />
        )}
        <GlobalStyle />
        <LeafletStyle />
        <AppStyle />
        <MapStyle />
      </Container>
    );
  }
}
