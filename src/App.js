// @flow

import * as React from 'react';
import includes from 'lodash/includes';
import findIndex from 'lodash/findIndex';
import get from 'lodash/get';
import type { Router } from 'next/router';
import queryString from 'query-string';

import config from './lib/config';
import savedState, {
  saveState,
  isFirstStart,
  getJoinedMappingEventData,
  setJoinedMappingEventData,
  getJoinedMappingEventId as readStoredJoinedMappingEventId,
  setJoinedMappingEventId as storeJoinedMappingEventId,
} from './lib/savedState';
import { hasBigViewport, isOnSmallViewport } from './lib/ViewportSize';
import { isTouchDevice, type UAResult } from './lib/userAgent';
import { type RouterHistory } from './lib/RouterHistory';
import { type SearchResultCollection } from './lib/searchPlaces';
import type { Feature, WheelmapFeature } from './lib/Feature';
import type { SearchResultFeature } from './lib/searchPlaces';
import type { EquipmentInfo, EquipmentInfoProperties } from './lib/EquipmentInfo';
import {
  type MappingEvents,
  type MappingEvent,
  isMappingEventVisible,
  isMappingEventOngoingById,
  canMappingEventBeJoined,
} from './lib/MappingEvent';
import { type Cluster } from './components/Map/Cluster';
import { type App as AppModel } from './lib/App';

import MainView, { UnstyledMainView } from './MainView';

import {
  type NodeProperties,
  type YesNoLimitedUnknown,
  type YesNoUnknown,
  isAccessibilityFiltered,
  isToiletFiltered,
  getFeatureId,
} from './lib/Feature';

import {
  accessibilityCloudImageCache,
  InvalidCaptchaReason,
} from './lib/cache/AccessibilityCloudImageCache';

import type { ModalNodeState } from './lib/ModalNodeState';
import { type CategoryLookupTables } from './lib/Categories';
import { type PhotoModel } from './lib/PhotoModel';
import { type PlaceDetailsProps } from './app/PlaceDetailsProps';
import { type PlaceFilter } from './components/SearchToolbar/AccessibilityFilterModel';
import { type LocalizedString } from './lib/i18n';
import { RouteProvider } from './components/Link/RouteContext';

import 'react-activity/dist/react-activity.css';
import './App.css';
import './Global.css';
import 'focus-visible';
import { trackModalView, trackEvent } from './lib/Analytics';
import { trackingEventBackend } from './lib/TrackingEventBackend';

export type LinkData = {
  label: LocalizedString,
  badgeLabel?: LocalizedString,
  url: LocalizedString,
  order?: number,
  tags?: string[],
};

type Props = {
  className?: string,
  router: Router,
  routerHistory: RouterHistory,
  routeName: string,
  categories?: CategoryLookupTables,
  userAgent?: UAResult,
  searchQuery?: ?string,
  searchResults?: SearchResultCollection | Promise<SearchResultCollection>,
  category?: string,
  app: AppModel,
  lat: ?string,
  lon: ?string,
  zoom: ?string,
  extent: ?[number, number, number, number],
  inEmbedMode: boolean,
  mappingEvents: MappingEvents,
  mappingEvent?: MappingEvent,

  includeSourceIds: Array<string>,
  excludeSourceIds: Array<string>,
  disableWheelmapSource?: boolean,
  overriddenAppId?: boolean,

  toiletFilter: YesNoUnknown[],
  accessibilityFilter: YesNoLimitedUnknown[],

  toiletsNearby: ?PotentialPromise<Feature[]>,
} & PlaceDetailsProps;

type State = {
  mappingEvents: MappingEvents,
  isOnboardingVisible: boolean,
  joinedMappingEventId: ?string,
  isMappingEventWelcomeDialogVisible: boolean,
  isMainMenuOpen: boolean,
  modalNodeState: ModalNodeState,
  accessibilityPresetStatus?: ?YesNoLimitedUnknown,
  isSearchBarVisible: boolean,
  isOnSmallViewport: boolean,
  isSearchToolbarExpanded: boolean,
  isMappingEventsToolbarVisible: boolean,
  isMappingEventToolbarVisible: boolean,

  // photo feature
  isPhotoUploadCaptchaToolbarVisible: boolean,
  isPhotoUploadInstructionsToolbarVisible: boolean,
  photosMarkedForUpload: FileList | null,
  waitingForPhotoUpload?: boolean,
  photoCaptchaFailed?: boolean,
  photoFlowNotification?: string,
  photoFlowErrorMessage: ?string,
  photoMarkedForReport: PhotoModel | null,

  activeCluster?: Cluster | null,

  // map controls
  lat?: ?number,
  lon?: ?number,
  isSpecificLatLonProvided: boolean,
  zoom?: ?number,
  extent?: ?[number, number, number, number],
};

