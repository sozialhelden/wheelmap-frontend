// @flow

// babel-preset-react-app uses useBuiltIn "entry". We therefore need an entry
// polyfill import to be replaced with polyfills we need for our targeted browsers.
import '@babel/polyfill';

import React from 'react';
import BaseApp, { Container } from 'next/app';
import Head from 'next/head';
import Error from 'next/error';
import { t } from 'ttag';

import AsyncNextHead from '../AsyncNextHead';
import GoogleAnalytics from '../components/GoogleAnalytics';
import TwitterMeta from '../components/TwitterMeta';
import FacebookMeta from '../components/FacebookMeta';
import OpenGraph from '../components/OpenGraph';
import NotFound from '../components/NotFound/NotFound';
import { parseAcceptLanguageString, availableLocales } from '../lib/i18n';
import router from '../app/router';
import {
  getInitialProps,
  getAppInitialProps,
  getRenderProps,
  clientStoreAppInitialProps,
  clientStoreInitialProps,
  getHead,
  type AppProps,
} from '../app/getInitialProps';
import NextRouterHistory from '../lib/NextRouteHistory';
import { applyTranslations } from '../lib/i18n';
import env from '../lib/env';
import isCordova from '../lib/isCordova';

let isServer = false;

export default class App extends BaseApp {
  static async getInitialProps({
    Component: PageComponent,
    ctx,
  }: {
    Component: React.Component<>,
    ctx: any,
  }) {
    // do not run usual routing stuff for cordova builds
    const isCordovaBuild = ctx && ctx.req && !ctx.req.headers;
    if (isCordovaBuild) {
      // take hostname from config
      const hostName = env.public.cordovaHostname;

      // serve only english languages
      const initialBuildTimeProps = await getAppInitialProps(
        { userAgentString: '', hostName, languages: ['en_US'], ...ctx.query },
        true
      );
      // strip translations from initial props, no added inclusion needed for cordova
      const { translations, ...buildTimeProps } = initialBuildTimeProps;
      return { buildTimeProps, isCordovaBuild };
    }

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

      const appPropsPromise = getAppInitialProps(
        { userAgentString, hostName, languages, ...ctx.query },
        isServer
      );

      if (ctx.query.routeName) {
        const routePropsPromise = getInitialProps(ctx.query, isServer);
        routeProps = await routePropsPromise;
      }
      appProps = await appPropsPromise;

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
      isCordovaBuild,
    };
  }

  routerHistory: NextRouterHistory;

  constructor(props: $Shape<AppProps>) {
    super(props);
    this.routerHistory = new NextRouterHistory(router, props.isCordovaBuild);
  }

  handleNotFoundReturnHomeClick = () => {
    this.routerHistory.push('map');
  };

  render() {
    const {
      Component: PageComponent,
      statusCode,
      routeName,
      path,
      hostName,
      isCordovaBuild,
      translations,
      ...props
    } = this.props;

    // no need to render anything but the bare page in cordova
    if (isCordovaBuild || isCordova()) {
      return (
        <PageComponent
          routerHistory={this.routerHistory}
          {...getRenderProps(routeName, props, isServer)}
          routeName={routeName}
          isCordovaBuild={isCordovaBuild}
        />
      );
    }

    // Show generic error page for now and show as soon as possible
    // as props like client side configuration are not set then.
    // TODO Move into app. This means that all the loaded props from getInitialProps can be null.
    if (statusCode >= 400) {
      return (
        <Container>
          <NotFound
            statusCode={statusCode}
            onReturnHomeClick={this.handleNotFoundReturnHomeClick}
          />
        </Container>
      );
    }

    if (translations) {
      applyTranslations(translations);
    }

    if (!isServer) {
      clientStoreAppInitialProps(props);

      if (routeName) {
        clientStoreInitialProps(routeName, props);
      }
    }

    const { clientSideConfiguration }: $Shape<AppProps> = props;
    const { textContent, meta } = clientSideConfiguration;
    const { name: productName, description } = textContent.product;
    const { twitter, googleAnalytics, facebook } = meta;

    // TODO this feels like bad configuration
    const shareHost = `https://${hostName}/`;

    return (
      <Container>
        <React.Fragment>
          <Head>
            {/* Alternates */}
            {generateLocaleLinks(path || (window && window.location.pathname), availableLocales)}

            {/* Relations */}
            <link href={`${router.generatePath('search')}`} rel="search" title={t`Search`} />
            <link href={`${router.generatePath('map')}`} rel="home" title={t`Homepage`} />

            {/* Misc */}
            <meta content={description} name="description" key="description" />
            <link rel="shortcut icon" href={`/favicon.ico`} />

            {/* iOS app */}
            {productName === 'Wheelmap' && (
              <meta content="app-id=399239476" name="apple-itunes-app" />
            )}
          </Head>
          <OpenGraph productName={productName} description={description} />
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
