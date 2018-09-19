// @flow

import get from 'lodash/get';
import * as React from 'react';
import includes from 'lodash/includes';
import queryString from 'query-string';
import initReactFastclick from 'react-fastclick';
import type { Location, RouterHistory } from 'react-router-dom';
import { MemoryRouter, Route } from 'react-router-dom';

import config from './lib/config';
import savedState, { saveState } from './lib/savedState';
import { applyTranslations, type Translations } from './lib/i18n';
import { hasBigViewport, isOnSmallViewport } from './lib/ViewportSize';
import { isTouchDevice, configureUserAgent, type UAResult } from './lib/userAgent';

import MainView, { UnstyledMainView } from './MainView';

import type { Feature, NodeProperties, YesNoLimitedUnknown, YesNoUnknown } from './lib/Feature';
import { yesNoLimitedUnknownArray, yesNoUnknownArray } from './lib/Feature';

import type { EquipmentInfoProperties } from './lib/EquipmentInfo';
import {
  accessibilityCloudImageCache,
  InvalidCaptchaReason,
} from './lib/cache/AccessibilityCloudImageCache';
import type { ModalNodeState } from './lib/queryParams';
import { getQueryParams } from './lib/queryParams';
import getRouteInformation from './lib/getRouteInformation';

import { type CategoryLookupTables } from './lib/Categories';
import { type PhotoModel } from './components/NodeToolbar/Photos/PhotoModel';

initReactFastclick();

export type pushRoute = (name: string, params?: { [name: string]: any }) => void;

type Props = {
  className?: string,
  history: RouterHistory,
  location: Location,
  feature?: ?Feature,
  featureId?: ?string,
  categories?: CategoryLookupTables,
  userAgent?: UAResult,
  translations?: Translations[],
  pushRoute: pushRoute,
};

type State = {
  equipmentInfoId?: ?string,
  category?: ?string,
  toiletFilter?: YesNoUnknown[],
  accessibilityFilter?: YesNoLimitedUnknown[],
  lastError?: ?string,
  searchQuery?: ?string,

  lat: ?string,
  lon: ?string,
  zoom: ?string,

  isOnboardingVisible: boolean,
  isMainMenuOpen: boolean,
  isNotFoundVisible: boolean,
  modalNodeState: ModalNodeState,
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
  photoFlowErrorMessage: ?string,
  photoMarkedForReport: PhotoModel | null,
};

function parseStatusString(statusString, allowedStatuses) {
  // Safe mutable sort as filter always returns a new array.
  return statusString
    ? statusString
        .split(/\./)
        .filter(s => includes(allowedStatuses, s))
        .sort()
    : [...allowedStatuses];
}

function getAccessibilityFilterFrom(statusString: string): YesNoLimitedUnknown[] {
  const result = parseStatusString(statusString, yesNoLimitedUnknownArray);

  return ((result: any): YesNoLimitedUnknown[]);
}

