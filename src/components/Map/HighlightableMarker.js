// @flow

import L from 'leaflet';

import { type Feature } from '../../lib/Feature';

export default class HighlightableMarker extends L.Marker {
  highlightedMarker: L.Marker | null = null;

  constructor(
    latlng: L.LatLng,
    markerIconType: (options: any) => any,
    markerIconOptions: any,
    featureId?: string,
    zIndexOffset?: number = 0
  ) {
    const markerIcon = new markerIconType(markerIconOptions);

    super(latlng, {
      icon: markerIcon,
      zIndexOffset: zIndexOffset,
    });

    this.markerIcon = markerIcon;
    this.markerIconType = markerIconType;
    this.markerIconOptions = markerIconOptions;
    this.featureId = featureId;
  }

  updateIcon(feature?: Feature) {
    if (feature) {
      this.markerIconOptions = { ...this.markerIconOptions, feature };
      this.markerIcon = new this.markerIconType(this.markerIconOptions);
    }

    this.setIcon(this.markerIcon);
  }

  hasHighlight() {
    return this.highlightedMarker;
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
      this.highlightedMarker = new L.Marker(this.getLatLng(), {
        zIndexOffset: 100,
        icon: new this.markerIconType({ ...this.markerIconOptions, highlighted: true }),
      });
      if (animated) {
        this.highlightedMarker.on('add', n => {
          n.target.getElement().classList.add('animated');
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
