// @flow

import get from 'lodash/get';
import pick from 'lodash/pick';
import omit from 'lodash/omit';
import * as React from 'react';
import styled from 'styled-components';
import includes from 'lodash/includes';
import queryString from 'query-string';
import initReactFastclick from 'react-fastclick';
import type { RouterHistory, Location } from 'react-router-dom';
import { BrowserRouter, HashRouter, Route } from 'react-router-dom';

import Map from './components/Map/Map';
import NotFound from './components/NotFound/NotFound';
import MainMenu from './components/MainMenu/MainMenu';
import NodeToolbar from './components/NodeToolbar/NodeToolbar';
import FilterButton from './components/FilterToolbar/FilterButton';
import SearchToolbar from './components/SearchToolbar/SearchToolbar';
import SearchButton from './components/SearchToolbar/SearchButton';
import FilterToolbar from './components/FilterToolbar/FilterToolbar';
import HighlightableMarker from './components/Map/HighlightableMarker';
import Onboarding, { saveOnboardingFlag, isOnboardingVisible } from './components/Onboarding/Onboarding';

import config from './lib/config';
import colors from './lib/colors';
import savedState, { saveState } from './lib/savedState';
import { loadExistingLocalizationByPreference } from './lib/i18n';
import { isOnSmallViewport, hasBigViewport } from './lib/ViewportSize';

import type {
  Feature,
  WheelmapFeature,
  AccessibilityCloudFeature,
  YesNoLimitedUnknown,
  YesNoUnknown,
  NodeProperties,
} from './lib/Feature';

import {
  isWheelmapFeatureId,
  isWheelmapFeature,
  yesNoLimitedUnknownArray,
  yesNoUnknownArray,
} from './lib/Feature';

import { CategoryStrings as EquipmentCategoryStrings } from './lib/EquipmentInfo';

import { wheelmapLightweightFeatureCache } from './lib/cache/WheelmapLightweightFeatureCache';
import { accessibilityCloudFeatureCache } from './lib/cache/AccessibilityCloudFeatureCache';
import { wheelmapFeatureCache } from './lib/cache/WheelmapFeatureCache';
import { getQueryParams, setQueryParams } from './lib/queryParams';
import parseQueryParams from './lib/parseQueryParams';
import isTouchDevice from './lib/isTouchDevice';


initReactFastclick();


type Props = {
  className: string,
  history: RouterHistory,
  location: Location,
};


type State = {
  feature?: ?Feature,
  fetching: boolean,
  toilet: ?string,
  status: ?string,
  lat: ?string,
  lon: ?string,
  zoom: ?string,
  includeSources: ?string,
  isFilterToolbarVisible: boolean,
  isOnboardingVisible: boolean,
  isMainMenuOpen: boolean;
  isNotFoundVisible: boolean;
  lastError: ?string,
  isReportMode: boolean,
  category: ?string,
  isLocalizationLoaded: boolean,
  isSearchBarVisible: boolean,
};

type RouteInformation = {
  featureId: ?string,
  category: ?string,
  isEditMode: boolean,
};

function updateTouchCapability() {
  const body = document.body;
  if (!body) return;

  if (isTouchDevice()) {
    body.classList.add('is-touch-device');
  } else {
    body.classList.remove('is-touch-device');
  }
}

