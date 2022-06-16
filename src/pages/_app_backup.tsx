// babel-preset-react-app uses useBuiltIn "entry". We therefore need an entry
// polyfill import to be replaced with polyfills we need for our targeted browsers.
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import * as React from 'react';
import BaseApp from 'next/app';
import Head from 'next/head';
import { t } from 'ttag';
import get from 'lodash/get';
import AsyncNextHead from '../AsyncNextHead';
import TwitterMeta from '../components/TwitterMeta';
import FacebookMeta from '../components/App/FacebookMeta';
import OpenGraph from '../components/App/OpenGraph';
import NotFound from '../components/NotFound/NotFound';
import { AppContextData, AppContextProvider } from '../AppContext';
import { encode } from 'js-base64';
import '../components/Map/leaflet-gesture-handling/leaflet-gesture-handling.css';

import {
  parseAcceptLanguageString,
  localeFromString,
  getBrowserLocaleStrings,
  translatedStringFromObject,
  addTranslationsToTTag,
  Locale,
  currentLocales,
} from '../lib/i18n';
import router from '../app/router';
import {
  getInitialRouteProps,
  getInitialRenderContext,
  getAdditionalPageComponentProps,
  storeInitialRenderContext,
  storeInitialRouteProps,
  getHead,
  RenderContext,
} from '../app/getInitialProps';
import NextRouterHistory from '../lib/NextRouteHistory';
import Categories from '../lib/model/Categories';

import allTranslations from '../lib/translations.json';
import { trackPageView } from '../lib/Analytics';
import { buildFullImageUrl } from '../lib/model/Image';
import isEmbedTokenValid from '../lib/model/isEmbedTokenValid';
import EmbedModeDeniedDialog from '../components/App/EmbedModeDeniedDialog';
import startClientSideApm from '../lib/apm/startClientSideApm';
import { ClientSideConfiguration } from '../lib/ClientSideConfiguration';

if (typeof window !== 'undefined') {
  // TODO: Re-enable APM
  // startClientSideApm();
}

let isServer = false;
// only used in serverSideRendering when getting the initial props
// used for storing the initial props instead of serializing them for the client
// to prevent sending too large html chunks, that break e.g. twitter cards
let nonSerializedProps: { renderContext: RenderContext; routeProps: any | void } | null = null;

let isFirstTimeClientRender = true;

export default class App extends BaseApp<any> {
  static async getInitialProps({ ctx }: { ctx: any }) {
    let renderContext;
    let routeProps;
    let path;
    let localeStrings: string[] = ['en'];

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
      } else {
        hostName = window.location.hostname;
      }

      // translations
      if (ctx.req) {
        if (ctx.req.headers['accept-language']) {
          localeStrings = parseAcceptLanguageString(ctx.req.headers['accept-language']);
          // console.log('Using languages:', localeStrings);
        }
      } else {
        localeStrings = getBrowserLocaleStrings();
      }

      // const getInitialRenderContextSpan = apm.startSpan('Getting app props');
      const renderContextPromise = getInitialRenderContext({
        userAgentString,
        hostName,
        localeStrings,
        ...ctx.query,
      });

      if (ctx.query.routeName) {
        // const getInitialRoutePropsSpan = apm.startSpan('Getting route props');
        routeProps = await getInitialRouteProps(ctx.query, renderContextPromise, isServer);
        // getInitialRoutePropsSpan.end();
        routeProps = { ...routeProps };
      }
      renderContext = await renderContextPromise;
      // getInitialRenderContextSpan.end();

      if (isServer) {
        ctx.res.set({ Vary: 'X-User-Agent-Variant, X-Locale-Variant, Content-Language' });
        if (currentLocales[0]) {
          ctx.res.set('X-Locale-Variant', currentLocales[0].string);
          ctx.res.set('Content-Language', currentLocales.map(l => l.string).join(', '));
        }
        const userAgentVariant =
          get(renderContext, 'userAgent.os.name') ||
          (userAgentString && userAgentString.replace(/\/.*$/, ''));
        if (userAgentVariant) {
          ctx.res.set('X-User-Agent-Variant', userAgentVariant);
        }
      }

