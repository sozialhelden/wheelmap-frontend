// babel-preset-react-app uses useBuiltIn "entry". We therefore need an entry
// polyfill import to be replaced with polyfills we need for our targeted browsers.
import * as React from 'react';
import Head from 'next/head';
import type { AppProps } from 'next/app'
import composeContexts, { ContextAndValue } from '../lib/composeContexts';
import * as queryString from 'query-string';
import { App } from '../lib/model/App';
import { default as NextApp } from 'next/app';
import { UserAgentContext, parseUserAgentString } from '../lib/context/UserAgentContext';
import { AppContext } from '../lib/context/AppContext';
import fetchApp from '../lib/fetchers/fetchApp';

interface ExtraProps {
  userAgentString?: string;
  app: App;
}

export default function MyApp(props: AppProps<ExtraProps>) {
  console.log('App props:', props);
  const { Component, pageProps } = props;
  const { userAgentString, app } = pageProps;
  const contexts: ContextAndValue<any>[] = [
    [UserAgentContext, parseUserAgentString(userAgentString)],
    [AppContext, app],
  ];

  return (
    <>
      <Head>

      </Head>

      {composeContexts(contexts, <Component {...pageProps} />)}
    </>
  );
}

const getInitialProps: typeof NextApp.getInitialProps = async (appContext) => {
  const appProps = await NextApp.getInitialProps(appContext);
  const { ctx } = appContext;
  const { req, res } = ctx;
  const isServer = !!req;
  const url = req ? req.url : location.href;
  const userAgentString = req ? req.headers['user-agent'] : navigator.userAgent
  const query = queryString.parse(url);
  const hostnameAndPort = query.hostname || query.appId || req ? req.headers.host : location.hostname;
  const hostname = hostnameAndPort.split(':')[0];
  if (typeof hostname !== 'string') {
    throw new Error(`Hostname ${hostname} must be a string.`);
  }
  const appToken = process.env.REACT_APP_ACCESSIBILITY_CLOUD_APP_TOKEN;
  const app = await fetchApp([hostname, appToken]);
  if (!app) {
    throw new Error(`No app found for hostname ${hostname}`);
  }
  const pageProps = { userAgentString, app };
  return { ...appProps, pageProps }
}


MyApp.getInitialProps = getInitialProps;