function isStickySearchBarSupported() {
  return hasBigViewport() && !isTouchDevice();
}

// filters mapping events for the active app & shown mapping event
function filterMappingEvents(
  mappingEvents: MappingEvents,
  appId: string,
  activeEventId?: string
): MappingEvents {
  return mappingEvents
    .filter(event => isMappingEventVisible(event) || activeEventId === event._id)
    .filter(event => appId === event.appId);
}

class App extends React.Component<Props, State> {
  props: Props;

  state: State = {
    lat: null,
    lon: null,
    isSpecificLatLonProvided: false,
    zoom: null,
    mappingEvents: filterMappingEvents(
      this.props.mappingEvents,
      this.props.app._id,
      this.props.mappingEvent && this.props.mappingEvent._id
    ),

    isSearchBarVisible: isStickySearchBarSupported(),
    isOnboardingVisible: false,
    joinedMappingEventId: null,
    isMappingEventWelcomeDialogVisible: false,
    isMainMenuOpen: false,
    modalNodeState: null,
    accessibilityPresetStatus: null,
    isOnSmallViewport: false,
    isSearchToolbarExpanded: false,
    isMappingEventsToolbarVisible: false,
    isMappingEventToolbarVisible: false,

    // photo feature
    isPhotoUploadCaptchaToolbarVisible: false,
    isPhotoUploadInstructionsToolbarVisible: false,
    photosMarkedForUpload: null,
    photoMarkedForReport: null,
    photoFlowErrorMessage: null,
  };

  map: ?any;

  mainView: ?UnstyledMainView;

  static getDerivedStateFromProps(props: Props, state: State): $Shape<State> {
    const newState: $Shape<State> = {
      isSearchToolbarExpanded: false,
      isSearchBarVisible: isStickySearchBarSupported(),
    };

    // open search results on search route
    if (props.routeName === 'search') {
      newState.isSearchToolbarExpanded = true;
      newState.isSearchBarVisible = true;
      newState.activeCluster = null;
    }

    if (props.routeName === 'createPlace') {
      newState.modalNodeState = 'create';
      trackModalView('create');
      newState.activeCluster = null;
    }

    if (props.routeName === 'contributionThanks') {
      newState.modalNodeState = 'contribution-thanks';
      trackModalView('contribution-thanks');
      newState.activeCluster = null;
    }

    if (props.routeName === 'map') {
      newState.modalNodeState = null;
    }

    if (props.routeName === 'mappingEvents') {
      newState.isMappingEventsToolbarVisible = true;
      newState.isSearchBarVisible = false;
    } else {
      newState.isMappingEventsToolbarVisible = false;
    }

    if (props.routeName === 'mappingEventDetail' || props.routeName === 'mappingEventJoin') {
      newState.isMappingEventToolbarVisible = true;
      newState.isSearchBarVisible = false;
    } else {
      newState.isMappingEventToolbarVisible = false;
    }

    const placeDetailsRoute = props.routeName === 'placeDetail' || props.routeName === 'equipment';
    if (placeDetailsRoute) {
      const { accessibilityFilter, toiletFilter, category } = props;

      newState.isSearchBarVisible =
        isStickySearchBarSupported() &&
        !isAccessibilityFiltered(accessibilityFilter) &&
        !isToiletFiltered(toiletFilter) &&
        !category;
    }

    const parsedZoom = typeof props.zoom === 'string' ? parseInt(props.zoom, 10) : null;
    const parsedLat = typeof props.lat === 'string' ? parseFloat(props.lat) : null;
    const parsedLon = typeof props.lon === 'string' ? parseFloat(props.lon) : null;

    newState.extent = state.extent || props.extent || null;
    newState.zoom = state.zoom || parsedZoom || savedState.map.lastZoom || null;
    newState.lat =
      state.lat || parsedLat || (savedState.map.lastCenter && savedState.map.lastCenter[0]) || null;
    newState.lon =
      state.lon || parsedLon || (savedState.map.lastCenter && savedState.map.lastCenter[1]) || null;

    newState.isSpecificLatLonProvided = Boolean(parsedLat) && Boolean(parsedLon);

    return newState;
  }

