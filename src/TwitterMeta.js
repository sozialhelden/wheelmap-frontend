// @flow
import React, { PureComponent } from 'react';
import Head from 'next/head';

import { type ClientSideConfiguration } from './lib/ClientSideConfiguration';

type Props = {
  shareHost: string,
  clientSideConfiguration: ClientSideConfiguration,
};

class TwitterMeta extends PureComponent<Props> {
  render() {
    const { shareHost, clientSideConfiguration } = this.props;
    const { name: productName, description } = clientSideConfiguration.textContent.product;

    return (
      <Head>
        <meta content="summary" name="twitter:card" key="twitter:card" />
        <meta content={shareHost} name="twitter:domain" key="twitter:domain" />
        <meta content="@wheelmap" name="twitter:site" key="twitter:site" />
        <meta content="@wheelmap" name="twitter:creator" key="twitter:creator" />
        <meta content={description} name="twitter:description" key="twitter:description" />
        <meta content={productName} property="twitter:title" key="twitter:title" />
        <meta
          content={`${shareHost}/static/images/wheely_big.jpg`}
          property="twitter:image"
          key="twitter:image"
        />
      </Head>
    );
  }
}

export default TwitterMeta;
