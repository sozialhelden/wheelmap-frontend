// @flow

import L from 'leaflet';
import includes from 'lodash/includes';
import isEqual from 'lodash/isEqual';
import debounce from 'lodash/debounce';
import React, { Component } from 'react';
import type { RouterHistory } from 'react-router-dom';

import 'leaflet.locatecontrol/src/L.Control.Locate';
import 'leaflet.locatecontrol/src/L.Control.Locate.scss';
import sozialheldenLogoUrl from './Sozialhelden.svg';
import immobilienScout24LogoUrl from './ImmobilienScout24.svg';

import {
  isWheelchairAccessible,
  yesNoLimitedUnknownArray,
  yesNoUnknownArray,
  hasAccessibleToilet,
  wheelmapFeatureCollectionFromResponse,
} from '../../lib/Feature';
import config from '../../lib/config';
import ClusterIcon from './ClusterIcon';
import Categories from '../../lib/Categories';
import isSamePosition from './isSamePosition';
import GeoJSONTileLayer from './GeoJSONTileLayer';
import savedState, { saveState } from './savedState';
import addLocateControlToMap from './addLocateControlToMap';
import { removeCurrentHighlightedMarker } from './highlightMarker';
import createMarkerFromFeatureFn from './createMarkerFromFeatureFn';
import overrideLeafletZoomBehavior from './overrideLeafletZoomBehavior';
import type { Feature, YesNoLimitedUnknown, YesNoUnknown } from '../../lib/Feature';
import { normalizeCoordinate, normalizeCoordinates } from '../../lib/normalizeCoordinates';
import { accessibilityCloudFeatureCache } from '../../lib/cache/AccessibilityCloudFeatureCache';
import { wheelmapLightweightFeatureCache } from '../../lib/cache/WheelmapLightweightFeatureCache';


type Props = {
  featureId?: ?string,
  feature?: ?Feature,
  lat?: ?number,
  lon?: ?number,
  zoom?: ?number,
  onMoveEnd?: (({ zoom: number, lat: number, lon: number }) => void),
  category: ?string,
  history: RouterHistory,
  accessibilityFilter: YesNoLimitedUnknown[],
  toiletFilter: YesNoUnknown[],
}


type State = {
  lat?: number,
  lon?: number,
  zoom?: number,
  accessibilityFilter: YesNoLimitedUnknown[],
  toiletFilter: YesNoUnknown[],
};


overrideLeafletZoomBehavior();


export default class Map extends Component<Props, State> {
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
    if (!this.map) return;
    const { lat, lng } = this.map.getCenter();
    const zoom = Math.max(
      this.map.getZoom(),
      config.minimalZoom.withSetCategory,
      config.minimalZoom.withoutSetCategory,
    );
    saveState('lastZoom', zoom);
    saveState('lastCenter.lat', lat);
    saveState('lastCenter.lon', lng);
    saveState('lastMoveDate', new Date().toString());
    const onMoveEnd = this.props.onMoveEnd;
    if (!(typeof onMoveEnd === 'function')) return;
    onMoveEnd({ lat: normalizeCoordinate(lat), lon: normalizeCoordinate(lng), zoom });
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

    map.attributionControl.setPrefix(null);
    map.attributionControl.addAttribution(`<span class="hide-on-small-viewports">A project by&nbsp;<a href="https://www.sozialhelden.de"><img src="${sozialheldenLogoUrl}" alt="Sozialhelden"></a></span>`);
    map.attributionControl.addAttribution(`<span class="hide-on-small-viewports">main sponsor: <a href="https://www.immobilienscout24.de"><img src="${immobilienScout24LogoUrl}" alt="">&nbsp;ImmobilienScout24</a></span>`);

    if (!map) {
      throw new Error('Could not initialize map component.');
    }

    this.map = map;
    window.map = this;

    new L.Control.Zoom({ position: 'topright' }).addTo(this.map);

    if (+new Date() - (savedState.lastMoveDate || 0) > config.locateTimeout) {
      map.locate({ setView: true, maxZoom: config.maxZoom, enableHighAccuracy: true });
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

    L.tileLayer(`https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/256/{z}/{x}/{y}@2x?access_token=${config.mapboxAccessToken}`, {
      attribution: 'map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
      maxZoom: config.maxZoom,
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

    const history = this.props.history;

    const wheelmapTileUrl = this.wheelmapTileUrl();

    this.wheelmapTileLayer = new GeoJSONTileLayer(wheelmapTileUrl, {
      featureCache: wheelmapLightweightFeatureCache,
      layerGroup: markerClusterGroup,
      featureCollectionFromResponse: wheelmapFeatureCollectionFromResponse,
      pointToLayer: createMarkerFromFeatureFn(history),
      filter: this.isFeatureVisible.bind(this),
      maxZoom: config.maxZoom,
    });

    const accessibilityCloudTileUrl = this.accessibilityCloudTileUrl();
    this.accessibilityCloudTileLayer = new GeoJSONTileLayer(accessibilityCloudTileUrl, {
      featureCache: accessibilityCloudFeatureCache,
      layerGroup: markerClusterGroup,
      pointToLayer: createMarkerFromFeatureFn(history),
      filter: this.isFeatureVisible.bind(this),
      maxZoom: config.maxZoom,
    });

    if (!Categories.fetchPromise) {
      throw new Error('Category fetching must be started.');
    }
    Categories.fetchPromise.then(() => {
      this.updateFeatureLayerVisibility();
      map.on('moveend', () => { this.updateFeatureLayerVisibility(); });
      map.on('zoomend', () => { this.updateFeatureLayerVisibility(); });
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
      if (map.getZoom() < config.minimalZoom.withSetCategory) {
        map.setZoom(config.minimalZoom.withSetCategory, { animate: true });
      }
    }

    const accessibilityFilterChanged = !isEqual(this.props.accessibilityFilter.sort(), newProps.accessibilityFilter.sort());
    const toiletFilterChanged = !isEqual(this.props.toiletFilter.sort(), newProps.toiletFilter.sort());
    if (accessibilityFilterChanged || toiletFilterChanged) {
      setTimeout(() => {
        this.accessibilityCloudTileLayer._reset();
        this.wheelmapTileLayer._reset();
        this.accessibilityCloudTileLayer._update(map.getCenter());
        this.wheelmapTileLayer._update(map.getCenter());
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

    if (!Categories.fetchPromise) {
      throw new Error('Category fetching must be started.');
    }
    Categories.fetchPromise.then(() => {
      this.updateFeatureLayerVisibility(props);
    });
  }


  updateFeatureLayerVisibility = debounce((props: Props = this.props) => {
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
