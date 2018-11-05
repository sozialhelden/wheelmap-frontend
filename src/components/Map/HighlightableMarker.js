// @flow

import L from 'leaflet';
import MarkerIcon from './MarkerIcon';
import { type Feature, type NodeProperties } from '../../lib/Feature';
import { type CategoryLookupTables } from '../../lib/Categories';
import { type EquipmentInfoProperties } from '../../lib/EquipmentInfo';

type Options = typeof L.Marker.Options & {
  feature: Feature,
  onClick: (featureId: string, properties: ?NodeProperties) => void,
  hrefForFeature: (
    featureId: string,
    properties: ?NodeProperties | EquipmentInfoProperties
  ) => string,
  categories: CategoryLookupTables,
};

export default class HighlightableMarker extends L.Marker {
  highlightedMarker: L.Marker | null = null;

  constructor(latlng: L.LatLng, options: Options) {
    super(latlng, {
      icon: new MarkerIcon({
        hrefForFeature: options.hrefForFeature,
        onClick: options.onClick,
        feature: options.feature,
        categories: options.categories,
      }),
      ...options,
    });
  }

  updateIcon(feature: Feature) {
    this.options.feature = feature;

    this.setIcon(
      new MarkerIcon({
        hrefForFeature: this.options.hrefForFeature,
        onClick: this.options.onClick,
        feature: feature,
        categories: this.options.categories,
      })
    );
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
          categories: this.options.categories,
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
