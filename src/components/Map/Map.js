// @flow

import L from 'leaflet';
import throttle from 'lodash/throttle';
import React, { Component } from 'react';
import type { RouterHistory } from 'react-router-dom';
import 'leaflet.locatecontrol/src/L.Control.Locate';
import 'leaflet.locatecontrol/src/L.Control.Locate.scss';

import config from '../../lib/config';
import savedState, { saveState } from './savedState';
import Categories from '../../lib/Categories';
import type { Feature } from '../../lib/Feature';
import GeoJSONTileLayer from '../../lib/GeoJSONTileLayer';
import overrideLeafletZoomBehavior from './overrideLeafletZoomBehavior';
import { wheelmapFeatureCollectionFromResponse } from '../../lib/Feature';
import createMarkerFromFeatureFn, { ClusterIcon } from '../../lib/createMarkerFromFeatureFn';
import { accessibilityCloudFeatureCache } from '../../lib/cache/AccessibilityCloudFeatureCache';
import { wheelmapLightweightFeatureCache } from '../../lib/cache/WheelmapLightweightFeatureCache';
import { removeCurrentHighlightedMarker } from '../../lib/highlightMarker';

import { normalizeCoordinate, normalizeCoordinates } from './normalizeCoordinates';
import addLocateControlToMap from './addLocateControlToMap';
import isSamePosition from './isSamePosition';


type Props = {
  feature?: ?Feature,
  lat?: ?number,
  lon?: ?number,
  zoom?: ?number,
  onMoveEnd?: (({ lat: number, lon: number }) => void),
  onZoomEnd?: (({ zoom: number }) => void),
  category: ?string,
  history: RouterHistory,
}


type State = {
  lat?: number,
  lon?: number,
  zoom?: number,
};


overrideLeafletZoomBehavior();


export default class Map extends Component<void, Props, State> {
  props: Props;
  state: State = {};
  map: ?L.Map;
  mapElement: ?HTMLElement;
  featureLayer: ?L.LayerGroup;
  wheelmapTileLayer: ?GeoJSONTileLayer;
  accessibilityCloudTileLayer: ?GeoJSONTileLayer;
  updateFeatureLayerSourceUrlsDebounced: (() => void);
  updateFeatureLayerVisibilityDebounced: (() => void);

  constructor() {
    super();
    this.updateFeatureLayerSourceUrlsDebounced = throttle(this.updateFeatureLayerSourceUrls, 500);
    this.updateFeatureLayerVisibilityDebounced = throttle(this.updateFeatureLayerVisibility, 500);
  }

