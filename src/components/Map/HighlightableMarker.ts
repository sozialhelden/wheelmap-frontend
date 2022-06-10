import { EquipmentInfo, PlaceInfo } from '@sozialhelden/a11yjson';
import L from 'leaflet';

export default class HighlightableMarker extends L.Marker {
  highlightedMarker: L.Marker | null = null;
  markerIcon: any;
  markerIconType: any;
  markerIconOptions: any;
  featureId: any;

  constructor(
    latlng: L.LatLng,
    MarkerIconType: typeof L.Icon,
    markerIconOptions: L.IconOptions,
    featureId?: string,
    zIndexOffset: number = 0
  ) {
    super(latlng, {
      icon: new MarkerIconType(markerIconOptions),
      zIndexOffset: zIndexOffset,
    });

    this.markerIcon = this.getIcon();
    this.markerIconType = MarkerIconType;
    this.markerIconOptions = markerIconOptions;
    this.featureId = featureId;
  }

  updateIcon(feature?: PlaceInfo | EquipmentInfo) {
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
