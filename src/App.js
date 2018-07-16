// @flow

import pick from 'lodash/pick';
import get from 'lodash/get';
import * as React from 'react';
import includes from 'lodash/includes';
import queryString from 'query-string';
import initReactFastclick from 'react-fastclick';
import type { RouterHistory, Location } from 'react-router-dom';
import { BrowserRouter, MemoryRouter, Route } from 'react-router-dom';

import config from './lib/config';
import savedState, { saveState, isFirstStart } from './lib/savedState';
import { loadExistingLocalizationByPreference } from './lib/i18n';
import { hasBigViewport, isOnSmallViewport } from './lib/ViewportSize';
import { isTouchDevice } from './lib/userAgent';

import MainView, { UnstyledMainView } from './MainView';

import type {
  Feature,
    WheelmapFeature,
    AccessibilityCloudFeature,
    YesNoLimitedUnknown,
    YesNoUnknown,
    NodeProperties,
} from './lib/Feature';

import type {
  EquipmentInfoProperties,
} from './lib/EquipmentInfo';

import {
  isWheelmapFeatureId,
  yesNoLimitedUnknownArray,
  yesNoUnknownArray,
  getFeatureId,
  isFiltered,
} from './lib/Feature';

import { wheelmapLightweightFeatureCache } from './lib/cache/WheelmapLightweightFeatureCache';
import { accessibilityCloudFeatureCache } from './lib/cache/AccessibilityCloudFeatureCache';
import { accessibilityCloudImageCache, InvalidCaptchaReason } from './lib/cache/AccessibilityCloudImageCache';
import { wheelmapFeatureCache } from './lib/cache/WheelmapFeatureCache';
import { getQueryParams } from './lib/queryParams';
import type { ModalNodeState } from './lib/queryParams';
import getRouteInformation from './lib/getRouteInformation';

initReactFastclick();


type Props = {
  className: string,
  history: RouterHistory,
  location: Location,
};


type State = {
  featureId?: ?string,
  equipmentInfoId?: ?string,
  feature?: ?Feature,
  category?: ?string,
  toiletFilter?: YesNoUnknown[],
  accessibilityFilter?: YesNoLimitedUnknown[],
  lastError?: ?string,
  searchQuery?: ?string,

  lat: ?string,
  lon: ?string,
  zoom: ?string,

  isOnboardingVisible: boolean,
  isMainMenuOpen: boolean;
  isNotFoundVisible: boolean;
  modalNodeState: ModalNodeState,
  isLocalizationLoaded: boolean,
  isSearchBarVisible: boolean,
  isOnSmallViewport: boolean,
  isSearchToolbarExpanded: boolean,

  // photo feature
  isPhotoUploadCaptchaToolbarVisible: boolean,
  isPhotoUploadInstructionsToolbarVisible: boolean,
  photosMarkedForUpload: FileList | null,
  waitingForPhotoUpload?: boolean,
  photoCaptchaFailed?: boolean,
  photoFlowNotification?: string, 
};


function getAccessibilityFilterFrom(statusString: string): YesNoLimitedUnknown[] {
  const allowedStatuses = yesNoLimitedUnknownArray;
  if (!statusString) return [].concat(allowedStatuses);
  const result = statusString
    .split(/\./)
    .filter(s => includes(allowedStatuses, s));
  return ((result: any): YesNoLimitedUnknown[]);
}


function getToiletFilterFrom(toiletString: string): YesNoUnknown[] {
  const allowedStatuses = yesNoUnknownArray;
  if (!toiletString) return [].concat(allowedStatuses);
  const result = toiletString
    .split(/\./)
    .filter(s => includes(allowedStatuses, s));
  return ((result: any): YesNoUnknown[]);
}


function getFeatureIdFromProps(props: Props): ?string {
  const { featureId } = getRouteInformation(props) || {};
  return featureId ? String(featureId) : null;
}


function hrefForFeature(featureId: string, properties: ?NodeProperties | EquipmentInfoProperties) {
  if (properties && typeof properties.placeInfoId === 'string') {
    const placeInfoId = properties.placeInfoId;
    if (includes(['elevator', 'escalator'], properties.category)) {
      return `/beta/nodes/${placeInfoId}/equipment/${featureId}`;
    }
  }
  return `/beta/nodes/${featureId}`;
}

function isStickySearchBarSupported() {
  return hasBigViewport() && !isTouchDevice();
}

