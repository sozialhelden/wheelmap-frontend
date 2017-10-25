// @flow

import L from 'leaflet';
import { t } from '../../lib/i18n';
import includes from 'lodash/includes';
import isEqual from 'lodash/isEqual';
import debounce from 'lodash/debounce';
import * as React from 'react';

import 'leaflet.locatecontrol/src/L.Control.Locate';
import sozialheldenLogoHTML from './SozialheldenLogo';

import {
  isWheelchairAccessible,
  yesNoLimitedUnknownArray,
  yesNoUnknownArray,
  hasAccessibleToilet,
  wheelmapFeatureCollectionFromResponse,
} from '../../lib/Feature';
import ClusterIcon from './ClusterIcon';
import Categories from '../../lib/Categories';
import isSamePosition from './isSamePosition';
import GeoJSONTileLayer from './GeoJSONTileLayer';
import isApplePlatform from '../../lib/isApplePlatform';
import addLocateControlToMap from './addLocateControlToMap';
import { removeCurrentHighlightedMarker } from './highlightMarker';
import overrideLeafletZoomBehavior from './overrideLeafletZoomBehavior';
import type { Feature, YesNoLimitedUnknown, YesNoUnknown } from '../../lib/Feature';
import { normalizeCoordinate, normalizeCoordinates } from '../../lib/normalizeCoordinates';
import { accessibilityCloudFeatureCache } from '../../lib/cache/AccessibilityCloudFeatureCache';
import { wheelmapLightweightFeatureCache } from '../../lib/cache/WheelmapLightweightFeatureCache';
import { globalFetchManager } from '../../lib/FetchManager';

type Props = {
  featureId?: ?string,
  feature?: ?Feature,
  lat?: ?number,
  lon?: ?number,
  zoom?: ?number,
  onMoveEnd?: (({ zoom: number, lat: number, lon: number, bbox: L.LatLngBounds }) => void),
  category: ?string,
  accessibilityFilter: YesNoLimitedUnknown[],
  toiletFilter: YesNoUnknown[],
  accessibilityCloudTileUrl: string,
  accessibilityCloudAppToken: string,
  wheelmapApiBaseUrl: string,
  wheelmapApiKey: string,
  mapboxTileUrl: string,
  maxZoom: number,
  minZoomWithSetCategory: number,
  minZoomWithoutSetCategory: number,
  defaultStartCenter: [number, number],
  pointToLayer: ((feature: Feature, latlng: [number, number]) => ?L.Marker),
  locateOnStart?: boolean,
  className: ?string,
}


type State = {
  lat?: number,
  lon?: number,
  zoom?: number,
  accessibilityFilter: YesNoLimitedUnknown[],
  toiletFilter: YesNoUnknown[],
};


overrideLeafletZoomBehavior();


export default class Map extends React.Component<Props, State> {
  props: Props;
  state: State = {
    accessibilityFilter: [].concat(yesNoLimitedUnknownArray),
    toiletFilter: [].concat(yesNoUnknownArray),
  };
  map: ?L.Map;
  mapElement: ?HTMLElement;
  featureLayer: ?L.LayerGroup;
  wheelmapTileLayer: ?GeoJSONTileLayer;
  accessibilityCloudTileLayer: ?GeoJSONTileLayer;

  onMoveEnd() {
    const map = this.map;
    if (!map) return;
    const { lat, lng } = map.getCenter();
    const zoom = Math.max(
      map.getZoom(),
      this.props.minZoomWithSetCategory,
      this.props.minZoomWithoutSetCategory,
    );
    const onMoveEnd = this.props.onMoveEnd;
    if (!(typeof onMoveEnd === 'function')) return;
    const bbox = map.getBounds();
    onMoveEnd({ lat: normalizeCoordinate(lat), lon: normalizeCoordinate(lng), zoom, bbox });

    this.updateTabIndexes();
  }

  updateTabIndexes() {
    this.map.eachLayer(layer => {
      if (layer.getElement) {

        const isInViewport = this.map.getBounds().contains(layer.getLatLng());

        const layerElement = layer.getElement();
        layerElement.setAttribute('tabindex', isInViewport ? 0 : -1)
      }
    })
  }

