// @flow

import EventTarget, { CustomEvent } from './EventTarget';
import fetch from '../lib/fetch';

export default class FetchManager extends EventTarget {
  lastError = null;
  runningPromises: Map<Promise<Response>, boolean> = new Map();

  isLoading(): boolean {
    return this.runningPromises.size ? (this.runningPromises.size > 0) : false;
  }

  fetch(
    input: RequestInfo,
    init?: any,
  ): Promise<Response> {
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

    promise = fetch(input, init)
      .then(removeFromRunningPromises, removeFromRunningPromises)
      .catch(handleError);
    this.runningPromises.set(promise, true);
    this.dispatchEvent(new CustomEvent('start', { target: this }));
    return promise;
  }
}

export const globalFetchManager = new FetchManager();
