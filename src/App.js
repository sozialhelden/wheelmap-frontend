// @flow

import React from 'react';
// import logo from './logo.svg';
import styled from 'styled-components';
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import Map from './components/Map';
import './App.css';
import colors from './lib/colors';
import { Linkbar } from './components/Linkbar';
import Toolbar from './components/Toolbar';
import NodeSidebar from './components/NodeSidebar';

const StyledNodeSidebar = styled(NodeSidebar)`
  background-color: ${colors.colorizedBackgroundColor};
`;

const App = () => (
  <Router>
    <div className="app-container">
      <Route path="/nodes/:id" component={StyledNodeSidebar} />
      <Route path="/" component={Map} />
      <Linkbar />
      <Toolbar />
    </div>
  </Router>
);

export default App;
