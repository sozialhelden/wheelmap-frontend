// @flow
import React, { PureComponent } from 'react';
import Head from 'next/head';

import { type ClientSideConfiguration } from '../lib/ClientSideConfiguration';

type Props = {
  shareHost: string,
  clientSideConfiguration: ClientSideConfiguration,
};

class OpenGraph extends PureComponent<Props> {
  render() {
    const { shareHost, clientSideConfiguration } = this.props;
    const { name: productName, description } = clientSideConfiguration.textContent.product;

    return (
      <Head>
        <meta content={productName} property="og:site_name" key="og:site_name" />
        <meta content={description} property="og:description" key="og:description" />
        <meta content={productName} property="og:title" key="og:title" />
        <meta content="website" property="og:type" key="og:type" />
        <meta
          content={`${shareHost}/static/images/wheely_big.jpg`}
          property="og:image"
          key="og:image"
        />
      </Head>
    );
  }
}

export default OpenGraph;