  componentDidMount() {
    const { routeName, inEmbedMode } = this.props;

    const shouldStartInSearch = routeName === 'map' && !inEmbedMode;

    if (isFirstStart()) {
      this.setState({ isOnboardingVisible: true });
    } else if (shouldStartInSearch) {
      this.openSearch(true);
    }

    this.setupMappingEvents();

    trackingEventBackend.track(this.props.app, {
      type: 'AppOpened',
      query: queryString.parse(window.location.search),
    });
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    // update filter, to include change in shown mapping event
    if (prevProps.mappingEvent !== this.props.mappingEvent) {
      this.setupMappingEvents();
    }
  }

  setupMappingEvents() {
    const mappingEvents = filterMappingEvents(
      this.props.mappingEvents,
      this.props.app._id,
      this.props.mappingEvent && this.props.mappingEvent._id
    );
    this.setState({ mappingEvents });
    this.initializeJoinedMappingEvent();
  }

  initializeJoinedMappingEvent() {
    const {
      mappingEvents,
      routeName,
      router: { query },
    } = this.props;

    let joinedMappingEventId = readStoredJoinedMappingEventId();
    const joinedMappingEvent = joinedMappingEventId
      ? mappingEvents.find(event => event._id === joinedMappingEventId)
      : null;
    const state = {
      joinedMappingEvent,
      joinedMappingEventId,
      isMappingEventWelcomeDialogVisible: false,
    };

    if (routeName === 'mappingEventJoin') {
      const mappingEventIdToJoin = query.id;
      const mappingEventToJoin = mappingEvents.find(event => event._id === mappingEventIdToJoin);
      if (mappingEventToJoin && canMappingEventBeJoined(mappingEventToJoin)) {
        state.isMappingEventWelcomeDialogVisible = true;
      }
    }

    // invalidate already locally stored mapping event if it already expired
    if (!joinedMappingEvent || !canMappingEventBeJoined(joinedMappingEvent)) {
      joinedMappingEventId = null;
      storeJoinedMappingEventId(joinedMappingEventId);
      setJoinedMappingEventData();
    }

    this.setState(state);
  }

  trackMappingEventMembershipChanged = (
    reason: 'url' | 'button',
    joinedMappingEventId: ?string,
    emailAddress?: string
  ) => {
    storeJoinedMappingEventId(joinedMappingEventId);
    const search: string = window.location.search;

    if (joinedMappingEventId) {
      const invitationToken = this.props.router.query.token;
      setJoinedMappingEventData(emailAddress, invitationToken);

      trackingEventBackend.track(this.props.app, {
        invitationToken,
        emailAddress,
        type: 'MappingEventJoined',
        joinedMappingEventId: joinedMappingEventId,
        joinedVia: reason,
        query: queryString.parse(search),
      });
      trackEvent({
        category: 'MappingEvent',
        action: 'Joined',
        label: joinedMappingEventId,
      });
    }
  };

  onMappingEventLeave = () => {
    this.trackMappingEventMembershipChanged('button');
    this.setState({ joinedMappingEventId: null });
  };

  onMappingEventJoin = (joinedMappingEventId: string, emailAddress?: string) => {
    this.trackMappingEventMembershipChanged('button', joinedMappingEventId, emailAddress);
    this.setState({
      joinedMappingEventId,
    });
    const params = this.getCurrentParams();
    this.props.routerHistory.replace('mappingEventDetail', params);
  };

  onMappingEventWelcomeDialogOpen = () => {
    const params = this.getCurrentParams();
    this.props.routerHistory.replace('mappingEventJoin', params);
  };

  onMappingEventWelcomeDialogClose = () => {
    const params = this.getCurrentParams();
    this.props.routerHistory.replace('mappingEventDetail', params);
  };

