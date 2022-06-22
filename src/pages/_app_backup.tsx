// babel-preset-react-app uses useBuiltIn "entry". We therefore need an entry
// polyfill import to be replaced with polyfills we need for our targeted browsers.
import "core-js/stable";
import "regenerator-runtime/runtime";
import * as React from "react";
import BaseApp from "next/app";
import get from "lodash/get";
import NotFound from "../components/NotFound/NotFound";
import "../components/Map/leaflet-gesture-handling/leaflet-gesture-handling.css";

import {
  parseAcceptLanguageString,
  localeFromString,
  getBrowserLocaleStrings,
  addTranslationsToTTag,
  Locale,
  currentLocales,
} from "../lib/i18n";

import allTranslations from "../lib/translations.json";
import { trackPageView } from "../lib/Analytics";


let isFirstTimeClientRender = true;

export default class App extends BaseApp<any> {
  static async getInitialProps({ ctx }: { ctx: any }) {
    let renderContext;
    let routeProps;
    let path;
    let localeStrings: string[] = ["en"];

    isServer = !!(ctx && ctx.req);

    // handle 404 before the app is rendered, as we otherwise render the whole app again
    // this is very relevant for missing static files like translations
    if (isServer && ctx.res.statusCode >= 400) {
      return { statusCode: ctx.res.statusCode };
    }

    try {

      // translations
      if (ctx.req) {
        if (ctx.req.headers["accept-language"]) {
          localeStrings = parseAcceptLanguageString(
            ctx.req.headers["accept-language"]
          );
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
        routeProps = await getInitialRouteProps(
          ctx.query,
          renderContextPromise,
          isServer
        );
        // getInitialRoutePropsSpan.end();
        routeProps = { ...routeProps };
      }
      renderContext = await renderContextPromise;
      // getInitialRenderContextSpan.end();

      if (isServer) {
        ctx.res.set({
          Vary: "X-User-Agent-Variant, X-Locale-Variant, Content-Language",
        });
        if (currentLocales[0]) {
          ctx.res.set("X-Locale-Variant", currentLocales[0].string);
          ctx.res.set(
            "Content-Language",
            currentLocales.map((l) => l.string).join(", ")
          );
        }
        const userAgentVariant =
          get(renderContext, "userAgent.os.name") ||
          (userAgentString && userAgentString.replace(/\/.*$/, ""));
        if (userAgentVariant) {
          ctx.res.set("X-User-Agent-Variant", userAgentVariant);
        }
      }

      if (ctx.req) {
        path = ctx.req.path;
      }
    } catch (error) {
      console.log("Caught an error while getting initial props:", error);

      const statusCode = error.status || error.statusCode || 500;

      if (ctx.res) {
        ctx.res.statusCode = statusCode;
      }

      return { statusCode };
    }


    // when requested by server side rendering only, skip serializing app props as these are huge
    const userAgent = renderContext.userAgent.ua || "";
    const isTwitterBot = userAgent.match(/Twitterbot/i);
    const doNotSerializeRenderContext = isTwitterBot && isServer;

  }

  routerHistory: NextRouterHistory;

  constructor(props: Partial<RenderContext>) {
    super(props as any);
    this.routerHistory = new NextRouterHistory(router);
  }

  render() {
    let receivedProps = this.props;

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
        <NotFound
          statusCode={statusCode}
          onReturnHomeClick={this.handleNotFoundReturnHomeClick}
        />
      );
    }

    if (translations) {
      addTranslationsToTTag(translations);
    }

    const availableLocales: Locale[] = Object.keys(allTranslations).map(
      localeFromString
    );
}

function generateLocaleLinks(path: string, locales: Locale[]) {
  if (path == null) {
    return null;
  }

  return locales.map((locale) => (
    <link
      key={locale.string}
      href={`${path}?locale=${locale.string}`}
      hrefLang={locale.string}
      rel="alternate"
    />
  ));
}
