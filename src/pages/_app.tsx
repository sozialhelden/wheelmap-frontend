// babel-preset-react-app uses useBuiltIn "entry". We therefore need an entry
// polyfill import to be replaced with polyfills we need for our targeted browsers.
import { HotkeysProvider } from "@blueprintjs/core";
import { ILanguageSubtag, parseLanguageTag } from "@sozialhelden/ietf-language-tags";
import { uniq } from "lodash";
import { NextPage } from "next";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { default as NextApp } from "next/app";
import * as queryString from "query-string";
import * as React from "react";
import useSWR from "swr";
import EnvContext from "../components/shared/EnvContext";
import composeContexts, { ContextAndValue } from "../lib/composeContexts";
import { AppContext } from "../lib/context/AppContext";
import CountryContext from "../lib/context/CountryContext";
import { HostnameContext } from "../lib/context/HostnameContext";
import { LanguageTagContext } from "../lib/context/LanguageTagContext";
import { UserAgentContext, parseUserAgentString } from "../lib/context/UserAgentContext";
import fetchApp from "../lib/fetchers/fetchApp";
import { addToEnvironment, getEnvironment } from "../lib/globalEnvironment";
import { TransifexTranslations, getServerSideTranslations, getTransifexTranslations, setTransifexTranslations } from "../lib/i18n";
import { parseAcceptLanguageString } from "../lib/i18n/parseAcceptLanguageString";

export type NextPageWithLayout = NextPage & {
  getLayout?: (page: React.ReactElement) => React.ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

interface ExtraProps {
  userAgentString?: string;
  hostname: string;
  languageTags: ILanguageSubtag[];
  ipCountryCode?: string;
  environmentVariables: Record<string, string>;
  transifexTranslations: TransifexTranslations;
}

export default function MyApp(props: AppProps<ExtraProps> & AppPropsWithLayout) {
  const { Component, pageProps } = props;
  setTransifexTranslations(pageProps.transifexTranslations);
  
  const { userAgentString, session, languageTags, ipCountryCode, environmentVariables, hostname } = pageProps;
  // can be done always, if it's empty, it won't overwrite anything
  addToEnvironment(environmentVariables)
  const environment = getEnvironment()

  const centralAppToken = environment.NEXT_PUBLIC_ACCESSIBILITY_CLOUD_APP_TOKEN;
  const baseUrl = environment.NEXT_PUBLIC_ACCESSIBILITY_CLOUD_UNCACHED_BASE_URL;
  const { data: app, isLoading: isAppLoading } = useSWR([baseUrl, hostname, centralAppToken], fetchApp);
  if (!isAppLoading && !app) {
    throw new Error(`No app found for hostname ${hostname}`);
  }

  if (!app) {
    return null;
  }

  const parsedUserAgentString = parseUserAgentString(userAgentString);
  const contexts: ContextAndValue<any>[] = [
    [UserAgentContext, parsedUserAgentString],
    [AppContext, app],
    [HostnameContext, hostname],
    [LanguageTagContext, { languageTags }],
    [CountryContext, ipCountryCode],
    [EnvContext, environmentVariables],
  ];

  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? React.useCallback((page) => page, []);
  return (
    <>
      <HotkeysProvider>
        <SessionProvider session={session}>{composeContexts(contexts, getLayout(<Component {...pageProps} />))}</SessionProvider>
      </HotkeysProvider>
    </>
  );
}

const getInitialProps: typeof NextApp.getInitialProps = async (appContext) => {
  const appProps = await NextApp.getInitialProps(appContext);
  const { ctx } = appContext;
  const { req, res } = ctx;
  const url = req ? req.url : location.href;
  const userAgentString = req ? req.headers["user-agent"] : navigator.userAgent;
  const acceptLanguageHeader = req?.headers?.["accept-language"];
  const languageTagStrings = req ? (acceptLanguageHeader && parseAcceptLanguageString(acceptLanguageHeader)) || ["en"] : uniq([navigator.language, ...navigator.languages]);
  const languageTags = languageTagStrings.map(parseLanguageTag);
  res?.setHeader("Vary", "X-Lang, Content-Language");
  if (languageTagStrings[0]) {
    res?.setHeader("X-Lang", languageTagStrings[0]);
    res?.setHeader("Content-Language", languageTagStrings.join(", "));
  }
  const query = queryString.parseUrl(url).query;
  const ipCountryCode = query.countryCode || req?.headers?.["cf-ipcountry"] || req?.headers?.["x-country-code"] || languageTags.map((l) => l.region).filter(Boolean)[0];
  const hostnameAndPort = query.appId || (req ? req.headers.host : location.hostname);
  if (typeof hostnameAndPort !== "string") {
    throw new Error("Please supply only one appId query parameter.");
  }
  const hostname = hostnameAndPort.split(":")[0];
  // console.log('Hostname:', query, query.appId, hostname);
  if (typeof hostname !== "string") {
    throw new Error(`Hostname ${hostname} must be a string.`);
  }

  const transifexTranslations = getTransifexTranslations() || await getServerSideTranslations({ locale: query.locale || languageTagStrings[0], locales: languageTagStrings });
  setTransifexTranslations(transifexTranslations);
  const environmentVariables = getEnvironment();
  const pageProps: ExtraProps = { userAgentString, languageTags, ipCountryCode, environmentVariables, hostname, transifexTranslations };
  return { ...appProps, pageProps };
};

MyApp.getInitialProps = getInitialProps;
