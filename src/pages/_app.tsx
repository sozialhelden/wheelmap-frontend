// babel-preset-react-app uses useBuiltIn "entry". We therefore need an entry
// polyfill import to be replaced with polyfills we need for our targeted browsers.
import { HotkeysProvider } from "@blueprintjs/core";
import { ILanguageSubtag, parseLanguageTag } from "@sozialhelden/ietf-language-tags";
import { pick, uniq } from "lodash";
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
import { getServerSideTranslations, setClientSideTranslations } from "../lib/i18n";
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
}

function getPublicEnvironmentVariablesOnServer() {
  return pick(
    process.env,
    Object.keys(process.env).filter((key) => key.startsWith("NEXT_PUBLIC_"))
  );
}

let isometricEnvironmentVariables: Record<string, string> | undefined;
if (typeof window === "undefined") {
  // We are on the server, so we can directly populate the environment variables with real values
  // as we have access to process.env.
  isometricEnvironmentVariables = getPublicEnvironmentVariablesOnServer();
}

export default function MyApp(props: AppProps<ExtraProps> & AppPropsWithLayout) {
  const { Component, pageProps } = props;
  setClientSideTranslations(pageProps);
  const { userAgentString, session, languageTags, ipCountryCode, environmentVariables, hostname } = pageProps;
  // On the first render pass, we set the environment variables to what the server hands over.
  // On every following render pass, the variables are already set globally.
  isometricEnvironmentVariables = isometricEnvironmentVariables || Object.freeze(environmentVariables);

  const centralAppToken = isometricEnvironmentVariables.NEXT_PUBLIC_ACCESSIBILITY_CLOUD_APP_TOKEN;
  const baseUrl = isometricEnvironmentVariables.NEXT_PUBLIC_ACCESSIBILITY_CLOUD_UNCACHED_BASE_URL;

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
  // On the client, isometricEnvironmentVariables is set on the first page rendering.
  const environmentVariables = isometricEnvironmentVariables || getPublicEnvironmentVariablesOnServer();
  const translationProps = await getServerSideTranslations({ locale: languageTags[0], locales: languageTags });
  const pageProps: ExtraProps = { userAgentString, languageTags, ipCountryCode, environmentVariables, hostname, ...translationProps };
  return { ...appProps, pageProps };
};

MyApp.getInitialProps = getInitialProps;
