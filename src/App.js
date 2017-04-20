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
  flex: 50px;
  color: white;
  position: absolute;
  z-index: 1000;
  top: 0px;
  left: 0px;

  height: 50px;
  width: 100%;
  box-sizing: border-box;
  padding: 10px 20px;

  font-size: 18px;
  background-color: ${colors.neutralBackgroundColor};
  background: -webkit-linear-gradient(top, #f2f2f2 0%, #ededed 100%);
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