  openSearch(replace: boolean = false) {
    if (this.props.routeName === 'search') {
      return;
    }

    const params = this.getCurrentParams();

    delete params.id;
    delete params.eid;

    if (replace) {
      this.props.routerHistory.replace('search', params);
    } else {
      this.props.routerHistory.push('search', params);
    }

    if (this.mainView) this.mainView.focusSearchToolbar();
  }

  closeSearch() {
    if (this.props.routeName !== 'search') {
      return;
    }

    const params = this.getCurrentParams();

    this.props.routerHistory.push('map', params);
  }

  onClickSearchButton = () => this.openSearch();

  onToggleMainMenu = (isMainMenuOpen: boolean) => {
    this.setState({ isMainMenuOpen });
  };

  onMainMenuHomeClick = () => {
    saveState({ onboardingCompleted: 'false' });
    this.setState({ isOnboardingVisible: true });

    const params = this.getCurrentParams();
    delete params.id;
    delete params.eid;
    this.props.routerHistory.push('map', params);
  };

  onMoveEnd = (state: $Shape<State>) => {
    let { zoom, lat, lon } = state;

    // Adjust zoom level to be stored in the local storage to make sure the user can
    // see some places when reloading the app after some time.
    const lastZoom = String(
      Math.max(zoom || 0, config.minZoomWithSetCategory, config.minZoomWithoutSetCategory)
    );

    saveState({
      'map.lastZoom': lastZoom,
      'map.lastCenter.lat': String(lat),
      'map.lastCenter.lon': String(lon),
      'map.lastMoveDate': new Date().toString(),
    });

    this.setState({ extent: null, lat, lon, zoom });
  };

  onMapClick = () => {
    if (this.state.isSearchToolbarExpanded) {
      this.closeSearch();
      this.mainView && this.mainView.focusMap();
    }
  };

  showSelectedFeature = (
    featureId: string | number,
    properties: ?NodeProperties | ?EquipmentInfoProperties
  ) => {
    const featureIdString = featureId.toString();
    const { routerHistory } = this.props;

    // show equipment inside their place details
    let routeName = 'placeDetail';
    const params = this.getCurrentParams();

    params.id = featureIdString;
    delete params.eid;

    if (properties && typeof properties.placeInfoId === 'string') {
      const placeInfoId = properties.placeInfoId;
      if (includes(['elevator', 'escalator'], properties.category)) {
        routeName = 'equipment';
        params.id = placeInfoId;
        params.eid = featureIdString;
      }
    }

    let activeCluster = null;
    if (this.state.activeCluster) {
      const index = findIndex(
        this.state.activeCluster.features,
        f => (f.id || f._id) === featureIdString
      );
      activeCluster = index !== -1 ? this.state.activeCluster : null;
    }

    this.setState({ activeCluster }, () => {
      routerHistory.push(routeName, params);
    });
  };

  showSelectedMappingEvent = (eventId: string) => {
    const event =
      this.state.mappingEvents && this.state.mappingEvents.find(event => event._id === eventId);
    const extent = event && event.area && event.area.properties.extent;

    if (extent) {
      this.setState({ extent });
    }

    const params = this.getCurrentParams();
    params.id = eventId;
    this.props.routerHistory.push('mappingEventDetail', params);
  };

  showCluster = (cluster: Cluster) => {
    this.setState({ activeCluster: cluster }, () => {
      const params = this.getCurrentParams();
      delete params.id;
      delete params.eid;
      this.props.routerHistory.push('map', params);
    });
  };

  closeActiveCluster = () => {
    this.setState({ activeCluster: null });
  };

  onAccessibilityFilterButtonClick = (filter: PlaceFilter) => {
    let { routeName } = this.props;
    const params = this.getCurrentParams();

    delete params.accessibility;
    delete params.toilet;

    if (filter.accessibilityFilter.length > 0) {
      params.accessibility = filter.accessibilityFilter.join(',');
    }

    if (filter.toiletFilter.length > 0) {
      params.toilet = filter.toiletFilter.join(',');
    }

    this.props.routerHistory.push(routeName, params);
  };

  onSearchResultClick = (feature: SearchResultFeature, wheelmapFeature: ?WheelmapFeature) => {
    const params = this.getCurrentParams();
    let routeName = 'map';

    if (wheelmapFeature) {
      let id = getFeatureId(wheelmapFeature);
      if (id) {
        params.id = id;
        delete params.eid;
        routeName = 'placeDetail';
      }
    }

    if (routeName === 'map') {
      delete params.id;
      delete params.eid;
    }

    if (feature.properties.extent) {
      const extent = feature.properties.extent;
      this.setState({ lat: null, lon: null, extent });
    } else {
      const [lon, lat] = feature.geometry.coordinates;
      this.setState({ lat, lon, extent: null });
    }

    this.props.routerHistory.push(routeName, params);
  };

