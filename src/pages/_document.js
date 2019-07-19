// @flow
import * as React from 'react';
import Document, { Html, Head, Main, NextScript, type NextDocumentContext } from 'next/document';
import { ServerStyleSheet } from 'styled-components';
import env from '../lib/env';

export default class MyDocument extends Document {
  static getInitialProps({ renderPage, ...ctx }: NextDocumentContext) {
    const sheet = new ServerStyleSheet();

    // Hacky way to get the locale used when rendering the page.
    let locale;

    const page = renderPage(App => props => {
      locale = props.locale;
      return sheet.collectStyles(<App {...props} />);
    });

    const styleTags = sheet.getStyleElement();
    return { ...page, styleTags, locale };
  }

  render() {
    const { locale } = this.props;

    return (
      <Html lang={locale}>
        <Head>
          <meta charSet="utf-8" key="charSet" />
          <meta
            httpEquiv="Content-Security-Policy"
            content={`
              default-src
                ws:
                data:
                'self'
                'unsafe-eval'
                'unsafe-inline'
                https://www.google-analytics.com
                https://www.googletagmanager.com
                https://ssl.gstatic.com
                https://photon.komoot.de
                https://sozialhelden.matomo.cloud
                ${env.REACT_APP_WHEELMAP_API_BASE_URL || ''}
                ${env.REACT_APP_ACCESSIBILITY_CLOUD_BASE_URL || ''}
                ${env.REACT_APP_ACCESSIBILITY_CLOUD_UNCACHED_BASE_URL || ''}
                ${env.REACT_APP_ACCESSIBILITY_APPS_BASE_URL || ''}
                ${env.REACT_APP_ALLOW_ADDITIONAL_DATA_URLS || ''};
              style-src
                'self'
                'unsafe-inline';
              frame-src
                'self';
              media-src
                'self';
              img-src
                'self'
                data:
                https://accessibility-cloud-uploads.s3.amazonaws.com
                https://www.googletagmanager.com
                https://www.google-analytics.com
                https://api.mapbox.com
                https://asset0.wheelmap.org
                https://asset1.wheelmap.org
                https://asset2.wheelmap.org
                https://asset3.wheelmap.org
                https://asset4.wheelmap.org
                ${env.REACT_APP_ACCESSIBILITY_CLOUD_BASE_URL || ''}
                ${env.REACT_APP_ACCESSIBILITY_CLOUD_UNCACHED_BASE_URL || ''}
                ${env.REACT_APP_ACCESSIBILITY_APPS_BASE_URL || ''}
                ${env.REACT_APP_ALLOW_ADDITIONAL_IMAGE_URLS || ''};
            `}
          />

          {/* Google Bots */}
          <meta content="follow index" name="robots" />

          {/* iOS link to "native" app and configuration for web app */}
          <meta name="apple-mobile-web-app-title" content="Wheelmap" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

          <link rel="apple-touch-icon" href="/static/images/wheely_big.jpg" />
          <link rel="apple-touch-icon" sizes="76x76" href="/static/images/wheely_big.jpg" />
          <link rel="apple-touch-icon" sizes="120x120" href="/static/images/wheely_big.jpg" />
          <link rel="apple-touch-icon" sizes="152x152" href="/static/images/wheely_big.jpg" />

          {this.props.styleTags}
          <script src="/clientEnv.js"></script>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
