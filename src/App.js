// @flow

import pick from 'lodash/pick';
import styled from 'styled-components';
import includes from 'lodash/includes';
import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import MainMenu from './components/MainMenu/MainMenu';
import Map from './components/Map/Map';
import NodeToolbar from './components/NodeToolbar/NodeToolbar';
import SearchToolbar from './components/SearchToolbar/SearchToolbar';
import FilterButton from './components/FilterToolbar/FilterButton';
import FilterToolbar from './components/FilterToolbar/FilterToolbar';
import Onboarding, { saveOnboardingFlag, isOnboardingVisible } from './components/Onboarding/Onboarding';

import colors from './lib/colors';
import type { Feature } from './lib/Feature';
import { isWheelmapFeatureId, yesNoLimitedUnknownArray, yesNoUnknownArray } from './lib/Feature';
import type { YesNoLimitedUnknown, YesNoUnknown } from './lib/Feature';
import { wheelmapLightweightFeatureCache } from './lib/cache/WheelmapLightweightFeatureCache';
import { accessibilityCloudFeatureCache } from './lib/cache/AccessibilityCloudFeatureCache';
import { getQueryParams, setQueryParams } from './lib/queryParams';
import { wheelmapFeatureCache } from './lib/cache/WheelmapFeatureCache';
import isTouchDevice from './lib/isTouchDevice';

import 'leaflet/dist/leaflet.css';
import './App.css';

type Props = {
  className: string
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
  };

  map: ?any;

  onHashUpdateBound: (() => void);


  constructor(props: Props) {
    super(props);
    this.onHashUpdateBound = this.onHashUpdate.bind(this);
  }


  componentWillMount() {
    this.onHashUpdate();
    this.resizeListener = () => { updateTouchCapability(); };
    window.addEventListener('resize', this.resizeListener);
    updateTouchCapability();
  }


  componentDidMount() {
    this.fetchFeature(this.props);
    window.addEventListener('hashchange', this.onHashUpdateBound);
  }


  componentWillReceiveProps(newProps: Props): void {
    this.fetchFeature(newProps);
    if (this.featureId(newProps) !== this.featureId(this.props)) {
      this.setState({ isFilterToolbarVisible: false });
    }
  }


  componentWillUnmount() {
    delete this.resizeListener;
    window.removeEventListener('hashchange', this.onHashUpdateBound);
    window.removeEventListener('resize', this.resizeListener);
  }


  onHashUpdate() {
    const params = Object.assign({ toilet: null, status: null }, pick(getQueryParams(), 'lat', 'lon', 'zoom', 'toilet', 'status'));
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
    const location = props.location;
    const match = location.pathname.match(/(?:\/beta)?\/(-?\w+)\/([-\w\d]+)/i);
    if (match) {
      if (match[1] === 'nodes') return match[2];
    }
    return null;
  }


  category(props: Props = this.props): ?string {
    const location = props.location;
    const match = location.pathname.match(/(?:\/beta)?\/(-?\w+)\/([-_\w\d]+)/i);
    if (match) {
      if (match[1] === 'categories') return match[2];
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
    cache.getFeature(id).then((feature) => {
      if (!feature) return;
      const currentlyShownId = this.featureId(this.props);
      const idProperties = [feature._id, feature.id, feature.properties.id, feature.properties._id];
      const fetchedId = String(idProperties.filter(Boolean)[0]);
      // shown feature might have changed in the mean time. `fetch` requests cannot be aborted so
      // we ignore the response here instead.
      if (fetchedId !== currentlyShownId) return;
      this.setState({ feature, fetching: false });
    });
  }


  toggleFilterToolbar() {
    this.setState({ isFilterToolbarVisible: !this.state.isFilterToolbarVisible });
  }


  render() {
    const featureId = this.featureId();
    const category = this.category();
    const isNodeRoute = Boolean(featureId);
    const { lat, lon, zoom } = this.state;
    console.log('Category:', category);
    console.log('Positioning:', lat, lon, zoom);
    console.log('Accessibility filter:', this.accessibilityFilter());
    console.log('Toilet filter:', this.toiletFilter());

    const classList = [
      'app-container',
      this.props.className,
      this.state.isOnboardingVisible ? 'is-dialog-visible' : null,
      this.state.isMainMenuOpen ? 'is-main-menu-open' : null,
      this.state.isFilterToolbarVisible ? 'is-filter-toolbar-visible' : null,
    ].filter(Boolean);

    return (<div className={classList.join(' ')}>
      <MainMenu
        className="main-menu"
        onToggle={isMainMenuOpen => this.setState({ isMainMenuOpen })}
      />

      <Map
        ref={(map) => { this.map = map; }}
        history={this.props.history}
        onZoomEnd={setQueryParams}
        onMoveEnd={setQueryParams}
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
      />

      {isNodeRoute ? <NodeToolbar
        history={this.props.history}
        feature={this.state.feature}
        hidden={this.state.isFilterToolbarVisible}
        featureId={featureId} /> : null}

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

  /*&.is-filter-toolbar-visible {
    > .main-menu {
      filter: blur(5px);
      &, * {
        pointer-events: none;
      }
    }
  }*/
`;

function App() {
  return (<Router>
    <Route path="/" component={StyledFeatureLoader} />
  </Router>);
}


export default App;
