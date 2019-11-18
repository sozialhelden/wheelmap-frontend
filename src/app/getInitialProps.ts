import UAParser from 'ua-parser-js';

import { getAvailableTranslationsByPreference, Translations } from '../lib/i18n';

import allTranslations from '../lib/translations.json';

import { RawCategoryLists } from '../lib/Categories';
import { UAResult, configureUserAgent } from '../lib/userAgent';
import {
  YesNoLimitedUnknown,
  YesNoUnknown,
  getAccessibilityFilterFrom,
  getToiletFilterFrom,
} from '../lib/Feature';

import { App } from '../lib/App';

import { appCache } from '../lib/cache/AppCache';
import CategoryLookupTablesCache from '../lib/cache/CategoryLookupTablesCache';
import { mappingEventsCache } from '../lib/cache/MappingEventsCache';
import { MappingEvents, MappingEvent } from '../lib/MappingEvent';

import SearchData from './SearchData';
import PlaceDetailsData from './PlaceDetailsData';
import MapData from './MapData';
import CreatePlaceData from './CreatePlaceData';
import ContributionThanksData from './ContributionThanksData';
import MappingEventDetailData from './MappingEventDetailData';
import { ReactElement } from 'react';

export type RenderContext = {
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
    renderContextPromise: Promise<RenderContext>,
    isServer: boolean
  ) => Promise<Props>,
  getAdditionalPageComponentProps?: (props: Props, isServer: boolean) => Props,
  getHead?: (
    props: Props & RenderContext,
    baseUrl?: string
  ) => Promise<ReactElement<any>> | ReactElement<any>,
  getMappingEvent?: (eventId: string, renderContext: RenderContext) => MappingEvent | undefined,
  storeInitialRouteProps?: (props: Props, appToken: string) => void,
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

export const categoriesCache = new CategoryLookupTablesCache({
  reloadInBackground: true,
  maxAllowedCacheAgeBeforeReload: 1000 * 60 * 60, // 1 hour
});

export function getInitialRouteProps(
  {
    routeName,
    ...query
  }: {
    routeName: string,
    [key: string]: string,
  },
  renderContextPromise: Promise<RenderContext>,
  isServer: boolean
) {
  const dataItem = dataTable[routeName];

  if (!dataItem || !dataItem.getInitialRouteProps) {
    return {};
  }

  return dataItem.getInitialRouteProps(query, renderContextPromise, isServer);
}

export function getAdditionalPageComponentProps<Props>(
  routeName: string,
  props: Props,
  isServer: boolean
): Props {
  const dataItem = dataTable[routeName];

  if (!dataItem || !dataItem.getAdditionalPageComponentProps) {
    return props;
  }

  return dataItem.getAdditionalPageComponentProps(props, isServer);
}

export async function getInitialRenderContext({
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
  [key: string]: any,
}): Promise<RenderContext> {
  // flow type is not synced with actual APIs
  // $FlowFixMe invalid type definition without userAgentString argument
  const userAgentParser = new UAParser(userAgentString);
  const userAgent = userAgentParser.getResult();
  configureUserAgent(userAgent);

  const usedHostName = overriddenAppId || hostName;

  // load application configuration
  const appPromise = appCache.getApp(usedHostName);

  // setup translations
  const translations = getAvailableTranslationsByPreference(
    allTranslations,
    localeStrings,
    overriddenLocaleString
  );

  const preferredLocaleString = translations[0].headers.language;

  const app = await appPromise;

  // load categories
  const rawCategoryListsPromise = categoriesCache.getRawCategoryLists({
    appToken: app.tokenString,
    locale: preferredLocaleString,
    disableWheelmapSource: overriddenWheelmapSource === 'true',
  });

  const clientSideConfiguration = app.clientSideConfiguration as any;
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
  const renderContext = {
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
  return renderContext;
}

let cachedTranslations: Translations[] = [];

export function storeInitialRenderContext(
  props: Partial<RenderContext>,
  isServer: boolean,
  appToken: string
) {
  const { translations, rawCategoryLists, app, hostName, preferredLocaleString } = props;

  // only store translations on server
  if (!isServer) {
    cachedTranslations = translations || cachedTranslations;
  }

  if (appCache && hostName) {
    appCache.injectApp(hostName, app, appToken);
  }

  if (preferredLocaleString && rawCategoryLists) {
    categoriesCache.injectLookupTables(preferredLocaleString, rawCategoryLists);
  }
}

export function storeInitialRouteProps(routeName: string, props: any, appToken: string) {
  const dataItem = dataTable[routeName];

  if (!dataItem || !dataItem.storeInitialRouteProps) {
    return {};
  }

  return dataItem.storeInitialRouteProps(props, appToken);
}

export function getHead(routeName: string, props: any, baseUrl?: string) {
  const dataItem = dataTable[routeName];

  if (!dataItem || !dataItem.getHead) {
    return null;
  }

  return dataItem.getHead(props, baseUrl);
}
