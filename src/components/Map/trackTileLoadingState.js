// @flow

import { globalFetchManager, type FetchManager } from '../../lib/FetchManager';

import L from 'leaflet';

type LayerEvent = Event & { layer: L.Layer, id: ?string, target: L.Layer };

export default class TileLoadingStatus {
  _fetchManager: FetchManager;

  constructor(fetchManager: FetchManager) {
    this._fetchManager = fetchManager;
  }

  registerMap(map: L.Map) {
    // Add listeners for begin and end of load to any layers already on the map
    map.eachLayer(function(layer) {
      if (!layer.on) return;
      layer.on(
        {
          loading: this._handleLoading,
          load: this._handleLoad,
        },
        this
      );
    }, this);

    // When a layer is added to the map, add listeners for begin and end of load
    map.on('layeradd', this.onLayerAdded, this);
    map.on('layerremove', this.onLayerRemoved, this);
  }

  unregisterMap(map: L.Map) {
    // Remove listeners for begin and end of load from all layers
    map.eachLayer(function(layer) {
      if (!layer.off) return;
      const id = layer._leaflet_id;
      this._fetchManager.injectExternalStatus(id, false);
      layer.off(
        {
          loading: this.onLayerLoadingStarted,
          load: this.onLayerLoaded,
        },
        this
      );
    }, this);

    // Remove layeradd/layerremove listener from map
    map.off('layeradd', this.onLayerAdded, this);
    map.off('layerremove', this.onLayerRemoved, this);
  }

  onLayerAdded(e: LayerEvent) {
    if (!e.layer || !e.layer.on) return;

    e.layer.on(
      {
        loading: this.onLayerLoadingStarted,
        load: this.onLayerLoaded,
      },
      this
    );
  }

  onLayerRemoved(e: LayerEvent) {
    if (!e.layer || !e.layer.off) return;

    e.layer.off(
      {
        loading: this.onLayerLoadingStarted,
        load: this.onLayerLoaded,
      },
      this
    );
  }

  onLayerLoadingStarted(e: LayerEvent) {
    const id = this.getEventTargetId(e);

    this._fetchManager.injectExternalStatus(id, true);
    this._fetchManager.dispatchEvent(new CustomEvent('start', { target: this }));
  }

  onLayerLoaded(e: LayerEvent) {
    const id = this.getEventTargetId(e);

    this._fetchManager.injectExternalStatus(id, false);
    this._fetchManager.dispatchEvent(new CustomEvent('stop', { target: this }));
  }

  getEventTargetId(e: LayerEvent): string {
    if (e.id) {
      return e.id;
    } else if (e.layer) {
      return e.layer._leaflet_id;
    }
    return e.target._leaflet_id;
  }
}

export const tileLoadingStatus = new TileLoadingStatus(globalFetchManager);
