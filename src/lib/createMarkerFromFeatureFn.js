// @flow

import L from 'leaflet';
import type { RouterHistory } from 'react-router-dom';
import { getColorForWheelchairAccessiblity } from './colors';
import Categories from './Categories';
import type { Feature } from './Feature';


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
    const href = `/nodes/${properties.id || properties._id}`;
    link.href = href;
    const img = this._createImg(this.options.iconUrl);
    link.appendChild(img);
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


const createMarkerFromFeatureFn = (history: RouterHistory) =>
  (feature: Feature, latlng: [number, number]) => {
    const properties = feature && feature.properties;
    if (!properties) return null;
    const givenNodeTypeId = properties.node_type ? properties.node_type.identifier : null;
    let givenCategoryId = null;
    if (typeof properties.category === 'string') {
      givenCategoryId = properties.category;
    }
    if (typeof properties.category === 'object') {
      givenCategoryId = properties.category.identifier;
    }
    const categoryIdOrSynonym = givenNodeTypeId || givenCategoryId;
    const category = Categories.getCategoryFromCache(categoryIdOrSynonym);
    const categoryId = category ? category._id : null;
    const iconName = categoryId || 'place';
    const color = getColorForWheelchairAccessiblity(properties);
    const icon = new Icon({
      history,
      feature,
      iconUrl: `/icons/categories/${iconName}.svg`,
      className: `ac-marker ac-marker-${color}`,
      iconSize: new L.Point(19, 19),
      iconAnchor: new L.Point(10, 11),
      popupAnchor: new L.Point(10, 11),
    });
    return L.marker(latlng, { icon });
  };

export default createMarkerFromFeatureFn;
