// @flow

import L from 'leaflet';
import Categories from './Categories';
import { getColorForWheelchairAccessiblity } from './colors';

// Extend Leaflet-icon to support colors and category-images

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
    link.addEventListener('click', (event) => {
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


const createMarkerFromFeatureFn = (history) => (feature, latlng) => {
  const properties = feature && feature.properties;
  const categoryIdOrSynonym = properties && (properties.node_type || properties.category);
  const categoryId = Categories.getCategoryFromCache(categoryIdOrSynonym)._id;
  const iconName = categoryId || 'place';
  const color = getColorForWheelchairAccessiblity(properties);
  const icon = new Icon({
    history,
    feature,
    iconUrl: `/icons/categories/${iconName}.svg`,
    // iconUrl: `/icons/categories/${icons[iconName}.svg`,
    className: `ac-marker ac-marker-${color}`,
    iconSize: new L.Point(19, 19),
    iconAnchor: new L.Point(10, 11),
    popupAnchor: new L.Point(10, 11),
  });
  return L.marker(latlng, { icon });
};

export default createMarkerFromFeatureFn;
