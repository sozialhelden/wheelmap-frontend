import L from 'leaflet';
import * as React from 'react';
import ReactDOM from 'react-dom';
import { color as d3Color } from 'd3-color';
import { interpolateWheelchairAccessibility } from '../../lib/colors';
import isSamePlace from './isSamePlace';
import getIconNameForProperties from './getIconNameForProperties';
import * as markers from '../icons/markers';
import Icon, { StyledIconContainer } from '../Icon';

export default class ClusterIcon extends L.Icon {
  constructor(options: L.IconOptions) {
    // increased tap region for icons, rendered size might differ
    const size = 40;
    const iconAnchorOffset = options.iconAnchorOffset || L.point(0, 0);

    const defaults = {
      number: '',
      shadowUrl: null,
      className: 'leaflet-div-icon accessiblity marker-icon ac-marker-cluster',
      iconSize: new L.Point(size, size),
      iconAnchor: new L.Point(size * 0.5 + iconAnchorOffset.x, size * 0.5 + iconAnchorOffset.y),
      popupAnchor: new L.Point(size * 0.5, size * 0.5),
      tooltipAnchor: new L.Point(size * 0.5, size * 0.5 + 25),
    };

    super(Object.assign(defaults, options));
  }

  createIcon() {
    const elem = document.createElement('a');

    const propertiesArray = this.options.propertiesArray;
    const categories = this.options.categories;
    const withArrow = this.options.withArrow;
    let hasIcon = false;

    const { foregroundColor, backgroundColor, accessibility } = interpolateWheelchairAccessibility(
      propertiesArray
    );
    const actualBackgroundColor = this.options.backgroundColor || d3Color(backgroundColor);
    const actualForegroundColor = this.options.foregroundColor || d3Color(foregroundColor);
    const MarkerComponent = markers[`${accessibility}${withArrow ? 'With' : 'Without'}Arrow`];

    const commonOptions = {
      backgroundColor: actualBackgroundColor,
      foregroundColor: actualForegroundColor,
      withArrow,
      size: this.options.size || 'small',
      shadowed: true,
      centered: true,
      ariaHidden: this.options.ariaHidden,
    };

    if (isSamePlace(propertiesArray)) {
      const iconNames = propertiesArray
        .map(p => getIconNameForProperties(categories, p))
        .filter(Boolean);

      if (iconNames[0]) {
        ReactDOM.render(
          <Icon {...commonOptions} category={iconNames[0]}>
            <MarkerComponent className="background" fill={actualBackgroundColor.toString()} />
          </Icon>,
          elem
        );
        hasIcon = true;
      }
    }

    if (!hasIcon) {
      ReactDOM.render(
        <StyledIconContainer {...commonOptions}>
          <MarkerComponent className="background" fill={actualBackgroundColor.toString()} />
          <div className="foreground">{propertiesArray.length}</div>
        </StyledIconContainer>,
        elem
      );
    }

    const count = propertiesArray.length;
    this._setIconStyles(elem, 'icon');

    if (count >= 500) {
      elem.classList.add('over-fivehundred');
    } else if (count >= 100) {
      elem.classList.add('over-hundred');
    } else if (count >= 50) {
      elem.classList.add('over-fifty');
    }
    return elem;
  }

  createShadow() {
    // eslint-disable-line class-methods-use-this
    return null;
  }
}
