// @flow

import React, { Component } from 'react';
// import logo from './logo.svg';
import styled from 'styled-components';
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import colors from './lib/colors';
import Map from './components/Map/Map';
import './App.css';
import SearchToolbar from './components/SearchToolbar/SearchToolbar';
import NodeToolbar from './components/NodeToolbar/NodeToolbar';

import { isWheelmapFeatureId } from './lib/Feature';

import type { Feature } from './lib/Feature';

import { wheelmapLightweightFeatureCache } from './lib/cache/WheelmapLightweightFeatureCache';
import { accessibilityCloudFeatureCache } from './lib/cache/AccessibilityCloudFeatureCache';
import { wheelmapFeatureCache } from './lib/cache/WheelmapFeatureCache';

import { getQueryParams, setQueryParams } from './lib/queryParams';


type Props = {
  className: string
};


type State = {
  feature?: Feature,
  fetching: boolean,
};


class FeatureLoader extends Component<void, Props, State> {
  constructor(props: Props) {
    super(props);
    this.onHashUpdateBound = this.onHashUpdate.bind(this);
  }


  state: State = { fetching: false };
  map: ?any;


  componentDidMount() {
    this.fetchFeature(this.props);
    window.addEventListener('hashchange', this.onHashUpdateBound);
  }


  componentWillReceiveProps(newProps: Props): void {
    this.fetchFeature(newProps);
  }


  componentWillUnmount() {
    window.removeEventListener('hashchange', this.onHashUpdateBound);
  }

  onHashUpdateBound: (() => void);


  onHashUpdate() {
    const map = this.map;
    if (!map) return;
    this.setState(getQueryParams());
  }


  featureId(props: Props = this.props): ?string {
    const location = props.location;
    const match = location.pathname.match(/\/(-?\w+)\/([-\w\d]+)/i);
    if (match) {
      if (match[1] === 'nodes') return match[2];
    }
    return null;
  }


  category(props: Props = this.props): ?string {
    const location = props.location;
    const match = location.pathname.match(/\/(-?\w+)\/([-_\w\d]+)/i);
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


  render() {
    const featureId = this.featureId();
    const category = this.category();
    const isNodeRoute = Boolean(featureId);
    const { lat, lon, zoom } = this.state;
    console.log('Category:', category);
    console.log('Positioning:', lat, lon, zoom);
    return (<div className={`app-container ${this.props.className}`}>
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
      />
      <SearchToolbar hidden={isNodeRoute} category={category} />;
      {isNodeRoute ? <NodeToolbar feature={this.state.feature} featureId={featureId} /> : null}
    </div>);
  }
}


function App() {
  return (<Router>
    <Route path="/" component={FeatureLoader} />
  </Router>);
}


const StyledApp = styled(App)`
  a {
    color: ${colors.linkColor};
    text-decoration: none;
  }
`;


export default StyledApp;
