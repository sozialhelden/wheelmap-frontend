// @flow

import L from 'leaflet';
import type MarkerIcon from './MarkerIcon';

export default class HighlightableMarker extends L.Marker {
  highlightedMarker: L.Marker | null = null;

  constructor(latlng: L.LatLng, createMarkerIcon: () => MarkerIcon) {
    super(latlng, {
      icon: createMarkerIcon(),
    });

    this.createMarkerIcon = createMarkerIcon;
  }

  updateIcon() {
    this.setIcon(this.createMarkerIcon());
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
        icon: this.createMarkerIcon({
          iconAnchorOffset: L.point(0, 20),
          className: 'marker-icon highlighted-marker',
          highlighted: true,
        }),
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
