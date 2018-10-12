// @flow

import get from 'lodash/get';
import * as React from 'react';
import includes from 'lodash/includes';
import initReactFastclick from 'react-fastclick';
import type { Location, RouterHistory } from 'react-router-dom';
import { MemoryRouter, Route } from 'react-router-dom';

import config from './lib/config';
import savedState, { saveState, isFirstStart } from './lib/savedState';
import { applyTranslations, type Translations } from './lib/i18n';
import { hasBigViewport, isOnSmallViewport } from './lib/ViewportSize';
import { isTouchDevice, configureUserAgent, type UAResult } from './lib/userAgent';
import { type RouterHistory as NewRouterHistory } from './lib/RouterHistory';
import { type SearchResultCollection } from './lib/searchPlaces';
import type { WheelmapFeature } from './lib/Feature';
import type { SearchResultFeature } from './lib/searchPlaces';
import type { EquipmentInfo } from './lib/EquipmentInfo';

import MainView, { UnstyledMainView } from './MainView';

import type { Feature, NodeProperties, YesNoLimitedUnknown, YesNoUnknown } from './lib/Feature';
import { yesNoLimitedUnknownArray, yesNoUnknownArray, getFeatureId } from './lib/Feature';

import type { ClientSideConfiguration } from './lib/ClientSideConfiguration';
import {
  accessibilityCloudImageCache,
  InvalidCaptchaReason,
} from './lib/cache/AccessibilityCloudImageCache';
import type { ModalNodeState } from './lib/queryParams';
import { getQueryParams } from './lib/queryParams';
import { type CategoryLookupTables } from './lib/Categories';
import { type PhotoModel } from './components/NodeToolbar/Photos/PhotoModel';
import { type PlaceDetailsProps } from './app/PlaceDetailsProps';

import 'react-activity/dist/react-activity.css';
import 'focus-visible';

initReactFastclick();

export type Link = {
  label: string,
  url: string,
};

type Props = {
  className?: string,
  history: RouterHistory,
  location: Location,
  routerHistory: NewRouterHistory,
  routeName: string,
  categories?: CategoryLookupTables,
  userAgent?: UAResult,
  translations?: Translations[],
  searchQuery?: ?string,
  searchResults?: SearchResultCollection | Promise<SearchResultCollection>,
  category?: string,
  clientSideConfiguration: ClientSideConfiguration,
  lat: ?string,
  lon: ?string,
  zoom: ?string,
  extent: ?[number, number, number, number],
} & PlaceDetailsProps;

