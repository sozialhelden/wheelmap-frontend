// @flow

import * as React from 'react';
import Head from 'next/head';

import App from '../App';
import { type Feature, isWheelmapFeatureId, placeNameFor } from '../lib/Feature';
import { type CategoryLookupTables } from '../lib/Categories';

import { dataSourceCache } from '../lib/cache/DataSourceCache';
import { sourceIdsForFeature } from '../components/NodeToolbar/SourceList';
import { licenseCache } from '../lib/cache/LicenseCache';
import { wheelmapFeatureCache } from '../lib/cache/WheelmapFeatureCache';
import { accessibilityCloudFeatureCache } from '../lib/cache/AccessibilityCloudFeatureCache';

async function fetchFeature(featureId: string, useCache: boolean): Promise<any> {
  const isWheelmap = isWheelmapFeatureId(featureId);

  if (isWheelmap) {
    return wheelmapFeatureCache.fetchFeature(featureId, { useCache });
  }

  return accessibilityCloudFeatureCache.fetchFeature(featureId, { useCache });
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

    // do not cache on server
    const feature = await fetchFeature(query.id, !res);

    const sources = await Promise.all(
      sourceIdsForFeature(feature).map(sourceId => dataSourceCache.getDataSourceWithId(sourceId))
    );

    const licenses = (await Promise.all(
      sources.map(source => {
        if (typeof source.licenseId === 'string') {
          return licenseCache.getLicenseWithId(source.licenseId);
        }

        return false;
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
          <title>{placeNameFor(feature.properties)} – Wheelmap</title>
        </Head>
        <App {...this.props} />
      </React.Fragment>
    );
  }
}

export default Nodes;
