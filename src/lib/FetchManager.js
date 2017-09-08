// @flow


export default class FetchManager {
  lastError = null;
  runningPromises: Map<Promise<Response>, boolean> = new Map();
  listeners = {};

  addEventListener(type: string, callback: ((event: Event) => void)) {
    if (!(type in this.listeners)) {
      this.listeners[type] = [];
    }
    this.listeners[type].push(callback);
  }

  removeEventListener(type: string, callback: ((event: Event) => void)) {
    if (!(type in this.listeners)) {
      return;
    }
    const stack = this.listeners[type];
    for (let i = 0, l = stack.length; i < l; i += 1) {
      if (stack[i] === callback) {
        stack.splice(i, 1);
        return;
      }
    }
  }

  dispatchEvent(event: Event) {
    if (!(event.type in this.listeners)) {
      return true;
    }
    const stack = this.listeners[event.type];
    stack.forEach(handler => handler.call(this, event));
    return !event.defaultPrevented;
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
      this.dispatchEvent(new Event('stop', { target: this }));
      return response;
    };

    const handleError = (reason: any) => {
      console.log('Unhandled error while fetching:', reason);
      this.dispatchEvent(new Event('error', { target: this }));
      if (reason instanceof Error) {
        this.lastError = reason;
      }
    };

    promise = fetch(input, init)
      .then(removeFromRunningPromises, removeFromRunningPromises)
      .catch(handleError);
    this.runningPromises.set(promise, true);
    this.dispatchEvent(new Event('start', { target: this }));
    return promise;
  }
}

export const globalFetchManager = new FetchManager();
