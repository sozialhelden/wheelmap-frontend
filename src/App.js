// @flow

import React from 'react';
// import logo from './logo.svg';
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import Map from './components/Map';
import './App.css';
import SearchToolbar from './components/SearchToolbar/SearchToolbar';
import NodeToolbar from './components/NodeToolbar/NodeToolbar';

const App = () => (
  <Router>
    <div className="app-container">
      <Route path="/" component={Map} />
      <Route component={SearchToolbar} />
      <Route path="/nodes/:id" component={NodeToolbar} />
    </div>
  </Router>
);

export default App;