class Loader extends React.Component<Props, State> {
  props: Props;

  state: State = {
    toiletFilter: [],
    accessibilityFilter: [],

    lat: (savedState.map.lastCenter && savedState.map.lastCenter[0]) || null,
    lon: (savedState.map.lastCenter && savedState.map.lastCenter[1]) || null,
    zoom: savedState.map.lastZoom || null,

    isSearchBarVisible: isStickySearchBarSupported(),
    isOnboardingVisible: false,
    isNotFoundVisible: false,
    category: null,
    isLocalizationLoaded: false,
    isMainMenuOpen: false,
    modalNodeState: null,
    lastError: null,
    featureId: null,
    isOnSmallViewport: false,
    isSearchToolbarExpanded: false,

    // photo feature
    isPhotoUploadCaptchaToolbarVisible: false,
    isPhotoUploadInstructionsToolbarVisible: false,
    photosMarkedForUpload: null,
  };

  map: ?any;

  lastFocusedElement: ?HTMLElement;
  mainView: UnstyledMainView;
  _asyncRequest: Promise<*>;


  constructor(props: Props) {
    super(props);

    if (isFirstStart()) {
      this.props.history.replace(props.history.location.pathname, { isOnboardingVisible: true });
    }
  }


  componentDidMount() {
    this.onHashUpdate();
    window.addEventListener('hashchange', this.onHashUpdate);

    loadExistingLocalizationByPreference()
      .then(() => this.setState({ isLocalizationLoaded: true }))

  }