  onClickFullscreenBackdrop = () => {
    this.setState({ isMainMenuOpen: false, isOnboardingVisible: false, modalNodeState: null });
    trackModalView(null);
    this.onCloseNodeToolbar();
  };

  onStartPhotoUploadFlow = () => {
    // start requesting captcha early
    accessibilityCloudImageCache.getCaptcha(this.props.app.tokenString);

    this.setState({
      isSearchBarVisible: false,
      waitingForPhotoUpload: false,
      isPhotoUploadInstructionsToolbarVisible: true,
      photosMarkedForUpload: null,
      photoFlowErrorMessage: null,
    });
  };

  onExitPhotoUploadFlow = (notification?: string, photoFlowErrorMessage: ?string) => {
    this.setState({
      photoFlowErrorMessage,
      isSearchBarVisible: !isOnSmallViewport(),
      waitingForPhotoUpload: false,
      isPhotoUploadInstructionsToolbarVisible: false,
      isPhotoUploadCaptchaToolbarVisible: false,
      photosMarkedForUpload: null,
      photoCaptchaFailed: false,
      photoFlowNotification: notification,
    });
  };

  onContinuePhotoUploadFlow = (photos: FileList) => {
    if (photos.length === 0) {
      this.onExitPhotoUploadFlow();
      return;
    }
    if (accessibilityCloudImageCache.hasSolvedCaptcha()) {
      this.onFinishPhotoUploadFlow(photos, accessibilityCloudImageCache.captchaSolution || '');
    } else {
      this.setState({
        isSearchBarVisible: false,
        isPhotoUploadInstructionsToolbarVisible: false,
        isPhotoUploadCaptchaToolbarVisible: true,
        photosMarkedForUpload: photos,
        photoCaptchaFailed: false,
        photoFlowNotification: undefined,
        photoFlowErrorMessage: null,
      });
    }
  };

  onFinishPhotoUploadFlow = (photos: FileList, captchaSolution: string) => {
    console.log('onFinishPhotoUploadFlow');
    const { featureId } = this.props;

    if (!featureId) {
      console.error('No feature found, aborting upload!');
      this.onExitPhotoUploadFlow();
      return;
    }

    this.setState({ waitingForPhotoUpload: true, photoFlowNotification: 'uploadProgress' });

    accessibilityCloudImageCache
      .uploadPhotoForFeature(String(featureId), photos, this.props.app.tokenString, captchaSolution)
      .then(() => {
        console.log('Succeeded upload');
        this.onExitPhotoUploadFlow('waitingForReview');
      })
      .catch(reason => {
        console.error('Failed upload', reason);
        if (reason.message === InvalidCaptchaReason) {
          this.setState({ waitingForPhotoUpload: false, photoCaptchaFailed: true });
        } else {
          this.onExitPhotoUploadFlow('uploadFailed', reason && reason.message);
        }
      });
  };

  onStartReportPhotoFlow = (photo: PhotoModel) => {
    this.setState({ isSearchBarVisible: false, photoMarkedForReport: photo });
  };

  onFinishReportPhotoFlow = (photo: PhotoModel, reason: string) => {
    if (photo.source === 'accessibility-cloud') {
      accessibilityCloudImageCache.reportPhoto(
        String(photo.imageId),
        reason,
        this.props.app.tokenString
      );
      this.onExitReportPhotoFlow('reported');
    }
  };

  onExitReportPhotoFlow = (notification?: string) => {
    this.setState({
      isSearchBarVisible: !isOnSmallViewport(),
      photoMarkedForReport: null,
      photoFlowNotification: notification,
    });
  };

  onOpenReportMode = () => {
    if (this.props.featureId) {
      this.setState({ modalNodeState: 'report' });
      trackModalView('report');
    }
  };

