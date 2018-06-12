// @flow

import pick from 'lodash/pick';
import * as React from 'react';
import includes from 'lodash/includes';
import queryString from 'query-string';
import initReactFastclick from 'react-fastclick';
import type { RouterHistory, Location } from 'react-router-dom';
import { BrowserRouter, HashRouter, Route } from 'react-router-dom';

import { saveOnboardingFlag, isOnboardingVisible } from './components/Onboarding/Onboarding';

import config from './lib/config';
import savedState, { saveState } from './lib/savedState';
import { loadExistingLocalizationByPreference } from './lib/i18n';
import { hasBigViewport, isOnSmallViewport } from './lib/ViewportSize';

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
import { wheelmapFeatureCache } from './lib/cache/WheelmapFeatureCache';
import { getQueryParams } from './lib/queryParams';
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
  isEditMode: boolean,
  isReportMode: boolean,
  isLocalizationLoaded: boolean,
  isSearchBarVisible: boolean,
  isOnSmallViewport: boolean,
  isSearchToolbarExpanded: boolean,
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
  if (properties && typeof properties.placeInfoId === 'string' ) {
    const placeInfoId = properties.placeInfoId;
    if (includes(['elevator', 'escalator'], properties.category)) {
      return `/beta/nodes/${placeInfoId}/equipment/${featureId}`;
    }
  }
  return `/beta/nodes/${featureId}`;
}


class Loader extends React.Component<Props, State> {
  props: Props;

  state: State = {
    toiletFilter: [],
    accessibilityFilter: [],

    lat: null,
    lon: null,
    zoom: null,

    isSearchBarVisible: hasBigViewport(),
    isOnboardingVisible: false,
    isNotFoundVisible: false,
    category: null,
    isLocalizationLoaded: false,
    isMainMenuOpen: false,
    isReportMode: false,
    isEditMode: false,
    lastError: null,
    featureId: null,
    isOnSmallViewport: false,
    isSearchToolbarExpanded: false,
  };

  map: ?any;

  lastFocusedElement: ?HTMLElement;
  mainView: UnstyledMainView;
  _asyncRequest: Promise<*>;


