// @flow

import * as React from 'react';
import Document, { Head, Main, NextScript } from 'next/document';
import { ServerStyleSheet } from 'styled-components';

import GlobalStyle from '../GlobalStyle';
import LeafletStyle from '../LeafletStyle';
import AppStyle from '../AppStyle';
import MapStyle from '../MapStyle';

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
          <title>My page</title>
          <link rel="stylesheet" href="/_next/static/style.css" />
          {this.props.styleTags}
        </Head>
        <body>
          <Main />
          <NextScript />
          <GlobalStyle />
          <LeafletStyle />
          <AppStyle />
          <MapStyle />
        </body>
      </html>
    );
  }
}
