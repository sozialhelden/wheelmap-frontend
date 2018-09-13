// @flow

import EventTarget, { CustomEvent } from './EventTarget';
import customFetch from '../lib/fetch';

// import L from 'leaflet';
// type LayerEvent = Event & { layer: L.Layer, id: ?string, target: L.Layer };

export default class FetchManager extends EventTarget {
  lastError: ?Error = null;
  runningPromises: Map<Promise<Response>, boolean> = new Map();
  layerStatus = {};

  isLoading(): boolean {
    let count = this.runningPromises.size ? this.runningPromises.size : 0;
    for (let e in this.layerStatus) {
      if (this.layerStatus[e] === true) {
        count++;
      }
    }
    return count > 0;
  }

  // registerMap(map: L.Map) {
  //   // Add listeners for begin and end of load to any layers already on the map
  //   map.eachLayer(function(layer) {
  //     if (!layer.on) return;
  //     layer.on(
  //       {
  //         loading: this._handleLoading,
  //         load: this._handleLoad,
  //       },
  //       this
  //     );
  //   }, this);
  //
  //   // When a layer is added to the map, add listeners for begin and end of load
  //   map.on('layeradd', this.onLayerAdded, this);
  //   map.on('layerremove', this.onLayerRemoved, this);
  // }
  //
  // unregisterMap(map: L.Map) {
  //   // Remove listeners for begin and end of load from all layers
  //   map.eachLayer(function(layer) {
  //     if (!layer.off) return;
  //     layer.off(
  //       {
  //         loading: this.onLayerLoadingStarted,
  //         load: this.onLayerLoaded,
  //       },
  //       this
  //     );
  //   }, this);
  //
  //   // Remove layeradd/layerremove listener from map
  //   map.off('layeradd', this.onLayerAdded, this);
  //   map.off('layerremove', this.onLayerRemoved, this);
  //
  //   this.layerStatus = {};
  // }
  //
  // onLayerAdded(e: LayerEvent) {
  //   if (!e.layer || !e.layer.on) return;
  //
  //   e.layer.on(
  //     {
  //       loading: this.onLayerLoadingStarted,
  //       load: this.onLayerLoaded,
  //     },
  //     this
  //   );
  // }
  //
  // onLayerRemoved(e: LayerEvent) {
  //   if (!e.layer || !e.layer.off) return;
  //
  //   e.layer.off(
  //     {
  //       loading: this.onLayerLoadingStarted,
  //       load: this.onLayerLoaded,
  //     },
  //     this
  //   );
  // }
  //
  // onLayerLoadingStarted(e: LayerEvent) {
  //   const id = this.getEventTargetId(e);
  //   this.layerStatus[id] = true;
  //   this.dispatchEvent(new CustomEvent('start', { target: this }));
  // }
  //
  // onLayerLoaded(e: LayerEvent) {
  //   const id = this.getEventTargetId(e);
  //   this.layerStatus[id] = false;
  //   this.dispatchEvent(new CustomEvent('stop', { target: this }));
  // }
  //
  // getEventTargetId(e: LayerEvent): string {
  //   if (e.id) {
  //     return e.id;
  //   } else if (e.layer) {
  //     return e.layer._leaflet_id;
  //   }
  //   return e.target._leaflet_id;
  // }

  fetch(input: RequestInfo, init?: any): Promise<Response> {
    let promise = null;

    const removeFromRunningPromises = (response: Response) => {
      if (promise) {
        this.runningPromises.delete(promise);
      }
      this.dispatchEvent(new CustomEvent('stop', { target: this }));
      return response;
    };

    const handleError = (reason: any) => {
      console.log('Unhandled error while fetching:', reason);
      this.dispatchEvent(new CustomEvent('error', { target: this }));
      if (reason instanceof Error) {
        this.lastError = reason;
      }
    };

    promise = customFetch(input, init)
      .then(removeFromRunningPromises, removeFromRunningPromises)
      .catch(handleError);
    this.runningPromises.set(promise, true);
    this.dispatchEvent(new CustomEvent('start', { target: this }));
    return promise;
  }
}

export const globalFetchManager = new FetchManager();