  componentDidMount() {
    const initialCenter = this.props.lat && this.props.lon ? [this.props.lat, this.props.lon] : this.props.defaultStartCenter;
    const map: L.Map = L.map(this.mapElement, {
      maxZoom: this.props.maxZoom,
      center: initialCenter,
      zoom: this.props.zoom || (this.props.maxZoom - 1),
      minZoom: 2,
      zoomControl: false,
    });

    // translator: Shown in the attributon bar at the bottom (followed by the ‘Sozialhelden’ logo)
    const aProjectBy = t`A project by`;

    // translator: Shown in the attributon bar at the bottom
    const mapboxOSMAttribution = t`map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>`;

    map.attributionControl.setPrefix(null);
    map.attributionControl.addAttribution(`<span class="hide-on-small-viewports">${aProjectBy}&nbsp;<a href="https://www.sozialhelden.de">${sozialheldenLogoHTML}</a></span>`);

    if (!map) {
      throw new Error('Could not initialize map component.');
    }

    this.map = map;
    window.map = this;

    new L.Control.Zoom({ position: 'topright' }).addTo(this.map);

    if (this.props.locateOnStart) {
      map.locate({ setView: true, maxZoom: this.props.maxZoom, enableHighAccuracy: true });
    }

    map.on('moveend', () => this.onMoveEnd());
    map.on('zoomend', () => this.onMoveEnd());

    const locale = window.navigator.language;
    const isImperial = locale === 'en' || locale === 'en-GB' || locale === 'en-US';

    L.control.scale({
      maxWidth: 70,
      metric: !isImperial,
      imperial: isImperial,
    }).addTo(map);

    addLocateControlToMap(map);

    L.tileLayer(this.props.mapboxTileUrl, {
      attribution: mapboxOSMAttribution,
      maxZoom: this.props.maxZoom,
      id: 'accessibility-cloud',
    }).addTo(map);

    const markerClusterGroup = new L.MarkerClusterGroup({
      maxClusterRadius(zoom) {
        const radius = 15 + (((1.5 ** (18 - zoom)) - 1) * 10);
        return Math.round(Math.max(15, Math.min(radius, 120)));
      },
      iconCreateFunction(cluster) {
        const propertiesArray = cluster
          .getAllChildMarkers()
          .map(marker => marker.feature.properties);
        return new ClusterIcon({ propertiesArray });
      },
      animate: true,
      chunkedLoading: true,
    });

    // markerClusterGroup.on('clusterclick', (cluster) => {
    //   const markers = cluster.layer.getAllChildMarkers();
    //   markers.forEach(marker => marker.)
    // });

    this.featureLayer = new L.LayerGroup();
    this.featureLayer.addLayer(markerClusterGroup);

    const wheelmapTileUrl = this.wheelmapTileUrl();

    if (wheelmapTileUrl) {
      this.wheelmapTileLayer = new GeoJSONTileLayer(wheelmapTileUrl, {
        featureCache: wheelmapLightweightFeatureCache,
        layerGroup: markerClusterGroup,
        featureCollectionFromResponse: wheelmapFeatureCollectionFromResponse,
        pointToLayer: this.props.pointToLayer,
        filter: this.isFeatureVisible.bind(this),
        maxZoom: this.props.maxZoom,
      });
    }

    const accessibilityCloudTileUrl = this.props.accessibilityCloudTileUrl;
    this.accessibilityCloudTileLayer = new GeoJSONTileLayer(accessibilityCloudTileUrl, {
      featureCache: accessibilityCloudFeatureCache,
      layerGroup: markerClusterGroup,
      pointToLayer: this.props.pointToLayer,
      filter: this.isFeatureVisible.bind(this),
      maxZoom: this.props.maxZoom,
    });

    Categories.fetchOnce(this.props).then(() => {
      this.updateFeatureLayerVisibility();
      map.on('moveend', () => { this.updateFeatureLayerVisibility(); });
      map.on('zoomend', () => { this.updateFeatureLayerVisibility(); });
      map.on('zoomstart', () => { this.removeLayersNotVisibleInZoomLevel(); });
    });


    globalFetchManager.addEventListener('stop', () => this.updateTabIndexes());
  }

