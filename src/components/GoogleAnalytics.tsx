import React, { PureComponent } from 'react';
import Head from 'next/head';

import { GoogleAnalyticsConfiguration } from '../lib/ClientSideConfiguration';

export function gtag(...args: any[]) {
  // @ts-ignore
  window.dataLayer = window.dataLayer || [];

  // @ts-ignore
  window.dataLayer.push(args);
}

type Props = {
  googleAnalytics?: GoogleAnalyticsConfiguration,
};

class GoogleAnalytics extends PureComponent<Props> {
  componentDidMount() {
    this.track();
  }

  componentDidUpdate() {
    this.track();
  }

  track() {
    if (!this.props.googleAnalytics) return;
    const { trackingId } = this.props.googleAnalytics;

    if (!trackingId) {
      return;
    }

    gtag('config', trackingId, { anonymize_ip: true });
    gtag('js', new Date());
  }

  render() {
    if (!this.props.googleAnalytics) {
      return null;
    }

    const { trackingId, siteVerification } = this.props.googleAnalytics;

    return (
      <Head>
        {trackingId && (
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${trackingId}`}
            key="script-ga"
          />
        )}
        {siteVerification && (
          <meta
            content={siteVerification}
            name="google-site-verification"
            key="google-site-verification"
          />
        )}
      </Head>
    );
  }
}

export default GoogleAnalytics;
