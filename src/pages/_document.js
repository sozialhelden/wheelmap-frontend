// @flow

import * as React from 'react';
import Document, { Head, Main, NextScript } from 'next/document';
import { ServerStyleSheet } from 'styled-components';

import config from '../lib/config';

export default class MyDocument extends Document {
  static getInitialProps({ renderPage }) {
    const sheet = new ServerStyleSheet();
    const page = renderPage(App => props => sheet.collectStyles(<App {...props} />));
    const styleTags = sheet.getStyleElement();
    return { ...page, styleTags };
  }

  render() {
    return (
      <html lang="en">
        <Head>
          <meta charSet="utf-8" />
          <meta
            httpEquiv="Content-Security-Policy"
            content={`default-src 'self' 'unsafe-eval' 'unsafe-inline' 
                data: gap: ws: https://www.google-analytics.com https://ssl.gstatic.com https://photon.komoot.de ${
                  config.wheelmapApiBaseUrl
                } ${config.accessibilityCloudBaseUrl} ${config.accessibilityCloudUncachedBaseUrl} ${
              config.allowAdditionalDataUrls
            }; 
                style-src 'self' 'unsafe-inline'; 
                media-src 'self'
                gap:; img-src 'self' https://accessibility-cloud-uploads.s3.amazonaws.com https://www.google-analytics.com https://api.mapbox.com ${
                  config.accessibilityCloudBaseUrl
                } ${config.allowAdditionalImageUrls}
                data: https://asset0.wheelmap.org https://asset1.wheelmap.org https://asset2.wheelmap.org https://asset3.wheelmap.org https://asset4.wheelmap.org`}
          />
          <meta
            name="viewport"
            content="width=device-width, height=device-height, initial-scale=1.0, maximum-scale=2.0, minimum-scale=1.0, viewport-fit=cover"
          />
          <link rel="shortcut icon" href={`${config.publicUrl}/favicon.ico`} />
          <title>Wheelmap</title>
          {/* Used to include imported CSS and SASS files */}
          <link rel="stylesheet" href="/_next/static/style.css" />
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
