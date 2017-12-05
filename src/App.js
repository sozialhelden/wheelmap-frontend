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
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Map from './components/Map/Map';
import NotFound from './components/NotFound/NotFound';
import MainMenu from './components/MainMenu/MainMenu';
import NodeToolbar from './components/NodeToolbar/NodeToolbar';
import FilterButton from './components/FilterToolbar/FilterButton';
import SearchToolbar from './components/SearchToolbar/SearchToolbar';
import FilterToolbar from './components/FilterToolbar/FilterToolbar';
import HighlightableMarker from './components/Map/HighlightableMarker';
import Onboarding, { saveOnboardingFlag, isOnboardingVisible } from './components/Onboarding/Onboarding';

import config from './lib/config';
import colors from './lib/colors';
import savedState, { saveState } from './lib/savedState';
import { loadExistingLocalizationByPreference } from './lib/i18n';
import type {
  Feature,
  WheelmapFeature,
  AccessibilityCloudFeature,
  YesNoLimitedUnknown,
  YesNoUnknown
} from './lib/Feature';
import {
  isWheelmapFeatureId,
  yesNoLimitedUnknownArray,
  yesNoUnknownArray
} from './lib/Feature';


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
  isReportMode: boolean,
  category: ?string,
  isLocalizationLoaded: boolean,
};

type RouteInformation = {
  featureId: ?string,
  category: ?string,
  isEditMode: boolean,
};

function updateTouchCapability() {
  if (!document.body) return;

  if (isTouchDevice()) {
    document.body.classList.add('is-touch-device');
  } else {
    document.body.classList.remove('is-touch-device');
  }
}

