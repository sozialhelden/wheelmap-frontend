// @flow
import React, { PureComponent } from 'react';
import Head from 'next/head';

import { type OpenGraphConfiguration } from '../lib/ClientSideConfiguration';

type Props = {
  productName: string,
  description: string,
};

class OpenGraph extends PureComponent<Props> {
  render() {
    const { productName, description } = this.props;

    return (
      <Head>
        <meta content={productName} property="og:site_name" key="og:site_name" />
        <meta content={productName} property="og:title" key="og:title" />
        <meta content={description} property="og:description" key="og:description" />
        <meta content="website" property="og:type" key="og:type" />
      </Head>
    );
  }
}

export default OpenGraph;
