import React from 'react';
import ReactDOM from 'react-dom';
import L from 'leaflet';
import { mappingEventHalo as MappingEventHaloSvg } from '../icons/markers';

export default class MappingEventHaloMarkerIcon extends L.Icon {
  constructor() {
    const size = 500;
    const defaults = {
      iconSize: new L.Point(size, size),
    };

    super(defaults);

    this.size = size;
  }

  createIcon() {
    const span = document.createElement('span');
    ReactDOM.render(<MappingEventHaloSvg width={this.size} height={this.size} />, span);
    this._setIconStyles(span, 'icon');
    span.tabIndex = -1;
    return span;
  }
}
