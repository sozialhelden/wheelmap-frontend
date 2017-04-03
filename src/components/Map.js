import React, { Component } from 'react';
import L from 'leaflet';
import 'leaflet.locatecontrol/src/L.Control.Locate';
import 'leaflet.locatecontrol/src/L.Control.Locate.scss';
import GeoJSONTileLayer from '../lib/geojson-tile-layer';
import createMarkerFromFeature from '../lib/create-marker-from-feature';

const config = {
  locateTimeout: 60 * 60 * 1000,
  defaultStartCenter: [51.505, -0.09],
  accessToken: 'pk.eyJ1Ijoic296aWFsaGVsZGVuIiwiYSI6IkdUY09sSmsifQ.6vkpci46vdS7m5Jeb_YTbA',
  maxZoom: 18,
};

const lastCenter = ['lat', 'lng']
  .map(coordinate => localStorage.getItem(`wheelmap.lastCenter.${coordinate}`));
const lastMoveDateString = localStorage.getItem('wheelmap.lastMoveDate');
const lastMoveDate = lastMoveDateString && new Date(lastMoveDateString);
const lastZoom = localStorage.getItem('wheelmap.lastZoom');

export default class Map extends Component {
  componentDidMount() {
    this.map = L.map(this.mapElement, {
      maxZoom: config.maxZoom,
      center: (lastCenter && lastCenter[0] && lastCenter) || config.defaultStartCenter,
      zoom: lastZoom || (config.maxZoom - 1),
      minZoom: 2,
    });

    if (+new Date() - lastMoveDate > config.locateTimeout) {
      this.map.locate({ setView: true, maxZoom: config.maxZoom, enableHighAccuracy: true });
    }

    this.map.on('moveend', () => {
      const { lat, lng } = this.map.getCenter();
      localStorage.setItem('wheelmap.lastCenter.lat', lat);
      localStorage.setItem('wheelmap.lastCenter.lng', lng);
      localStorage.setItem('wheelmap.lastMoveDate', new Date());
    });
    this.map.on('zoomend', () => {
      localStorage.setItem('wheelmap.lastZoom', this.map.getZoom());
    });

    L.control.scale().addTo(this.map);
    L.control.locate().addTo(this.map);

    L.tileLayer(`https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/256/{z}/{x}/{y}@2x?access_token=${config.accessToken}`, {
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
      maxZoom: 18,
      id: 'accesssibility-cloud',
    }).addTo(this.map);

    const markerClusterGroup = new L.MarkerClusterGroup({
      maxClusterRadius: 15,
    });

    const wheelmapBackendUrl = 'http://localhost:5000/nodes/{x}/{y}/{z}.geojson?limit=25';
    const wheelmapTileLayer = new GeoJSONTileLayer(wheelmapBackendUrl, {
      layerGroup: markerClusterGroup,
      pointToLayer: createMarkerFromFeature,
    });

    const accessibilityCloudUrl = 'https://www.accessibility.cloud/place-infos?excludeSourceIds=LiBTS67TjmBcXdEmX&x={x}&y={y}&z={z}&appToken=27be4b5216aced82122d7cf8f69e4a07';
    const accessibilityCloudTileLayer = new GeoJSONTileLayer(accessibilityCloudUrl, {
      layerGroup: markerClusterGroup,
      pointToLayer(feature, latlng) {
        return new L.Marker(latlng);
      },
    });

    const featureLayer = new L.LayerGroup();
    featureLayer.addLayer(wheelmapTileLayer);
    featureLayer.addLayer(accessibilityCloudTileLayer);
    featureLayer.addLayer(markerClusterGroup);
    this.map.addLayer(featureLayer);

    this.map.on('zoomend', () => {
      if (this.map.getZoom() > 16) {
        this.map.addLayer(featureLayer);
      } else {
        this.map.removeLayer(featureLayer);
      }
    });
  }

  render() {
    return (<section ref={el => (this.mapElement = el)} />);
  }
}
