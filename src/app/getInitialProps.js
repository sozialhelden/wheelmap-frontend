// @flow
import UAParser from 'ua-parser-js';

import {
  expandedPreferredLocales,
  loadExistingLocalizationByPreference,
  type Translations,
} from '../lib/i18n';

import Categories, { type CategoryLookupTables } from '../lib/Categories';
import { type UAResult } from '../lib/userAgent';
import {
  type YesNoLimitedUnknown,
  type YesNoUnknown,
  getAccessibilityFilterFrom,
  getToiletFilterFrom,
} from '../lib/Feature';

import {
  fetchClientSideConfiguration,
  type ClientSideConfiguration,
} from '../lib/ClientSideConfiguration';

import SearchData from './SearchData';
import PlaceDetailsData from './PlaceDetailsData';
import MapData from './MapData';

export type AppProps = {
  userAgent: UAResult,
  categories: CategoryLookupTables,
  translations: Translations[],
  clientSideConfiguration: ClientSideConfiguration,
  hostName: string,
  accessibilityFilter: YesNoLimitedUnknown[],
  toiletFilter: YesNoUnknown[],
  isCordovaBuild?: boolean,
};

type DataTableQuery = {
  [key: string]: string,
};

export type DataTableEntry<Props> = {
  getInitialProps?: (query: DataTableQuery, isServer: boolean) => Promise<Props>,
  getRenderProps?: (props: Props, isServer: boolean) => Props,
  getHead?: (props: Props & AppProps) => Promise<React$Element<any>> | React$Element<any>,
  clientStoreInitialProps?: (props: Props) => void,
};

type DataTable = {
  [key: string]: DataTableEntry<any>,
};

const dataTable: DataTable = Object.freeze({
  place_detail: PlaceDetailsData,
  search: SearchData,
  map: MapData,
  equipment: PlaceDetailsData,
});

export function getInitialProps(
  {
    routeName,
    ...query
  }: {
    routeName: string,
    [key: string]: string,
  },
  isServer: boolean
) {
  const dataItem = dataTable[routeName];

  if (!dataItem || !dataItem.getInitialProps) {
    return {};
  }

  return dataItem.getInitialProps(query, isServer);
}

export function getRenderProps<Props>(routeName: string, props: Props, isServer: boolean): Props {
  const dataItem = dataTable[routeName];

  if (!dataItem || !dataItem.getRenderProps) {
    return props;
  }

  return dataItem.getRenderProps(props, isServer);
}

export async function getAppInitialProps(
  {
    userAgentString,
    languages,
    hostName,
    category,
    extent,
    lat,
    lon,
    locale,
    accessibility,
    toilet,
    q,
    includeSourceIds,
    ...query
  }: {
    userAgentString: string,
    languages: string[],
    hostName: string,
    category?: string,
    extent?: [number, number, number, number],
    lat?: number,
    lon?: number,
    locale?: string,
    accessibility?: string,
    toilet?: string,
    includeSourceIds?: string,
    [key: string]: string,
  },
  isServer: boolean,
  useCache: boolean = true
): Promise<AppProps> {
  // flow type is not synced with actual APIs
  // $FlowFixMe invalid type definition without userAgentString argument
  const userAgentParser = new UAParser(userAgentString);
  const userAgent = ((userAgentParser.getResult(): any): UAResult);

  // load application configuration
  let clientSideConfiguration = useCache ? clientCache.clientSideConfiguration : null;
  const clientSideConfigurationPromise = !clientSideConfiguration
    ? fetchClientSideConfiguration(hostName)
    : null;

  // setup translations
  const locales = expandedPreferredLocales(languages, locale);
  const translations =
    useCache && clientCache.translations
      ? clientCache.translations
      : loadExistingLocalizationByPreference(locales);
  const preferredLocale = translations[0].headers.language;

  // load categories
  let categories = useCache ? clientCache.categories : null;
  const categoriesPromise = !categories
    ? Categories.generateLookupTables({ locale: preferredLocale })
    : null;

  if (clientSideConfigurationPromise || categoriesPromise) {
    clientSideConfiguration = clientSideConfigurationPromise
      ? await clientSideConfigurationPromise
      : null;
    categories = categoriesPromise ? await categoriesPromise : null;
  }

  if (!categories) {
    throw new Error('missing categories lookup table');
  }

  const accessibilityFilter = getAccessibilityFilterFrom(accessibility);
  const toiletFilter = getToiletFilterFrom(toilet);

  // assign to local variable for better flow errors
  const appProps: AppProps = {
    userAgent,
    translations,
    categories,
    clientSideConfiguration,
    category,
    extent,
    lat,
    lon,
    hostName,
    locale: preferredLocale,
    accessibilityFilter,
    toiletFilter,
    searchQuery: q,
    includeSourceIds,
  };
  return appProps;
}

const clientCache: $Shape<AppProps> = {};

export function clientStoreAppInitialProps(props: $Shape<AppProps>) {
  clientCache.translations = props.translations || clientCache.translations;
  clientCache.categories = props.categories || clientCache.categories;
  clientCache.clientSideConfiguration =
    props.clientSideConfiguration || clientCache.clientSideConfiguration;
}

export function clientStoreInitialProps(routeName: string, props: any) {
  const dataItem = dataTable[routeName];

  if (!dataItem || !dataItem.clientStoreInitialProps) {
    return {};
  }

  return dataItem.clientStoreInitialProps(props);
}

export function getHead(routeName: string, props: any) {
  const dataItem = dataTable[routeName];

  if (!dataItem || !dataItem.getHead) {
    return null;
  }

  return dataItem.getHead(props);
}
