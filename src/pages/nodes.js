// @flow

import * as React from 'react';
import Head from 'next/head';

import App from '../App';
import { type Feature, isWheelmapFeatureId } from '../lib/Feature';
import fetch from '../lib/fetch';
import config from '../lib/config';
import { currentLocales } from '../lib/i18n';
import { type CategoryLookupTables } from '../lib/Categories';
import { dataSourceCache } from '../lib/cache/DataSourceCache';
import { sourceIdsForFeature } from '../components/NodeToolbar/SourceList';
import { licenseCache } from '../lib/cache/LicenseCache';

async function fetchFeature(featureId: string): Promise<any> {
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
  categories: CategoryLookupTables,
};

class Nodes extends React.Component<Props> {
  static async getInitialProps({ query, res }) {
    if (!query.id) {
      const error = new Error();
      error.statusCode = 404;

      throw error;
    }

    const feature = await fetchFeature(query.id);

    const sources = await Promise.all(
      sourceIdsForFeature(feature).map(sourceId => dataSourceCache.getDataSourceWithId(sourceId))
    );

    const licenses = (await Promise.all(
      sources.map(source => {
        if (typeof source.licenseId === 'string') {
          return licenseCache.getLicenseWithId(source.licenseId);
        }
      })
    )).filter(Boolean);

    return { feature, featureId: query.id, sources, licenses };
  }

  render() {
    const { feature } = this.props;

    return (
      <React.Fragment>
        <Head>
          {/* @TODO Fix for wheelmap features */}
          <title>{feature.properties.name} – Wheelmap</title>
        </Head>
        <App {...this.props} />
      </React.Fragment>
    );
  }
}

export default Nodes;
