// @flow
import React, { PureComponent } from 'react';
import Head from 'next/head';

import { type FacebookConfiguration } from '../lib/ClientSideConfiguration';

type Props = {
  facebook: FacebookConfiguration,
};

class FacebookMeta extends PureComponent<Props> {
  render() {
    const { appId, admins } = this.props.facebook;

    return (
      <Head>
        {appId && <meta content={appId} property="fb:app_id" />}
        {admins && <meta content={admins} property="fb:admins" />}
      </Head>
    );
  }
}

export default FacebookMeta;
