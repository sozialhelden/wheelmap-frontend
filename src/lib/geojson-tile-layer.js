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

import L from 'mapbox.js';
import 'leaflet.markercluster/dist/leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import createMarkerFromFeature from './create-marker-from-feature';

const TileLayer = L.TileLayer;

const GeoJSONTileLayer = TileLayer.extend({
  initialize: function(tileUrl, options) {
    TileLayer.prototype.initialize.call(this, tileUrl, options);

    // this._layerGroup = L.layerGroup();
    this._layerGroup = new L.MarkerClusterGroup();
    this._idsToShownMarkers = {};
  },

  _removeShownFeatures(featureCollection) {
    const result = { type: 'FeatureCollection' };
    result.features = featureCollection.features.filter(
      feature => !this._idsToShownMarkers[feature.properties._id || feature.properties.id]
    );
    return result;
  },

  _reset: function () {
    for (var key in this._tiles) {
      this._tiles[key].request.abort();
    }

    TileLayer.prototype._reset.apply(this, arguments);

    this._layerGroup.clearLayers();
  },

  onAdd: function (map) {
    TileLayer.prototype.onAdd.call(this, map);
    map.addLayer(this._layerGroup);
  },

  onRemove: function (map) {
    TileLayer.prototype.onRemove.call(this, map);
    map.removeLayer(this._layerGroup);
  },

  _addTile: function(tilePoint) {
    var tile = {};

    this._tiles[tilePoint.x + ':' + tilePoint.y] = tile;
    this._loadTile(tile, tilePoint);
  },

  _removeTile: function(key) {
    var tile = this._tiles[key];

    tile.request.abort();
    this.fire('tileunload', { tile: tile });

    if (tile.layer != null)
      this._layerGroup.removeLayer(tile.layer);

    delete this._tiles[key];
  },

  getLayers: function() {
    var layers = [];

    this._layerGroup.eachLayer(function(layer) {
      layers.push.apply(layers, layer.getLayers());
    });

    return layers;
  },

  _loadTile: function(tile, tilePoint) {
    // this._adjustTilePoint(tilePoint);

    var url = this.getTileUrl(tilePoint),
      layer = this;

    tile.point = tile.coords = tilePoint;

    this.fire('tileloadstart', {
      tile: tile,
      url: url
    });

    const removeShownFeatures = this._removeShownFeatures.bind(this);
    const idsToShownMarkers = this._idsToShownMarkers;
    tile.request = new XMLHttpRequest();
    tile.request.open('GET', url, true);
    tile.request.addEventListener('load', function() {
      if (!this.responseText) {
        return;
      }
      const geoJSON = JSON.parse(this.responseText);
      const filteredGeoJSON = removeShownFeatures(geoJSON);
      tile.layer = new L.GeoJSON(filteredGeoJSON, Object.assign({}, layer.options, { // eslint-disable-line new-cap
        pointToLayer(feature, latlng) {
          const id = feature.properties._id || feature.properties.id;

          if (idsToShownMarkers[id]) {
            return idsToShownMarkers[id];
          }

          // const marker = createMarkerFromFeature(feature, latlng);
          const marker = L.marker(latlng);

          marker.on('click', () => {
            // FlowRouter.go('placeInfos.show', {
            //   _id: FlowRouter.getParam('_id'),
            //   placeInfoId: feature.properties._id,
            // }, {
            //   limit: FlowRouter.getQueryParam('limit'),
            // });
          });

          idsToShownMarkers[id] = marker;

          return marker;
        },
      }));
      layer._tileOnLoad(tile, url);
    });
    tile.request.addEventListener('error', function(event) {
      console.log('Error while fetching tile:', event);
      layer._tileOnError(tile, url);
    });
    tile.request.send();
    tile.el = {};
  },

  _tileOnLoad: function (tile, url) {
    this._tilesToLoad--;

    this._layerGroup.addLayer(tile.layer);

    this.fire('tileload', {
      tile: tile,
      url: url
    });
  },

  _tileOnError: function (tile, url) {
    this.fire('tileerror', {
      tile: tile,
      url: url
    });
  }
});

export default GeoJSONTileLayer;