  componentWillUnmount() {
    window.removeEventListener('hashchange', this.onHashUpdate);
    if (this._asyncRequest && typeof this._asyncRequest.cancel === 'function') {
      this._asyncRequest.cancel();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    this.manageFocus(prevProps, prevState);
    if (!this.state.feature && this.state.featureId) {
      this.fetchFeature(this.state.featureId);
    }
  }

  static getDerivedStateFromProps(props: Props, state: State): State {
    const routeInformation = getRouteInformation(props) || {};
    const {
      featureId,
      equipmentInfoId,
      category,
      searchQuery,
      modalNodeState,
      isCreateMode,
    } = routeInformation;

    const toiletFilter = getToiletFilterFrom(routeInformation.toilet);
    const accessibilityFilter = getAccessibilityFilterFrom(routeInformation.status);

    const result: $Shape<State> = {
      equipmentInfoId,
      // keep category if you just click on a feature
      category: featureId ? (state.category || category) : category,
      searchQuery,
      modalNodeState,
      isCreateMode,
      toiletFilter,
      accessibilityFilter,
    };

    const featureIdHasChanged = state.featureId !== featureId;
    const equipmentIdHasChanged = state.equipmentInfoId !== equipmentInfoId;

    if (featureIdHasChanged) {
      // Store prevId in state so we can compare when props change.
      result.featureId = featureId;
      // Clear out previously-loaded data (so we don't render stale stuff).
      result.feature = null;
      result.photoFlowNotification = undefined;

      if (isWheelmapFeatureId(featureId)) {
        const feature = wheelmapLightweightFeatureCache.getCachedFeature(featureId);
        Object.assign(result, {
          feature,
          lat: null,
          lon: null,
          zoom: null
        });
      }
    }

    if (searchQuery && searchQuery.length > 0) {
      result.isSearchBarVisible = true;
      result.isSearchToolbarExpanded = true;
    } else if (featureIdHasChanged || equipmentIdHasChanged) {
      result.isSearchToolbarExpanded = false;

      // always minify search bar on small viewport or when filtered
      if (state.isOnSmallViewport || category || isFiltered(accessibilityFilter)) {
        result.isSearchBarVisible = false;
      }
    }

    const locationState = props.history.location.state;
    if (locationState) {
      result.isOnboardingVisible = !!locationState.isOnboardingVisible;
    }

    if (!routeInformation) {
      Object.assign(result, {
        isNotFoundVisible: true,
        lastError: 'Route not found.',
      });
      return result;
    }

    return result;
  }

  onHashUpdate = () => {
    if (this.hashUpdateDisabled) return;
    let baseParams = { toilet: null, status: null, lat: null, lon: null, zoom: null };
    if (savedState.map.lastZoom) {
      baseParams.zoom = savedState.map.lastZoom;
    }
    if (savedState.map.lastCenter && savedState.map.lastCenter[0]) {
      const lastCenter = savedState.map.lastCenter;
      baseParams.lat = lastCenter[0];
      baseParams.lon = lastCenter[1];
    }

    console.log("Previous state:", baseParams);
    const nextState = Object.assign(baseParams, pick(getQueryParams(), 'lat', 'lon', 'zoom', 'toilet', 'status'));
    console.log('Next state:', nextState);
    this.setState(nextState);
  }


  fetchFeature(featureId: string): void {
    const isWheelmap = isWheelmapFeatureId(featureId);
    if (this._asyncRequest && typeof this._asyncRequest.cancel === 'function') {
      this._asyncRequest.cancel();
    }
    const cache = isWheelmap ? wheelmapFeatureCache : accessibilityCloudFeatureCache;
    this._asyncRequest = cache.getFeature(featureId).then((feature: AccessibilityCloudFeature | WheelmapFeature) => {
      if (!feature)
        return;
      const currentlyShownId = getFeatureIdFromProps(this.props);
      const fetchedId = getFeatureId(feature);
      // shown feature might have changed in the mean time. `fetch` requests cannot be aborted so
      // we ignore the response here instead.
      if (currentlyShownId && fetchedId !== currentlyShownId) return;
      this.setState({ feature, lat: null, lon: null, zoom: null });
    }, (reason) => {
      let error = null;
      if (reason && (typeof reason === 'string' || reason instanceof Response || reason instanceof Error)) {
        error = reason;
      }
      this.setState({ feature: null, lat: null, lon: null, zoom: null, isNotFoundVisible: true, lastError: error });
    });
  }


  manageFocus(prevProps: Props, prevState: State) {
    const prevFeatureId = getFeatureIdFromProps(prevProps);
    const featureId = getFeatureIdFromProps(this.props);
    const featureIdHasChanged = prevFeatureId !== featureId;

    const wasNodeToolbarDisplayed = this.isNodeToolbarDisplayed(prevState);
    const isNodeToolbarDisplayed = this.isNodeToolbarDisplayed(this.state);
    const wasSearchToolbarDisplayed = prevState.isSearchBarVisible;
    const isSearchToolbarDisplayed = this.state.isSearchBarVisible;

    const nodeToolbarDidDisappear = wasNodeToolbarDisplayed && !isNodeToolbarDisplayed;
    const nodeToolbarDidAppear = isNodeToolbarDisplayed && !wasNodeToolbarDisplayed;
    const searchToolbarDidDisappear = wasSearchToolbarDisplayed && !isSearchToolbarDisplayed;
    const searchToolbarDidAppear = isSearchToolbarDisplayed && !wasSearchToolbarDisplayed;

    if ((nodeToolbarDidDisappear || searchToolbarDidDisappear)) {
      window.document.activeElement.blur();
      if (this.lastFocusedElement) this.lastFocusedElement.focus();
    }

    if ((nodeToolbarDidAppear || featureIdHasChanged) && this.mainView.nodeToolbar) {
      this.lastFocusedElement = document.activeElement;
      this.mainView.nodeToolbar.focus();
    }

    if (searchToolbarDidAppear && this.mainView.searchToolbar) {
      this.lastFocusedElement = document.activeElement;
      this.mainView.searchToolbar.focus();
    }
  }


  openSearch() {
    this.setState({ isSearchBarVisible: true, isSearchToolbarExpanded: true }, () => {
      setTimeout(() => {
        if (this.mainView) this.mainView.focusSearchToolbar();
      }, 100);
    });
  }


  closeSearch() {
    this.setState({ isSearchBarVisible: isStickySearchBarSupported(), isSearchToolbarExpanded: false });
  }


  onHashUpdate = () => {
    if (this.hashUpdateDisabled) return;
    let baseParams = { toilet: null, status: null, lat: null, lon: null, zoom: null };
    if (savedState.map.lastZoom) {
      baseParams.zoom = savedState.map.lastZoom;
    }
    if (savedState.map.lastCenter && savedState.map.lastCenter[0]) {
      const lastCenter = savedState.map.lastCenter;
      baseParams.lat = lastCenter[0];
      baseParams.lon = lastCenter[1];
    }

    console.log("Previous state:", baseParams);
    const nextState = Object.assign(baseParams, pick(getQueryParams(), 'lat', 'lon', 'zoom', 'toilet', 'status'));
    console.log('Next state:', nextState);
    // this.setState(nextState);
  }


  modalNodeState() {
    const routeInformation = getRouteInformation(this.props);
    const { modalNodeState } = routeInformation || {};
    return modalNodeState;
  }


  onClickSearchButton = () => this.openSearch();

  onToggleMainMenu = (isMainMenuOpen) => {
    this.setState({ isMainMenuOpen });
  }

  onMoveEnd = (state) => {
    saveState({
      'map.lastZoom': String(state.zoom),
      'map.lastCenter.lat': String(state.lat),
      'map.lastCenter.lon': String(state.lon),
      'map.lastMoveDate': new Date().toString(),
    });
  };

  onMapClick = () => {
    if (this.state.isSearchToolbarExpanded) {
      this.closeSearch();
      this.setState({ isMainMenuOpen: false, isSearchToolbarExpanded: false });
      this.mainView.focusMap();
    }
  };

  onMarkerClick = (featureId: string, properties: ?NodeProperties) => {
    const params = getQueryParams();
    const pathname = hrefForFeature(featureId, properties);
    const location = { pathname, search: queryString.stringify(params) };
    this.props.history.push(location);
  };

  // Pan back to currently shown feature when marker in details panel is tapped/clicked
  onClickCurrentMarkerIcon = (feature: Feature) => {
    if (!feature) return;
    this.setState({
      lat: get(feature, 'geometry.coordinates.1'),
      lon: get(feature, 'geometry.coordinates.0'),
    });
  };

  onError = (error) => {
    this.setState({ isNotFoundVisible: true, lastError: error });
  };

  onSelectCoordinate = (coords: ?{ lat: string, lon: string }) => {
    if (coords) {
      this.setState(coords);
    }
    this.setState({ isSearchBarVisible: isStickySearchBarSupported() });
  };

  onResetCategory = () => {
    this.setState({
      category: null,
      isSearchToolbarExpanded: true,
    });
  };

  onCloseNotFoundDialog = () => { this.setState({ isNotFoundVisible: false }); };

  onClickFullscreenBackdrop = () => {
    this.setState({
      isMainMenuOpen: false,
      isOnboardingVisible: false,
      isNotFoundVisible: false,
      isReportMode: false,
    });
    if (this.modalNodeState()) {
      this.props.history.push(`/nodes/${String(this.state.featureId)}`);
    }
  };

  onStartPhotoUploadFlow = () => {
    // start requesting captcha early
    accessibilityCloudImageCache.getCaptcha();
    
    this.setState({ 
      isSearchBarVisible: false,
      waitingForPhotoUpload: false,
      isPhotoUploadInstructionsToolbarVisible: true,
      photosMarkedForUpload: null,
    });
  };

  onExitPhotoUploadFlow = (notification?: string) => { 
    this.setState({ 
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
      });
    }
  }

