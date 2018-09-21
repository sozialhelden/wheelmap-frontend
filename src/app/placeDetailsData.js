// @flow

import { type DataTableEntry } from './getInitialProps';

import {
  type Feature,
  isWheelmapFeatureId,
  type WheelmapFeature,
  type AccessibilityCloudFeature,
  sourceIdsForFeature,
} from '../lib/Feature';

import { type PlaceDetailsProps } from './PlaceDetailsProps';
import { dataSourceCache, type DataSource } from '../lib/cache/DataSourceCache';
import { licenseCache, type License } from '../lib/cache/LicenseCache';
import { wheelmapFeatureCache } from '../lib/cache/WheelmapFeatureCache';
import { accessibilityCloudFeatureCache } from '../lib/cache/AccessibilityCloudFeatureCache';

function fetchFeature(featureId: string, useCache: boolean): Promise<Feature> {
  const isWheelmap = isWheelmapFeatureId(featureId);

  if (isWheelmap) {
    return wheelmapFeatureCache.fetchFeature(featureId, { useCache });
  }

  return accessibilityCloudFeatureCache.fetchFeature(featureId, { useCache });
}

const PlaceDetailsData: DataTableEntry<PlaceDetailsProps> = {
  async getInitialProps(query, isServer): Promise<PlaceDetailsProps> {
    const featureId = query.id;

    try {
      if (!featureId) {
        const error = new Error('No feature id passed into placeDetailsData');
        error.statusCode = 404;
        throw error;
      }

      // do not cache on server
      const useCache = !isServer;

      // console.log("loading", { useCache });
      const feature = await fetchFeature(featureId, useCache);

      // console.log("loaded", { useCache, feature });

      let sources: DataSource[] = [];
      let licenses: License[] = [];
      if (!isWheelmapFeatureId(featureId)) {
        // console.log("loading", { sources });
        sources = await Promise.all(
          sourceIdsForFeature(feature).map(sourceId =>
            dataSourceCache.getDataSourceWithId(sourceId, { useCache })
          )
        );
        // console.log("loaded", { sources });
        // console.log("loading", { licenses });

        licenses = await Promise.all(
          sources
            .map(source => {
              if (typeof source.licenseId === 'string') {
                return licenseCache.getLicenseWithId(source.licenseId, { useCache });
              }
              return null;
            })
            .filter(Boolean)
        );
        //  console.log("loaded", { licenses });
      }

      // console.log({ feature, featureId, sources, licenses, lightweightFeature: null });
      return { feature, featureId, sources, licenses, lightweightFeature: null };
    } catch (e) {
      console.error('Failed loading feature', featureId);
      // TODO how to redirect to 404 or other error
      return {
        feature: null,
        featureId: null,
        sources: [],
        licenses: [],
        lightweightFeature: null,
      };
    }
  },
  clientStoreInitialProps(props: PlaceDetailsProps) {
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
