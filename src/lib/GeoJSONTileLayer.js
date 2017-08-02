/*!

Code based on https://github.com/glenrobertson/leaflet-tilelayer-geojson, adapted for Mapbox
and Wheelmap.

Copyright (c) 2012, Glen Robertson
All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are
permitted provided that the following conditions are met:

   1. Redistributions of source code must retain the above copyright notice, this list of
      conditions and the following disclaimer.

   2. Redistributions in binary form must reproduce the above copyright notice, this list
      of conditions and the following disclaimer in the documentation and/or other materials
      provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)
HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR
TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

import L from 'leaflet';
import 'leaflet.markercluster/dist/leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
// import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import geoTileToBbox from './geoTileToBbox';

const TileLayer = L.TileLayer;

class GeoJSONTileLayer extends TileLayer {
  _idsToShownLayers = {};
  _loadedTileUrls = {};

  constructor(tileUrl, options) {
    super(tileUrl, options);
    this._layerGroup = options.layerGroup || L.layerGroup();
  }

  _removeShownFeatures(featureCollection) {
    const result = { type: 'FeatureCollection' };
    result.features = featureCollection.features.filter(
      feature => !this._idsToShownLayers[feature.properties._id || feature.properties.id],
    );
    console.log('Added', result.features.length, '/', featureCollection.features.length, 'features');
    return result;
  }

  _reset() {
    if (this._tiles) {
      Object.values(this._tiles).forEach(tile => tile.request.abort());
    }
    // TileLayer.prototype._reset.apply(this, arguments);
    Object.keys(this._idsToShownLayers).forEach(id => delete this._idsToShownLayers[id]);
    this._layerGroup.clearLayers();
    this._loadedTileUrls = {};
  }

  _addTile(tilePoint) {
    const tile = {};

    this._tiles[`${tilePoint.x}:${tilePoint.y}`] = tile;
    this._loadTile(tile, tilePoint);
  }

  _removeTile(key) {
    const tile = this._tiles[key];

    tile.request.abort();
    this.fire('tileunload', { tile });
    delete this._loadedTileUrls[tile.url];
    if (tile.layer != null) { this._layerGroup.removeLayer(tile.layer); }

    delete this._tiles[key];
  }

  getLayers() {
    const layers = [];

    this._layerGroup.eachLayer((layer) => {
      layers.push(...layer.getLayers());
    });

    return layers;
  }

  static pointToLayer(feature, latlng) {
    return new L.Marker(latlng);
  }

  getTileUrl(coords) {
    if (!this._url) return null;
    const data = {
      r: L.Browser.retina ? '@2x' : '',
      s: this._getSubdomain(coords),
      x: coords.x,
      y: coords.y,
      z: this._getZoomForUrl(),
    };
    data.bbox = geoTileToBbox(data);
    if (this._map && !this._map.options.crs.infinite) {
      const invertedY = this._globalTileRange.max.y - coords.y;
      if (this.options.tms) {
        data.y = invertedY;
      }
      data['-y'] = invertedY;
    }

    return L.Util.template(this._url, L.extend(data, this.options));
  }

  _loadTile(tile, tilePoint) {
    // this._adjustTilePoint(tilePoint);

    const url = this.getTileUrl(tilePoint);
    const layer = this;

    tile.coords = tilePoint; // eslint-disable-line no-param-reassign
    tile.url = url;


    this.fire('tileloadstart', {
      tile,
      url,
    });

    if (this._loadedTileUrls[url]) {
      // This is needed to not crash in superclasses, which assume that every tile has a request
      tile.el = {};
      tile.request = { abort() {} };
      return;
    }

    this._loadedTileUrls[url] = true;

    const removeShownFeatures = this._removeShownFeatures.bind(this);
    const idsToShownLayers = this._idsToShownLayers;
    const featureCollectionFromResponse = this.options.featureCollectionFromResponse || (r => r);
    tile.request = new XMLHttpRequest(); // eslint-disable-line no-param-reassign
    tile.request.open('GET', url, true);
    tile.request.setRequestHeader('Accept', 'application/json');
    const httpHeaders = layer.options.httpHeaders;
    Object.keys(httpHeaders || {}).forEach(key =>
      tile.request.setRequestHeader(key, httpHeaders[key]));
    tile.request.addEventListener('load', function load() {
      if (!this.responseText || this.status >= 400) {
        return;
      }
      const geoJSON = featureCollectionFromResponse(JSON.parse(this.responseText));
      const filteredGeoJSON = removeShownFeatures(geoJSON);
      layer.options.featureCache.cacheGeoJSON(filteredGeoJSON);
      const geoJSONOptions = { // eslint-disable-line new-cap
        pointToLayer(feature, latlng) {
          const id = feature.properties._id || feature.properties.id;
          if (idsToShownLayers[id]) return idsToShownLayers[id];
          const pointToLayerFn = layer.options.pointToLayer || layer.constructor.pointToLayer;
          return (idsToShownLayers[id] = pointToLayerFn(feature, latlng));
        },
      };
      // eslint-disable-next-line no-param-reassign
      tile.layer = new L.GeoJSON(filteredGeoJSON, Object.assign({}, layer.options, geoJSONOptions));
      layer._tileOnLoad(tile, url);
    });
    tile.request.addEventListener('error', () => layer._tileOnError(tile, url));
    tile.request.send();
    tile.el = {}; // eslint-disable-line no-param-reassign
  }

  _tileOnLoad(tile, url) {
    this._tilesToLoad -= 1;

    this._layerGroup.addLayer(tile.layer);

    this.fire('tileload', {
      tile,
      url,
    });
  }

  _tileOnError(tile, url) {
    this.fire('tileerror', {
      tile,
      url,
    });
  }
}

export default GeoJSONTileLayer;
