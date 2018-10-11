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
import GoogleAnalytics from '../components/GoogleAnalytics';
import TwitterMeta from '../components/TwitterMeta';
import FacebookMeta from '../components/FacebookMeta';
import OpenGraph from '../components/OpenGraph';
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
      return { statusCode: ctx.res.statusCode };
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
        throw new Error('User agent must be defined');
      }

      if (!languages || languages.length === 0) {
        throw new Error('Missing languages.');
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
      console.log(error);

      const statusCode = error.statusCode || 500;

      if (ctx.res) {
        ctx.res.statusCode = statusCode;
      }

      return { statusCode };
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
    const {
      Component: PageComponent,
      statusCode,
      routeName,
      path,
      hostName,
      ...props
    } = this.props;
    const { clientSideConfiguration }: { clientSideConfiguration: ClientSideConfiguration } = props;

    // Show generic error page for now and show as soon as possible
    // as props like client side configuration are not set then.
    if (statusCode >= 400) {
      return (
        <Container>
          <Error statusCode={statusCode} />
        </Container>
      );
    }

    if (!isServer) {
      clientStoreAppInitialProps(props);

      if (routeName) {
        clientStoreInitialProps(routeName, props);
      }
    }

    const {
      name: productName,
      description,
      twitter,
      googleAnalytics,
      facebook,
    } = clientSideConfiguration.textContent.product;

    // TODO this like bad configuration
    const shareHost = `https://${hostName}/`;

    return (
      <Container>
        <React.Fragment>
          <Head>
            {/* Alternates */}
            {generateLocaleLinks(path || (window && window.location.pathname), locales)}

            {/* Relations */}
            <link href={`${router.generate('search')}`} rel="search" title={t`Search`} />
            <link href={`${router.generate('map')}`} rel="home" title={t`Homepage`} />

            {/* Misc */}
            <meta content={description} name="description" key="description" />
            <link rel="shortcut icon" href={`/favicon.ico`} />

            {/* iOS app */}
            {productName === 'Wheelmap' && (
              <meta content="app-id=399239476" name="apple-itunes-app" />
            )}
          </Head>
          <OpenGraph shareHost={shareHost} clientSideConfiguration={clientSideConfiguration} />
          {googleAnalytics && <GoogleAnalytics googleAnalytics={googleAnalytics} />}
          {twitter && (
            <TwitterMeta
              shareHost={shareHost}
              productName={productName}
              description={description}
              twitter={twitter}
            />
          )}
          {facebook && <FacebookMeta facebook={facebook} />}
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
    <link key={locale} href={`${path}?locale=${locale}`} hrefLang={locale} rel="alternate" />
  ));
}
