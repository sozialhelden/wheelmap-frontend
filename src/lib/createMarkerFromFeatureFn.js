import L from 'leaflet';
import get from 'lodash/get';

// Extend Leaflet-icon to support colors and category-images
const Icon = L.Icon.extend({
  options: {
    number: '',
    shadowUrl: null,
    className: 'leaflet-div-icon accessiblity',
  },

  createIcon() {
    const link = document.createElement('a');
    const href = `/nodes/${this.options.feature.properties.id}`;
    link.href = href;
    const img = this._createImg(this.options.iconUrl);
    link.appendChild(img);
    link.addEventListener('click', (event) => {
      event.preventDefault();
      this.options.history.push(href);
    });
    this._setIconStyles(link, 'icon');
    return link;
  },

  createShadow() {
    return null;
  },
});

function getColorForWheelchairAccessiblity(placeData) {
  const isAccessible = get(placeData, 'properties.wheelchair') ||
    get(placeData, 'properties.accessibility.accessibleWith.wheelchair');
  const isPartiallyAccessible = get(placeData, 'properties.accessibility.partiallyAccessibleWith.wheelchair');
  switch (isAccessible) {
    case 'yes':
    case true: return 'green';
    case 'limited': return 'yellow';
    case 'no':
    case false: return isPartiallyAccessible ? 'yellow' : 'red';
    default: return 'gray';
  }
}

const createMarkerFromFeatureFn = (history) => (feature, latlng) => {
  const iconName = (feature && feature.properties && feature.properties.category) || 'place';
  const color = getColorForWheelchairAccessiblity(feature);
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