  componentDidMount() {
    const lastCenter = (savedState.lastCenter && savedState.lastCenter[0] && savedState.lastCenter);

    const map: L.Map = L.map(this.mapElement, {
      maxZoom: config.maxZoom,
      center: lastCenter || config.defaultStartCenter,
      zoom: savedState.lastZoom || (config.maxZoom - 1),
      minZoom: 2,
      zoomControl: false,
    });

    if (!map) {
      throw new Error('Could not initialize map component.');
    }

    this.map = map;
    window.map = map;

    this.navigate();

    new L.Control.Zoom({ position: 'topright' }).addTo(this.map);

    if (+new Date() - (savedState.lastMoveDate || 0) > config.locateTimeout) {
      map.locate({ setView: true, maxZoom: config.maxZoom, enableHighAccuracy: true });
    }

    map.on('moveend', () => {
      const { lat, lng } = map.getCenter();
      saveState('lastCenter.lat', lat);
      saveState('lastCenter.lon', lng);
      saveState('lastMoveDate', new Date().toString());
      const onMoveEnd = this.props.onMoveEnd;
      if (!(typeof onMoveEnd === 'function')) return;
      onMoveEnd({ lat: normalizeCoordinate(lat), lon: normalizeCoordinate(lng) });
    });

    map.on('zoomend', () => {
      const zoom = map.getZoom();
      localStorage.setItem('wheelmap.lastZoom', zoom);
      const onZoomEnd = this.props.onZoomEnd;
      if (!(typeof onZoomEnd === 'function')) return;
      onZoomEnd({ zoom });
    });

    L.control.scale().addTo(map);

    addLocateControlToMap(map);

    L.tileLayer(`https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/256/{z}/{x}/{y}@2x?access_token=${config.mapboxAccessToken}`, {
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
      maxZoom: 18,
      id: 'accessibility-cloud',
    }).addTo(map);

    const markerClusterGroup = new L.MarkerClusterGroup({
      maxClusterRadius(zoom) {
        const radius = 15 + (((1.3 ** (18 - zoom)) - 1) * 10);
        return Math.round(Math.max(15, Math.min(radius, 120)));
      },
      iconCreateFunction(cluster) {
        const propertiesArray = cluster
          .getAllChildMarkers()
          .map(marker => marker.feature.properties);
        return new ClusterIcon({ propertiesArray });
      },
      // animate: false,
      chunkedLoading: true,
    });

    this.featureLayer = new L.LayerGroup();
    this.featureLayer.addLayer(markerClusterGroup);

    const history = this.props.history;

    const wheelmapTileUrl = this.wheelmapTileUrl();

    this.wheelmapTileLayer = new GeoJSONTileLayer(wheelmapTileUrl, {
      featureCache: wheelmapLightweightFeatureCache,
      layerGroup: markerClusterGroup,
      featureCollectionFromResponse: wheelmapFeatureCollectionFromResponse,
      pointToLayer: createMarkerFromFeatureFn(history, wheelmapLightweightFeatureCache),
    });

    const accessibilityCloudTileUrl = this.accessibilityCloudTileUrl();
    this.accessibilityCloudTileLayer = new GeoJSONTileLayer(accessibilityCloudTileUrl, {
      featureCache: accessibilityCloudFeatureCache,
      layerGroup: markerClusterGroup,
      pointToLayer: createMarkerFromFeatureFn(history, accessibilityCloudFeatureCache),
    });

    if (!Categories.fetchPromise) {
      throw new Error('Category fetching must be started.');
    }
    Categories.fetchPromise.then(() => {
      this.updateFeatureLayerVisibilityDebounced();
      map.on('zoomend', () => { this.updateFeatureLayerVisibilityDebounced(); });
      map.on('zoomstart', () => { this.removeLayersNotVisibleInZoomLevel(); });
    });
  }


  removeLayersNotVisibleInZoomLevel() {
    const map: L.Map = this.map;
    const featureLayer = this.featureLayer;
    const wheelmapTileLayer = this.wheelmapTileLayer;
    const accessibilityCloudTileLayer = this.accessibilityCloudTileLayer;

    if (!map || !featureLayer || !wheelmapTileLayer || !accessibilityCloudTileLayer) return;

    const minimalZoomLevelForFeatures = this.props.category ?
      config.minimalZoom.withSetCategory :
      config.minimalZoom.withoutSetCategory;

    if (this.props.category) {
      if (featureLayer.hasLayer(this.accessibilityCloudTileLayer)) {
        console.log('Hide AC layer...');
        featureLayer.removeLayer(this.accessibilityCloudTileLayer);
      }
    }
    if (map.getZoom() < minimalZoomLevelForFeatures && map.hasLayer(featureLayer)) {
      console.log('Hide feature layer...');
      map.removeLayer(featureLayer);
    }
  }


  componentWillReceiveProps(newProps: Props) {
    this.navigate(newProps);
    // Without this, the map would be empty when navigating to a category
    if (this.props.category !== newProps.category) {
      if (this.map.getZoom() < config.minimalZoom.withSetCategory) {
        this.map.setZoom(config.minimalZoom.withSetCategory, { animate: true });
      }
    }
  }


