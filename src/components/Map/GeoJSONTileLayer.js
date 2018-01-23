// @flow

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

import L from "leaflet";
import "leaflet.markercluster/dist/leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
// import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import geoTileToBbox from "./geoTileToBbox";
import highlightMarker from "./highlightMarker";
import { Feature } from "../../lib/Feature";
import { CustomEvent } from "../../lib/EventTarget";

const TileLayer = L.TileLayer;

class GeoJSONTileLayer extends TileLayer {
  _idsToShownLayers = {};
  _loadedTileUrls = {};

  constructor(tileUrl: string, options: {}) {
    super(tileUrl, options);
    this._layerGroup = options.layerGroup || L.layerGroup();
    options.featureCache.addEventListener(
      "change",
      this._onCachedFeatureChanged
    );
    options.featureCache.addEventListener("add", this._onCachedFeatureAdded);
  }

  _onCachedFeatureChanged = (event: CustomEvent & { feature: Feature }) => {
    const feature = event.feature;
    this._updateFeature(feature);
  };

  _onCachedFeatureAdded = (event: CustomEvent & { feature: Feature }) => {
    const feature = event.feature;
    this._updateFeature(feature, { allowAdding: true });
  };

  _updateFeature(
    feature: Feature,
    { allowAdding }: { allowAdding: boolean } = {}
  ) {
    const featureId: string =
      feature.id || feature.properties.id || feature.properties._id;

    const existingMarker = this._idsToShownLayers[featureId];
    if (existingMarker) {
      // recreate existing marker on the same layer
      const layerGroup = existingMarker.layerGroup;
      if (layerGroup) {
        existingMarker.remove();
        delete this._idsToShownLayers[featureId];

        const marker = this._markerFromFeature(layerGroup, feature);
        this._map.addLayer(marker);
        this._idsToShownLayers[featureId] = marker;
      }
    } else if (allowAdding) {
      // create a new layer for this marker
      const newLayerGroup = L.layerGroup(this.options);
      const newMarker = this._markerFromFeature(newLayerGroup, feature);
      this._map.addLayer(newMarker);
      this._idsToShownLayers[featureId] = newMarker;
    }
  }

  _markerFromFeature(layerGroup: L.LayerGroup, feature: Feature) {
    const marker = this.pointToLayer(feature);
    layerGroup.addLayer(marker);
    marker.layerGroup = layerGroup;
    return marker;
  }

  _filterFeatureCollection(featureCollection, filterFn) {
    const result = {
      type: "FeatureCollection",
      features: featureCollection.features.filter(filterFn)
    };
    return result;
  }

  _removeFilteredFeatures(featureCollection) {
    return this._filterFeatureCollection(
      featureCollection,
      this.options.filter || (i => true)
    );
  }

  _removeShownFeatures(featureCollection) {
    console.log(
      "Filtering from",
      Object.keys(this._idsToShownLayers).length,
      "cached layers"
    );
    const result = this._filterFeatureCollection(
      featureCollection,
      feature =>
        !this._idsToShownLayers[feature.properties._id || feature.properties.id]
    );
    return result;
  }

  _reset() {
    console.log("Resetting tile layer, emptying _idsToShownLayers");
    if (this._tiles) {
      Object.keys(this._tiles)
        .map(k => this._tiles[k])
        .forEach(tile => tile.request.abort());
    }
    // TileLayer.prototype._reset.apply(this, arguments);
    Object.keys(this._idsToShownLayers).forEach(
      id => delete this._idsToShownLayers[id]
    );
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
    this.fire("tileunload", { tile });
    delete this._loadedTileUrls[tile.url];
    if (tile.layer != null) {
      this._layerGroup.removeLayer(tile.layer);
    }

    delete this._tiles[key];
  }

  getLayers() {
    return this._layerGroup.getLayers();
  }

  static pointToLayer(feature, latlng) {
    return new L.Marker(latlng);
  }

