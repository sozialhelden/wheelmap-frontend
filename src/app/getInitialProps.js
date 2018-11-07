// @flow
import UAParser from 'ua-parser-js';

import { getAvailableTranslationsByPreference, type Translations } from '../lib/i18n';

import allTranslations from '../lib/translations.json';

import Categories, { type ACCategory, type WheelmapCategory } from '../lib/Categories';
import { type UAResult, configureUserAgent } from '../lib/userAgent';
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
  rawCategoryLists: RawCategoryLists,
  translations: Translations[],
  clientSideConfiguration: ClientSideConfiguration,
  hostName: string,
  accessibilityFilter: YesNoLimitedUnknown[],
  toiletFilter: YesNoUnknown[],
  disableWheelmapSource?: boolean,
  isCordovaBuild?: boolean,
  skipApplicationBody?: boolean,
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
    localeStrings,
    hostName,
    category,
    extent,
    lat,
    lon,
    locale: overriddenLocaleString,
    accessibility,
    toilet,
    q,
    includeSourceIds,
    disableWheelmapSource,
    ...query
  }: {
    userAgentString: string,
    localeStrings: string[],
    hostName: string,
    category?: string,
    extent?: [number, number, number, number],
    lat?: number,
    lon?: number,
    locale?: string,
    accessibility?: string,
    toilet?: string,
    includeSourceIds?: string,
    disableWheelmapSource?: string,
    [key: string]: string,
  },
  isServer: boolean,
  useCache: boolean = true
): Promise<AppProps> {
  // flow type is not synced with actual APIs
  // $FlowFixMe invalid type definition without userAgentString argument
  const userAgentParser = new UAParser(userAgentString);
  const userAgent = ((userAgentParser.getResult(): any): UAResult);
  configureUserAgent(userAgent);

  // load application configuration
  let clientSideConfiguration = useCache ? appPropsCache.clientSideConfiguration : null;
  const clientSideConfigurationPromise = !clientSideConfiguration
    ? fetchClientSideConfiguration(hostName)
    : null;

  // setup translations
  const translations =
    useCache && appPropsCache.translations
      ? appPropsCache.translations
      : getAvailableTranslationsByPreference(
          allTranslations,
          localeStrings,
          overriddenLocaleString
        );
  const preferredLocaleString = translations[0].headers.language;

  // load categories
  let rawCategoryLists = useCache ? appPropsCache.rawCategoryLists : null;
  const categoriesPromise = !rawCategoryLists
    ? Categories.fetchCategoryData({
        locale: preferredLocaleString,
        disableWheelmapSource: disableWheelmapSource === 'true',
      })
    : null;

  if (clientSideConfigurationPromise || categoriesPromise) {
    clientSideConfiguration = clientSideConfigurationPromise
      ? await clientSideConfigurationPromise
      : null;
    rawCategoryLists = categoriesPromise ? await categoriesPromise : null;
  }

  if (!rawCategoryLists) {
    throw new Error('missing categories lookup table');
  }

  const accessibilityFilter = getAccessibilityFilterFrom(accessibility);
  const toiletFilter = getToiletFilterFrom(toilet);

  // assign to local variable for better flow errors
  const appProps: AppProps = {
    userAgent,
    translations,
    rawCategoryLists,
    clientSideConfiguration,
    category,
    extent,
    lat,
    lon,
    hostName,
    preferredLocale: overriddenLocaleString,
    accessibilityFilter,
    toiletFilter,
    searchQuery: q,
    includeSourceIds,
    disableWheelmapSource: disableWheelmapSource === 'true',
  };
  return appProps;
}

const appPropsCache: $Shape<AppProps> = {};

export function clientStoreAppInitialProps(props: $Shape<AppProps>, isServer: boolean) {
  if (!isServer) {
    appPropsCache.translations = props.translations || appPropsCache.translations;
  }
  appPropsCache.rawCategoryLists = props.rawCategoryLists || appPropsCache.rawCategoryLists;
  appPropsCache.clientSideConfiguration =
    props.clientSideConfiguration || appPropsCache.clientSideConfiguration;
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
