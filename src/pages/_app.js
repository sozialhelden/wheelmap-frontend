// @flow

// babel-preset-react-app uses useBuiltIn "entry". We therefore need an entry
// polyfill import to be replaced with polyfills we need for our targeted browsers.
import '@babel/polyfill';

import React from 'react';
import BaseApp, { Container } from 'next/app';
import Head from 'next/head';
import { t } from 'ttag';
import get from 'lodash/get';

import AsyncNextHead from '../AsyncNextHead';
import GoogleAnalytics from '../components/GoogleAnalytics';
import TwitterMeta from '../components/TwitterMeta';
import FacebookMeta from '../components/FacebookMeta';
import OpenGraph from '../components/OpenGraph';
import NotFound from '../components/NotFound/NotFound';
import { AppContextProvider } from '../AppContext';

import {
  parseAcceptLanguageString,
  localeFromString,
  getBrowserLocaleStrings,
  translatedStringFromObject,
  addTranslationsToTTag,
  type Locale,
  currentLocales,
} from '../lib/i18n';
import router from '../app/router';
import {
  getInitialRouteProps,
  getInitialAppProps,
  getRenderProps,
  storeInitialAppProps,
  storeInitialRouteProps,
  getHead,
  type AppProps,
} from '../app/getInitialProps';
import NextRouterHistory from '../lib/NextRouteHistory';
import env from '../lib/env';
import isCordova, { isCordovaDebugMode } from '../lib/isCordova';
import Categories from '../lib/Categories';

import allTranslations from '../lib/translations.json';
import { restoreAnalytics, trackPageView } from '../lib/Analytics';

let isServer = false;
// only used in serverSideRendering when getting the initial props
// used for storing the initial props instead of serializing them for the client
// to prevent sending too large html chunks, that break e.g. twitter cards
let nonSerializedProps: ?{ appProps: AppProps, routeProps: any | void } = null;

let isFirstTimeClientRender = true;

