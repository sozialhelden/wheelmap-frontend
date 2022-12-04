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

export type NextPageWithLayout = NextPage & {
  getLayout?: (page: React.ReactElement) => React.ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

interface ExtraProps {
  userAgentString?: string;
  app: App;
}

export default function MyApp(props: AppProps<ExtraProps> & AppPropsWithLayout) {
  const { Component, pageProps } = props;
  const { userAgentString, app } = pageProps;
  const contexts: ContextAndValue<any>[] = [
    [UserAgentContext, parseUserAgentString(userAgentString)],
    [AppContext, app],
  ];

  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => page)

  return (
    <>
      <Head>

      </Head>

      {composeContexts(contexts, getLayout(<Component {...pageProps} />))}
    </>
  );
}

const getInitialProps: typeof NextApp.getInitialProps = async (appContext) => {
  const appProps = await NextApp.getInitialProps(appContext);
  const { ctx } = appContext;
  const { req, res } = ctx;
  const url = req ? req.url : location.href;
  const userAgentString = req ? req.headers['user-agent'] : navigator.userAgent
  const query = queryString.parseUrl(url).query;
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
  const pageProps = { userAgentString, app };
  return { ...appProps, pageProps }
}


MyApp.getInitialProps = getInitialProps;
