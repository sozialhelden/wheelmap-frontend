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
// import createMarkerFromFeature from './create-marker-from-feature';

const TileLayer = L.TileLayer;

class GeoJSONTileLayer extends TileLayer {
  constructor(tileUrl, options) {
    super(tileUrl, options);

    // this._layerGroup = L.layerGroup();
    this._layerGroup = new L.MarkerClusterGroup();
    this._idsToShownMarkers = {};
  }

  _removeShownFeatures(featureCollection) {
    const result = { type: 'FeatureCollection' };
    result.features = featureCollection.features.filter(
      feature => !this._idsToShownMarkers[feature.properties._id || feature.properties.id],
    );
    return result;
  }

  _reset() {
    Object.values(this._tiles).forEach(tile => tile.request.abort());
    // TileLayer.prototype._reset.apply(this, arguments);
    this._layerGroup.clearLayers();
  }

  onAdd(map) {
    TileLayer.prototype.onAdd.call(this, map);
    map.addLayer(this._layerGroup);
  }

  onRemove(map) {
    TileLayer.prototype.onRemove.call(this, map);
    map.removeLayer(this._layerGroup);
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

  _loadTile(tile, tilePoint) {
    // this._adjustTilePoint(tilePoint);

    const url = this.getTileUrl(tilePoint);
    const layer = this;

    tile.coords = tilePoint; // eslint-disable-line no-param-reassign

    this.fire('tileloadstart', {
      tile,
      url,
    });

    const removeShownFeatures = this._removeShownFeatures.bind(this);
    const idsToShownMarkers = this._idsToShownMarkers;
    tile.request = new XMLHttpRequest(); // eslint-disable-line no-param-reassign
    tile.request.open('GET', url, true);
    tile.request.addEventListener('load', function load() {
      if (!this.responseText) {
        return;
      }
      const geoJSON = JSON.parse(this.responseText);
      const filteredGeoJSON = removeShownFeatures(geoJSON);
      const geoJSONOptions = { // eslint-disable-line new-cap
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