  removeLayersNotVisibleInZoomLevel() {
    const map: L.Map = this.map;
    const featureLayer = this.featureLayer;
    const wheelmapTileLayer = this.wheelmapTileLayer;
    const accessibilityCloudTileLayer = this.accessibilityCloudTileLayer;

    if (!map || !featureLayer || !accessibilityCloudTileLayer) return;

    const minimalZoomLevelForFeatures = this.props.category ?
      this.props.minZoomWithSetCategory :
      this.props.minZoomWithoutSetCategory;

    if (this.props.category) {
      if (featureLayer.hasLayer(this.accessibilityCloudTileLayer)) {
        featureLayer.removeLayer(this.accessibilityCloudTileLayer);
      }
    }
    if (map.getZoom() < minimalZoomLevelForFeatures && map.hasLayer(featureLayer)) {
      map.removeLayer(featureLayer);
    }
  }


  componentWillReceiveProps(newProps: Props) {
    const map = this.map;
    if (!map) return;

    this.navigate(newProps);

    // Without this, the map would be empty when navigating to a category
    if (this.props.category !== newProps.category) {
      if (map.getZoom() < this.props.minZoomWithSetCategory) {
        map.setZoom(this.props.minZoomWithSetCategory, { animate: true });
      }
    }

    const accessibilityFilterChanged = !isEqual(this.props.accessibilityFilter.sort(), newProps.accessibilityFilter.sort());
    const toiletFilterChanged = !isEqual(this.props.toiletFilter.sort(), newProps.toiletFilter.sort());
    if (accessibilityFilterChanged || toiletFilterChanged) {
      setTimeout(() => {
        this.accessibilityCloudTileLayer._reset();
        if (this.wheelmapTileLayer) this.wheelmapTileLayer._reset();
        this.accessibilityCloudTileLayer._update(map.getCenter());
        if (this.wheelmapTileLayer) this.wheelmapTileLayer._update(map.getCenter());
      }, 100);
    }
  }


  navigate(props: Props = this.props) {
    if (!this.map) {
      return;
    }
    const map: L.Map = this.map;

    this.setState({ accessibilityFilter: props.accessibilityFilter });
    this.setState({ toiletFilter: props.toiletFilter });

    if (props.lat && props.lon) {
      const overriddenCoordinates = normalizeCoordinates([props.lat, props.lon]);
      if (!isSamePosition(overriddenCoordinates, [this.state.lat, this.state.lon])) {
        console.log('Panning to', overriddenCoordinates, 'because params override existing state coordinates', [this.state.lat, this.state.lon]);
        this.setState({ lat: overriddenCoordinates[0], lon: overriddenCoordinates[1] });
        map.panTo(overriddenCoordinates);
      }
    } else {
      const feature = props.feature;
      if (feature &&
        feature.geometry &&
        feature.geometry.type === 'Point' &&
        feature.geometry.coordinates instanceof Array) {
        const coords = feature.geometry.coordinates;
        const featureCoordinates = coords && normalizeCoordinates([coords[1], coords[0]]);
        const state = this.state;
        if (featureCoordinates && !isSamePosition(featureCoordinates, [state.lat, state.lon])) {
          if (!map.getBounds().pad(-5).contains(featureCoordinates) || !state.lat) {
            console.log('Panning to', featureCoordinates, 'because PoI position is new', [state.lat, state.lon]);
            this.setState({ lat: featureCoordinates[0], lon: featureCoordinates[1] });
            map.panTo(featureCoordinates);
          }
        }
      }
    }

    if (props.zoom && this.state.zoom !== props.zoom) {
      console.log('Zooming to', props.zoom, 'because params override existing zoom', this.state.zoom);

      this.setState({ zoom: props.zoom });
      map.setZoom(props.zoom);
    }

    Categories.fetchOnce(props).then(() => {
      this.updateFeatureLayerVisibility(props);
    });
  }