  onFinishPhotoUploadFlow = (photos: FileList, captchaSolution: string) => {
    console.log("onFinishPhotoUploadFlow");
    const featureId = this.state.featureId;

    if (!featureId) {
      console.error("No feature found, aborting upload!");
      this.onExitPhotoUploadFlow();
      return;
    }

    this.setState({ 
      waitingForPhotoUpload: true,
      photoFlowNotification: "uploadProgress",
    });

    accessibilityCloudImageCache.uploadPhotoForFeature(featureId, photos, captchaSolution)
      .then(() => {
        console.log("Succeeded upload");
        this.onExitPhotoUploadFlow("waitingForReview");
      }).catch((reason) => {
        console.error("Failed upload", reason);
        if (reason === InvalidCaptchaReason) {
          this.setState({ 
            waitingForPhotoUpload: false,
            photoCaptchaFailed: true,
          });
        } else {
          this.onExitPhotoUploadFlow("uploadFailed");
        }
      });
  }

  onOpenReportMode = () => { this.setState({ isReportMode: true }) };

  onCloseNodeToolbar = () => { if (this.state.isReportMode) { this.setState({ isReportMode: false }) } };

  onCloseOnboarding = () => {
    saveState({ onboardingCompleted: 'true' });
    this.props.history.push(this.props.history.location.pathname, { isOnboardingVisible: false });
    if (this.mainView) this.mainView.focusSearchToolbar();
  };

  onClickSearchToolbar = () => {
    this.setState({
      isSearchBarVisible: true,
      isSearchToolbarExpanded: true,
    });
  };

