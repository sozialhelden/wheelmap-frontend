// @flow

import React, { Component } from 'react';
import L from 'leaflet';
import 'leaflet.locatecontrol/src/L.Control.Locate';
import 'leaflet.locatecontrol/src/L.Control.Locate.scss';
import GeoJSONTileLayer from '../lib/GeoJSONTileLayer';
import createMarkerFromFeatureFn from '../lib/createMarkerFromFeatureFn';
import Categories from '../lib/Categories';
import { wheelmapLightweightFeatureCache } from '../lib/cache/WheelmapLightweightFeatureCache';
import { accessibilityCloudFeatureCache } from '../lib/cache/AccessibilityCloudFeatureCache';
import { Feature } from '../lib/Feature';


const config = {
  locateTimeout: 60 * 60 * 1000,
  defaultStartCenter: [51.505, -0.09],
  accessToken: 'pk.eyJ1Ijoic296aWFsaGVsZGVuIiwiYSI6IkdUY09sSmsifQ.6vkpci46vdS7m5Jeb_YTbA',
  maxZoom: 18,
};


const lastCenter = ['lat', 'lon']
  .map(coordinate => localStorage.getItem(`wheelmap.lastCenter.${coordinate}`));
const lastMoveDateString = localStorage.getItem('wheelmap.lastMoveDate');
const lastMoveDate = lastMoveDateString && new Date(lastMoveDateString);
const lastZoom = localStorage.getItem('wheelmap.lastZoom');


type Props = {
  featureId: ?string,
  feature: ?Feature,
  lat?: ?number,
  lon?: ?number,
  zoom?: ?number,
  history: {
    push: ((path: String) => void),
  },
}

type State = {
  lat?: number,
  lon?: number,
  zoom?: number,
};


function normalizeCoordinate(number) {
  const asFloat = parseFloat(number);
  return Math.floor(asFloat * 10000) / 10000;
}

function normalizeCoordinates([lat, lon]: [number, number]) {
  return [lat, lon].map(normalizeCoordinate);
}

export default class Map extends Component<void, Props, State> {
  state: State = {};

