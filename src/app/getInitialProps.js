// @flow
import UAParser from 'ua-parser-js';

import {
  expandedPreferredLocales,
  loadExistingLocalizationByPreference,
  type Translations,
} from '../lib/i18n';

import Categories, { type CategoryLookupTables } from '../lib/Categories';
import { type UAResult } from '../lib/userAgent';

import PlaceDetailsData from './placeDetailsData';
import SearchData from './searchData';

export type DataTableEntry<Props> = {
  getInitialProps: (query: { [key: string]: string }, isServer: boolean) => Promise<Props>,
  clientStoreInitialProps?: (props: Props) => void,
};

type DataTable = { [key: string]: DataTableEntry<any> };

type AppProps = {
  userAgent: UAResult,
  categories: CategoryLookupTables,
  translations: Translations[],
};

const dataTable: DataTable = {
  place_detail: PlaceDetailsData,
  search: SearchData,
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
): Promise<AppProps> {
  // flow type is not synced with actual apis
  const userAgentParser = new UAParser(userAgentString);
  const userAgent = ((userAgentParser.getResult(): any): UAResult);

  const locales = expandedPreferredLocales(languages);
  const translations =
    clientCache.translations || (await loadExistingLocalizationByPreference(locales));

  const categories =
    clientCache.categories ||
    (await Categories.generateLookupTables({
      locale: locales[0],
    }));

  return { userAgent, translations, categories };
}

const clientCache: $Shape<AppProps> = {};

export function clientStoreAppInitialProps(props: AppProps) {
  clientCache.translations = props.translations;
  clientCache.categories = props.categories;
}

export function clientStoreInitialProps(routeName: string, props: any) {
  const dataItem = dataTable[routeName];

  if (!dataItem || !dataItem.clientStoreInitialProps) {
    return {};
  }

  return dataItem.clientStoreInitialProps(props);
}