  constructor(props: Props) {
    super(props);

    if (isOnboardingVisible()) {
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
    // this.manageFocus(prevProps, prevState);
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
      isEditMode,
    } = routeInformation;

    const toiletFilter = getToiletFilterFrom(routeInformation.toilet);
    const accessibilityFilter = getAccessibilityFilterFrom(routeInformation.status);

    const result: $Shape<State> = {
      equipmentInfoId,
      category: state.category || category, // keep category if you just click on a feature
      searchQuery,
      isEditMode,
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

    if (featureIdHasChanged || equipmentIdHasChanged) {
      result.isSearchToolbarExpanded = false;
      if (category || isFiltered(accessibilityFilter)) {
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

  // TODO: Re-enable and adapt this when UX flows are stable again

  // manageFocus(prevProps: Props, prevState: State) {
  //   // focus to and from nodeToolbar
  //   let wasNodeToolbarDisplayed: boolean;
  //   let isNodeToolbarDisplayed: boolean;

  //   const featureId = getFeatureIdFromProps(this.props);
  //   const isNodeRoute = Boolean(featureId);
  //   const { isLocalizationLoaded } = this.state;
  //   isNodeToolbarDisplayed = isNodeRoute && isLocalizationLoaded;

  //   const prevFeatureId = getFeatureIdFromProps(prevProps);
  //   const wasNodeRoute = Boolean(prevFeatureId);
  //   const { isLocalizationLoaded: wasLocalizationLoaded } = prevState;
  //   wasNodeToolbarDisplayed = wasNodeRoute && wasLocalizationLoaded;

  //   const nodeToolbarDidDisappear = wasNodeToolbarDisplayed && !isNodeToolbarDisplayed;
  //   const nodeToolbarDidAppear = isNodeToolbarDisplayed && !wasNodeToolbarDisplayed;
  //   const nodeToolbarIsDiplayedAndDidUpdate = isNodeToolbarDisplayed && prevFeatureId !== featureId;

  //   if (nodeToolbarDidDisappear && this.lastFocusedElement) {
  //     this.lastFocusedElement.focus();
  //   }

  //   if ((nodeToolbarDidAppear || nodeToolbarIsDiplayedAndDidUpdate) && this.nodeToolbar) {
  //     this.lastFocusedElement = document.activeElement;
  //     this.nodeToolbar.focus();
  //   }
  // }


  openSearch() {
    this.setState({ isSearchBarVisible: true, isSearchToolbarExpanded: true }, () => {
      setTimeout(() => {
        if (this.mainView) this.mainView.focusSearchToolbar();
      }, 100);
    });
  }


  closeSearch() {
    this.setState({ isSearchBarVisible: hasBigViewport(), isSearchToolbarExpanded: false });
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



  isEditMode() {
    const routeInformation = getRouteInformation(this.props);
    const { isEditMode } = routeInformation || {};
    return isEditMode;
  }


  onClickSearchButton = e => { e.stopPropagation(); this.openSearch(); };

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
    this.closeSearch();
    this.setState({ isMainMenuOpen: false, isSearchToolbarExpanded: false });
  };

  onMarkerClick = (featureId: string, properties: ?NodeProperties) => {
    const params = getQueryParams();
    const pathname = hrefForFeature(featureId, properties);
    const location = { pathname, search: queryString.stringify(params) };
    this.props.history.push(location);
  };

  onError = (error) => {
    this.setState({ isNotFoundVisible: true, lastError: error });
  };

  onSelectCoordinate = (coords: ?{ lat: string, lon: string }) => {
    if (coords) {
      this.setState(coords);
    }
    this.setState({ isSearchBarVisible: !isOnSmallViewport() });
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
    if (this.isEditMode()) {
      this.props.history.push(`/nodes/${this.state.featureId}`);
    }
  };

  onOpenReportMode = () => { this.setState({ isReportMode: true }) };

  onCloseNodeToolbar = () => { if (this.state.isReportMode) { this.setState({ isReportMode: false }) }};

  onCloseOnboarding = () => {
    saveOnboardingFlag();
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
      isSearchBarVisible: hasBigViewport(),
      isSearchToolbarExpanded: false,
    });
  };

  render() {
    const isNodeRoute = Boolean(this.state.featureId);
    const isEditMode = this.isEditMode();
    const isNodeToolbarVisible = this.state.feature && !this.state.isSearchToolbarExpanded;

    const shouldLocateOnStart = +new Date() - (savedState.map.lastMoveDate || 0) > config.locateTimeout;

    const isSearchButtonVisible: boolean = !this.state.isSearchBarVisible;

    const extraProps = {
      history: this.props.history,
      location: this.props.location,

      isNodeRoute,
      isEditMode,
      isNodeToolbarVisible,
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
      isEditMode: this.state.isEditMode,
      isReportMode: this.state.isReportMode,
      isLocalizationLoaded: this.state.isLocalizationLoaded,
      isSearchBarVisible: this.state.isSearchBarVisible,
      isOnSmallViewport: this.state.isOnSmallViewport,
      isSearchToolbarExpanded: this.state.isSearchToolbarExpanded,
    }

    return (<MainView
      {...extraProps}

      onClickSearchButton={this.onClickSearchButton}
      onToggleMainMenu={this.onToggleMainMenu}
      onMoveEnd={this.onMoveEnd}
      onMapClick={this.onMapClick}
      onMarkerClick={this.onMarkerClick}
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

      innerRef={(mainView) => { this.mainView = mainView; }}
    />);
  }
}


function App() {
  const Router = window.cordova ? HashRouter : BrowserRouter;
  // const Router = HashRouter;

  return (<Router>
    <Route path="/" component={Loader} />
  </Router>);
}


export default App;
