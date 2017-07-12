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
import type { Feature } from '../lib/Feature';
import type { RouterHistory } from 'react-router-dom';


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
  // featureId?: ?string,
  feature?: ?Feature,
  lat?: ?number,
  lon?: ?number,
  zoom?: ?number,
  onMoveEnd?: (({ lat: number, lon: number }) => void),
  onZoomEnd?: (({ zoom: number }) => void),
  history: RouterHistory,
}


type State = {
  lat?: number,
  lon?: number,
  zoom?: number,
};


function normalizeCoordinate(number) {
  const asFloat = parseFloat(number);
  return Math.round(asFloat * 10000) / 10000;
}

function normalizeCoordinates([lat, lon]: [number, number]): [number, number] {
  return [normalizeCoordinate(lat), normalizeCoordinate(lon)];
}

export default class Map extends Component<void, Props, State> {
  props: Props;
  state: State = {};
  map: ?L.Map;
  mapElement: ?HTMLElement;

  componentDidMount() {
    const map = L.map(this.mapElement, {
      maxZoom: config.maxZoom,
      center: (lastCenter && lastCenter[0] && lastCenter) || config.defaultStartCenter,
      zoom: lastZoom || (config.maxZoom - 1),
      minZoom: 2,
      zoomControl: false,
    });

    if (!map) {
      throw new Error('Could not initialize map component.');
    }

    this.map = map;

    this.navigate();

    new L.Control.Zoom({ position: 'topright' }).addTo(this.map);

    if (+new Date() - (lastMoveDate || 0) > config.locateTimeout) {
      map.locate({ setView: true, maxZoom: config.maxZoom, enableHighAccuracy: true });
    }

    map.on('moveend', () => {
      const { lat, lng } = map.getCenter();
      localStorage.setItem('wheelmap.lastCenter.lat', lat);
      localStorage.setItem('wheelmap.lastCenter.lon', lng);
      localStorage.setItem('wheelmap.lastMoveDate', new Date().toString());
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
    }).addTo(map);

    L.tileLayer(`https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/256/{z}/{x}/{y}@2x?access_token=${config.accessToken}`, {
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
      maxZoom: 18,
      id: 'accessibility-cloud',
    }).addTo(map);

    const markerClusterGroup = new L.MarkerClusterGroup({
      maxClusterRadius: 15,
    });

    const featureLayer = new L.LayerGroup();
    featureLayer.addLayer(markerClusterGroup);
    map.addLayer(featureLayer);

    Categories.fetchPromise.then(() => {
      const history = this.props.history;
      const wheelmapTileUrl = '/nodes/{x}/{y}/{z}.geojson?limit=25';
      const wheelmapTileLayer = new GeoJSONTileLayer(wheelmapTileUrl, {
        featureCache: wheelmapLightweightFeatureCache,
        layerGroup: markerClusterGroup,
        pointToLayer: createMarkerFromFeatureFn(history, wheelmapLightweightFeatureCache),
      });

      const accessibilityCloudTileUrl = 'https://www.accessibility.cloud/place-infos?excludeSourceIds=LiBTS67TjmBcXdEmX&x={x}&y={y}&z={z}&appToken=27be4b5216aced82122d7cf8f69e4a07';
      const accessibilityCloudTileLayer = new GeoJSONTileLayer(accessibilityCloudTileUrl, {
        featureCache: accessibilityCloudFeatureCache,
        layerGroup: markerClusterGroup,
        pointToLayer: createMarkerFromFeatureFn(history, accessibilityCloudFeatureCache),
      });
      featureLayer.addLayer(wheelmapTileLayer);
      featureLayer.addLayer(accessibilityCloudTileLayer);
    });

    map.on('zoomend', () => {
      if (map.getZoom() > 16) {
        map.addLayer(featureLayer);
      } else {
        map.removeLayer(featureLayer);
      }
    });
  }


  componentWillReceiveProps(newProps: Props) {
    this.navigate(newProps);
  }


  coordinatesDifferFromCurrentCoordinates(coordinates: [number, number]) {
    const lat = this.state.lat || 0;
    const lon = this.state.lon || 0;
    return coordinates &&
      Math.abs(coordinates[0] - lat) > 0.001 &&
      Math.abs(coordinates[1] - lon) > 0.001;
  }


  navigate(props: Props = this.props) {
    const map = this.map;
    if (!map) return;

    if (props.zoom && this.state.zoom !== props.zoom) {
      this.setState({ zoom: props.zoom });
      map.setZoom(props.zoom);
    }

    if (props.lat && props.lon) {
      const overriddenCoordinates = normalizeCoordinates([props.lat, props.lon]);
      if (this.coordinatesDifferFromCurrentCoordinates(overriddenCoordinates)) {
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
      const coords = feature.geometry.coordinates;
      const featureCoordinates = coords && normalizeCoordinates([coords[1], coords[0]]);
      if (featureCoordinates && this.coordinatesDifferFromCurrentCoordinates(featureCoordinates)) {
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
