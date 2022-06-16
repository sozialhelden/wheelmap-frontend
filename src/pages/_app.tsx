// babel-preset-react-app uses useBuiltIn "entry". We therefore need an entry
// polyfill import to be replaced with polyfills we need for our targeted browsers.
import * as React from 'react';
import Head from 'next/head';
import type { AppProps } from 'next/app'
import composeContexts, { ContextAndValue } from '../lib/composeContexts';
import addEmbedModeResponseHeaders from '../lib/data-fetching/addEmbedModeResponseHeaders';
import App from 'next/app';
import { useCurrentApp } from '../lib/data-fetching/useCurrentApp';
import * as queryString from 'query-string';
import { parseUserAgentString, UserAgentContext } from '../lib/data-fetching/useUserAgent';
import { getProductTitle } from '../lib/model/ClientSideConfiguration';

interface ExtraProps {
  userAgentString?: string;
}

export default function MyApp({ Component, pageProps }: AppProps<ExtraProps>) {
  const { userAgentString } = pageProps;
  const contexts: ContextAndValue<any>[] = [
    [UserAgentContext, parseUserAgentString(userAgentString)],
  ];

  return (
    <>
      <Head>

      </Head>

      {composeContexts(contexts, <Component {...pageProps} />)}
    </>
  );
}

//
// MyApp.getInitialProps = async (appContext) => {
//   // calls page's `getInitialProps` and fills `appProps.pageProps`
//   const appProps = await App.getInitialProps(appContext);
//
//   return { ...appProps }
// }

const getInitialProps: typeof App.getInitialProps = async (appContext) => {
  const appProps = await App.getInitialProps(appContext);
  console.log('App context', appContext);
  const { ctx } = appContext;
  const { req, res } = ctx;
  const isServer = !!req;
  const url = req ? req.url : location.href;
  const userAgentString = req ? req.headers['user-agent'] : navigator.userAgent
  const query = queryString.parse(url);
  const { embedToken } = query;
  const app = useCurrentApp();
  console.log('Query:', query);
  if (isServer) {
    addEmbedModeResponseHeaders(app, res, typeof embedToken === 'string' ? embedToken : undefined);
  }

  return { ...appProps, userAgentString }
}


MyApp.getInitialProps = getInitialProps;