function hrefForFeatureId(featureId: string) {
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
    isFilterToolbarVisible: false,
    isOnboardingVisible: isOnboardingVisible(),
    isNotFoundVisible: false,
    category: null,
    isLocalizationLoaded: false,
    isMainMenuOpen: false,
    isReportMode: false,
  };

  map: ?any;


  onMarkerClick = (featureId: string) => {
    const params = getQueryParams();
    const href = hrefForFeatureId(featureId);
    this.props.history.push(`${href}#?${queryString.stringify(params)}`);
  };


  createMarkerFromFeature = (feature: Feature, latlng: [number, number]) => {
    const properties = feature && feature.properties;
    if (!properties) return null;
    return new HighlightableMarker(latlng, {
      onClick: this.onMarkerClick,
      hrefForFeatureId,
      feature,
    });
  }


  resizeListener = () => {
    updateTouchCapability();
  };


  async componentWillMount() {
    this.onHashUpdate();
    window.addEventListener('resize', this.resizeListener);
    this.resizeListener();
    loadExistingLocalizationByPreference()
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

    const routeInformation = this.routeInformation(props);
    if (!routeInformation) {
      this.setState({ isNotFoundVisible: true });
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
    console.log("Restored state", savedState);
    let baseParams = { toilet: null, status: null, lat: null, lon: null, zoom: null };
    if (savedState.map.lastZoom) {
      baseParams.zoom = savedState.map.lastZoom;
    }
    if (savedState.map.lastCenter && savedState.map.lastCenter[0]) {
      const lastCenter = savedState.map.lastCenter;
      baseParams.lat = lastCenter[0];
      baseParams.lon = lastCenter[1];
    }

    const params = Object.assign(baseParams, pick(getQueryParams(), 'lat', 'lon', 'zoom', 'toilet', 'status'));
    console.log('Hash updated:', params);

    this.setState(params);
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
    const match = location.pathname.match(/(?:\/beta)?\/?(?:(-?\w+)(?:\/([-\w\d]+)(?:\/([-\w\d]+))?)?)?/i);
    if (match) {
      if (match[1] && !includes(allowedResourceNames, match[1])) return null;
      return {
        featureId: match[1] === 'nodes' ? match[2] : null,
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
      if (!feature.properties.name) debugger
      const currentlyShownId = this.featureId(this.props);
      const idProperties = [feature.id, feature.properties.id, feature._id, feature.properties._id];
      const fetchedId = String(idProperties.filter(Boolean)[0]);
      // shown feature might have changed in the mean time. `fetch` requests cannot be aborted so
      // we ignore the response here instead.
      if (fetchedId !== currentlyShownId) return;
      const [lon, lat] = get(feature, 'geometry.coordinates') || [this.state.lon, this.state.lat];
      this.setState({ feature, lat, lon, fetching: false });
    }, (reason) => {
      this.setState({ feature: null, fetching: false, isNotFoundVisible: true });
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

    if (prevState.isFilterToolbarVisible && !this.state.isFilterToolbarVisible) {
      this.filterButton.focus();
      return;
    }

    if (nodeToolbarDidDisappear && !this.state.isFilterToolbarVisible) {
      this.lastFocusedElement.focus();
    }

    if (nodeToolbarDidAppear || nodeToolbarIsDiplayedAndDidUpdate) {
      this.lastFocusedElement = document.activeElement;
      this.nodeToolbar.focus();
    }

    if (this.state.category && !prevState.category) {
      this.map.focus();
    }
  }

  render() {
    const routeInformation = this.routeInformation();

    const { featureId, isEditMode, searchQuery } = routeInformation || {};
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
      isEditMode ? 'is-edit-mode' : null,
      this.state.isReportMode ? 'is-report-mode' : null,
    ].filter(Boolean);

    const shouldLocateOnStart = +new Date() - (savedState.map.lastMoveDate || 0) > config.locateTimeout;

    const searchToolbarIsHidden =
      isNodeRoute || this.state.isFilterToolbarVisible || this.state.isOnboardingVisible || this.state.isNotFoundVisible;

    const searchToolbarIsInert = searchToolbarIsHidden || this.state.isMainMenuOpen;

    return (<div className={classList.join(' ')}>
      <MainMenu
        className="main-menu"
        onToggle={isMainMenuOpen => this.setState({ isMainMenuOpen })}
        isEditMode={isEditMode}
        isLocalizationLoaded={isLocalizationLoaded}
      />

      {isLocalizationLoaded ? <SearchToolbar
        ref={searchToolbar => this.searchToolbar = searchToolbar}
        history={this.props.history}
        hidden={searchToolbarIsHidden}
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
        }}
        onClose={() => { this.setState({ category: null }); }}
      /> : null }

      {(isNodeRoute && isLocalizationLoaded) ? (<div className="node-toolbar">
        <NodeToolbar
          ref={nodeToolbar => this.nodeToolbar = nodeToolbar}
          history={this.props.history}
          feature={this.state.feature}
          hidden={this.state.isFilterToolbarVisible}
          featureId={featureId}
          isEditMode={isEditMode}
          onReportModeToggle={(isReportMode) => { this.setState({ isReportMode }); }}
          // onClose={() => { this.setState({ category: null }); }}
        />
      </div>) : null}

      {(isLocalizationLoaded && !this.state.isFilterToolbarVisible) ? <FilterButton
        ref={filterButton => this.filterButton = filterButton}
        accessibilityFilter={this.accessibilityFilter()}
        toiletFilter={this.toiletFilter()}
        onClick={() => this.toggleFilterToolbar()}
      /> : null}

      {(this.state.isFilterToolbarVisible && isLocalizationLoaded) ? (<div className="filter-toolbar">
        <FilterToolbar
          accessibilityFilter={this.accessibilityFilter()}
          toiletFilter={this.toiletFilter()}
          onCloseClicked={() => this.setState({ isFilterToolbarVisible: false })}
          onFilterChanged={(filter) => {
            setQueryParams(this.props.history, filter);
            this.setState(filter);
          }}
        />
      </div>) : null}

      <Map
        ref={(map) => { this.map = map; window.map = map; }}
        history={this.props.history}
        onMoveEnd={(...args) => { this.onMoveEndHandler(...args) }}
        lat={lat ? parseFloat(lat) : null}
        lon={lon ? parseFloat(lon) : null}
        zoom={zoom ? parseFloat(zoom) : null}
        category={category}
        featureId={featureId}
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
          this.setState({ isOnboardingVisible: false });
          this.searchToolbar.focus();
        }}
      />

      <NotFound
        isVisible={this.state.isNotFoundVisible}
        onClose={() => {
          this.setState({ isNotFoundVisible: false });
        }}
      />
    </div>);
  }

  onMoveEndHandler(state) {
    console.log('Setting query params after moving to', state);
    setQueryParams(this.props.history, omit(state, 'bbox'));

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
  return (<Router>
    <Route path="/" component={StyledFeatureLoader} />
  </Router>);
}


export default App;
