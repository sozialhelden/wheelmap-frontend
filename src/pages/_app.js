// @flow

// babel-preset-react-app uses useBuiltIn "entry". We therefore need an entry
// polyfill import to be replaced with polyfills we need for our targeted browsers.
import '@babel/polyfill';

import React from 'react';
import BaseApp, { Container } from 'next/app';
import Router from 'next/router';
import Error from 'next/error';
import { stringify } from 'query-string';

import GlobalStyle from '../GlobalStyle';
import LeafletStyle from '../LeafletStyle';
import AppStyle from '../AppStyle';
import MapStyle from '../MapStyle';
import { parseAcceptLanguageString } from '../lib/i18n';
import router from '../app/router';
import { getInitialProps, getAppInitialProps } from '../app/getInitialProps';
import { format } from 'url';

export default class App extends BaseApp {
  static async getInitialProps({ Component: PageComponent, ctx }) {
    let appProps;
    let routeProps;

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

      // translations
      let languages = ['en'];

      if (ctx.req) {
        if (ctx.req.headers['accept-language']) {
          languages = parseAcceptLanguageString(ctx.req.headers['accept-language']);
        }
      } else {
        languages = window.navigator.languages;
      }

      appProps = await getAppInitialProps({ userAgentString, languages }, isServer);

      if (ctx.query.routeName) {
        routeProps = await getInitialProps(ctx.query, isServer);
      }
    } catch (error) {
      console.log(error);

      if (ctx.res) {
        ctx.res.statusCode = error.statusCode || 500;
      }

      return { error };
    }

    return { ...appProps, ...routeProps };
  }

  pushRoute(name: string, params: { [name: string]: any } = {}) {
    const route = router.getRoute(name, true);
    const path = router.generate(name, params);

    Router.push({ pathname: '/index', query: { routeName: route.name, ...params } }, path);
  }

  render() {
    const { Component: PageComponent, error, ...props } = this.props;

    if (error && error.statusCode !== 404) {
      console.error(error);
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
