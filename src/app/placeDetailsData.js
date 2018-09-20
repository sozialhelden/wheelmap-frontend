// @flow

import { type DataTableEntry } from './getInitialProps';

import {
  type Feature,
  isWheelmapFeatureId,
  type WheelmapFeature,
  type AccessibilityCloudFeature,
} from '../lib/Feature';

import { dataSourceCache } from '../lib/cache/DataSourceCache';
import { sourceIdsForFeature } from '../components/NodeToolbar/SourceList';
import { licenseCache } from '../lib/cache/LicenseCache';
import { wheelmapFeatureCache } from '../lib/cache/WheelmapFeatureCache';
import { accessibilityCloudFeatureCache } from '../lib/cache/AccessibilityCloudFeatureCache';

function fetchFeature(featureId: string, useCache: boolean): Promise<Feature> {
  const isWheelmap = isWheelmapFeatureId(featureId);

  if (isWheelmap) {
    return wheelmapFeatureCache.fetchFeature(featureId, { useCache });
  }

  return accessibilityCloudFeatureCache.fetchFeature(featureId, { useCache });
}

type PlaceProps = {
  feature: ?Feature,
  featureId: ?(string | number),
  sources?: {}[],
  licenses?: {}[],
};

const PlaceDetailsData: DataTableEntry<PlaceProps> = {
  async getInitialProps(query, isServer): Promise<PlaceProps> {
    if (!query.id) {
      const error = new Error();
      error.statusCode = 404;
      throw error;
    }

    try {
      // do not cache on server
      const useCache = !isServer;

      const feature = await fetchFeature(query.id, useCache);
      const sources = await Promise.all(
        sourceIdsForFeature(feature).map(sourceId =>
          dataSourceCache.getDataSourceWithId(sourceId, { useCache })
        )
      );

      const licenses = await Promise.all(
        sources
          .map(source => {
            if (typeof source.licenseId === 'string') {
              return licenseCache.getLicenseWithId(source.licenseId, { useCache });
            }
            return null;
          })
          .filter(Boolean)
      );

      return { feature, featureId: query.id, sources, licenses };
    } catch (e) {
      console.error('Failed loading feature', query.id);
      // TODO how to redirect to 404 or other error
      return { feature: null, featureId: null };
    }
  },
  clientStoreInitialProps(props: PlaceProps) {
    const { feature, featureId, sources, licenses } = props;
    if (!feature) {
      return;
    }

    // inject feature
    const isWheelmap = isWheelmapFeatureId(featureId);
    if (isWheelmap) {
      wheelmapFeatureCache.injectFeature(((feature: any): WheelmapFeature));
    } else {
      accessibilityCloudFeatureCache.injectFeature(((feature: any): AccessibilityCloudFeature));
    }

    // inject sources & licenses
    if (sources) {
      sources.forEach((s: any) => {
        const url = dataSourceCache.urlFromId(s._id);
        dataSourceCache.inject(url, s);
      });
    }

    if (licenses) {
      licenses.forEach((l: any) => {
        const url = licenseCache.urlFromId(l._id);
        licenseCache.inject(url, l);
      });
    }
  },
};

export default PlaceDetailsData;
