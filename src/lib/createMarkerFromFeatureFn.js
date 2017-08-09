// @flow

import L from 'leaflet';
import React from 'react';
import ReactDOM from 'react-dom';
import includes from 'lodash/includes';
import levenshtein from 'fast-levenshtein';
import { color as d3Color } from 'd3-color';
import type { RouterHistory } from 'react-router-dom';
import {
  getColorForWheelchairAccessibility,
  interpolateWheelchairAccessibilityColors,
} from './colors';
import Categories from './Categories';
import type { Feature, NodeProperties } from './Feature';
import * as categoryIcons from '../components/icons/categories';


// Extend Leaflet-icon to support colors and category images

const Icon = L.Icon.extend({
  options: {
    number: '',
    shadowUrl: null,
    className: 'leaflet-div-icon accessiblity',
  },

  createIcon() {
    // this.options.history.navigate(...)
    const link = document.createElement('a');
    const properties = this.options.feature.properties;
    const href = `/beta/nodes/${properties.id || properties._id}`;
    link.href = href;
    const IconComponent = categoryIcons[this.options.iconName || 'undefined'];
    if (IconComponent) {
      ReactDOM.render(<IconComponent />, link);
    }
    link.addEventListener('click', (event: MouseEvent) => {
      event.preventDefault();
      this.options.history.push(href);
    });
    this._setIconStyles(link, 'icon');
    link.addEventListener('click', (event: MouseEvent) => {
      event.preventDefault();
      this.options.history.push(link.pathname);
    });
    return link;
  },

  createShadow() {
    return null;
  },
});

function getIconNameForProperties(properties) {
  const givenNodeTypeId = properties.node_type ? properties.node_type.identifier : null;
  let givenCategoryId = null;
  if (typeof properties.category === 'string') {
    givenCategoryId = properties.category;
  }
  if (properties.category && typeof properties.category === 'object') {
    givenCategoryId = properties.category.identifier;
  }
  const categoryIdOrSynonym = givenNodeTypeId || givenCategoryId;
  const category = Categories.getCategoryFromCache(categoryIdOrSynonym);
  const categoryId = category ? category._id : null;
  return categoryId;
}

const createMarkerFromFeatureFn = (history: RouterHistory) =>
  (feature: Feature, latlng: [number, number]) => {
    const properties = feature && feature.properties;
    if (!properties) return null;

    const color = getColorForWheelchairAccessibility(properties);
    const iconName = getIconNameForProperties(properties) || 'place';
    const className = `ac-marker ac-marker-${color}`;
    const icon = new Icon({
      history,
      feature,
      iconName,
      className,
      iconSize: new L.Point(19, 19),
      iconAnchor: new L.Point(11, 11),
      popupAnchor: new L.Point(11, 11),
      tooltipAnchor: new L.Point(11, 37),
    });

    const marker = L.marker(latlng, { icon });
    // marker.on('click', () => {
    //   highlightMarker(marker);
    // });

    // Uncomment this to enable tooltips with names for each place.

    // if (properties.name) {
    //   marker.bindTooltip(properties.name, {
    //     direction: 'bottom',
    //     className: 'ac-marker-name-tooltip',
    //     offset: new L.Point(0, 1),
    //     // permanent: true,
    //   });
    //   marker.on('tooltipopen', (event) => {
    //     const el = event.tooltip.getElement();
    //     el.style.width = el.scrollWidth;
    //   });
    // }

    return marker;
  };

export default createMarkerFromFeatureFn;


function isSamePlace(propertiesArray: NodeProperties[]) {
  const hasTwoPlaces = propertiesArray.length === 2;
  if (!hasTwoPlaces) return false;

  const [name0, name1] = propertiesArray.map(p => p.name);
  if (!name0 || !name1) return false;

  const levenshteinDistance = levenshtein.get(name0, name1, { useCollator: true });
  if (levenshteinDistance < 5) return true;

  const isOneStringContainedInTheOther = includes(name0, name1) || includes(name1, name0);
  return isOneStringContainedInTheOther;
}


export const ClusterIcon = L.Icon.extend({
  options: {
    number: '',
    shadowUrl: null,
    className: 'leaflet-div-icon accessiblity ac-marker ac-marker-cluster',
    iconSize: new L.Point(20, 20),
    iconAnchor: new L.Point(11, 11),
    popupAnchor: new L.Point(11, 11),
  },

  createIcon() {
    const div = document.createElement('div');
    const propertiesArray = this.options.propertiesArray;
    if (isSamePlace(propertiesArray)) {
      const iconNames = propertiesArray.map(p => getIconNameForProperties(p)).filter(Boolean);
      const IconComponent = categoryIcons[iconNames[0] || 'undefined'];
      if (IconComponent) {
        ReactDOM.render(<IconComponent />, div);
      }
    } else {
      div.innerHTML = String(propertiesArray.length);
    }
    const backgroundColor = d3Color(interpolateWheelchairAccessibilityColors(propertiesArray));
    div.style.backgroundColor = backgroundColor;
    this._setIconStyles(div, 'icon');
    return div;
  },

  createShadow() {
    return null;
  },
});