function hrefForFeature(featureId: string, properties: ?NodeProperties) {
  if (properties) {
    const placeInfoId = properties.placeInfoId;
    if (placeInfoId && includes(['elevator', 'escalator'], properties.category)) {
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
    isFilterToolbarVisible: false,
    isOnboardingVisible: false,
    isNotFoundVisible: false,
    category: null,
    isLocalizationLoaded: false,
    isMainMenuOpen: false,
    isReportMode: false,
    lastError: null,
  };

  map: ?any;

  filterButton: ?FilterButton;
  lastFocusedElement: ?HTMLElement;
  nodeToolbar: ?NodeToolbar;
  searchToolbar: ?SearchToolbar;


  onMarkerClick = (featureId: string, properties: ?NodeProperties) => {
    const params = getQueryParams();
    const pathname = hrefForFeature(featureId, properties);
    // const newHref = `${href}${hashOrNothing}?${queryString.stringify(params)}`;
    const location = { pathname, search: queryString.stringify(params) };
    const newHref = this.props.history.createHref(location);
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
  };

  onError = (error) => {
    this.setState({ isNotFoundVisible: true, lastError: error });
  }

  constructor(props: Props) {
    super(props);

    if (isOnboardingVisible()) {
      this.props.history.replace(props.history.location.pathname, { isOnboardingVisible: true });
    }
  }

  async componentWillMount() {
    this.onHashUpdate();
    window.addEventListener('resize', this.resizeListener);
    this.resizeListener();
    await loadExistingLocalizationByPreference()
      .then(() => this.setState({ isLocalizationLoaded: true }));
  }


  componentDidMount() {
    window.addEventListener('hashchange', this.onHashUpdate);
    this.updateStateFromProps(this.props);
  }

  componentDidUpdate(prevProps, prevState) {
    this.manageFocus(prevProps, prevState);
  }

  updateStateFromProps(props: Props) {
    this.fetchFeature(props);

    if (this.featureId(props) !== this.featureId(this.props)) {
      this.setState({ isFilterToolbarVisible: false });
    }

    const state = this.props.history.location.state;
    if (state) {
      this.setState({ isOnboardingVisible: !!state.isOnboardingVisible });
    }

    const routeInformation = this.routeInformation(props);
    if (!routeInformation) {
      this.setState({ isNotFoundVisible: true, lastError: 'Route not found.' });
      return;
    }

    if (routeInformation.category) {
      this.setState({ category: routeInformation.category });
    }
  }

  componentWillReceiveProps(newProps: Props): void {
    this.updateStateFromProps(newProps);
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


  featureId(props: Props = this.props): ?string {
    const routeInformation = this.routeInformation(props);
    return routeInformation ? routeInformation.featureId : null;
  }


  routeInformation(props: Props = this.props): ?RouteInformation {
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
      };
    }
    return null;
  }


  fetchFeature(props: Props): void {
    const id = this.featureId(props);
    if (!id) {
      this.setState({ feature: null });
      return;
    }
    this.setState({ fetching: true });
    const isWheelmap = isWheelmapFeatureId(id);
    if (isWheelmap) {
      this.setState({ feature: wheelmapLightweightFeatureCache.getCachedFeature(id) });
    }
    const cache = isWheelmap ? wheelmapFeatureCache : accessibilityCloudFeatureCache;
    cache.getFeature(id).then((feature: AccessibilityCloudFeature | WheelmapFeature) => {
      if (!feature) return;
      const currentlyShownId = this.featureId(this.props);
      const idProperties = [feature.id, feature.properties.id, feature._id, feature.properties._id];
      const fetchedId = String(idProperties.filter(Boolean)[0]);
      // shown feature might have changed in the mean time. `fetch` requests cannot be aborted so
      // we ignore the response here instead.
      if (fetchedId !== currentlyShownId) return;
      const [lon, lat] = get(feature, 'geometry.coordinates') || [this.state.lon, this.state.lat];
      this.setState({ feature, lat, lon, fetching: false });
    }, (reason) => {
      let error = null;
      if (reason && (typeof reason === 'string' || reason instanceof Response || reason instanceof Error)) {
        error = reason;
      }
      this.setState({ feature: null, fetching: false, isNotFoundVisible: true, lastError: error });
    });
  }


  toggleFilterToolbar() {
    this.setState({ isFilterToolbarVisible: !this.state.isFilterToolbarVisible });
  }

  manageFocus(prevProps, prevState) {
    // focus to and from nodeToolbar
    let wasNodeToolbarDisplayed: boolean;
    let isNodeToolbarDisplayed: boolean;

    const routeInformation = this.routeInformation();
    const { featureId } = routeInformation || {};
    const isNodeRoute = Boolean(featureId);
    const { isLocalizationLoaded, isFilterToolbarVisible } = this.state;
    isNodeToolbarDisplayed = isNodeRoute && isLocalizationLoaded && !isFilterToolbarVisible;

    const prevRouteInformation = this.routeInformation(prevProps);
    const { featureId: prevFeatureId } = prevRouteInformation || {};
    const wasNodeRoute = Boolean(prevFeatureId);
    const { isLocalizationLoaded: wasLocalizationLoaded, isFilterToolbarVisible: wasFilterToolbarVisible } = prevState;
    wasNodeToolbarDisplayed = wasNodeRoute && wasLocalizationLoaded && !wasFilterToolbarVisible;

    const nodeToolbarDidDisappear = wasNodeToolbarDisplayed && !isNodeToolbarDisplayed;
    const nodeToolbarDidAppear = isNodeToolbarDisplayed && !wasNodeToolbarDisplayed;
    const nodeToolbarIsDiplayedAndDidUpdate = isNodeToolbarDisplayed && prevFeatureId !== featureId;

    if (prevState.isFilterToolbarVisible && !this.state.isFilterToolbarVisible && this.filterButton) {
      this.filterButton.focus();
      return;
    }

    if (nodeToolbarDidDisappear && !this.state.isFilterToolbarVisible && this.lastFocusedElement) {
      this.lastFocusedElement.focus();
    }

    if ((nodeToolbarDidAppear || nodeToolbarIsDiplayedAndDidUpdate) && this.nodeToolbar) {
      this.lastFocusedElement = document.activeElement;
      this.nodeToolbar.focus();
    }

    if (this.state.category && !prevState.category && this.map) {
      this.map.focus();
    }
  }

  openSearch() {
    this.setState({ isSearchBarVisible: true }, () => {
      setTimeout(() => {
        if (this.searchToolbar) {
          this.searchToolbar.focus();
        }
      }, 100);
    });
  }

  render() {
    const routeInformation = this.routeInformation();

    const { featureId, isEditMode, searchQuery, equipmentInfoId } = routeInformation || {};
    const { isLocalizationLoaded } = this.state;
    const category = this.state.category;
    const isNodeRoute = Boolean(featureId);
    const { lat, lon, zoom } = this.state;

    const classList = [
      'app-container',
      this.props.className,
      this.state.isOnboardingVisible ? 'is-dialog-visible' : null,
      this.state.isMainMenuOpen ? 'is-main-menu-open' : null,
      this.state.isFilterToolbarVisible ? 'is-filter-toolbar-visible' : null,
      this.state.isNotFoundVisible ? 'is-on-not-found-page' : null,
      this.state.isSearchBarVisible ? 'is-search-bar-visible' : null,
      isEditMode ? 'is-edit-mode' : null,
      this.state.isReportMode ? 'is-report-mode' : null,
    ].filter(Boolean);

    const shouldLocateOnStart = +new Date() - (savedState.map.lastMoveDate || 0) > config.locateTimeout;

    const searchToolbarIsHidden =
      isNodeRoute || this.state.isFilterToolbarVisible || this.state.isOnboardingVisible || this.state.isNotFoundVisible;

    const searchToolbarIsInert = searchToolbarIsHidden || this.state.isMainMenuOpen;
    const isSearchButtonVisible = !this.state.isSearchBarVisible;

    return (<div className={classList.join(' ')}>
      <MainMenu
        className="main-menu"
        onToggle={isMainMenuOpen => this.setState({ isMainMenuOpen })}
        isEditMode={isEditMode}
        isLocalizationLoaded={isLocalizationLoaded}
        history={this.props.history}
        { ...{lat, lon, zoom}}
      />

      {isLocalizationLoaded && <SearchToolbar
        ref={searchToolbar => this.searchToolbar = searchToolbar}
        history={this.props.history}
        hidden={!this.state.isSearchBarVisible}
        inert={searchToolbarIsInert}
        category={category}
        searchQuery={searchQuery}
        onChangeSearchQuery={(newSearchQuery) => {
          if (!newSearchQuery || newSearchQuery.length === 0) {
            this.props.history.replace('/beta/', null);
            return;
          }
          this.props.history.replace(`/beta/search/?q=${newSearchQuery}`, null);
        }}
        lat={lat ? parseFloat(lat) : null}
        lon={lon ? parseFloat(lon) : null}
        onSelectCoordinate={(coords: ?{ lat: number, lon: number }) => {
          if (coords) {
            this.setState(coords);
          }
          this.setState({ isSearchBarVisible: false });
        }}
        onClose={() => { this.setState({ category: null, isSearchBarVisible: false }); }}
      /> }

      {isLocalizationLoaded && !this.state.isSearchBarVisible && (<div className="node-toolbar">
        <NodeToolbar
          ref={nodeToolbar => this.nodeToolbar = nodeToolbar}
          history={this.props.history}
          feature={this.state.feature}
          hidden={this.state.isFilterToolbarVisible || !isNodeRoute}
          featureId={featureId}
          equipmentInfoId={equipmentInfoId}
          isEditMode={isEditMode}
          onReportModeToggle={(isReportMode) => { this.setState({ isReportMode }); }}
        />
      </div>)}

      {(isLocalizationLoaded && !this.state.isFilterToolbarVisible) && <FilterButton
        ref={filterButton => this.filterButton = filterButton}
        accessibilityFilter={this.accessibilityFilter()}
        toiletFilter={this.toiletFilter()}
        onClick={() => this.toggleFilterToolbar()}
        top={200}
        right={10}
      />}

      {(this.state.isFilterToolbarVisible && isLocalizationLoaded) && (<div className="filter-toolbar">
        <FilterToolbar
          accessibilityFilter={this.accessibilityFilter()}
          toiletFilter={this.toiletFilter()}
          onCloseClicked={() => this.setState({ isFilterToolbarVisible: false })}
          onFilterChanged={(filter) => {
            setQueryParams(this.props.history, filter);
            this.setState(filter);
          }}
        />
      </div>)}

      {isSearchButtonVisible && <SearchButton
        onClick={e => { e.stopPropagation(); this.openSearch(); }}
        top={60}
        left={10}
      />}

      <Map
        ref={(map) => { this.map = map; window.map = map; }}
        history={this.props.history}
        onMoveEnd={(...args) => { this.onMoveEndHandler(...args) }}
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
        {...config}
      />

      <Onboarding
        isVisible={this.state.isOnboardingVisible}
        onClose={() => {
          saveOnboardingFlag();
          this.props.history.push(this.props.history.location.pathname, { isOnboardingVisible: false });
          if (this.searchToolbar) this.searchToolbar.focus();
        }}
      />

      <NotFound
        isVisible={this.state.isNotFoundVisible}
        onClose={() => {
          this.setState({ isNotFoundVisible: false });
        }}
        error={this.state.lastError}
      />
    </div>);
  }

  onMoveEndHandler(state) {
    // console.log('Setting query params after moving to', state);
    // setQueryParams(this.props.history, omit(state, 'bbox'));

    saveState('map.lastZoom', String(state.zoom));
    saveState('map.lastCenter.lat', String(state.lat));
    saveState('map.lastCenter.lon', String(state.lon));
    saveState('map.lastMoveDate', new Date().toString());
  }
}

const StyledFeatureLoader = styled(FeatureLoader)`
  a {
    color: ${colors.linkColor};
    text-decoration: none;
  }

  &.is-dialog-visible {
    > *:not(.modal-dialog) {
      filter: blur(5px);
      &, * {
        pointer-events: none;
      }
    }
  }

  &.is-main-menu-open {
    > *:not(.main-menu) {
      filter: blur(5px);
      &, * {
        pointer-events: none;
      }
    }
  }

  &.is-filter-toolbar-visible {
    > *:not(.filter-toolbar) {
      filter: blur(5px);
      &, * {
        pointer-events: none;
      }
    }
  }

  &.is-report-mode:not(.is-on-not-found-page),
  &.is-edit-mode:not(.is-on-not-found-page) {
    > *:not(.node-toolbar) {
      filter: blur(5px);
      &, * {
        pointer-events: none;
      }
    }
  }

  &.is-on-not-found-page {
    > *:not(.not-found-page) {
      filter: blur(5px);
      &, * {
        pointer-events: none;
      }
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
