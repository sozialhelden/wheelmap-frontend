// @flow

import L from 'leaflet';
import type { NodeProperties } from '../../lib/Feature';

type Options = typeof L.Icon.options & {
  onClick: (featureId: string, properties: ?NodeProperties) => void,
  hrefForFeature: (featureId: string) => ?string,
  highlighted?: boolean,
};

export default class MarkerIcon extends L.Icon {
  constructor(options: Options) {
    // increased tap region for icons, rendered size might differ
    const size = 40;
    const iconAnchorOffset = options.iconAnchorOffset || L.point(0, 0);
    const defaults = {
      number: '',
      shadowUrl: null,
      iconSize: new L.Point(size, size),
      iconAnchor: new L.Point(
        size * 0.5 + iconAnchorOffset.x,
        size * 0.5 + 1.5 + iconAnchorOffset.y
      ),
      popupAnchor: new L.Point(size * 0.5, size * 0.5),
      tooltipAnchor: new L.Point(size * 0.5, size * 0.5 + 25),
      onClick: (featureId: string, properties: ?NodeProperties) => {},
      hrefForFeature: (featureId: string) => null,
      className: 'marker-icon',
      size: 'small',
      withArrow: false,
    };

    super(Object.assign(defaults, options));
  }

  createIcon() {
    throw new Error(
      'createIcon should be implemented in a subclass of MarkerIcon. You probably used MarkerIcon directly.'
    );
  }

  createShadow() {
    return null;
  }
}
