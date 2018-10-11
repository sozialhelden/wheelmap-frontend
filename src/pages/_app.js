// @flow

// babel-preset-react-app uses useBuiltIn "entry". We therefore need an entry
// polyfill import to be replaced with polyfills we need for our targeted browsers.
import '@babel/polyfill';

import React from 'react';
import BaseApp, { Container } from 'next/app';
import Error from 'next/error';
import Head from 'next/head';
import { t } from 'ttag';

import GlobalStyle from '../GlobalStyle';
import LeafletStyle from '../LeafletStyle';
import AppStyle from '../AppStyle';
import MapStyle from '../MapStyle';
import AsyncNextHead from '../AsyncNextHead';
import { parseAcceptLanguageString, locales } from '../lib/i18n';
import router from '../app/router';
import {
  getInitialProps,
  getAppInitialProps,
  getRenderProps,
  clientStoreAppInitialProps,
  clientStoreInitialProps,
  getHead,
} from '../app/getInitialProps';
import NextRouterHistory from '../lib/NextRouteHistory';
import { type ClientSideConfiguration } from '../lib/ClientSideConfiguration';

let isServer = false;

export default class App extends BaseApp {
  static async getInitialProps({
    Component: PageComponent,
    ctx,
  }: {
    Component: React.Component<>,
    ctx: any,
  }) {
    let appProps;
    let routeProps;
    let path;

    isServer = !!(ctx && ctx.req);

    // handle 404 before the app is rendered, as we otherwise render the whole app again
    // this is very relevant for missing static files like translations
    if (isServer && ctx.res.statusCode >= 400) {
      const error = new Error('Could not load');
      error.statusCode = ctx.res.statusCode;
      return { error };
    }

    try {
      const userAgentString = isServer ? ctx.req.headers['user-agent'] : window.navigator.userAgent;

      const hostName: string = isServer
        ? ctx.req.headers.host.replace(/:.*$/, '')
        : window.location.hostname;

      // translations
      let languages = ['en'];

      if (ctx.req) {
        if (ctx.req.headers['accept-language']) {
          languages = parseAcceptLanguageString(ctx.req.headers['accept-language']);
        }
      } else {
        languages = [window.navigator.language]
          .concat(window.navigator.languages || [])
          .filter(Boolean);
      }

      if (!userAgentString) {
        return { error: new Error('User agent must be defined') };
      }

      if (!languages || languages.length === 0) {
        return { error: new Error('Missing languages.') };
      }

      appProps = await getAppInitialProps(
        { userAgentString, hostName, languages, ...ctx.query },
        isServer
      );

      if (ctx.query.routeName) {
        routeProps = await getInitialProps(ctx.query, isServer);
      }

      if (ctx.req) {
        path = ctx.req.path;
      }
    } catch (error) {
      console.error(error);

      if (ctx.res) {
        ctx.res.statusCode = error.statusCode || 500;
      }

      return { error };
    }

    return {
      ...appProps,
      ...routeProps,
      routeName: ctx.query.routeName,
      path,
    };
  }

  constructor(props: any) {
    super(props);

    this.routerHistory = new NextRouterHistory(router);
  }

  render() {
    const { Component: PageComponent, error, routeName, path, hostName, ...props } = this.props;
    const { clientSideConfiguration }: { clientSideConfiguration: ClientSideConfiguration } = props;

    if (error && error.statusCode !== 404) {
      console.error('Error in _app.js', error);
    }

    if (!isServer) {
      clientStoreAppInitialProps(props);

      if (routeName) {
        clientStoreInitialProps(routeName, props);
      }
    }

    const { name: productName, description } = clientSideConfiguration.textContent.product;
    const shareHost = `https://${hostName}/`;

    return (
      <Container>
        {error ? (
          <div>
            {error.message}
            <Error statusCode={error.statusCode} />
          </div>
        ) : (
          <React.Fragment>
            <Head>
              {/* Open Graph defaults (keys are used to overwrite in subpages if needed) */}
              <meta content={productName} property="og:site_name" key="og:site_name" />
              <meta content={description} property="og:description" key="og:description" />
              <meta content="website" property="og:type" key="og:type" />
              <meta content={productName} property="og:title" key="og:title" />
              <meta
                content={`${shareHost}/static/images/wheely_big.jpg`}
                property="og:image"
                key="og:image"
              />

              {/* Alternates */}
              {generateLocaleLinks(path || (window && window.location.pathname), locales)}

              {/* Twitter */}
              <meta content="summary" name="twitter:card" key="twitter:card" />
              <meta content={shareHost} name="twitter:domain" key="twitter:domain" />
              <meta content="@wheelmap" name="twitter:site" key="twitter:site" />
              <meta content="@wheelmap" name="twitter:creator" key="twitter:creator" />
              <meta content={description} name="twitter:description" key="twitter:description" />
              <meta content={productName} property="twitter:title" key="twitter:title" />
              <meta
                content={`${shareHost}/static/images/wheely_big.jpg`}
                property="twitter:image"
                key="twitter:image"
              />

              {/* Relations */}
              <link href={`${router.generate('search')}`} rel="search" title={t`Search`} />
              <link href={`${router.generate('map')}`} rel="home" title={t`Homepage`} />

              {/* Misc */}
              <meta content={description} name="description" key="description" />
              <link rel="shortcut icon" href={`/favicon.ico`} />
            </Head>
            {routeName != null && <AsyncNextHead head={getHead(routeName, props)} />}
            <PageComponent
              routerHistory={this.routerHistory}
              {...getRenderProps(routeName, props, isServer)}
              routeName={routeName}
            />
          </React.Fragment>
        )}
        <GlobalStyle />
        <LeafletStyle />
        <AppStyle />
        <MapStyle />
      </Container>
    );
  }
}

function generateLocaleLinks(path, locales) {
  if (path == null) {
    return null;
  }

  return locales.map(locale => (
    <link key={locale} href={`${path}?locale=${locale}`} hreflang={locale} rel="alternate" />
  ));
}
