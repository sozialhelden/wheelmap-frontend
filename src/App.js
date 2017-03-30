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
import Toolbar from './components/Toolbar';
import NodeSidebar from './components/NodeSidebar';

const StyledNodeSidebar = styled(NodeSidebar)`
  background-color: ${colors.colorizedBackgroundColor};
`;

const Flex = styled.section`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: ${props => props.direction};
`;

const StyledToolbar = styled(Toolbar)`
  background-color: ${colors.neutralBackgroundColor};
  flex: 50px;
  color: white;
`;

const StyledMap = styled(Map)`
  flex: 1;
`;

const App = () => (
  <Router>
    <Flex direction="column">
      <Flex direction="row">
        <Route path="/nodes/:id" component={StyledNodeSidebar} />
        <Route path="/" component={StyledMap} />
      </Flex>
      {/* <Route path="/about" component={About}/>
      <Route path="/topics" component={Topics}/> */}
      <StyledToolbar />
    </Flex>
  </Router>
);

export default App;