  onCloseSearchToolbar = () => {
    this.setState({
      isSearchBarVisible: isStickySearchBarSupported(),
      isSearchToolbarExpanded: false,
    });
    if (this.mainView) this.mainView.focusMap();
  };

  onCloseCreatePlaceDialog = () => {
    this.setState({
      isCreateMode: false,
    });
  };

  isNodeToolbarDisplayed(state = this.state) {
    return state.feature && 
           !state.isSearchToolbarExpanded && 
           !state.isPhotoUploadCaptchaToolbarVisible && 
           !state.isPhotoUploadInstructionsToolbarVisible;
  }

  render() {
    const isNodeRoute = Boolean(this.state.featureId);
    const modalNodeState = this.modalNodeState();
    const isNodeToolbarDisplayed = this.isNodeToolbarDisplayed();

    const shouldLocateOnStart =
      !isNodeRoute &&
      +new Date() - (savedState.map.lastMoveDate || 0) > config.locateTimeout;

    const isSearchButtonVisible: boolean = !this.state.isSearchBarVisible;

    const extraProps = {
      history: this.props.history,
      location: this.props.location,

      isNodeRoute,
      modalNodeState,
      isNodeToolbarDisplayed,
      shouldLocateOnStart,
      isSearchButtonVisible,

      featureId: this.state.featureId,
      equipmentInfoId: this.state.equipmentInfoId,
      feature: this.state.feature,
      category: this.state.category,
      toiletFilter: this.state.toiletFilter,
      accessibilityFilter: this.state.accessibilityFilter,
      lastError: this.state.lastError,
      searchQuery: this.state.searchQuery,
      lat: this.state.lat,
      lon: this.state.lon,
      zoom: this.state.zoom,
      isOnboardingVisible: this.state.isOnboardingVisible,
      isMainMenuOpen: this.state.isMainMenuOpen,
      isNotFoundVisible: this.state.isNotFoundVisible,
      isSearchBarVisible: this.state.isSearchBarVisible,
      isLocalizationLoaded: this.state.isLocalizationLoaded,
      isOnSmallViewport: this.state.isOnSmallViewport,
      isSearchToolbarExpanded: this.state.isSearchToolbarExpanded,

      // photo feature
      isPhotoUploadCaptchaToolbarVisible: this.state.feature && this.state.isPhotoUploadCaptchaToolbarVisible,
      isPhotoUploadInstructionsToolbarVisible: this.state.feature && this.state.isPhotoUploadInstructionsToolbarVisible,
      photosMarkedForUpload: this.state.photosMarkedForUpload,
      waitingForPhotoUpload: this.state.waitingForPhotoUpload,
      photoCaptchaFailed: this.state.photoCaptchaFailed,
      photoFlowNotification: this.state.photoFlowNotification,
    }

    return (<MainView
      {...extraProps}

      innerRef={(mainView) => { this.mainView = mainView; }}

      onClickSearchButton={this.onClickSearchButton}
      onToggleMainMenu={this.onToggleMainMenu}
      onMoveEnd={this.onMoveEnd}
      onMapClick={this.onMapClick}
      onMarkerClick={this.onMarkerClick}
      onClickCurrentMarkerIcon={this.onClickCurrentMarkerIcon}
      onError={this.onError}
      onSelectCoordinate={this.onSelectCoordinate}
      onResetCategory={this.onResetCategory}
      onCloseNotFoundDialog={this.onCloseNotFoundDialog}
      onClickFullscreenBackdrop={this.onClickFullscreenBackdrop}
      onOpenReportMode={this.onOpenReportMode}
      onCloseNodeToolbar={this.onCloseNodeToolbar}
      onCloseOnboarding={this.onCloseOnboarding}
      onClickSearchToolbar={this.onClickSearchToolbar}
      onCloseSearchToolbar={this.onCloseSearchToolbar}
      onCloseCreatePlaceDialog={this.onCloseCreatePlaceDialog}

      // photo feature
      onStartPhotoUploadFlow={this.onStartPhotoUploadFlow}
      onAbortPhotoUploadFlow={this.onExitPhotoUploadFlow}
      onContinuePhotoUploadFlow={this.onContinuePhotoUploadFlow}
      onFinishPhotoUploadFlow={this.onFinishPhotoUploadFlow}
    />);
  }
}


function App() {
  const Router = window.cordova ? MemoryRouter : BrowserRouter;

  return (<Router>
    <Route path="/" component={Loader} />
  </Router>);
}


export default App;
