// @flow

import get from 'lodash/get';
import * as React from 'react';
import includes from 'lodash/includes';
import initReactFastclick from 'react-fastclick';

import config from './lib/config';
import savedState, { saveState, isFirstStart } from './lib/savedState';
import { hasBigViewport, isOnSmallViewport } from './lib/ViewportSize';
import { isTouchDevice, configureUserAgent, type UAResult } from './lib/userAgent';
import { type RouterHistory } from './lib/RouterHistory';
import { type SearchResultCollection } from './lib/searchPlaces';
import type { WheelmapFeature } from './lib/Feature';
import type { SearchResultFeature } from './lib/searchPlaces';
import type { EquipmentInfo } from './lib/EquipmentInfo';

import MainView, { UnstyledMainView } from './MainView';

import {
  type Feature,
  type NodeProperties,
  type YesNoLimitedUnknown,
  type YesNoUnknown,
  isAccessibilityFiltered,
  isToiletFiltered,
  getFeatureId,
} from './lib/Feature';

import type { ClientSideConfiguration } from './lib/ClientSideConfiguration';
import {
  accessibilityCloudImageCache,
  InvalidCaptchaReason,
} from './lib/cache/AccessibilityCloudImageCache';
import type { ModalNodeState } from './lib/ModalNodeState';
import { type CategoryLookupTables } from './lib/Categories';
import { type PhotoModel } from './lib/PhotoModel';
import { type PlaceDetailsProps } from './app/PlaceDetailsProps';
import { type PlaceFilter } from './components/SearchToolbar/AccessibilityFilterModel';
import { RouteProvider } from './components/Link/RouteContext';

import 'react-activity/dist/react-activity.css';
import './App.css';
import './Global.css';
import 'focus-visible';

initReactFastclick();

export type Link = {
  label: string,
  url: string,
};

type Props = {
  className?: string,
  routerHistory: RouterHistory,
  routeName: string,
  categories?: CategoryLookupTables,
  userAgent?: UAResult,
  searchQuery?: ?string,
  searchResults?: SearchResultCollection | Promise<SearchResultCollection>,
  category?: string,
  clientSideConfiguration: ClientSideConfiguration,
  lat: ?string,
  lon: ?string,
  zoom: ?string,
  extent: ?[number, number, number, number],
  includeSourceIds: ?string,
  toiletFilter: YesNoUnknown[],
  accessibilityFilter: YesNoLimitedUnknown[],
} & PlaceDetailsProps;

type State = {
  isOnboardingVisible: boolean,
  isMainMenuOpen: boolean,
  modalNodeState: ModalNodeState,
  accessibilityPresetStatus?: ?YesNoLimitedUnknown,
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

  // map controls
  lat?: ?number,
  lon?: ?number,
  zoom?: ?number,
  extent?: ?[number, number, number, number],
};

function isStickySearchBarSupported() {
  return hasBigViewport() && !isTouchDevice();
}

class App extends React.Component<Props, State> {
  props: Props;

