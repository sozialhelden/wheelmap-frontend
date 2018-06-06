// @flow

import pick from 'lodash/pick';
import * as React from 'react';
import styled from 'styled-components';
import includes from 'lodash/includes';
import queryString from 'query-string';
import initReactFastclick from 'react-fastclick';
import type { RouterHistory, Location } from 'react-router-dom';
import { BrowserRouter, HashRouter, Route } from 'react-router-dom';
import { Dots } from 'react-activity';

import Map from './components/Map/Map';
import NotFound from './components/NotFound/NotFound';
import MainMenu from './components/MainMenu/MainMenu';
import NodeToolbar from './components/NodeToolbar/NodeToolbar';
import SearchToolbar from './components/SearchToolbar/SearchToolbar';
import SearchButton from './components/SearchToolbar/SearchButton';
import HighlightableMarker from './components/Map/HighlightableMarker';
import Onboarding, { saveOnboardingFlag, isOnboardingVisible } from './components/Onboarding/Onboarding';
import FullscreenBackdrop from './components/FullscreenBackdrop';

import config from './lib/config';
import colors from './lib/colors';
import savedState, { saveState } from './lib/savedState';
import { loadExistingLocalizationByPreference } from './lib/i18n';
import { hasBigViewport, isOnSmallViewport } from './lib/ViewportSize';

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
  isWheelmapFeature,
  yesNoLimitedUnknownArray,
  yesNoUnknownArray,
  getFeatureId,
} from './lib/Feature';

import { CategoryStrings as EquipmentCategoryStrings } from './lib/EquipmentInfo';

import { wheelmapLightweightFeatureCache } from './lib/cache/WheelmapLightweightFeatureCache';
import { accessibilityCloudFeatureCache } from './lib/cache/AccessibilityCloudFeatureCache';
import { wheelmapFeatureCache } from './lib/cache/WheelmapFeatureCache';
import { getQueryParams, newLocationWithReplacedQueryParams } from './lib/queryParams';
import parseQueryParams from './lib/parseQueryParams';
import isTouchDevice from './lib/isTouchDevice';


initReactFastclick();


type Props = {
  className: string,
  history: RouterHistory,
  location: Location,
};


type State = {
  featureId: ?string,
  feature?: ?Feature,
  fetching: boolean,
  toilet: ?string,
  status: ?string,
  lat: ?string,
  lon: ?string,
  zoom: ?string,
  includeSources: ?string,
  isOnboardingVisible: boolean,
  isMainMenuOpen: boolean;
  isNotFoundVisible: boolean;
  lastError: ?string,
  isReportMode: boolean,
  category: ?string,
  isLocalizationLoaded: boolean,
  isSearchBarVisible: boolean,
  isOnSmallViewport: boolean,
  isSearchToolbarExpanded: boolean,
};


type RouteInformation = {
  featureId: ?string,
  category: ?string,
  isEditMode: boolean,
  searchQuery: ?string,
  equipmentInfoId: ?string,
};


function getRouteInformation(props: Props): ?RouteInformation {
  const location = props.location;
  const allowedResourceNames = ['nodes', 'categories', 'search'];
  const match = location.pathname.match(/(?:\/beta)?\/?(?:(-?\w+)(?:\/([-\w\d]+)(?:\/([-\w\d]+)(?:\/([-\w\d]+))?)?)?)?/i);
  if (match) {
    if (match[1] && !includes(allowedResourceNames, match[1])) return null;
    return {
      featureId: match[1] === 'nodes' ? match[2] : null,
      equipmentInfoId: (match[1] === 'nodes' && match[3] === 'equipment') ? match[4] : null,
      category: match[1] === 'categories' ? match[2] : null,
      searchQuery: match[1] === 'search' ? parseQueryParams(location.search).q : null,
      isEditMode: (match[3] === 'edit'),
      toilet: parseQueryParams(location.search).toilet,
      status: parseQueryParams(location.search).status,
    };
  }
  return null;
}


function getFeatureIdFromProps(props: Props): ?string {
  const { featureId } = getRouteInformation(props) || {};
  return featureId ? String(featureId) : null;
}


function featureIdHasChanged(newProps: Props, prevState: State) {
  const oldFeatureId = prevState.featureId;
  const newFeatureId = getFeatureIdFromProps(newProps);
  const isDifferent = oldFeatureId !== newFeatureId;
  return isDifferent;
}