function getToiletFilterFrom(toiletString: string): YesNoUnknown[] {
  const result = parseStatusString(toiletString, yesNoUnknownArray);

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
      return `/nodes/${placeInfoId}/equipment/${featureId}`;
    }
  }
  return `/nodes/${featureId}`;
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
    photoMarkedForReport: null,
    photoFlowErrorMessage: null,
  };

  map: ?any;

  mainView: UnstyledMainView;

  //_asyncRequest: Promise<*>;

  constructor(props: Props) {
    super(props);

    if (props.translations) {
      applyTranslations(props.translations);
    }

    if (props.userAgent) {
      configureUserAgent(props.userAgent);
    }

    // if (isFirstStart()) {
    //   this.props.history.replace(props.history.location.pathname, { isOnboardingVisible: true });
    // }
  }

  /*componentWillUnmount() {
    if (this._asyncRequest && typeof this._asyncRequest.cancel === 'function') {
      this._asyncRequest.cancel();
    }
  }*/

  /*static getDerivedStateFromProps(props: Props, state: State): State {
    const routeInformation = getRouteInformation(props);

    let result: $Shape<State> = {
      equipmentInfoId: null,
      category: null,
      searchQuery: null,
      modalNodeState: null,
      toiletFilter: [],
      accessibilityFilter: [],
    };

    if (!routeInformation) {
      return {
        ...result,
        isNotFoundVisible: true,
        lastError: 'Route not found.',
      };
    }

    const { featureId, equipmentInfoId, category, searchQuery, modalNodeState } = routeInformation;

    const toiletFilter = getToiletFilterFrom(routeInformation.toilet);
    const accessibilityFilter = getAccessibilityFilterFrom(routeInformation.status);

    let nextCategory = category;

    // Keep category if you just click on a feature
    if ((featureId || modalNodeState) && state.category) {
      nextCategory = state.category;
    }

    result = {
      ...result,
      equipmentInfoId,
      category: nextCategory,
      searchQuery,
      modalNodeState,
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
          zoom: null,
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

    return result;
  }*/

  /*fetchFeature(featureId: string): void {
    const isWheelmap = isWheelmapFeatureId(featureId);
    if (this._asyncRequest && typeof this._asyncRequest.cancel === 'function') {
      this._asyncRequest.cancel();
    }
    const cache = isWheelmap ? wheelmapFeatureCache : accessibilityCloudFeatureCache;
    this._asyncRequest = cache.getFeature(featureId).then(
      (feature: AccessibilityCloudFeature | WheelmapFeature) => {
        if (!feature) return;
        const currentlyShownId = getFeatureIdFromProps(this.props);
        const fetchedId = getFeatureId(feature);
        // shown feature might have changed in the mean time. `fetch` requests cannot be aborted so
        // we ignore the response here instead.
        if (currentlyShownId && fetchedId !== currentlyShownId) return;
        this.setState({ feature, lat: null, lon: null, zoom: null });
      },
      reason => {
        let error = null;
        if (
          reason &&
          (typeof reason === 'string' || reason instanceof Response || reason instanceof Error)
        ) {
          error = reason;
        }
        this.setState({
          feature: null,
          lat: null,
          lon: null,
          zoom: null,
          isNotFoundVisible: true,
          lastError: error,
        });
      }
    );
  }*/

  openSearch() {
    this.setState({ isSearchBarVisible: true, isSearchToolbarExpanded: true }, () => {
      setTimeout(() => {
        if (this.mainView) this.mainView.focusSearchToolbar();
      }, 100);
    });
  }

  closeSearch() {
    this.setState({
      isSearchBarVisible: isStickySearchBarSupported(),
      isSearchToolbarExpanded: false,
    });
  }

  modalNodeState() {
    const routeInformation = getRouteInformation(this.props);
    const { modalNodeState } = routeInformation || {};
    return modalNodeState;
  }

  onClickSearchButton = () => this.openSearch();

  onToggleMainMenu = isMainMenuOpen => {
    this.setState({ isMainMenuOpen });
  };

  onMoveEnd = state => {
    let { zoom, lat, lon } = state;

    // Adjust zoom level to be stored in the local storage to make sure the user
    // can see some places when reloading the app after some time.
    const lastZoom = String(
      Math.max(zoom, config.minZoomWithSetCategory, config.minZoomWithoutSetCategory)
    );

    saveState({
      'map.lastZoom': lastZoom,
      'map.lastCenter.lat': String(lat),
      'map.lastCenter.lon': String(lon),
      'map.lastMoveDate': new Date().toString(),
    });

    this.setState({
      lat,
      lon,
      zoom,
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
    //const pathname = hrefForFeature(featureId, properties);
    //const location = { pathname, query: getQueryParams() };

    this.props.pushRoute('place_detail', { id: featureId });
  };

  // Pan back to currently shown feature when marker in details panel is tapped/clicked
  onClickCurrentMarkerIcon = (feature: Feature) => {
    if (!feature) return;

    this.setState({
      lat: get(feature, 'geometry.coordinates.1'),
      lon: get(feature, 'geometry.coordinates.0'),
    });
  };

  onError = error => {
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

  onCloseNotFoundDialog = () => {
    this.setState({ isNotFoundVisible: false });
  };

  onClickFullscreenBackdrop = () => {
    this.setState({
      isMainMenuOpen: false,
      isOnboardingVisible: false,
      isNotFoundVisible: false,
      modalNodeState: null,
    });
    this.onCloseNodeToolbar();
  };

  onStartPhotoUploadFlow = () => {
    // start requesting captcha early
    accessibilityCloudImageCache.getCaptcha();

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

    this.setState({
      waitingForPhotoUpload: true,
      photoFlowNotification: 'uploadProgress',
    });

    accessibilityCloudImageCache
      .uploadPhotoForFeature(featureId, photos, captchaSolution)
      .then(() => {
        console.log('Succeeded upload');
        this.onExitPhotoUploadFlow('waitingForReview');
      })
      .catch(reason => {
        console.error('Failed upload', reason);
        if (reason.message === InvalidCaptchaReason) {
          this.setState({
            waitingForPhotoUpload: false,
            photoCaptchaFailed: true,
          });
        } else {
          this.onExitPhotoUploadFlow('uploadFailed', reason && reason.message);
        }
      });
  };

  onStartReportPhotoFlow = (photo: PhotoModel) => {
    this.setState({
      isSearchBarVisible: false,
      photoMarkedForReport: photo,
    });
  };

  onFinishReportPhotoFlow = (photo: PhotoModel, reason: string) => {
    if (photo.source === 'accessibility-cloud') {
      accessibilityCloudImageCache.reportPhoto(String(photo.imageId), reason);
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
      const query = queryString.stringify(getQueryParams());
      this.props.history.push(`/beta/nodes/${String(this.props.featureId)}/report?${query}`);
    }
  };

  onCloseNodeToolbar = () => {
    //const { featureId } = this.props;
    //const { category } = this.state;

    // onCloseNodeToolbar is used as a callback for when the node toolbar is closed as well as
    // when any node toolbar subpages are closed. in order to know how to change the route correctly
    // we have to distinguish between these two cases
    //const actualNodeToolbarWasClosed = featureId && typeof this.modalNodeState() === 'undefined';
    //const nodeToolbarSubpageWasClosed = featureId && typeof this.modalNodeState() !== 'undefined';

    this.props.pushRoute('map');

    // by default route to the index page
    /*let path = '/beta';

    if (actualNodeToolbarWasClosed && category) {
      // if node toolbar was closed and category was previously selected restore the categories url
      path = `/beta/categories/${category}`;
    } else if (nodeToolbarSubpageWasClosed) {
      // if a node toolbar subpage was closed restore the node toolbar default url
      path = `/beta/nodes/${String(featureId)}`;
    }

    // restore any query params
    const query = queryString.stringify(getQueryParams());

    this.props.history.push(`${path}?${query}`);*/
  };

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

  onOpenWheelchairAccessibility = () => {
    if (this.props.featureId) {
      const query = queryString.stringify(getQueryParams());
      this.props.history.push(
        `/beta/nodes/${this.props.featureId}/edit-wheelchair-accessibility?${query}`
      );
    }
  };

  onOpenToiletAccessibility = () => {
    if (this.props.featureId) {
      const query = queryString.stringify(getQueryParams());
      this.props.history.push(
        `/beta/nodes/${this.props.featureId}/edit-toilet-accessibility?${query}`
      );
    }
  };

  gotoCurrentFeature() {
    /*const { featureId } = this.state;
    if (featureId) {
      this.props.history.push(`/beta/nodes/${featureId}`);
      const feature =
        wheelmapFeatureCache.getCachedFeature(String(featureId)) ||
        wheelmapLightweightFeatureCache.getCachedFeature(String(featureId));
      this.setState({ feature });
    }*/
  }

  onCloseWheelchairAccessibility = () => {
    this.gotoCurrentFeature();
  };

  onCloseToiletAccessibility = () => {
    this.gotoCurrentFeature();
  };

  onSelectWheelchairAccessibility = (value: YesNoLimitedUnknown) => {
    if (this.props.featureId) {
      this.props.history.push({
        pathname: `/beta/nodes/${this.props.featureId}/edit-wheelchair-accessibility`,
        search: `presetStatus=${value}`,
      });
    }
  };

  isNodeToolbarDisplayed(props = this.props, state = this.state) {
    return (
      props.feature &&
      !state.isSearchToolbarExpanded &&
      !state.isPhotoUploadCaptchaToolbarVisible &&
      !state.isPhotoUploadInstructionsToolbarVisible &&
      !state.photoMarkedForReport
    );
  }

  render() {
    const isNodeRoute = Boolean(this.props.featureId);
    const modalNodeState = this.modalNodeState();
    const isNodeToolbarDisplayed = this.isNodeToolbarDisplayed();

    const shouldLocateOnStart =
      !isNodeRoute && +new Date() - (savedState.map.lastMoveDate || 0) > config.locateTimeout;

    const isSearchButtonVisible: boolean = !this.state.isSearchBarVisible;

    const extraProps = {
      history: this.props.history,
      location: this.props.location,

      isNodeRoute,
      modalNodeState,
      isNodeToolbarDisplayed,
      shouldLocateOnStart,
      isSearchButtonVisible,

      featureId: this.props.featureId,
      equipmentInfoId: this.state.equipmentInfoId,
      feature: this.props.feature,
      category: this.state.category,
      categories: this.props.categories,
      userAgent: this.props.userAgent,
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
      isOnSmallViewport: this.state.isOnSmallViewport,
      isSearchToolbarExpanded: this.state.isSearchToolbarExpanded,

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
      presetStatus: getQueryParams(this.props.history.location.search).presetStatus || null,
    };

    return (
      <MainView
        {...extraProps}
        innerRef={mainView => {
          this.mainView = mainView;
        }}
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
        onCloseCreatePlaceDialog={this.onCloseNodeToolbar}
        onOpenWheelchairAccessibility={this.onOpenWheelchairAccessibility}
        onOpenToiletAccessibility={this.onOpenToiletAccessibility}
        onSelectWheelchairAccessibility={this.onSelectWheelchairAccessibility}
        onCloseWheelchairAccessibility={this.onCloseWheelchairAccessibility}
        onCloseToiletAccessibility={this.onCloseToiletAccessibility}
        // photo feature
        onStartPhotoUploadFlow={this.onStartPhotoUploadFlow}
        onAbortPhotoUploadFlow={this.onExitPhotoUploadFlow}
        onContinuePhotoUploadFlow={this.onContinuePhotoUploadFlow}
        onFinishPhotoUploadFlow={this.onFinishPhotoUploadFlow}
        onStartReportPhotoFlow={this.onStartReportPhotoFlow}
        onFinishReportPhotoFlow={this.onFinishReportPhotoFlow}
        onAbortReportPhotoFlow={this.onExitReportPhotoFlow}
      />
    );
  }
}

function App(props: Props) {
  // const Router = isCordova() ? MemoryRouter : BrowserRouter;
  const Router = MemoryRouter;

  return (
    <Router>
      <Route path="/" render={routeProps => <Loader {...routeProps} {...props} />} />
    </Router>
  );
}

export default App;
