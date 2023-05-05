// babel-preset-react-app uses useBuiltIn "entry". We therefore need an entry
// polyfill import to be replaced with polyfills we need for our targeted browsers.
import * as React from 'react';
import Head from 'next/head';
import type { AppProps } from 'next/app'
import composeContexts, { ContextAndValue } from '../lib/composeContexts';
import * as queryString from 'query-string';
import { App } from '../lib/model/ac/App';
import { default as NextApp } from 'next/app';
import { UserAgentContext, parseUserAgentString } from '../lib/context/UserAgentContext';
import { AppContext } from '../lib/context/AppContext';
import fetchApp from '../lib/fetchers/fetchApp';
import { NextPage } from 'next';
import { SessionContext, SessionProvider } from 'next-auth/react';
import { HostnameContext } from '../lib/context/HostnameContext';
import { LanguageTagContext } from '../lib/context/LanguageTagContext';
import { uniq } from 'lodash';
import { parseAcceptLanguageString } from '../lib/i18n/parseAcceptLanguageString';
import { ILanguageSubtag, parseLanguageTag } from '@sozialhelden/ietf-language-tags';
import CountryContext from '../lib/context/CountryContext';


export type NextPageWithLayout = NextPage & {
  getLayout?: (page: React.ReactElement) => React.ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

interface ExtraProps {
  userAgentString?: string;
  app: App;
  languageTags: ILanguageSubtag[];
  ipCountryCode?: string;
}

export default function MyApp(props: AppProps<ExtraProps> & AppPropsWithLayout) {
  const { Component, pageProps } = props;
  const { userAgentString, app, session, languageTags, ipCountryCode } = pageProps;
  const contexts: ContextAndValue<any>[] = [
    [UserAgentContext, parseUserAgentString(userAgentString)],
    [AppContext, app],
    [HostnameContext, app.hostname],
    [LanguageTagContext, { languageTags }],
    [CountryContext, ipCountryCode]
  ];

  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => page)

  return (
    <>
      <Head>

      </Head>
      <SessionProvider session={session}>
        {composeContexts(contexts, getLayout(<Component {...pageProps} />))}
      </SessionProvider>
    </>
  );
}

const getInitialProps: typeof NextApp.getInitialProps = async (appContext) => {
  const appProps = await NextApp.getInitialProps(appContext);
  const { ctx } = appContext;
  const { req, res } = ctx;
  const url = req ? req.url : location.href;
  const userAgentString = req ? req.headers['user-agent'] : navigator.userAgent
  const languageTagStrings = req?.headers?.["accept-language"] ? parseAcceptLanguageString(req.headers["accept-language"]) : uniq([navigator.language, ...navigator.languages]);
  const languageTags = languageTagStrings.map(parseLanguageTag);
  res?.setHeader("Vary", "X-Lang, Content-Language");
  if (languageTagStrings[0]) {
    res?.setHeader("X-Lang", languageTagStrings[0]);
    res?.setHeader("Content-Language", languageTagStrings.join(", "));
  }
  const query = queryString.parseUrl(url).query;
  const ipCountryCode = query.countryCode
    || req?.headers?.["cf-ipcountry"]
    || req?.headers?.["x-country-code"]
    || languageTags.map(l => l.region).filter(Boolean)[0];
  const hostnameAndPort = query.appId || (req ? req.headers.host : location.hostname);
  if (typeof hostnameAndPort !== 'string') {
    throw new Error('Please supply only one appId query parameter.');
  }
  const hostname = hostnameAndPort.split(':')[0];
  console.log('Hostname:', query, query.appId, hostname);
  if (typeof hostname !== 'string') {
    throw new Error(`Hostname ${hostname} must be a string.`);
  }
  const centralAppToken = process.env.REACT_APP_ACCESSIBILITY_CLOUD_APP_TOKEN;
  const app = await fetchApp([hostname, centralAppToken]);
  if (!app) {
    throw new Error(`No app found for hostname ${hostname}`);
  }
  const pageProps: ExtraProps = { userAgentString, app, languageTags, ipCountryCode };
  return { ...appProps, pageProps }
}


MyApp.getInitialProps = getInitialProps;