function updateTouchCapability() {
  const body = document.body;
  if (!body) return;

  if (isTouchDevice()) {
    body.classList.add('is-touch-device');
  } else {
    body.classList.remove('is-touch-device');
  }
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


class FeatureLoader extends React.Component<Props, State> {
  props: Props;

  state: State = {
    fetching: false,
    toilet: null,
    status: null,
    includeSources: null,
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
    lastError: null,
    featureId: null,
    isOnSmallViewport: false,
    isSearchToolbarExpanded: false,
  };

  map: ?any;

  lastFocusedElement: ?HTMLElement;
  nodeToolbar: ?NodeToolbar;
  searchToolbar: ?SearchToolbar;


  onMarkerClick = (featureId: string, properties: ?NodeProperties) => {
    const params = getQueryParams();
    const pathname = hrefForFeature(featureId, properties);
    // const newHref = this.props.history.createHref(location);
    const location = { pathname, search: queryString.stringify(params) };
    this.props.history.push(location);
  };


  createMarkerFromFeature = (feature: Feature, latlng: [number, number]) => {
    const properties = feature && feature.properties;
    if (!properties) return null;
    if (!isWheelmapFeature(feature) && !properties.accessibility && !includes(EquipmentCategoryStrings, properties.category)) return null;

    return new HighlightableMarker(latlng, {
      onClick: this.onMarkerClick,
      hrefForFeature,
      feature,
    });
  }


  resizeListener = () => {
    updateTouchCapability();
    this.updateViewportSizeState();
  };


  onMoveEndHandler = (state) => {
    saveState({
      'map.lastZoom': String(state.zoom),
      'map.lastCenter.lat': String(state.lat),
      'map.lastCenter.lon': String(state.lon),
      'map.lastMoveDate': new Date().toString(),
    });
  }


  onMapClickHandler = () => {
    this.closeSearch();
    this.setState({ isMainMenuOpen: false });
  }

  
  onError = (error) => {
    this.setState({ isNotFoundVisible: true, lastError: error });
  }


  constructor(props: Props) {
    super(props);

    if (isOnboardingVisible()) {
      this.props.history.replace(props.history.location.pathname, { isOnboardingVisible: true });
    }
  }


  async componentDidMount(): Promise<void> {
    this.onHashUpdate();
    window.addEventListener('resize', this.resizeListener);
    this.resizeListener();
    await loadExistingLocalizationByPreference()
      .then(() => this.setState({ isLocalizationLoaded: true }))
    window.addEventListener('hashchange', this.onHashUpdate);
    
    if (this.state.featureId && !this.state.feature && !this.state.fetching) {
      this.fetchFeature(this.state.featureId);
    }
  }


  componentDidUpdate(prevProps, prevState) {
    this.manageFocus(prevProps, prevState);
    if (this.state.featureId && !this.state.feature && !this.state.fetching) {
      this.fetchFeature(this.state.featureId);
    }
  }


  static getDerivedStateFromProps(newProps: Props, prevState: State): State {
    const result: $Shape<State> = {};

    if (featureIdHasChanged(newProps, prevState)) {
      result.featureId = getFeatureIdFromProps(newProps);
      result.isSearchToolbarExpanded = false;
      if (!result.featureId || (prevState.feature && prevState.feature.id !== result.featureId)) {
        result.feature = null;
      }
    }

    const state = newProps.history.location.state;
    if (state) {
      result.isOnboardingVisible = !!state.isOnboardingVisible;
    }

    const routeInformation = getRouteInformation(newProps);

    if (!routeInformation) {
      Object.assign(result, {
        isNotFoundVisible: true,
        lastError: 'Route not found.',
      });
      return result;
    }

    Object.assign(result, pick(routeInformation, 'category', 'toilet', 'status'));
    return result;
  }


  componentWillUnmount() {
    delete this.resizeListener;
    window.removeEventListener('hashchange', this.onHashUpdate);
    window.removeEventListener('resize', this.resizeListener);
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


  updateViewportSizeState() {
    this.setState({ isOnSmallViewport: isOnSmallViewport() });
  }


  accessibilityFilter(): YesNoLimitedUnknown[] {
    const allowedStatuses = yesNoLimitedUnknownArray;
    if (!this.state.status) return [].concat(allowedStatuses);
    const result = this.state.status
      .split(/\./)
      .filter(s => includes(allowedStatuses, s));
    return ((result: any): YesNoLimitedUnknown[]);
  }


  toiletFilter(): YesNoUnknown[] {
    const allowedStatuses = yesNoUnknownArray;
    if (!this.state.toilet) return [].concat(allowedStatuses);
    const result = this.state.toilet
      .split(/\./)
      .filter(s => includes(allowedStatuses, s));
    return ((result: any): YesNoUnknown[]);
  }


  fetchFeature(featureId: ?string): void {
    if (!featureId) {
      this.setState({ featureId: null, feature: null, lat: null, lon: null, zoom: null });
      return;
    }
    this.setState({ fetching: true, featureId });
    const isWheelmap = isWheelmapFeatureId(featureId);
    if (isWheelmap) {
      this.setState({ feature: wheelmapLightweightFeatureCache.getCachedFeature(featureId), lat: null, lon: null, zoom: null });
    }
    const cache = isWheelmap ? wheelmapFeatureCache : accessibilityCloudFeatureCache;
    cache.getFeature(featureId).then((feature: AccessibilityCloudFeature | WheelmapFeature) => {
      if (!feature) 
        return;
      const currentlyShownId = getFeatureIdFromProps(this.props);
      const fetchedId = getFeatureId(feature);
      // shown feature might have changed in the mean time. `fetch` requests cannot be aborted so
      // we ignore the response here instead.
      if (currentlyShownId && fetchedId !== currentlyShownId) return;
      this.setState({ feature, lat: null, lon: null, zoom: null, fetching: false });
    }, (reason) => {
      let error = null;
      if (reason && (typeof reason === 'string' || reason instanceof Response || reason instanceof Error)) {
        error = reason;
      }
      this.setState({ featureId: null, feature: null, lat: null, lon: null, zoom: null, fetching: false, isNotFoundVisible: true, lastError: error });
    });
  }


  manageFocus(prevProps: Props, prevState: State) {
    // focus to and from nodeToolbar
    let wasNodeToolbarDisplayed: boolean;
    let isNodeToolbarDisplayed: boolean;

    const featureId = getFeatureIdFromProps(this.props);
    const isNodeRoute = Boolean(featureId);
    const { isLocalizationLoaded } = this.state;
    isNodeToolbarDisplayed = isNodeRoute && isLocalizationLoaded;

    const prevFeatureId = getFeatureIdFromProps(prevProps);
    const wasNodeRoute = Boolean(prevFeatureId);
    const { isLocalizationLoaded: wasLocalizationLoaded } = prevState;
    wasNodeToolbarDisplayed = wasNodeRoute && wasLocalizationLoaded;

    const nodeToolbarDidDisappear = wasNodeToolbarDisplayed && !isNodeToolbarDisplayed;
    const nodeToolbarDidAppear = isNodeToolbarDisplayed && !wasNodeToolbarDisplayed;
    const nodeToolbarIsDiplayedAndDidUpdate = isNodeToolbarDisplayed && prevFeatureId !== featureId;

    if (nodeToolbarDidDisappear && this.lastFocusedElement) {
      this.lastFocusedElement.focus();
    }

    if ((nodeToolbarDidAppear || nodeToolbarIsDiplayedAndDidUpdate) && this.nodeToolbar) {
      this.lastFocusedElement = document.activeElement;
      this.nodeToolbar.focus();
    }
  }


  openSearch() {
    this.setState({ isSearchBarVisible: true, isSearchToolbarExpanded: true }, () => {
      setTimeout(() => {
        if (this.searchToolbar) {
          this.searchToolbar.focus();
        }
      }, 100);
    });
  }


  closeSearch() {
    this.setState({ isSearchBarVisible: hasBigViewport(), isSearchToolbarExpanded: false });
  }


  renderNodeToolbar({ isNodeRoute, featureId, equipmentInfoId, isEditMode, isReportMode }) {
    return <div className="node-toolbar">
      <NodeToolbar
        ref={nodeToolbar => this.nodeToolbar = nodeToolbar}
        history={this.props.history}
        feature={this.state.feature}
        hidden={!isNodeRoute}
        featureId={featureId}
        equipmentInfoId={equipmentInfoId}
        isEditMode={isEditMode}
        isReportMode={isReportMode}
        onClose={() => { if (isReportMode) { this.setState({ isReportMode: false }) }}}
        onOpenReportMode={(isReportMode) => { this.setState({ isReportMode: true }) }}
      />
    </div>;
  }


  renderSearchToolbar({ isInert, category, searchQuery, lat, lon }) {
    return <SearchToolbar
      ref={searchToolbar => this.searchToolbar = searchToolbar}
      history={this.props.history}
      hidden={!this.state.isSearchBarVisible}
      inert={isInert}
      category={category}
      searchQuery={searchQuery}
      accessibilityFilter={this.accessibilityFilter()}
      toiletFilter={this.toiletFilter()}
      onChangeSearchQuery={(newSearchQuery) => {
        if (!newSearchQuery || newSearchQuery.length === 0) {
          this.props.history.replace('/beta/', null);
          return;
        }
        this.props.history.replace(`/beta/search/?q=${newSearchQuery}`, null);
      }}
      onFilterChanged={(filter) => {
        this.props.history.replace(newLocationWithReplacedQueryParams(this.props.history, filter));
      }}
      lat={lat ? parseFloat(lat) : null}
      lon={lon ? parseFloat(lon) : null}
      onSelectCoordinate={(coords: ?{ lat: number, lon: number }) => {
        if (coords) {
          this.setState(coords);
        }
        this.setState({ isSearchBarVisible: !isOnSmallViewport() });
      }}
      onResetCategory={() => { this.setState({
        category: null,
        isSearchToolbarExpanded: true,
      }); }}
      onClick={() => { this.setState({
        isSearchBarVisible: true,
        isSearchToolbarExpanded: true,
      }); }}
      onClose={() => { this.setState({
        isSearchBarVisible: hasBigViewport(),
        isSearchToolbarExpanded: false,
      }); }}
      isExpanded={this.state.isSearchToolbarExpanded}
    />;
  }


  renderSearchButton() {
    return <SearchButton
      onClick={e => { e.stopPropagation(); this.openSearch(); }}
      category={this.state.category}
      toiletFilter={this.toiletFilter()}
      accessibilityFilter={this.accessibilityFilter()}
      top={60}
      left={10}
    />;
  }


  renderOnboarding({ isLocalizationLoaded }) {
    if (!isLocalizationLoaded && this.state.isOnboardingVisible) {
      return <Dots size={36} color={colors.colorizedBackgroundColor} />;
    }

    return <Onboarding
      isVisible={isLocalizationLoaded && this.state.isOnboardingVisible}
      onClose={() => {
        saveOnboardingFlag();
        this.props.history.push(this.props.history.location.pathname, { isOnboardingVisible: false });
        if (this.searchToolbar) this.searchToolbar.focus();
      }}
    />;
  }


  renderNotFound() {
    return <NotFound
      isVisible={this.state.isNotFoundVisible}
      onClose={() => {
        this.setState({ isNotFoundVisible: false });
      }}
      error={this.state.lastError}
    />;
  }


  renderMainMenu({ isEditMode, isLocalizationLoaded, lat, lon, zoom }) {
    return <MainMenu
      className="main-menu"
      isOpen={this.state.isMainMenuOpen}
      onToggle={isMainMenuOpen => this.setState({ isMainMenuOpen })}
      isEditMode={isEditMode}
      isLocalizationLoaded={isLocalizationLoaded}
      history={this.props.history}
      { ...{lat, lon, zoom}}
    />;
  }


  getMapPadding() {
    const hasPanel = !!this.state.feature;
    const isPortrait = window.innerWidth < window.innerHeight;
    if (hasBigViewport()) {
      return { left: hasPanel ? 400 : 32, right: 32, top: 82, bottom: 64 };
    }

    if (isPortrait) {
      return { left: 32, right: 32, top: 82, bottom: hasPanel ? 256 : 64 };
    }
    return { left: hasPanel ? 400 : 32, right: 32, top: 82, bottom: 64 };
  }


  renderFullscreenBackdrop() {
    const routeInformation = getRouteInformation(this.props);
    const { isEditMode } = routeInformation || {};
    const isActive =
      this.state.isMainMenuOpen ||
      this.state.isOnboardingVisible ||
      this.state.isNotFoundVisible ||
      isEditMode ||
      this.state.isReportMode;

    return <FullscreenBackdrop
      onClick={() => {
        this.setState({
          isMainMenuOpen: false,
          isOnboardingVisible: false,
          isNotFoundVisible: false,
          isReportMode: false,
        });
        if (this.isEditMode()) {
          this.props.history.push(`/nodes/${routeInformation.featureId}`);
        }
      }}
      isActive={isActive}
    />;
  }


  isEditMode() {
    const routeInformation = getRouteInformation(this.props);
    const { isEditMode } = routeInformation || {};
    return isEditMode;
  }


  render() {
    const routeInformation = getRouteInformation(this.props);

    const { featureId, searchQuery, equipmentInfoId } = routeInformation || {};
    const { isLocalizationLoaded } = this.state;
    const category = this.state.category;
    const isNodeRoute = Boolean(featureId);
    const isEditMode = this.isEditMode();
    const { lat, lon, zoom, isReportMode } = this.state;
    const isNodeToolbarVisible = this.state.feature && !this.state.isSearchToolbarExpanded;

    const classList = [
      'app-container',
      this.props.className,
      this.state.isOnboardingVisible ? 'is-dialog-visible' : null,
      this.state.isNotFoundVisible ? 'is-dialog-visible' : null,
      this.state.isMainMenuOpen ? 'is-main-menu-open' : null,
      this.state.isSearchBarVisible ? 'is-search-bar-visible' : null,
      isNodeToolbarVisible ? 'is-node-toolbar-visible' : null,
      isEditMode ? 'is-edit-mode' : null,
      this.state.isReportMode ? 'is-report-mode' : null,
    ].filter(Boolean);

    const shouldLocateOnStart = +new Date() - (savedState.map.lastMoveDate || 0) > config.locateTimeout;

    const searchToolbarIsHidden =
      (isNodeRoute && this.state.isOnSmallViewport) ||
      this.state.isOnboardingVisible ||
      this.state.isNotFoundVisible;

    const isMainMenuInBackground =
      this.state.isOnboardingVisible ||
      this.state.isNotFoundVisible ||
      isEditMode ||
      this.state.isReportMode;

    const searchToolbarIsInert: boolean = searchToolbarIsHidden || this.state.isMainMenuOpen;
    const isSearchButtonVisible: boolean = !this.state.isSearchBarVisible;
    const isNodeToolbarModal = isReportMode || isEditMode;

    const map = <Map
      ref={(map) => { this.map = map; window.map = map; }}
      history={this.props.history}
      onMoveEnd={this.onMoveEndHandler}
      onClick={this.onMapClickHandler}
      onError={this.onError}
      lat={lat ? parseFloat(lat) : null}
      lon={lon ? parseFloat(lon) : null}
      zoom={zoom ? parseFloat(zoom) : null}
      category={category}
      featureId={featureId}
      equipmentInfoId={equipmentInfoId}
      feature={this.state.feature}
      accessibilityFilter={this.accessibilityFilter()}
      toiletFilter={this.toiletFilter()}
      pointToLayer={this.createMarkerFromFeature}
      locateOnStart={shouldLocateOnStart}
      isLocalizationLoaded={isLocalizationLoaded}
      padding={this.getMapPadding()}
      hideHints={isOnSmallViewport() && (isNodeToolbarVisible || this.state.isMainMenuOpen )}
      {...config}
    />;

    const mainMenu = this.renderMainMenu({ isEditMode, isLocalizationLoaded, lat, lon, zoom });
    const nodeToolbar = this.renderNodeToolbar({ isNodeRoute, featureId, equipmentInfoId, isEditMode, isReportMode });

    return (<div className={classList.join(' ')}>
      {!isMainMenuInBackground && mainMenu}
      <div className="behind-backdrop">
        {isMainMenuInBackground && mainMenu}
        {isLocalizationLoaded && this.renderSearchToolbar({ isInert: searchToolbarIsInert, category, searchQuery, lat, lon })}
        {isNodeToolbarVisible && !isNodeToolbarModal && nodeToolbar}
        {isSearchButtonVisible && this.renderSearchButton()}
        {map}
      </div>
      {this.renderFullscreenBackdrop()}
      {isNodeToolbarVisible && isNodeToolbarModal && nodeToolbar}
      {this.renderOnboarding({ isLocalizationLoaded })}
      {this.renderNotFound()}
    </div>);
  }
}


const StyledFeatureLoader = styled(FeatureLoader)`
  a {
    color: ${colors.linkColor};
    text-decoration: none;
  }

  > * {
    transition: transform 0.3s ease-out, opacity 0.3s ease-out;
  }

  > .rai-activity-indicator {
    display: inline-block;
    font-size: 36px;
    line-height: 0;
    top: 50%;
    left: 50%;
    position: absolute;
    transform: translate(-50%, -50%);
  }

  > .behind-backdrop {
    .toolbar {
      z-index: 1001;
    }
  }

  &.is-dialog-visible, &.is-edit-mode, &.is-report-mode, &.is-main-menu-open {
    > .behind-backdrop {
      .toolbar {
        z-index: 999;
      }
      filter: blur(5px);
      transform: scale3d(0.99, 0.99, 1);
      @media (max-width: 512px), (max-height: 512px) {
        transform: scale3d(0.9, 0.9, 1);
      }
      @media (prefers-reduced-motion: reduce) {
        transform: scale3d(1, 1, 1);
      }
      &, * {
        pointer-events: none;
      }
    }
  }

  &.is-edit-mode, &.is-report-mode {
    .node-toolbar, .toolbar {
      z-index: 1001;
    }
  }

  &.is-main-menu-open {
    > .main-menu {
      z-index: 1001;
    }
  }
`;

function App() {
  const Router = window.cordova ? HashRouter : BrowserRouter;
  // const Router = HashRouter;

  return (<Router>
    <Route path="/" component={StyledFeatureLoader} />
  </Router>);
}


export default App;