  getCurrentParams() {
    const params = {};
    const {
      app,
      category,
      accessibilityFilter,
      toiletFilter,
      featureId,
      equipmentInfoId,
      disableWheelmapSource,
      includeSourceIds,
      excludeSourceIds,
      overriddenAppId,
      inEmbedMode,
    } = this.props;

    if (category) {
      params.category = category;
    }

    if (isAccessibilityFiltered(accessibilityFilter)) {
      params.accessibility = accessibilityFilter.join(',');
    }

    if (isToiletFiltered(toiletFilter)) {
      params.toilet = toiletFilter.join(',');
    }

    if (featureId) {
      params.id = featureId;
    }

    if (equipmentInfoId) {
      params.eid = equipmentInfoId;
    }

    // ensure to keep widget/custom whitelabel parameters
    if (includeSourceIds && includeSourceIds.length > 0) {
      const includeSourceIdsAsString = includeSourceIds.join(',');
      if (includeSourceIdsAsString !== app.clientSideConfiguration.includeSourceIds.join(',')) {
        params.includeSourceIds = includeSourceIdsAsString;
      }
    }

    if (excludeSourceIds && excludeSourceIds.length > 0) {
      const excludeSourceIdsAsString = excludeSourceIds.join(',');
      if (excludeSourceIdsAsString !== app.clientSideConfiguration.excludeSourceIds.join(',')) {
        params.excludeSourceIds = excludeSourceIdsAsString;
      }
    }

    if (
      typeof disableWheelmapSource !== 'undefined' &&
      disableWheelmapSource !== app.clientSideConfiguration.disableWheelmapSource
    ) {
      params.disableWheelmapSource = disableWheelmapSource ? 'true' : 'false';
    }

    if (overriddenAppId) {
      params.appId = overriddenAppId;
    }

    if (inEmbedMode) {
      params.embedded = 'true';
    }

    return params;
  }

  // this is called also when the report dialog is closed
  onCloseNodeToolbar = () => {
    const currentModalState = this.state.modalNodeState;

    if (!currentModalState) {
      const params = this.getCurrentParams();

      delete params.id;
      delete params.eid;

      this.props.routerHistory.push('map', params);
    } else {
      this.setState({ modalNodeState: null });
      trackModalView(null);
    }
  };

  onCloseMappingEventsToolbar = () => {
    const params = this.getCurrentParams();
    delete params.id;
    this.props.routerHistory.push('map', params);
  };

  onCloseModalDialog = () => {
    const params = this.getCurrentParams();
    this.props.routerHistory.push('map', params);
  };

  onCloseOnboarding = () => {
    saveState({ onboardingCompleted: 'true' });
    this.setState({ isOnboardingVisible: false });
    if (this.mainView) this.mainView.focusSearchToolbar();
  };

  onSearchToolbarClick = () => {
    this.openSearch();
  };

  onSearchToolbarClose = () => {
    this.closeSearch();

    if (this.mainView) this.mainView.focusMap();
  };

  onSearchToolbarSubmit = (searchQuery: string) => {
    // Enter a command like `locale:de_DE` to set a new locale.
    const setLocaleCommandMatch = searchQuery.match(/^locale:(\w\w(?:_\w\w))/);

    if (setLocaleCommandMatch) {
      const { routeName, routerHistory } = this.props;
      const params = this.getCurrentParams();

      params.locale = setLocaleCommandMatch[1];

      routerHistory.push(routeName, params);
    }
  };

  onOpenWheelchairAccessibility = () => {
    if (this.props.featureId) {
      this.setState({ modalNodeState: 'edit-wheelchair-accessibility' });
      trackModalView('edit-wheelchair-accessibility');
    }
  };

  onOpenToiletAccessibility = () => {
    if (this.props.featureId) {
      this.setState({ modalNodeState: 'edit-toilet-accessibility' });
      trackModalView('edit-toilet-accessibility');
    }
  };

  onShowSelectedFeature = (feature: Feature | EquipmentInfo) => {
    const featureId = getFeatureId(feature);

    if (!featureId) {
      return;
    }

    this.showSelectedFeature(featureId, feature.properties);
  };

  gotoCurrentFeature() {
    if (this.props.featureId) {
      this.setState({ modalNodeState: null });
      trackModalView(null);
    }
  }

  onCloseWheelchairAccessibility = () => {
    this.gotoCurrentFeature();
  };

  onCloseToiletAccessibility = () => {
    this.gotoCurrentFeature();
  };