  updateFeatureLayerVisibility = debounce((props: Props = this.props) => {
    console.log('Update feature layer visibility...');
    const map: L.Map = this.map;
    const featureLayer = this.featureLayer;
    const wheelmapTileLayer = this.wheelmapTileLayer;
    const accessibilityCloudTileLayer = this.accessibilityCloudTileLayer;

    if (!map || !featureLayer || !accessibilityCloudTileLayer) return;

    let minimalZoomLevelForFeatures = this.props.minZoomWithSetCategory;

    if (map.getZoom() >= minimalZoomLevelForFeatures) {
      if (!map.hasLayer(featureLayer)) {
        console.log('Show feature layer...');
        map.addLayer(featureLayer);
      }
    } else if (map.hasLayer(featureLayer)) {
      console.log('Hide feature layer...');
      map.removeLayer(featureLayer);
    }

    this.updateFeatureLayerSourceUrls(props);

    if (!this.props.category) {
      minimalZoomLevelForFeatures = this.props.minZoomWithoutSetCategory;
      if (!featureLayer.hasLayer(accessibilityCloudTileLayer) && accessibilityCloudTileLayer) {
        console.log('Show AC layer...');
        featureLayer.addLayer(this.accessibilityCloudTileLayer);
        accessibilityCloudTileLayer._update(map.getCenter());
      }
    }

    if (!featureLayer.hasLayer(wheelmapTileLayer) && wheelmapTileLayer) {
      console.log('Show wheelmap layer...');
      featureLayer.addLayer(wheelmapTileLayer);
      wheelmapTileLayer._update(map.getCenter());
    }

    this.updateHighlightedMarker(props);
  }, 100);


  updateHighlightedMarker(props: Props) {
    if (props.featureId) {
      if (this.wheelmapTileLayer) {
        this.wheelmapTileLayer.highlightMarkerWithId(String(props.featureId));
      }
      if (this.accessibilityCloudTileLayer) {
        this.accessibilityCloudTileLayer.highlightMarkerWithId(String(props.featureId));
      }
    } else {
      removeCurrentHighlightedMarker();
    }
  }


  isFeatureVisible(feature: Feature) {
    if (!feature) return false;
    if (!feature.properties) return false;
    const properties = feature.properties;
    const { accessibilityFilter, toiletFilter } = this.state;
    const hasMatchingA11y = includes(accessibilityFilter, isWheelchairAccessible(properties));
    const hasMatchingToilet = includes(toiletFilter, hasAccessibleToilet(properties));
    return hasMatchingA11y && hasMatchingToilet;
  }

  updateFeatureLayerSourceUrls = debounce((props: Props = this.props) => {
    const wheelmapTileLayer = this.wheelmapTileLayer;
    if (!wheelmapTileLayer) return;
    const url = this.wheelmapTileUrl(props);
    const featureLayer = this.featureLayer;
    if (featureLayer && wheelmapTileLayer._url !== url) {
      console.log('Setting new URL on wheelmap layer / removing + re-adding layer:', url);
      wheelmapTileLayer._reset();
      featureLayer.removeLayer(wheelmapTileLayer);
      featureLayer.addLayer(wheelmapTileLayer);
      wheelmapTileLayer.setUrl(url);
    }
  }, 500);

  focus() {
    this.mapElement.focus();
  }

  render() {
    const className = [
      isApplePlatform() ? 'is-apple-platform' : null,
      this.props.className,
    ].filter(Boolean).join(' ');

    return (
      <section
        className={className}
        ref={el => (this.mapElement = el)}
        aria-hidden="true"
      />
    );
  }


  wheelmapTileUrl(props: Props = this.props): ?string {
    // For historical reasons:
    // 'Classic' Wheelmap way of fetching GeoJSON tiles:
    // const wheelmapTileUrl = '/nodes/{x}/{y}/{z}.geojson?limit=25';
    const baseUrl = this.props.wheelmapApiBaseUrl;
    if (typeof baseUrl !== 'string') return null;
    const wheelmapApiKey = this.props.wheelmapApiKey;
    const categoryName = props.category;
    if (categoryName) {
      const category = Categories.wheelmapRootCategoryWithName(categoryName);
      if (!category) {
        return null;
      }
      return `${baseUrl}/api/categories/${category.id}/nodes/?api_key=${wheelmapApiKey}&per_page=100&bbox={bbox}&limit=100`;
    }
    return `${baseUrl}/api/nodes/?api_key=${wheelmapApiKey}&per_page=25&bbox={bbox}&per_page=100&limit=100`;
  }
}
