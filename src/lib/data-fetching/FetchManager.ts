import EventTarget, { CustomEvent } from './EventTarget';
import customFetch from '../lib/fetch';

export class FetchManager extends EventTarget<CustomEvent> {
  lastError: Error | null = null;
  runningPromises: Map<Promise<Response>, boolean> = new Map();
  externalStatus: {[key: string]: boolean} = {};

  isLoading(): boolean {
    let count = this.runningPromises.size ? this.runningPromises.size : 0;
    for (let e in this.externalStatus) {
      if (this.externalStatus[e] === true) {
        count++;
      }
    }

    return count > 0;
  }

  injectExternalStatus(key: string, busy: boolean) {
    this.externalStatus[key] = busy;
  }

  fetch(input: string, init?: any): Promise<Response> {
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
