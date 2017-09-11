// @flow

import pick from 'lodash/pick';
import styled from 'styled-components';
import includes from 'lodash/includes';
import get from 'lodash/get';
import React, { Component } from 'react';
import { BrowserRouter as Router, Route, RouterHistory } from 'react-router-dom';

import MainMenu from './components/MainMenu/MainMenu';
import Map from './components/Map/Map';
import NodeToolbar from './components/NodeToolbar/NodeToolbar';
import SearchToolbar from './components/SearchToolbar/SearchToolbar';
import FilterButton from './components/FilterToolbar/FilterButton';
import FilterToolbar from './components/FilterToolbar/FilterToolbar';
import Onboarding, { saveOnboardingFlag, isOnboardingVisible } from './components/Onboarding/Onboarding';
import NotFound from './components/NotFound/NotFound';

import colors from './lib/colors';
import type { Feature } from './lib/Feature';
import { isWheelmapFeatureId, yesNoLimitedUnknownArray, yesNoUnknownArray } from './lib/Feature';
import type { YesNoLimitedUnknown, YesNoUnknown } from './lib/Feature';
import { wheelmapLightweightFeatureCache } from './lib/cache/WheelmapLightweightFeatureCache';
import { accessibilityCloudFeatureCache } from './lib/cache/AccessibilityCloudFeatureCache';
import { getQueryParams, setQueryParams } from './lib/queryParams';
import parseQueryParams from './lib/parseQueryParams';
import { wheelmapFeatureCache } from './lib/cache/WheelmapFeatureCache';
import isTouchDevice from './lib/isTouchDevice';

import 'leaflet/dist/leaflet.css';
import './App.css';

type Props = {
  className: string,
  history: RouterHistory,
};


type State = {
  feature?: Feature,
  fetching: boolean,
  toilet: ?string,
  status: ?string,
  lat: ?string,
  lon: ?string,
  zoom: ?string,
  isFilterToolbarVisible: boolean,
  isOnboardingVisible: boolean,
  isMainMenuOpen: boolean;
  isNotFoundVisible: boolean;
};

type RouteInformation = {
  nodeId: ?string,
  category: ?string,
  isEditMode: boolean,
};

function updateTouchCapability() {
  if (isTouchDevice()) {
    document.body.classList.add('is-touch-device');
  } else {
    document.body.classList.remove('is-touch-device');
  }
}


class FeatureLoader extends Component<void, Props, State> {
  state: State = {
    fetching: false,
    toilet: null,
    status: null,
    lat: null,
    lon: null,
    zoom: null,
    isFilterToolbarVisible: false,
    isOnboardingVisible: isOnboardingVisible(),
    isNotFoundVisible: false,
  };

  map: ?any;


  componentWillMount() {
    this.onHashUpdate();
    this.resizeListener = () => { updateTouchCapability(); };
    window.addEventListener('resize', this.resizeListener);
    updateTouchCapability();
  }


  componentDidMount() {
    this.fetchFeature(this.props);
    window.addEventListener('hashchange', this.onHashUpdate);
  }


  componentWillReceiveProps(newProps: Props): void {
    this.fetchFeature(newProps);
    if (this.featureId(newProps) !== this.featureId(this.props)) {
      this.setState({ isFilterToolbarVisible: false });
    }
    const routeInformation = this.routeInformation(newProps);
    if (!routeInformation) {
      this.setState({ isNotFoundVisible: true });
    }
  }


  componentWillUnmount() {
    delete this.resizeListener;
    window.removeEventListener('hashchange', this.onHashUpdate);
    window.removeEventListener('resize', this.resizeListener);
  }


  onHashUpdate = () => {
    const params = Object.assign({ toilet: null, status: null }, pick(getQueryParams(), 'lat', 'lon', 'zoom', 'toilet', 'status'));
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


  routeInformation(props: Props = this.props): ?RouteInformation {
    const location = props.location;
    const allowedResourceNames = ['nodes', 'categories', 'search'];
    const match = location.pathname.match(/(?:\/beta)?\/?(?:(-?\w+)(?:\/([-\w\d]+)(?:\/([-\w\d]+))?)?)?/i);
    if (match) {
      if (match[1] && !allowedResourceNames.includes(match[1])) return null;
      return {
        featureId: match[1] === 'nodes' ? match[2] : null,
        category: match[1] === 'categories' ? match[2] : null,
        searchQuery: match[1] === 'search' ? parseQueryParams(location.search).q : null,
        isEditMode: (match[3] === 'edit'),
      };
    }
    return null;
  }


  featureId(props: Props = this.props): ?string {
    const routeInformation = this.routeInformation(props);
    return routeInformation ? routeInformation.featureId : null;
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
    cache.getFeature(id).then((feature) => {
      if (!feature) return;
      const currentlyShownId = this.featureId(this.props);
      const idProperties = [feature._id, feature.id, feature.properties.id, feature.properties._id];
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


  render() {
    const routeInformation = this.routeInformation();

    const { featureId, category, isEditMode, searchQuery } = routeInformation || {};
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
    ].filter(Boolean);

    return (<div className={classList.join(' ')}>
      <MainMenu
        className="main-menu"
        onToggle={isMainMenuOpen => this.setState({ isMainMenuOpen })}
      />

      <Map
        ref={(map) => { this.map = map; }}
        history={this.props.history}
        onMoveEnd={(...params) => { console.log('Setting query params after moving to', params[0]); setQueryParams(...params); }}
        lat={lat ? parseFloat(lat) : null}
        lon={lon ? parseFloat(lon) : null}
        zoom={zoom ? parseFloat(zoom) : null}
        category={category}
        featureId={featureId}
        feature={this.state.feature}
        accessibilityFilter={this.accessibilityFilter()}
        toiletFilter={this.toiletFilter()}
      />

      {this.state.isFilterToolbarVisible ? null : <FilterButton
        accessibilityFilter={this.accessibilityFilter()}
        toiletFilter={this.toiletFilter()}
        onClick={() => this.toggleFilterToolbar()}
      />}

      <SearchToolbar
        history={this.props.history}
        hidden={isNodeRoute || this.state.isFilterToolbarVisible}
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
      />

      {isNodeRoute ? (<div className="node-toolbar">
        <NodeToolbar
          history={this.props.history}
          feature={this.state.feature}
          hidden={this.state.isFilterToolbarVisible}
          featureId={featureId}
          isEditMode={isEditMode}
        />
      </div>) : null}

      {this.state.isFilterToolbarVisible ? (<div className="filter-toolbar">
        <FilterToolbar
          accessibilityFilter={this.accessibilityFilter()}
          toiletFilter={this.toiletFilter()}
          onCloseClicked={() => this.setState({ isFilterToolbarVisible: false })}
        />
      </div>) : null}

      <Onboarding isVisible={this.state.isOnboardingVisible} onClose={() => {
        saveOnboardingFlag();
        this.setState({ isOnboardingVisible: false });
      }} />

      <NotFound isVisible={this.state.isNotFoundVisible} onClose={() => {
        this.setState({ isNotFoundVisible: false });
      }} />
    </div>);
  }
}

const StyledFeatureLoader = styled(FeatureLoader)`
  a {
    color: ${colors.linkColor};
    text-decoration: none;
  }

  &.is-dialog-visible {
    > *:not(.modal-dialog) {
      filter: blur(10px);
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
