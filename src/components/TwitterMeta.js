// @flow
import React, { PureComponent } from 'react';
import Head from 'next/head';

import { type TwitterConfiguration } from '../lib/ClientSideConfiguration';

type Props = {
  shareHost: string,
  productName: string,
  description: string,
  twitter: TwitterConfiguration,
};

class TwitterMeta extends PureComponent<Props> {
  render() {
    const { shareHost, productName, description, twitter } = this.props;

    if (!twitter.creatorHandle && !twitter.siteHandle) {
      return null;
    }

    return (
      <Head>
        <meta content="summary" property="twitter:card" key="twitter:card" />
        <meta content={shareHost} property="twitter:domain" key="twitter:domain" />
        {twitter.siteHandle && (
          <meta content={twitter.siteHandle} property="twitter:site" key="twitter:site" />
        )}
        {twitter.creatorHandle && (
          <meta content={twitter.creatorHandle} property="twitter:creator" key="twitter:creator" />
        )}
        <meta content={description} property="twitter:description" key="twitter:description" />
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