  onSelectWheelchairAccessibility = (value: YesNoLimitedUnknown) => {
    if (this.props.featureId) {
      this.setState({
        modalNodeState: 'edit-wheelchair-accessibility',
        accessibilityPresetStatus: value,
      });
      trackModalView('edit-wheelchair-accessibility');
    }
  };

  onSearchQueryChange = (newSearchQuery: ?string) => {
    const params = this.getCurrentParams();

    if (!newSearchQuery || newSearchQuery.length === 0) {
      delete params.q;

      return this.props.routerHistory.replace('map', params);
    }

    params.q = newSearchQuery;

    this.props.routerHistory.replace('search', params);
  };

  onEquipmentSelected = (placeInfoId: string, equipmentInfo: EquipmentInfo) => {
    this.props.routerHistory.replace('equipment', {
      id: placeInfoId,
      eid: get(equipmentInfo, 'properties._id'),
    });
  };

  isNodeToolbarDisplayed(props: Props = this.props, state: State = this.state) {
    return (
      props.feature &&
      !props.mappingEvent &&
      !state.isSearchToolbarExpanded &&
      !state.isPhotoUploadCaptchaToolbarVisible &&
      !state.isPhotoUploadInstructionsToolbarVisible &&
      !state.photoMarkedForReport
    );
  }

  onMappingEventsLinkClick = () => {
    this.setState({ isMainMenuOpen: false });
  };