      if (ctx.req) {
        path = ctx.req.path;
      }
    } catch (error) {
      console.log('Caught an error while getting initial props:', error);

      const statusCode = error.status || error.statusCode || 500;

      if (ctx.res) {
        ctx.res.statusCode = statusCode;
      }

      return { statusCode };
    }

    const embedModeDenied = this.handleEmbedModeAccess(isServer, renderContext, ctx.res);

    // when requested by server side rendering only, skip serializing app props as these are huge
    const userAgent = renderContext.userAgent.ua || '';
    const isTwitterBot = userAgent.match(/Twitterbot/i);
    const doNotSerializeRenderContext = isTwitterBot && isServer;

    if (doNotSerializeRenderContext) {
      nonSerializedProps = { renderContext, routeProps };
      renderContext = {};
      routeProps = null;
    }

    return {
      ...renderContext,
      ...routeProps,
      skipApplicationBody: isTwitterBot || embedModeDenied,
      embedModeDenied,
      routeName: ctx.query.routeName,
      preferredLanguage: localeStrings[0],
      path,
    };
  }


  routerHistory: NextRouterHistory;

  constructor(props: Partial<RenderContext>) {
    super(props as any);
    this.routerHistory = new NextRouterHistory(router);
  }

  handleNotFoundReturnHomeClick = () => {
    this.routerHistory.push('map');
  };

  render() {
    let receivedProps = this.props;

    // merge non serialized props back in
    if (isServer && nonSerializedProps) {
      receivedProps = {
        ...nonSerializedProps.renderContext,
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
      translations,
      skipApplicationBody,
      embedModeDenied,
      rawCategoryLists,
      buildTimeProps,
      preferredLanguage,
      ...renderContext
    } = receivedProps;

    if (!receivedProps.isServer && isFirstTimeClientRender) {
      isFirstTimeClientRender = false;
      if (receivedProps.app) {
        trackPageView(path);
      }
    }

    // Show generic error page for now and show as soon as possible
    // as props like client side configuration are not set then.
    // TODO Move into app. This means that all the loaded props from getInitialProps can be null.
    if (statusCode && statusCode >= 400) {
      return (
        <NotFound statusCode={statusCode} onReturnHomeClick={this.handleNotFoundReturnHomeClick} />
      );
    }

    // build lookup table
    // @ts-ignore
    renderContext.categories = Categories.generateLookupTables(rawCategoryLists);

    if (translations) {
      addTranslationsToTTag(translations);
    }

    // store app initial props (use this.props to cache rawCategoryLists)
    // @ts-ignore
    storeInitialRenderContext(this.props, isServer, renderContext.app.tokenString);
    if (routeName) {
      storeInitialRouteProps(routeName, renderContext, renderContext.app.tokenString);
    }

    const { textContent, meta, branding } = this.props.app
      .clientSideConfiguration as ClientSideConfiguration;
    const { name: productName, description } = textContent?.product || {
      name: 'Wheelmap',
      description: undefined,
    };
    const { twitter, facebook } = meta || {};

    const baseUrl = `https://${hostName}`;

    let translatedDescription = translatedStringFromObject(description);
    let translatedProductName = translatedStringFromObject(productName);
    let pageTitle = translatedProductName;
    let facebookMetaData = { ...facebook, imageWidth: 0, imageHeight: 0 };
    let twitterMetaData = { ...twitter };
    let ogUrl = baseUrl;
    const iconSvg = branding?.vectorIconSVG?.data;
    const faviconDataUrl = iconSvg && `data:image/svg+xml;base64,${encode(iconSvg)}`;

    if (routeName === 'mappingEventDetail') {
      const mappingEvent = this.props.mappingEvents.find(
        event => event._id === this.props.featureId
      );
      if (mappingEvent) {
        pageTitle = translatedProductName
          ? `${mappingEvent.name} - ${translatedProductName}`
          : mappingEvent.name;
        translatedDescription = mappingEvent.description || mappingEvent.name;

        const mappingEventImage = mappingEvent.images && mappingEvent.images[0];
        const mappingEventImageUrl = mappingEventImage && buildFullImageUrl(mappingEventImage);

        facebookMetaData.imageURL =
          mappingEventImageUrl || `${baseUrl}/images/eventPlaceholder.png`;

        // 2048x1288 is the dimension of the placeholder image
        facebookMetaData.imageWidth = mappingEventImage ? mappingEventImage.dimensions.width : 2048;
        facebookMetaData.imageHeight = mappingEventImage
          ? mappingEventImage.dimensions.height
          : 1288;

        twitterMetaData.imageURL = mappingEventImageUrl || `${baseUrl}/images/eventPlaceholder.png`;
        ogUrl = `${baseUrl}/events/${mappingEvent._id}`;
      }
    }

    const availableLocales: Locale[] = Object.keys(allTranslations).map(localeFromString);

    const appContext: AppContextData = {
      app: this.props.app,
      baseUrl,
      categories: renderContext.categories,
      preferredLanguage,
    };

    return (
      <React.Fragment>
        <Head>
          {/*
              Move viewport meta into Head from next/head to allow deduplication to work. Do not rely on deduplication by key,
              as React.mapChildren will prefix keys with ".$", but the default keys in next are not prefixed. Deduplication by
              name works fine.
             */}
          <meta
            name="viewport"
            content="width=device-width, height=device-height, initial-scale=1.0, maximum-scale=2.0, minimum-scale=1.0, viewport-fit=cover"
          />

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
          <link rel="shortcut icon" href={faviconDataUrl || `/favicon.ico`} />
          <link rel="icon" href={faviconDataUrl || `/favicon.ico`} />

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
        {twitter && (
          <TwitterMeta
            shareHost={baseUrl}
            productName={translatedProductName}
            description={translatedDescription}
            twitter={twitter}
          />
        )}
        {facebook && <FacebookMeta facebook={facebookMetaData} />}

        {routeName != null && (
          <AsyncNextHead head={getHead(routeName, renderContext, appContext.baseUrl)} />
        )}
        {!skipApplicationBody && (
          <AppContextProvider value={appContext}>
            <PageComponent
              routerHistory={this.routerHistory}
              {...getAdditionalPageComponentProps(routeName, renderContext, isServer)}
              // @ts-ignore
              routeName={routeName}
            />
          </AppContextProvider>
        )}
        {embedModeDenied && <EmbedModeDeniedDialog language={preferredLanguage} />}
      </React.Fragment>
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
