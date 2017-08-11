// @flow

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import L from 'leaflet';

export default class FilterButton extends Component {
  render() {
    return (<a className="leaflet-bar-part leaflet-bar-part-single" title="Change which places are shown on the map">
      <span className="leaflet-icon-filter"></span>
    </a>);
  }
}


export function addFilterControlToMap(map: L.Map) {
  const bar = document.createElement('div');
  bar.className = 'leaflet-bar leaflet-control';
  map._controlCorners.topright.appendChild(bar);
  ReactDOM.render(<FilterButton />, bar);
}
