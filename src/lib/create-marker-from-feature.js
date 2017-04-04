import L from 'leaflet';
import get from 'lodash/get';

// Extend Leaflet-icon to support colors and category-images
const AccessibilityIcon = L.Icon.extend({
  options: {
    number: '',
    shadowUrl: null,
    className: 'leaflet-div-icon accessiblity',
  },

  createIcon() {
    const div = document.createElement('div');
    const img = this._createImg(this.options.iconUrl);
    div.appendChild(img);
    this._setIconStyles(div, 'icon');
    return div;
  },

  createShadow() {
    return null;
  },
});

function getColorForWheelchairAccessiblity(placeData) {
  const isAccessible = get(placeData, 'properties.wheelchair') ||
    get(placeData, 'properties.accessibility.accessibleWith.wheelchair');
  switch (isAccessible) {
    case 'yes':
    case true: return 'green';
    case 'limited': return 'yellow';
    case 'no':
    case false: return 'red';
    default: return 'gray';
  }
}

export default function createMarkerFromFeature(
  feature,
  latlng,
) {
  const iconName = (feature && feature.properties && feature.properties.category) || 'place';
  const color = getColorForWheelchairAccessiblity(feature);
  const icon = new AccessibilityIcon({
    iconUrl: `/icons/categories/${iconName}.svg`,
    // iconUrl: `/icons/categories/${icons[iconName}.svg`,
    className: `ac-marker ac-marker-${color}`,
    iconSize: new L.Point(19, 19),
    iconAnchor: new L.Point(10, 11),
    popupAnchor: new L.Point(10, 11),
  });
  return L.marker(latlng, { icon });
}