  render() {
    const { isSpecificLatLonProvided } = this.state;
    const isNodeRoute = Boolean(this.props.featureId);
    const isNodeToolbarDisplayed = this.isNodeToolbarDisplayed();
    const mapMoveDate = savedState.map.lastMoveDate;
    const wasMapMovedRecently = mapMoveDate && new Date() - mapMoveDate < config.locateTimeout;

    const shouldLocateOnStart = !isSpecificLatLonProvided && !isNodeRoute && !wasMapMovedRecently;

    const isSearchBarVisible = this.state.isSearchBarVisible;
    const isMappingEventsToolbarVisible = this.state.isMappingEventsToolbarVisible;
    const isMappingEventToolbarVisible = this.state.isMappingEventToolbarVisible;
    const isSearchButtonVisible =
      !isSearchBarVisible && !isMappingEventsToolbarVisible && !isMappingEventToolbarVisible;

    const extraProps = {
      isNodeRoute,
      modalNodeState: this.state.modalNodeState,
      isNodeToolbarDisplayed,
      isMappingEventsToolbarVisible,
      isMappingEventToolbarVisible,
      shouldLocateOnStart,
      isSearchButtonVisible,
      isSearchBarVisible,

      featureId: this.props.featureId,
      feature: this.props.feature,
      lightweightFeature: this.props.lightweightFeature,
      equipmentInfoId: this.props.equipmentInfoId,
      equipmentInfo: this.props.equipmentInfo,
      photos: this.props.photos,
      toiletsNearby: this.props.toiletsNearby,
      category: this.props.category,
      categories: this.props.categories,
      sources: this.props.sources,
      userAgent: this.props.userAgent,
      toiletFilter: this.props.toiletFilter,
      accessibilityFilter: this.props.accessibilityFilter,
      searchQuery: this.props.searchQuery,
      lat: this.state.lat,
      lon: this.state.lon,
      zoom: this.state.zoom,
      extent: this.state.extent,
      isOnboardingVisible: this.state.isOnboardingVisible,
      isMappingEventWelcomeDialogVisible: this.state.isMappingEventWelcomeDialogVisible,
      isMainMenuOpen: this.state.isMainMenuOpen,
      isOnSmallViewport: this.state.isOnSmallViewport,
      isSearchToolbarExpanded: this.state.isSearchToolbarExpanded,
      searchResults: this.props.searchResults,
      inEmbedMode: this.props.inEmbedMode,
      mappingEvents: this.state.mappingEvents,
      mappingEvent: this.props.mappingEvent,
      invitationToken: this.props.router.query.token,

      disableWheelmapSource: this.props.disableWheelmapSource,
      includeSourceIds: this.props.includeSourceIds,
      excludeSourceIds: this.props.excludeSourceIds,

      // photo feature
      isPhotoUploadCaptchaToolbarVisible:
        this.props.feature && this.state.isPhotoUploadCaptchaToolbarVisible,
      isPhotoUploadInstructionsToolbarVisible:
        this.props.feature && this.state.isPhotoUploadInstructionsToolbarVisible,
      photosMarkedForUpload: this.state.photosMarkedForUpload,
      waitingForPhotoUpload: this.state.waitingForPhotoUpload,
      photoCaptchaFailed: this.state.photoCaptchaFailed,
      photoFlowNotification: this.state.photoFlowNotification,
      photoFlowErrorMessage: this.state.photoFlowErrorMessage,
      photoMarkedForReport: this.state.photoMarkedForReport,

      // simple 3-button status editor feature
      accessibilityPresetStatus: this.state.accessibilityPresetStatus,

      // feature list (e.g. cluster panel)
      activeCluster: this.state.activeCluster,

      app: this.props.app,
    };

    return (
      <RouteProvider
        value={{
          history: this.props.routerHistory,
          params: this.getCurrentParams(),
          name: this.props.routeName,
        }}
      >
        <MainView
          {...extraProps}
          ref={mainView => {
            this.mainView = mainView;
          }}
          onClickSearchButton={this.onClickSearchButton}
          onToggleMainMenu={this.onToggleMainMenu}
          onMoveEnd={this.onMoveEnd}
          onMapClick={this.onMapClick}
          onMarkerClick={this.showSelectedFeature}
          onClusterClick={this.showCluster}
          onCloseClusterPanel={this.closeActiveCluster}
          onSelectFeatureFromCluster={this.onShowSelectedFeature}
          onSearchResultClick={this.onSearchResultClick}
          onClickFullscreenBackdrop={this.onClickFullscreenBackdrop}
          onOpenReportMode={this.onOpenReportMode}
          onCloseNodeToolbar={this.onCloseNodeToolbar}
          onCloseOnboarding={this.onCloseOnboarding}
          onSearchToolbarClick={this.onSearchToolbarClick}
          onSearchToolbarClose={this.onSearchToolbarClose}
          onSearchToolbarSubmit={this.onSearchToolbarSubmit}
          onCloseModalDialog={this.onCloseModalDialog}
          onOpenWheelchairAccessibility={this.onOpenWheelchairAccessibility}
          onOpenToiletAccessibility={this.onOpenToiletAccessibility}
          onOpenToiletNearby={this.onShowSelectedFeature}
          onSelectWheelchairAccessibility={this.onSelectWheelchairAccessibility}
          onCloseWheelchairAccessibility={this.onCloseWheelchairAccessibility}
          onCloseToiletAccessibility={this.onCloseToiletAccessibility}
          onSearchQueryChange={this.onSearchQueryChange}
          onEquipmentSelected={this.onEquipmentSelected}
          onShowPlaceDetails={this.showSelectedFeature}
          onMainMenuHomeClick={this.onMainMenuHomeClick}
          onAccessibilityFilterButtonClick={this.onAccessibilityFilterButtonClick}
          // photo feature
          onStartPhotoUploadFlow={this.onStartPhotoUploadFlow}
          onAbortPhotoUploadFlow={this.onExitPhotoUploadFlow}
          onContinuePhotoUploadFlow={this.onContinuePhotoUploadFlow}
          onFinishPhotoUploadFlow={this.onFinishPhotoUploadFlow}
          onStartReportPhotoFlow={this.onStartReportPhotoFlow}
          onFinishReportPhotoFlow={this.onFinishReportPhotoFlow}
          onAbortReportPhotoFlow={this.onExitReportPhotoFlow}
          // mapping event feature
          onMappingEventsLinkClick={this.onMappingEventsLinkClick}
          onMappingEventClick={this.showSelectedMappingEvent}
          joinedMappingEventId={this.state.joinedMappingEventId}
          joinedMappingEvent={this.state.joinedMappingEvent}
          onCloseMappingEventsToolbar={this.onCloseMappingEventsToolbar}
          onMappingEventJoin={this.onMappingEventJoin}
          onMappingEventLeave={this.onMappingEventLeave}
          onMappingEventWelcomeDialogOpen={this.onMappingEventWelcomeDialogOpen}
          onMappingEventWelcomeDialogClose={this.onMappingEventWelcomeDialogClose}
        />
      </RouteProvider>
    );
  }
}

export default App;
