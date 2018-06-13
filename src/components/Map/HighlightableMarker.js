// @flow

import L from 'leaflet';
import MarkerIcon from './MarkerIcon';
import type { Feature } from '../../lib/Feature';


type Options = typeof L.Marker.Options & {
  feature: Feature,
  onClick: ((featureId: string, properties: ?NodeProperties) => void),
  hrefForFeature: ((featureId: string) => string),
};


export default class HighlightableMarker extends L.Marker {
  highlightedMarker: L.Marker | null = null;

  constructor(latlng: L.LatLng, options: Options) {
    const defaults: Options = {
      icon: new MarkerIcon({
        hrefForFeature: options.hrefForFeature,
        onClick: options.onClick,
        feature: options.feature,
      }),
    };
    super(latlng, Object.assign(defaults, options));
  }


  unhighlight(highLightLayer: L.Layer) {
    if (this.highlightedMarker && highLightLayer) {
      highLightLayer.removeLayer(this.highlightedMarker);
      this.highlightedMarker = null;
    }
    this.setOpacity(1.0);
  }

  highlight(highLightLayer: L.Layer, animated: boolean): boolean {
    if (!this.highlightedMarker && highLightLayer) {
      const options = this.options;
      this.highlightedMarker = new L.Marker(this.getLatLng(), {
        zIndexOffset: 100,
        icon: new MarkerIcon({
          hrefForFeature: options.hrefForFeature,
          onClick: options.onClick,
          feature: options.feature,
          withArrow: true,
          shadowed: true,
          size: 'big',
          ariaHidden: true,
          iconAnchorOffset: L.point(0, 20),
          className: 'marker-icon highlighted-marker',
        })});
      if (animated) {
        this.highlightedMarker.on('add', (n) => { 
          n.target.getElement().classList.add("animated");
        });
      }
      highLightLayer.addLayer(this.highlightedMarker);
      this.setOpacity(0.0);
      return true;
    }

    this.setOpacity(0.0);
    return false;
  }
}
