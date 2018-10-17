// @flow
import * as React from 'react';
import Document, { Head, Main, NextScript, type NextDocumentContext } from 'next/document';
import { ServerStyleSheet } from 'styled-components';

import env from '../lib/env';

const cordovaBlock = 'gap: file:';

export default class MyDocument extends Document {
  static getInitialProps({ renderPage }: NextDocumentContext) {
    const sheet = new ServerStyleSheet();

    // Hacky way to get the locale used when rendering the page.
    let locale, isCordovaBuild;

    const page = renderPage(App => props => {
      locale = props.locale;
      isCordovaBuild = props.isCordovaBuild;

      return sheet.collectStyles(<App {...props} />);
    });

    const styleTags = sheet.getStyleElement();

    return { ...page, styleTags, locale, isCordovaBuild };
  }

  render() {
    const { locale, isCordovaBuild } = this.props;

    return (
      <html lang={locale}>
        <Head>
          <meta charSet="utf-8" />
          <meta
            httpEquiv="Content-Security-Policy"
            content={`
              default-src
                ws:
                ${isCordovaBuild ? cordovaBlock : ''}
                file:
                data:
                'self'
                'unsafe-eval'
                'unsafe-inline'
                https://www.googletagmanager.com
                https://ssl.gstatic.com
                https://photon.komoot.de
                ${env.public.wheelmap.baseUrl}
                ${env.public.accessibilityCloud.baseUrl.cached}
                ${env.public.accessibilityCloud.baseUrl.uncached}
                ${env.public.allowAdditionalDataUrls || ''};
              style-src 
                'self' 
                'unsafe-inline';
              frame-src 
                'self'
                ${isCordovaBuild ? cordovaBlock : ''};
              media-src 
                'self' 
                ${isCordovaBuild ? cordovaBlock : ''};
              img-src
                'self'
                data:
                https://accessibility-cloud-uploads.s3.amazonaws.com
                https://www.googletagmanager.com
                https://api.mapbox.com
                https://asset0.wheelmap.org
                https://asset1.wheelmap.org
                https://asset2.wheelmap.org
                https://asset3.wheelmap.org
                https://asset4.wheelmap.org
                ${env.public.accessibilityCloud.baseUrl.cached}
                ${env.public.allowAdditionalImageUrls || ''}
                ${isCordovaBuild ? cordovaBlock : ''};
            `}
          />
          <meta
            name="viewport"
            content="width=device-width, height=device-height, initial-scale=1.0, maximum-scale=2.0, minimum-scale=1.0, viewport-fit=cover"
          />

          {/* Google Bots */}
          <meta content="follow index" name="robots" />

          {/* iOS link to "native" app and configuration for web app */}
          <meta content="yes" name="apple-mobile-web-app-capable" />
          <meta content="white" name="apple-mobile-web-app-status-bar-style" />

          {this.props.styleTags}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
