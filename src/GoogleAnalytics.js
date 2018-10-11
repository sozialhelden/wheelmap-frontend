// @flow
import React, { PureComponent } from 'react';
import Head from 'next/head';

export function gtag(...args: any[]) {
  window.dataLayer = window.dataLayer || [];

  window.dataLayer.push(args);
}

type Props = {
  trackingId: string,
  siteVerification: string,
};

class GoogleAnalytics extends PureComponent<Props> {
  componentDidMount() {
    this.track();
  }

  componentDidUpdate() {
    this.track();
  }

  track() {
    const { trackingId } = this.props;

    gtag('config', trackingId);
    gtag('js', new Date());
  }

  render() {
    const { trackingId, siteVerification } = this.props;

    return (
      <Head>
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${trackingId}`}
          key="script-ga"
        />
        <meta
          content={siteVerification}
          name="google-site-verification"
          key="google-site-verification"
        />
      </Head>
    );
  }
}

export default GoogleAnalytics;
