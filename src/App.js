// @flow

import React from 'react';
import Map from './components/Map';
// import logo from './logo.svg';
import styled from 'styled-components';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'
import 'leaflet/dist/leaflet.css';
import './App.css';


const Wrapper = styled.section`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const Toolbar = styled.nav`
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
      <Route exact path="/" component={StyledMap}/>
      {/* <Route path="/about" component={About}/>
      <Route path="/topics" component={Topics}/> */}
      <Toolbar>
        <Link to="/">Wheelmap</Link>
        <Link to="/about">About</Link>
        <Link to="/topics">Topics</Link>
      </Toolbar>
    </Wrapper>
  </Router>
)

export default App;