export default class App extends BaseApp {
  static async getInitialProps({ ctx }: { ctx: any }) {
    // do not run usual routing stuff for cordova builds
    const isCordovaBuild = ctx && ctx.req && !ctx.req.headers;
    if (isCordovaBuild) {
      // take hostname from config
      const hostName = env.public.cordovaHostname;

      // serve only english languages
      const initialBuildTimeProps = await getInitialAppProps(
        { userAgentString: '', hostName, localeStrings: ['en_US'], ...ctx.query },
        isCordovaBuild
      );
      // strip translations from initial props, no added inclusion needed for cordova
      const { translations, ...buildTimeProps } = initialBuildTimeProps;
      // store buildTimeProps separately as we don't want runtime overrides of these
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

      let hostName: string;

      if (isServer) {
        hostName = ctx.req.headers.host.replace(/:.*$/, '');
      } else if (isCordova() || isCordovaDebugMode()) {
        hostName = env.public.cordovaHostname;
      } else {
        hostName = window.location.hostname;
      }

      // translations
      let localeStrings: string[] = [];

      if (ctx.req) {
        if (ctx.req.headers['accept-language']) {
          localeStrings = parseAcceptLanguageString(ctx.req.headers['accept-language']);
          // console.log('Using languages:', localeStrings);
        }
      } else {
        localeStrings = getBrowserLocaleStrings();
      }

      const appPropsPromise = getInitialAppProps(
        { userAgentString, hostName, localeStrings, ...ctx.query },
        isCordovaBuild
      );

      if (ctx.query.routeName) {
        const routePropsPromise = getInitialRouteProps(ctx.query, appPropsPromise, isServer);
        routeProps = await routePropsPromise;
        routeProps = { ...routeProps };
      }
      appProps = await appPropsPromise;

      if (isServer) {
        ctx.res.set({ Vary: 'X-User-Agent-Variant, X-Locale-Variant, Content-Language' });
        if (currentLocales[0]) {
          ctx.res.set('X-Locale-Variant', currentLocales[0].string);
          ctx.res.set('Content-Language', currentLocales.map(l => l.string).join(', '));
        }
        const userAgentVariant =
          get(appProps, 'userAgent.os.name') ||
          (userAgentString && userAgentString.replace(/\/.*$/, ''));
        if (userAgentVariant) {
          ctx.res.set('X-User-Agent-Variant', userAgentVariant);
        }
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

    // when requested by server side rendering only, skip serializing app props as these are huge
    const userAgent = appProps.userAgent.ua || '';
    const isTwitterBot = userAgent.match(/Twitterbot/i);
    const doNotSerializeAppProps = isTwitterBot && isServer;

    if (doNotSerializeAppProps) {
      nonSerializedProps = { appProps, routeProps };
      appProps = {};
      routeProps = null;
    }

    return {
      ...appProps,
      ...routeProps,
      skipApplicationBody: isTwitterBot,
      routeName: ctx.query.routeName,
      path,
      isCordovaBuild,
    };
  }

  routerHistory: NextRouterHistory;

  constructor(props: $Shape<AppProps>) {
    super(props);
    this.routerHistory = new NextRouterHistory(router, props.isCordovaBuild || isCordova());
  }

  handleNotFoundReturnHomeClick = () => {
    this.routerHistory.push('map');
  };

  render() {
    let receivedProps = this.props;

    // merge non serialized props back in
    if (isServer && nonSerializedProps) {
      receivedProps = {
        ...nonSerializedProps.appProps,
        ...nonSerializedProps.routeProps,
        ...receivedProps,
      };
      nonSerializedProps = null;
    }

    // strip out _app.js only props
    const {
      Component: PageComponent,
      statusCode,
      routeName,
      path,
      hostName,
      isCordovaBuild,
      translations,
      skipApplicationBody,
      rawCategoryLists,
      buildTimeProps,
      ...appProps
    } = receivedProps;

    if (!receivedProps.isServer && isFirstTimeClientRender) {
      isFirstTimeClientRender = false;

      // setup analytics for any client that has a google analytics tracking id
      if (receivedProps.clientSideConfiguration) {
        const { googleAnalytics } = receivedProps.clientSideConfiguration.meta;
        if (googleAnalytics && googleAnalytics.trackingId) {
          restoreAnalytics(googleAnalytics.trackingId);
          trackPageView(path);
        }
      }
    }

    // Show generic error page for now and show as soon as possible
    // as props like client side configuration are not set then.
    // TODO Move into app. This means that all the loaded props from getInitialProps can be null.
    if (statusCode && statusCode >= 400) {
      return (
        <Container>
          <NotFound
            statusCode={statusCode}
            onReturnHomeClick={this.handleNotFoundReturnHomeClick}
          />
        </Container>
      );
    }

    // no need to render anything but the bare page in cordova
    if (isCordovaBuild || isCordova() || isCordovaDebugMode()) {
      return (
        <PageComponent
          appProps={appProps}
          buildTimeProps={buildTimeProps}
          getRenderProps={getRenderProps}
          routerHistory={this.routerHistory}
          routeName={routeName}
          isCordovaBuild={isCordovaBuild}
        />
      );
    }

    // build lookup table
    appProps.categories = Categories.generateLookupTables(rawCategoryLists);

    if (translations) {
      addTranslationsToTTag(translations);
    }

    // store app initial props (use this.props to cache rawCategoryLists)
    storeInitialAppProps(this.props, isServer);
    if (routeName) {
      storeInitialRouteProps(routeName, appProps);
    }

    const { textContent, meta } = this.props.clientSideConfiguration;
    const { name: productName, description } = textContent.product;
    const { twitter, googleAnalytics, facebook } = meta;

    const baseUrl = `https://${hostName}`;

    let translatedDescription = translatedStringFromObject(description);
    let translatedProductName = translatedStringFromObject(productName);
    let pageTitle = translatedProductName;
    let facebookMetaData = { ...facebook };
    let twitterMetaData = { ...twitter };
    let ogUrl = baseUrl;

    if (routeName === 'mappingEventDetail') {
      const mappingEvent = this.props.mappingEvents.find(
        event => event._id === this.props.featureId
      );
      if (mappingEvent) {
        pageTitle = translatedProductName
          ? `${mappingEvent.name} - ${translatedProductName}`
          : mappingEvent.name;
        translatedDescription = mappingEvent.description || mappingEvent.name;
        facebookMetaData.imageURL =
          mappingEvent.photoUrl || `${baseUrl}/static/images/eventPlaceholder.png`;
        twitterMetaData.imageUrl =
          mappingEvent.photoUrl || `${baseUrl}/static/images/eventPlaceholder.png`;
        ogUrl = `${baseUrl}/events/${mappingEvent._id}`;
      }
    }

    const availableLocales: Locale[] = Object.keys(allTranslations).map(localeFromString);

    const appContext = { baseUrl };

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
            <meta
              content={translatedStringFromObject(description)}
              name="description"
              key="description"
            />
            <link rel="shortcut icon" href={`/favicon.ico`} />

            {/* iOS app */}
            {productName === 'Wheelmap' && (
              <meta content="app-id=399239476" name="apple-itunes-app" />
            )}
          </Head>

          <OpenGraph
            productName={translatedProductName}
            title={pageTitle}
            description={translatedDescription}
            url={ogUrl}
          />
          {googleAnalytics && <GoogleAnalytics googleAnalytics={googleAnalytics} />}
          {twitter && (
            <TwitterMeta
              shareHost={baseUrl}
              productName={translatedProductName}
              description={translatedDescription}
              twitter={twitter}
            />
          )}
          {facebook && <FacebookMeta facebook={facebookMetaData} />}

          {routeName != null && <AsyncNextHead head={getHead(routeName, appProps)} />}
          {!skipApplicationBody && (
            <AppContextProvider value={appContext}>
              <PageComponent
                routerHistory={this.routerHistory}
                {...getRenderProps(routeName, appProps, isServer)}
                routeName={routeName}
              />
            </AppContextProvider>
          )}
        </React.Fragment>
      </Container>
    );
  }
}

function generateLocaleLinks(path: string, locales: Locale[]) {
  if (path == null) {
    return null;
  }

  return locales.map(locale => (
    <link
      key={locale.string}
      href={`${path}?locale=${locale.string}`}
      hrefLang={locale.string}
      rel="alternate"
    />
  ));
}