  state: State = {
    lat: (savedState.map.lastCenter && savedState.map.lastCenter[0]) || null,
    lon: (savedState.map.lastCenter && savedState.map.lastCenter[1]) || null,
    zoom: savedState.map.lastZoom || null,

    isSearchBarVisible: isStickySearchBarSupported(),
    isOnboardingVisible: false,
    isMainMenuOpen: false,
    modalNodeState: null,
    accessibilityPresetStatus: null,
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

  static getDerivedStateFromProps(props: Props): $Shape<State> {
    const state = {
      isSearchToolbarExpanded: false,
      isSearchBarVisible: isStickySearchBarSupported(),
    };

    // close search results when leaving search route
    if (props.routeName === 'search') {
      state.isSearchToolbarExpanded = true;
      state.isSearchBarVisible = true;
    }

    if (props.routeName === 'place_detail') {
      const { accessibilityFilter, toiletFilter, category } = props;

      state.isSearchBarVisible =
        isStickySearchBarSupported() &&
        !isAccessibilityFiltered(accessibilityFilter) &&
        !isToiletFiltered(toiletFilter) &&
        !category;
    }

    return state;
  }

  constructor(props: Props) {
    super(props);

    if (props.userAgent) {
      configureUserAgent(props.userAgent);
    }
  }

  componentDidMount() {
    if (isFirstStart()) {
      this.setState({ isOnboardingVisible: true });
    } else if (this.props.routeName === 'map') {
      this.openSearch(true);
    }
  }

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

  onToggleMainMenu = isMainMenuOpen => {
    this.setState({ isMainMenuOpen });
  };

  onMainMenuHomeClick = () => {
    saveState({ onboardingCompleted: 'false' });
    this.setState({ isOnboardingVisible: true });
    this.props.routerHistory.push('map');
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
      extent: null,
      lat: null,
      lon: null,
      zoom: null,
    });
  };

  onMapClick = () => {
    if (this.state.isSearchToolbarExpanded) {
      this.closeSearch();
      this.mainView.focusMap();
    }
  };

  showSelectedFeature = (featureId: string, properties: ?NodeProperties) => {
    const { routerHistory } = this.props;

    // show equipment inside their place details
    let routeName = 'place_detail';
    const params = this.getCurrentParams();

    params.id = featureId;
    delete params.eid;

    if (properties && typeof properties.placeInfoId === 'string') {
      const placeInfoId = properties.placeInfoId;
      if (includes(['elevator', 'escalator'], properties.category)) {
        routeName = 'equipment';
        params.id = placeInfoId;
        params.eid = featureId;
      }
    }

    routerHistory.push(routeName, params);
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
        routeName = 'place_detail';
      }
    }

    if (routeName === 'map') {
      delete params.id;
      delete params.eid;
    }

    if (feature.properties.extent) {
      const extent = feature.properties.extent;
      this.setState({
        lat: null,
        lon: null,
        extent,
      });
    } else {
      const [lon, lat] = feature.geometry.coordinates;
      this.setState({
        lat,
        lon,
        extent: null,
      });
    }

    this.props.routerHistory.push(routeName, params);
  };

  onClickFullscreenBackdrop = () => {
    this.setState({
      isMainMenuOpen: false,
      isOnboardingVisible: false,
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
      this.setState({
        modalNodeState: 'report',
      });
    }
  };

  getCurrentParams() {
    const params = {};
    const {
      category,
      accessibilityFilter,
      toiletFilter,
      routeName,
      featureId,
      equipmentInfoId,
      searchQuery,
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
      this.setState({
        modalNodeState: null,
      });
    }
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
      this.setState({
        modalNodeState: 'edit-wheelchair-accessibility',
      });
    }
  };

  onOpenToiletAccessibility = () => {
    if (this.props.featureId) {
      this.setState({
        modalNodeState: 'edit-toilet-accessibility',
      });
    }
  };

  gotoCurrentFeature() {
    if (this.props.featureId) {
      this.setState({
        modalNodeState: null,
      });
    }
  }

  onCloseWheelchairAccessibility = () => {
    this.gotoCurrentFeature();
  };

  onCloseToiletAccessibility = () => {
    this.gotoCurrentFeature();
  };

  onAddMissingPlaceClick = () => {
    this.setState({
      modalNodeState: 'create',
    });
  };

  onSelectWheelchairAccessibility = (value: YesNoLimitedUnknown) => {
    if (this.props.featureId) {
      this.setState({
        modalNodeState: 'edit-wheelchair-accessibility',
        accessibilityPresetStatus: value,
      });
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
    this.props.routerHistory.replace('equipment', { id: placeInfoId, eid: equipmentInfo._id });
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
    const isNodeToolbarDisplayed = this.isNodeToolbarDisplayed();

    const shouldLocateOnStart =
      !isNodeRoute && +new Date() - (savedState.map.lastMoveDate || 0) > config.locateTimeout;

    const isSearchBarVisible = this.state.isSearchBarVisible;
    const isSearchButtonVisible = !isSearchBarVisible;

    const extraProps = {
      isNodeRoute,
      modalNodeState: this.state.modalNodeState,
      isNodeToolbarDisplayed,
      shouldLocateOnStart,
      isSearchButtonVisible,
      isSearchBarVisible,

      featureId: this.props.featureId,
      feature: this.props.feature,
      lightweightFeature: this.props.lightweightFeature,
      equipmentInfoId: this.props.equipmentInfoId,
      equipmentInfo: this.props.equipmentInfo,
      photos: this.props.photos,
      category: this.props.category,
      categories: this.props.categories,
      sources: this.props.sources,
      userAgent: this.props.userAgent,
      toiletFilter: this.props.toiletFilter,
      accessibilityFilter: this.props.accessibilityFilter,
      searchQuery: this.props.searchQuery,
      lat: this.state.lat || this.props.lat,
      lon: this.state.lon || this.props.lon,
      zoom: this.state.zoom || this.props.zoom,
      extent: this.state.extent || this.props.extent,
      isOnboardingVisible: this.state.isOnboardingVisible,
      isMainMenuOpen: this.state.isMainMenuOpen,
      isOnSmallViewport: this.state.isOnSmallViewport,
      isSearchToolbarExpanded: this.state.isSearchToolbarExpanded,
      searchResults: this.props.searchResults,
      includeSourceIds: this.props.includeSourceIds,

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

      clientSideConfiguration: this.props.clientSideConfiguration,
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
          onError={this.onError}
          onSearchResultClick={this.onSearchResultClick}
          onClickFullscreenBackdrop={this.onClickFullscreenBackdrop}
          onOpenReportMode={this.onOpenReportMode}
          onCloseNodeToolbar={this.onCloseNodeToolbar}
          onCloseOnboarding={this.onCloseOnboarding}
          onSearchToolbarClick={this.onSearchToolbarClick}
          onSearchToolbarClose={this.onSearchToolbarClose}
          onSearchToolbarSubmit={this.onSearchToolbarSubmit}
          onCloseCreatePlaceDialog={this.onCloseNodeToolbar}
          onOpenWheelchairAccessibility={this.onOpenWheelchairAccessibility}
          onOpenToiletAccessibility={this.onOpenToiletAccessibility}
          onSelectWheelchairAccessibility={this.onSelectWheelchairAccessibility}
          onCloseWheelchairAccessibility={this.onCloseWheelchairAccessibility}
          onCloseToiletAccessibility={this.onCloseToiletAccessibility}
          onAddMissingPlaceClick={this.onAddMissingPlaceClick}
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
        />
      </RouteProvider>
    );
  }
}

export default App;
