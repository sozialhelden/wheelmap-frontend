// @flow
import UAParser from 'ua-parser-js';

import { getAvailableTranslationsByPreference, type Translations } from '../lib/i18n';

import allTranslations from '../lib/translations.json';

import { type RawCategoryLists } from '../lib/Categories';
import { type UAResult, configureUserAgent } from '../lib/userAgent';
import {
  type YesNoLimitedUnknown,
  type YesNoUnknown,
  getAccessibilityFilterFrom,
  getToiletFilterFrom,
} from '../lib/Feature';

import { type App } from '../lib/App';

import { appCache } from '../lib/cache/AppCache';
import { categoriesCache } from '../lib/cache/CategoryLookupTablesCache';
import { mappingEventsCache } from '../lib/cache/MappingEventsCache';
import type { MappingEvents } from '../lib/MappingEvent';

import SearchData from './SearchData';
import PlaceDetailsData from './PlaceDetailsData';
import MapData from './MapData';
import CreatePlaceData from './CreatePlaceData';
import ContributionThanksData from './ContributionThanksData';
import MappingEventDetailData from './MappingEventDetailData';

export type AppProps = {
  app: App,
  userAgent: UAResult,
  rawCategoryLists: RawCategoryLists,
  translations: Translations[],
  mappingEvents: MappingEvents,
  hostName: string,
  accessibilityFilter: YesNoLimitedUnknown[],
  toiletFilter: YesNoUnknown[],
  routeName?: string,
  path?: string,
  statusCode?: number,
  preferredLocaleString: string,
  skipApplicationBody?: boolean,

  includeSourceIds: Array<string>,
  excludeSourceIds: Array<string>,
  disableWheelmapSource?: boolean,
  inEmbedMode: boolean,
  embedToken?: string,
};

type DataTableQuery = {
  [key: string]: string,
};

export type DataTableEntry<Props> = {
  getInitialRouteProps?: (
    query: DataTableQuery,
    appPropsPromise: Promise<AppProps>,
    isServer: boolean
  ) => Promise<Props>,
  getRenderProps?: (props: Props, isServer: boolean) => Props,
  getHead?: (
    props: Props & AppProps,
    baseUrl?: string
  ) => Promise<React$Element<any>> | React$Element<any>,
  storeInitialRouteProps?: (props: Props) => void,
};

type DataTable = {
  [key: string]: DataTableEntry<any>,
};

const dataTable: DataTable = Object.freeze({
  placeDetail: PlaceDetailsData,
  search: SearchData,
  map: MapData,
  equipment: PlaceDetailsData,
  createPlace: CreatePlaceData,
  contributionThanks: ContributionThanksData,
  mappingEventDetail: MappingEventDetailData,
  mappingEventJoin: MappingEventDetailData,
});

export function getInitialRouteProps(
  {
    routeName,
    ...query
  }: {
    routeName: string,
    [key: string]: string,
  },
  appPropsPromise: Promise<AppProps>,
  isServer: boolean
) {
  const dataItem = dataTable[routeName];

  if (!dataItem || !dataItem.getInitialRouteProps) {
    return {};
  }

  return dataItem.getInitialRouteProps(query, appPropsPromise, isServer);
}

export function getRenderProps<Props>(routeName: string, props: Props, isServer: boolean): Props {
  const dataItem = dataTable[routeName];

  if (!dataItem || !dataItem.getRenderProps) {
    return props;
  }

  return dataItem.getRenderProps(props, isServer);
}

export async function getInitialAppProps(
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
    excludeSourceIds,
    disableWheelmapSource: overriddenWheelmapSource,
    appId: overriddenAppId,
    embedded,
    embedToken,
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
    excludeSourceIds?: string,
    disableWheelmapSource?: string,
    appId?: string,
    embedded?: string,
    embedToken?: string,
    [key: string]: ?string,
  },
  useCache: boolean = true
): Promise<AppProps> {
  // flow type is not synced with actual APIs
  // $FlowFixMe invalid type definition without userAgentString argument
  const userAgentParser = new UAParser(userAgentString);
  const userAgent = ((userAgentParser.getResult(): any): UAResult);
  configureUserAgent(userAgent);

  const usedHostName = overriddenAppId || hostName;

  // load application configuration
  const appPromise = appCache.getApp(usedHostName);

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
  const rawCategoryListsPromise = categoriesCache.getRawCategoryLists({
    locale: preferredLocaleString,
    disableWheelmapSource: overriddenWheelmapSource === 'true',
  });

  const app = await appPromise;
  const clientSideConfiguration = app.clientSideConfiguration;
  const [rawCategoryLists, mappingEvents] = await Promise.all([
    rawCategoryListsPromise,
    mappingEventsCache.getMappingEvents(app),
  ]);

  if (!clientSideConfiguration) {
    throw new Error('missing clientSideConfiguration');
  }

  if (!rawCategoryLists) {
    throw new Error('missing raw category data');
  }

  const usedDisableWheelmapSource =
    typeof overriddenWheelmapSource === 'undefined'
      ? clientSideConfiguration.disableWheelmapSource
      : overriddenWheelmapSource === 'true';
  const accessibilityFilter = getAccessibilityFilterFrom(accessibility);
  const toiletFilter = getToiletFilterFrom(toilet);

  const includeSourceIdsArray =
    (includeSourceIds ? includeSourceIds.split(/,/) : null) ||
    (clientSideConfiguration ? clientSideConfiguration.includeSourceIds : []);
  const excludeSourceIdsArray =
    (excludeSourceIds ? excludeSourceIds.split(/,/) : null) ||
    (clientSideConfiguration ? clientSideConfiguration.excludeSourceIds : []);

  // assign to local variable for better flow errors
  const appProps: AppProps = {
    userAgent,
    translations,
    rawCategoryLists,
    clientSideConfiguration,
    app,
    category,
    mappingEvents,
    extent,
    lat,
    lon,
    hostName: usedHostName,
    preferredLocaleString: preferredLocaleString,
    accessibilityFilter,
    toiletFilter,
    searchQuery: q,
    overriddenAppId,

    includeSourceIds: includeSourceIdsArray,
    excludeSourceIds: excludeSourceIdsArray,
    disableWheelmapSource: usedDisableWheelmapSource,
    inEmbedMode: embedded === 'true',
    embedToken,
  };
  return appProps;
}

const appPropsCache: $Shape<AppProps> = {};

export function storeInitialAppProps(props: $Shape<AppProps>, isServer: boolean) {
  const { translations, rawCategoryLists, app, hostName, preferredLocaleString } = props;

  // only store translations on server
  if (!isServer) {
    appPropsCache.translations = translations || appPropsCache.translations;
  }

  if (appCache && hostName) {
    appCache.injectApp(hostName, app);
  }

  if (preferredLocaleString && rawCategoryLists) {
    categoriesCache.injectLookupTables(preferredLocaleString, rawCategoryLists);
  }
}

export function storeInitialRouteProps(routeName: string, props: any) {
  const dataItem = dataTable[routeName];

  if (!dataItem || !dataItem.storeInitialRouteProps) {
    return {};
  }

  return dataItem.storeInitialRouteProps(props);
}

export function getHead(routeName: string, props: any, baseUrl?: string) {
  const dataItem = dataTable[routeName];

  if (!dataItem || !dataItem.getHead) {
    return null;
  }

  return dataItem.getHead(props, baseUrl);
}