  navigate(props: Props = this.props) {
    console.log('Navigating', props);
    if (!this.map) {
      console.log('Map not loaded yet.');
      return;
    }
    const map: L.Map = this.map;

    if (props.zoom && this.state.zoom !== props.zoom) {
      this.setState({ zoom: props.zoom });
      map.setZoom(props.zoom);
    }

    if (props.lat && props.lon) {
      const overriddenCoordinates = normalizeCoordinates([props.lat, props.lon]);
      if (!isSamePosition(overriddenCoordinates, [this.state.lat, this.state.lon])) {
        console.log('Panning to', overriddenCoordinates, 'because params override existing state coordinates');
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
          if (!map.getBounds().pad(-30).contains(featureCoordinates) || !state.lat) {
            console.log('Panning to', featureCoordinates, 'because PoI position is new');
            this.setState({ lat: featureCoordinates[0], lon: featureCoordinates[1] });
            map.panTo(featureCoordinates);
          }
        }
      }
    }

    if (!Categories.fetchPromise) {
      throw new Error('Category fetching must be started.');
    }
    console.log('Updating debounced...');
    Categories.fetchPromise.then(() => {
      this.updateFeatureLayerVisibilityDebounced(props);
    });
  }


  updateFeatureLayerVisibility(props: Props = this.props) {
    console.log('Update feature layer visibility...');
    const map: L.Map = this.map;
    const featureLayer = this.featureLayer;
    const wheelmapTileLayer = this.wheelmapTileLayer;
    const accessibilityCloudTileLayer = this.accessibilityCloudTileLayer;

    if (!map || !featureLayer || !wheelmapTileLayer || !accessibilityCloudTileLayer) return;

    let minimalZoomLevelForFeatures = config.minimalZoom.withSetCategory;

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
      minimalZoomLevelForFeatures = config.minimalZoom.withoutSetCategory;
      if (!featureLayer.hasLayer(this.accessibilityCloudTileLayer) && this.accessibilityCloudTileLayer) {
        console.log('Show AC layer...');
        featureLayer.addLayer(this.accessibilityCloudTileLayer);
        this.accessibilityCloudTileLayer._update(map.getCenter());
      }
    }

    if (!featureLayer.hasLayer(this.wheelmapTileLayer) && this.wheelmapTileLayer) {
      console.log('Show wheelmap layer...');
      featureLayer.addLayer(this.wheelmapTileLayer);
      this.wheelmapTileLayer._update(map.getCenter());
    }

    this.updateHighlightedMarker(props);
  }

  updateHighlightedMarker(props: Props) {
    if (props.feature && props.feature.properties) {
      const id = props.feature.properties._id || props.feature.properties.id;
      if (id) {
        if (this.wheelmapTileLayer) {
          this.wheelmapTileLayer.highlightMarkerWithId(String(id));
        }
        if (this.accessibilityCloudTileLayer) {
          this.accessibilityCloudTileLayer.highlightMarkerWithId(String(id));
        }
        return;
      }
    }
    removeCurrentHighlightedMarker();
  }

  updateFeatureLayerSourceUrls(props: Props = this.props) {
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
  }


  render() {
    return (<section ref={el => (this.mapElement = el)} />);
  }


  accessibilityCloudTileUrl() { // eslint-disable-line class-methods-use-this
    return `https://www.accessibility.cloud/place-infos?excludeSourceIds=LiBTS67TjmBcXdEmX&x={x}&y={y}&z={z}&appToken=${config.accessibilityCloudAppToken}`;
  }


  wheelmapTileUrl(props: Props = this.props): ?string {
    // For historical reasons:
    // 'Classic' Wheelmap way of fetching GeoJSON tiles:
    // const wheelmapTileUrl = '/nodes/{x}/{y}/{z}.geojson?limit=25';

    const categoryName = props.category;
    if (categoryName) {
      const category = Categories.wheelmapRootCategoryWithName(categoryName);
      if (!category) {
        return null;
      }
      return `/api/categories/${category.id}/nodes/?api_key=${config.wheelmapApiKey}&per_page=100&bbox={bbox}&limit=100`;
    }
    return `/api/nodes/?api_key=${config.wheelmapApiKey}&per_page=25&bbox={bbox}&per_page=100&limit=100`;
  }
}