type State = {
  toiletFilter?: YesNoUnknown[],
  accessibilityFilter?: YesNoLimitedUnknown[],

  isOnboardingVisible: boolean,
  isMainMenuOpen: boolean,
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

function isStickySearchBarSupported() {
  return hasBigViewport() && !isTouchDevice();
}

class Loader extends React.Component<Props, State> {
  props: Props;

  state: State = {
    accessibilityFilter: [].concat(yesNoLimitedUnknownArray),
    toiletFilter: [].concat(yesNoUnknownArray),

    lat: (savedState.map.lastCenter && savedState.map.lastCenter[0]) || null,
    lon: (savedState.map.lastCenter && savedState.map.lastCenter[1]) || null,
    zoom: savedState.map.lastZoom || null,

    isSearchBarVisible: isStickySearchBarSupported(),
    isOnboardingVisible: false,
    isMainMenuOpen: false,
    modalNodeState: null,
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
  }

  componentDidMount() {
    if (isFirstStart()) {
      this.setState({ isOnboardingVisible: true });
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
    this.setState({
      isSearchBarVisible: isStickySearchBarSupported(),
      isSearchToolbarExpanded: false,
    });
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

  showSelectedFeature = (featureId: string, properties: ?NodeProperties) => {
    //const pathname = hrefForFeature(featureId, properties);
    //const location = { pathname, query: getQueryParams() };

    // show equipment inside their place details
    if (properties && typeof properties.placeInfoId === 'string') {
      const placeInfoId = properties.placeInfoId;
      if (includes(['elevator', 'escalator'], properties.category)) {
        this.props.routerHistory.push('equipment', { id: placeInfoId, eid: featureId });
        return;
      }
    }

    this.props.routerHistory.push('place_detail', { id: featureId });
  };

  // Pan back to currently shown feature when marker in details panel is tapped/clicked
  onClickCurrentMarkerIcon = (feature: Feature) => {
    if (!feature) return;

    this.setState({
      lat: get(feature, 'geometry.coordinates.1'),
      lon: get(feature, 'geometry.coordinates.0'),
    });
  };

  onSearchResultClick = (feature: SearchResultFeature, wheelmapFeature: ?WheelmapFeature) => {
    const params = {};
    let routeName = 'map';

    if (feature.properties.extent) {
      params.extent = feature.properties.extent;
    } else {
      const [lon, lat] = feature.geometry.coordinates;

      params.lat = lat;
      params.lon = lon;
    }

    if (wheelmapFeature) {
      let id = getFeatureId(wheelmapFeature);

      if (id) {
        params.id = id;
        routeName = 'place_detail';
      }
    } else if (this.props.category) {
      params.category = this.props.category;
      routeName = 'categories';
    }

    this.props.routerHistory.push(routeName, params);
  };

  onCategorySelect = (categoryName: string) => {
    const { routeName: currentRouteName, featureId, routerHistory } = this.props;

    const newRouteName = currentRouteName === 'map' ? 'categories' : currentRouteName;

    // preserve all query params...
    const queryParams = getQueryParams();

    const newParams =
      currentRouteName === 'place_detail'
        ? {
            ...queryParams,
            category: categoryName,
            id: featureId,
          }
        : { ...queryParams, category: categoryName };

    routerHistory.push(newRouteName, newParams);
  };

  onCategoryReset = () => {
    const { routeName: currentRouteName, featureId, routerHistory } = this.props;

    // preserve all query params...
    const queryParams = getQueryParams();
    // ...except for category
    delete queryParams.category;

    const newRouteName = currentRouteName === 'place_detail' ? currentRouteName : 'map';
    const newParams =
      currentRouteName === 'place_detail' ? { ...queryParams, id: featureId } : queryParams;

    routerHistory.push(newRouteName, newParams);
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

  // this is called also when the report dialog is closed
  onCloseNodeToolbar = () => {
    const currentModalState = this.state.modalNodeState;

    if (!currentModalState) {
      this.props.routerHistory.push('map');
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

  onClickSearchToolbar = () => {
    this.setState({
      isSearchBarVisible: true,
      isSearchToolbarExpanded: true,
    });
  };

  onCloseSearchToolbar = () => {
    this.props.routerHistory.replace('map');
    this.setState({
      isSearchBarVisible: isStickySearchBarSupported(),
      isSearchToolbarExpanded: false,
    });
    if (this.mainView) this.mainView.focusMap();
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
      this.props.history.push({
        pathname: `/beta/nodes/${this.props.featureId}/edit-wheelchair-accessibility`,
        search: `presetStatus=${value}`,
      });
    }
  };

  onSearchQueryChange = (newSearchQuery: ?string) => {
    if (!newSearchQuery || newSearchQuery.length === 0) {
      return this.props.routerHistory.replace('map');
    }

    this.props.routerHistory.replace('search', { q: newSearchQuery });
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

    const isSearchButtonVisible: boolean = !this.state.isSearchBarVisible;

    const extraProps = {
      history: this.props.history,
      location: this.props.location,

      isNodeRoute,
      modalNodeState: this.state.modalNodeState,
      isNodeToolbarDisplayed,
      shouldLocateOnStart,
      isSearchButtonVisible,

      featureId: this.props.featureId,
      feature: this.props.feature,
      lightweightFeature: this.props.lightweightFeature,
      equipmentInfoId: this.props.equipmentInfoId,
      equipmentInfo: this.props.equipmentInfo,
      category: this.props.category,
      categories: this.props.categories,
      sources: this.props.sources,
      userAgent: this.props.userAgent,
      toiletFilter: this.state.toiletFilter,
      accessibilityFilter: this.state.accessibilityFilter,
      searchQuery: this.props.searchQuery,
      lat: this.props.lat,
      lon: this.props.lon,
      zoom: this.props.zoom,
      extent: this.props.extent,
      isOnboardingVisible: this.state.isOnboardingVisible,
      isMainMenuOpen: this.state.isMainMenuOpen,
      isSearchBarVisible: this.state.isSearchBarVisible,
      isOnSmallViewport: this.state.isOnSmallViewport,
      isSearchToolbarExpanded: this.state.isSearchToolbarExpanded,
      searchResults: this.props.searchResults,

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

      clientSideConfiguration: this.props.clientSideConfiguration,
    };

    return (
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
        onClickCurrentMarkerIcon={this.onClickCurrentMarkerIcon}
        onError={this.onError}
        onSearchResultClick={this.onSearchResultClick}
        onCategorySelect={this.onCategorySelect}
        onCategoryReset={this.onCategoryReset}
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
        onAddMissingPlaceClick={this.onAddMissingPlaceClick}
        onSearchQueryChange={this.onSearchQueryChange}
        onEquipmentSelected={this.onEquipmentSelected}
        onShowPlaceDetails={this.showSelectedFeature}
        onMainMenuHomeClick={this.onMainMenuHomeClick}
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
