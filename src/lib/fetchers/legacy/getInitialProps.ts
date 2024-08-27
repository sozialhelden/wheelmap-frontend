import { UAParser } from 'ua-parser-js';

import { ReactElement } from 'react';
import App from 'next/app';
import { Translations } from 'ttag/types';
import SearchData from './SearchData';
import PlaceDetailsData from './PlaceDetailsData';
import MapData from './MapData';
import ContributionThanksData from './ContributionThanksData';
import MappingEventDetailData from './MappingEventDetailData';
import { PotentialPromise } from './PlaceDetailsProps';
import CategoryLookupTablesCache from '../cache/CategoryLookupTablesCache';
import { mappingEventsCache } from '../cache/MappingEventsCache';
import { getAvailableTranslationsByPreference } from '../i18n';
import { RawCategoryLists } from '../model/Categories';
import {
  YesNoLimitedUnknown,
  YesNoUnknown,
  getAccessibilityFilterFrom,
  getToiletFilterFrom,
} from '../model/Feature';
import { MappingEvents, MappingEvent } from '../model/MappingEvent';
import { UAResult, configureUserAgent } from '../userAgent';

export type RenderContext = {
  app: App;

  userAgent: UAResult;
  rawCategoryLists: RawCategoryLists;
  translations: Translations[];
  mappingEvents: MappingEvents;
  hostName: string;
  accessibilityFilter: YesNoLimitedUnknown[];
  toiletFilter: YesNoUnknown[];
  routeName?: string;
  path?: string;
  statusCode?: number;
  preferredLocaleString: string;
  skipApplicationBody?: boolean;

  includeSourceIds: Array<string>;
  excludeSourceIds: Array<string>;
  disableWheelmapSource?: boolean;
  inEmbedMode: boolean;
  embedToken?: string;
};

type DataTableQuery = {
  [key: string]: string;
};

export type DataTableEntry<Props> = {
  getInitialRouteProps?: (
    query: DataTableQuery,
    renderContextPromise: Promise<RenderContext>,
    isServer: boolean
  ) => Promise<Props>;
  getAdditionalPageComponentProps?: (
    props: Props & RenderContext,
    isServer: boolean
  ) => Props;
  getHead?: (
    props: Props & RenderContext,
    baseUrl?: string
  ) => PotentialPromise<ReactElement<any>>;
  getMappingEvent?: (
    eventId: string,
    renderContext: RenderContext
  ) => Promise<MappingEvent>;
  storeInitialRouteProps?: (props: Props, appToken: string) => void;
};

type DataTable = {
  [key: string]: DataTableEntry<any>;
};

const dataTable: DataTable = Object.freeze({
  placeDetail: PlaceDetailsData,
  osmWayDetail: PlaceDetailsData,
  osmNodeDetail: PlaceDetailsData,
  osmRelationDetail: PlaceDetailsData,
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

export async function getInitialRouteProps(
  {
    routeName,
    ...query
  }: {
    routeName: string;
    [key: string]: string;
  },
  renderContextPromise: Promise<RenderContext>,
  isServer: boolean,
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
  isServer: boolean,
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
  userAgentString: string;
  localeStrings: string[];
  hostName: string;
  category?: string;
  extent?: [number, number, number, number];
  lat?: number;
  lon?: number;
  locale?: string;
  accessibility?: string;
  toilet?: string;
  includeSourceIds?: string;
  excludeSourceIds?: string;
  disableWheelmapSource?: string;
  appId?: string;
  embedded?: string;
  embedToken?: string;
  [key: string]: any;
}): Promise<RenderContext> {
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
    overriddenLocaleString,
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

  const usedDisableWheelmapSource = typeof overriddenWheelmapSource === 'undefined'
    ? clientSideConfiguration.disableWheelmapSource
    : overriddenWheelmapSource === 'true';
  const accessibilityFilter = getAccessibilityFilterFrom(accessibility);
  const toiletFilter = getToiletFilterFrom(toilet);

  const includeSourceIdsArray = (includeSourceIds ? includeSourceIds.split(/,/) : null)
    || (clientSideConfiguration ? clientSideConfiguration.includeSourceIds : []);
  const excludeSourceIdsArray = (excludeSourceIds ? excludeSourceIds.split(/,/) : null)
    || (clientSideConfiguration ? clientSideConfiguration.excludeSourceIds : []);

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
    preferredLocaleString,
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

const cachedTranslations: Translations[] = [];
