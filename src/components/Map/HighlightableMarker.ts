import L from 'leaflet';

export default class HighlightableMarker extends L.Marker {
  highlightedMarker: L.Marker | null = null;
  markerIcon: any
  markerIconType: any
  markerIconOptions: any
  featureId: any

  constructor(
    latlng: L.LatLng,
    markerIconType: any,
    markerIconOptions: any,
    featureId?: string,
    zIndexOffset: number = 0
  ) {
    super(latlng, {
      icon: new markerIconType(markerIconOptions),
      zIndexOffset: zIndexOffset,
    });

    this.markerIcon = this.getIcon();
    this.markerIconType = markerIconType;
    this.markerIconOptions = markerIconOptions;
    this.featureId = featureId;
  }

  updateIcon() {
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
