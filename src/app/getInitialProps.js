// @flow
import UAParser from 'ua-parser-js';

import { expandedPreferredLocales, loadExistingLocalizationByPreference } from '../lib/i18n';
import Categories from '../lib/Categories';
import { type Feature, isWheelmapFeatureId } from '../lib/Feature';

import { dataSourceCache } from '../lib/cache/DataSourceCache';
import { sourceIdsForFeature } from '../components/NodeToolbar/SourceList';
import { licenseCache } from '../lib/cache/LicenseCache';
import { wheelmapFeatureCache } from '../lib/cache/WheelmapFeatureCache';
import { accessibilityCloudFeatureCache } from '../lib/cache/AccessibilityCloudFeatureCache';

type DataTableEntry<Props> = {
  getInitialProps: (query: { [key: string]: string }, isServer: boolean) => Props,
};

type DataTable = { [key: string]: DataTableEntry<{}> };

function fetchFeature(featureId: string, useCache: boolean): Promise<Feature> {
  const isWheelmap = isWheelmapFeatureId(featureId);

  if (isWheelmap) {
    return wheelmapFeatureCache.fetchFeature(featureId, { useCache });
  }

  return accessibilityCloudFeatureCache.fetchFeature(featureId, { useCache });
}

const dataTable: DataTable = {
  place_detail: {
    async getInitialProps(query, isServer) {
      if (!query.id) {
        const error = new Error();
        error.statusCode = 404;
        throw error;
      }

      // do not cache on server
      const feature = await fetchFeature(query.id, isServer);

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
    },
  },
  search: {
    async getInitialProps(query, isServer) {
      return { searchQuery: query.q };
    },
  },
};

export function getInitialProps(
  { routeName, ...query }: { routeName: string, [key: string]: string },
  isServer: boolean
) {
  const dataItem = dataTable[routeName];

  if (!dataItem) {
    return {};
  }

  return dataItem.getInitialProps(query, isServer);
}

export async function getAppInitialProps(
  {
    userAgentString,
    languages,
    ...query
  }: { userAgentString: string, languages: string[], [key: string]: string },
  isServer: boolean
) {
  const userAgentParser = new UAParser(userAgentString);
  const userAgent = userAgentParser.getResult();

  const locales = expandedPreferredLocales(languages);
  const translations = await loadExistingLocalizationByPreference(locales);

  const categories = await Categories.generateLookupTables({
    locale: locales[0],
  });

  return { userAgent, translations, categories };
}