  componentDidMount() {
    this.map = L.map(this.mapElement, {
      maxZoom: config.maxZoom,
      center: (lastCenter && lastCenter[0] && lastCenter) || config.defaultStartCenter,
      zoom: lastZoom || (config.maxZoom - 1),
      minZoom: 2,
      zoomControl: false,
    });

    if (!this.map) throw new Error('Could not initialize map component.');

    this.navigate(this.props);

    new L.Control.Zoom({ position: 'topright' }).addTo(this.map);

    if (+new Date() - lastMoveDate > config.locateTimeout) {
      this.map.locate({ setView: true, maxZoom: config.maxZoom, enableHighAccuracy: true });
    }

    this.map.on('moveend', () => {
      const { lat, lng } = this.map.getCenter();
      localStorage.setItem('wheelmap.lastCenter.lat', lat);
      localStorage.setItem('wheelmap.lastCenter.lon', lng);
      localStorage.setItem('wheelmap.lastMoveDate', new Date());
      if (this.props.onMoveEnd) {
        this.props.onMoveEnd({ lat: normalizeCoordinate(lat), lon: normalizeCoordinate(lng) });
      }
    });

    this.map.on('zoomend', () => {
      const zoom = this.map.getZoom();
      localStorage.setItem('wheelmap.lastZoom', zoom);
      if (this.props.onZoomEnd) {
        this.props.onZoomEnd({ zoom });
      }
    });

    L.control.scale().addTo(this.map);
    L.control.locate({
      position: 'topright',
      icon: 'leaflet-icon-locate',
      iconLoading: 'leaflet-icon-locate-loading',
      showPopup: false,
      circleStyle: {
        color: '#1fabd9',
        fillColor: '#1fabd9',
        fillOpacity: 0.1,
        opacity: 0.25,
      },
      markerStyle: {
        color: '#1fabd9',
        fillColor: '#1fabd9',
      },
      strings: {
        title: 'Show me where I am',
      },
      locateOptions: {
        enableHighAccuracy: true,
      },
    }).addTo(this.map);

    L.tileLayer(`https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/256/{z}/{x}/{y}@2x?access_token=${config.accessToken}`, {
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
      maxZoom: 18,
      id: 'accessibility-cloud',
    }).addTo(this.map);

    const markerClusterGroup = new L.MarkerClusterGroup({
      maxClusterRadius: 15,
    });

    const featureLayer = new L.LayerGroup();
    featureLayer.addLayer(markerClusterGroup);
    this.map.addLayer(featureLayer);

    Categories.fetchPromise.then(() => {
      const wheelmapTileUrl = '/nodes/{x}/{y}/{z}.geojson?limit=25';
      const wheelmapTileLayer = new GeoJSONTileLayer(wheelmapTileUrl, {
        featureCache: wheelmapLightweightFeatureCache,
        layerGroup: markerClusterGroup,
        pointToLayer: createMarkerFromFeatureFn(this.props.history, wheelmapLightweightFeatureCache),
      });

      const accessibilityCloudTileUrl = 'https://www.accessibility.cloud/place-infos?excludeSourceIds=LiBTS67TjmBcXdEmX&x={x}&y={y}&z={z}&appToken=27be4b5216aced82122d7cf8f69e4a07';
      const accessibilityCloudTileLayer = new GeoJSONTileLayer(accessibilityCloudTileUrl, {
        featureCache: accessibilityCloudFeatureCache,
        layerGroup: markerClusterGroup,
        pointToLayer: createMarkerFromFeatureFn(this.props.history, accessibilityCloudFeatureCache),
      });
      featureLayer.addLayer(wheelmapTileLayer);
      featureLayer.addLayer(accessibilityCloudTileLayer);
    });

    this.map.on('zoomend', () => {
      if (this.map.getZoom() > 16) {
        this.map.addLayer(featureLayer);
      } else {
        this.map.removeLayer(featureLayer);
      }
    });
  }


  componentWillReceiveProps(newProps: Props = this.props) {
    this.navigate(newProps);
  }

  map: ?L.Map;
  mapElement: ?HTMLElement;
  props: Props;

  coordinatesAreDifferent(coordinates: [number, number]) {
    const lat = this.state.lat || 0;
    const lon = this.state.lon || 0;
    return coordinates &&
      Math.abs(coordinates[0] - lat) > 0.001 &&
      Math.abs(coordinates[1] - lon) > 0.001;
  }


  navigate(props: Props) {
    const map = this.map;
    if (!map) return;

    if (props.zoom && this.state.zoom !== props.zoom) {
      this.setState({ zoom: props.zoom });
      map.setZoom(props.zoom);
    }

    const overriddenCoordinates: ?[number, number] = (props.lat && props.lon) ? normalizeCoordinates([props.lat, props.lon]) : null;
    if (overriddenCoordinates) {
      if (this.coordinatesAreDifferent(overriddenCoordinates)) {
        console.log('Panning to', overriddenCoordinates, 'because params override them');
        this.setState({ lat: overriddenCoordinates[0], lon: overriddenCoordinates[1] });
        map.panTo(overriddenCoordinates);
      }
      return;
    }

    const feature = props.feature;
    if (feature &&
      feature.geometry &&
      feature.geometry.type === 'Point' &&
      feature.geometry.coordinates instanceof Array) {
      const coordinates = feature.geometry.coordinates;
      const featureCoordinates = coordinates && normalizeCoordinates([coordinates[1], coordinates[0]]);
      if (featureCoordinates && this.coordinatesAreDifferent(featureCoordinates)) {
        console.log('Panning to', featureCoordinates, 'because PoI position');
        this.setState({ lat: featureCoordinates[0], lon: featureCoordinates[1] });
        map.panTo(featureCoordinates);
      }
    }
  }


  render() {
    return (<section ref={el => (this.mapElement = el)} />);
  }
}
