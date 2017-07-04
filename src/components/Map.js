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
import { getQueryParams, setQueryParams } from '../lib/queryParams';


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
  history: {
    push: ((path: String) => void),
  },
}

export default class Map extends Component {
  map: ?L.Map;
  mapElement: ?HTMLElement;
  onHashUpdateBound: (() => void);


  constructor(props: Props) {
    super(props);
    this.onHashUpdateBound = this.onHashUpdate.bind(this);
  }


  componentDidMount() {
    this.map = L.map(this.mapElement, {
      maxZoom: config.maxZoom,
      center: (lastCenter && lastCenter[0] && lastCenter) || config.defaultStartCenter,
      zoom: lastZoom || (config.maxZoom - 1),
      minZoom: 2,
      zoomControl: false,
    });

    if (!this.map) throw new Error('Could not initialize map component.');

    this.navigate(this.props.location);
    window.addEventListener('hashchange', this.onHashUpdateBound);
    window.addEventListener('popstate', this.onHashUpdateBound);

    new L.Control.Zoom({ position: 'topright' }).addTo(this.map);

    if (+new Date() - lastMoveDate > config.locateTimeout) {
      this.map.locate({ setView: true, maxZoom: config.maxZoom, enableHighAccuracy: true });
    }

    this.map.on('moveend', () => {
      const { lat, lng } = this.map.getCenter();
      localStorage.setItem('wheelmap.lastCenter.lat', lat);
      localStorage.setItem('wheelmap.lastCenter.lon', lng);
      localStorage.setItem('wheelmap.lastMoveDate', new Date());
      setQueryParams({ lat, lon: lng });
    });

    this.map.on('zoomend', () => {
      const zoom = this.map.getZoom();
      localStorage.setItem('wheelmap.lastZoom', zoom);
      setQueryParams({ zoom });
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


  componentWillReceiveNewProps(newProps: Props) {
    this.navigate(newProps.location);
  }


  componentWillUnmount() {
    window.removeEventListener('hashchange', this.onHashUpdateBound);
    window.removeEventListener('popstate', this.onHashUpdateBound);
  }


  onHashUpdate() {
    const map = this.map;
    if (!map) return;
    const params = getQueryParams();
    if (params.lat && params.lon) {
      const { lat, lon } = params;
      map.panTo([lat, lon]);
    }
    if (params.zoom) {
      map.setZoom(params.zoom);
    }
  }


  props: Props;


  navigate(location) {
    if (!this.map) return;
    console.log(location);
  }


  render() {
    this.navigate(this.props.location);
    return (<section ref={el => (this.mapElement = el)} />);
  }
}
