// babel-preset-react-app uses useBuiltIn "entry". We therefore need an entry
// polyfill import to be replaced with polyfills we need for our targeted browsers.
import * as React from 'react';
import Head from 'next/head';
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        {/*
            Move viewport meta into Head from next/head to allow deduplication to work. Do not rely on deduplication by key,
            as React.mapChildren will prefix keys with ".$", but the default keys in next are not prefixed. Deduplication by
            name works fine.
            */}
        <meta
          name="viewport"
          content="width=device-width, height=device-height, initial-scale=1.0, maximum-scale=2.0, minimum-scale=1.0, viewport-fit=cover" />
      </Head>

      <Component />
    </>
  );
}