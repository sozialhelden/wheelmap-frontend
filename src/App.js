// @flow

import React from 'react';
// import logo from './logo.svg';
import styled from 'styled-components';
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import colors from './lib/colors';
import Map from './components/Map';
import './App.css';
import SearchToolbar from './components/SearchToolbar/SearchToolbar';
import NodeToolbar from './components/NodeToolbar/NodeToolbar';


function HidingSearchToolbar(props) {
  const isNodeRoute = Boolean(props.location && props.location.pathname.match(/\/nodes/));
  return <SearchToolbar hidden={isNodeRoute} />;
}

const App = ({ className }: { className: string }) => (
  <Router>
    <div className={`app-container ${className}`}>
      <Route path="/" component={Map} />
      <Route path="/" component={HidingSearchToolbar} />
      <Route path="/nodes/:id" component={NodeToolbar} />
    </div>
  </Router>
);

const StyledApp = styled(App)`
  a {
    color: ${colors.linkColor};
    text-decoration: none;
  }
`;

export default StyledApp;
