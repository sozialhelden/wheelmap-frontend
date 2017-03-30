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
import Toolbar from './components/Toolbar';

const Wrapper = styled.section`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const StyledToolbar = styled(Toolbar)`
  background-color: #fff;
  flex: 50px;
  color: white;
`;

const StyledMap = styled(Map)`
  flex: 1;
`;

const App = () => (
  <Router>
    <Wrapper>
      <Route exact path="/" component={StyledMap} />
      {/* <Route path="/about" component={About}/>
      <Route path="/topics" component={Topics}/> */}
      <StyledToolbar />
    </Wrapper>
  </Router>
);

export default App;
