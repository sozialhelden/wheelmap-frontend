// @flow

import * as React from 'react';
import Head from 'next/head';

import App from '../App';
import { isWheelmapFeatureId } from '../lib/Feature';
import fetch from '../lib/fetch';
import config from '../lib/config';
import { currentLocales } from '../lib/i18n';

async function fetchFeature(featureId: string): void {
  const isWheelmap = isWheelmapFeatureId(featureId);
  let url;

  if (isWheelmap) {
    url = `${config.wheelmapApiBaseUrl}/api/nodes/${featureId}?api_key=${config.wheelmapApiKey}`;
  } else {
    url = `${config.accessibilityCloudBaseUrl}/place-infos/${featureId}.json?appToken=${
      config.accessibilityCloudAppToken
    }&locale=${currentLocales[0]}&includePlacesWithoutAccessibility=1`;
  }

  const response = await fetch(url);

  if (!response.ok) {
    const error = new Error();
    error.statusCode = response.status;

    throw error;
  }

  return response.json();
}

type Props = {
  feature: Feature,
  featureId: string,
};

class Nodes extends React.Component<Props> {
  static async getInitialProps({ query, res }) {
    if (!query.id) {
      const error = new Error();
      error.statusCode = 404;

      throw error;
    }

    const feature = await fetchFeature(query.id);

    return { feature, featureId: query.id };
  }

  render() {
    const { feature, featureId } = this.props;

    return (
      <React.Fragment>
        <Head>
          <title>{feature.properties.name} – Wheelmap</title>
        </Head>
        <App feature={feature} featureId={featureId} />
      </React.Fragment>
    );
  }
}

export default Nodes;