  getTileUrl(coords) {
    if (!this._url) return null;
    const data = {
      r: L.Browser.retina ? "@2x" : "",
      s: this._getSubdomain(coords),
      x: coords.x,
      y: coords.y,
      z: this._getZoomForUrl()
    };
    data.bbox = geoTileToBbox(data);
    if (this._map && !this._map.options.crs.infinite) {
      const invertedY = this._globalTileRange.max.y - coords.y;
      if (this.options.tms) {
        data.y = invertedY;
      }
      data["-y"] = invertedY;
    }

    return L.Util.template(this._url, L.extend(data, this.options));
  }

  pointToLayer(feature) {
    const geometry = feature.geometry;
    const latlng = [geometry.coordinates[1], geometry.coordinates[0]];
    const id = feature.properties._id || feature.properties.id;
    const existingMarker = this._idsToShownLayers[id];
    if (existingMarker) {
      if (String(id) === this.highlightedMarkerId) {
        highlightMarker(existingMarker);
      }
      return existingMarker;
    }
    const pointToLayerFn =
      this.options.pointToLayer || this.constructor.pointToLayer;
    const marker = pointToLayerFn(feature, latlng);
    marker.feature = feature;

    this._idsToShownLayers[id] = marker;
    if (String(id) === this.highlightedMarkerId) {
      const highlightFn = () => {
        highlightMarker(marker);
        marker.off("add", highlightFn);
      };
      marker.on("add", highlightFn);
    }
    return marker;
  }

  _loadTile(tile, tilePoint) {
    // this._adjustTilePoint(tilePoint);

    const url = this.getTileUrl(tilePoint);
    const tileLayer = this;

    tile.coords = tilePoint; // eslint-disable-line no-param-reassign
    tile.url = url;

    this.fire("tileloadstart", {
      tile,
      url
    });

    if (this._loadedTileUrls[url]) {
      // This is needed to not crash in superclasses, which assume that every tile has a request
      tile.el = {};
      tile.request = { abort() {} };
      return;
    }

    this._loadedTileUrls[url] = true;

    const featureCollectionFromResponse =
      this.options.featureCollectionFromResponse || (r => r);

    tile.request = new XMLHttpRequest(); // eslint-disable-line no-param-reassign
    tile.request.open("GET", url, true);
    tile.request.setRequestHeader("Accept", "application/json");

    tile.request.addEventListener("load", function load() {
      if (!this.responseText || this.status >= 400) {
        return;
      }
      let geoJSON;
      let response = null;
      try {
        response = JSON.parse(this.responseText);
        geoJSON = featureCollectionFromResponse(response);
      } catch (e) {
        console.log("Could not parse FeatureCollection JSON.");
        return;
      }
      const filteredGeoJSON = tileLayer._removeFilteredFeatures(geoJSON);

      tileLayer.options.featureCache.cacheGeoJSON(filteredGeoJSON, response);
      const layerGroup = L.layerGroup(tileLayer.options);
      const markers = filteredGeoJSON.features.map(
        tileLayer._markerFromFeature.bind(tileLayer, layerGroup)
      );
      // eslint-disable-next-line no-param-reassign
      tile.layer = layerGroup;
      tileLayer._tileOnLoad(tile, url);
    });
    tile.request.addEventListener("error", () =>
      tileLayer._tileOnError(tile, url)
    );
    tile.request.send();

    tile.el = {}; // eslint-disable-line no-param-reassign
  }

  _tileOnLoad(tile, url) {
    this._tilesToLoad -= 1;

    this._layerGroup.addLayer(tile.layer);

    this.fire("tileload", {
      tile,
      url
    });
  }

  _tileOnError(tile, url) {
    this.fire("tileerror", {
      tile,
      url
    });
  }

  highlightMarkerWithId(id: string) {
    const marker = this._idsToShownLayers[id];
    this.highlightedMarkerId = id;
    if (!marker) return;
    highlightMarker(marker);
  }
}

export default GeoJSONTileLayer;
