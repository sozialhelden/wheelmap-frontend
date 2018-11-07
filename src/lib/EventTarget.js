// @flow

// Base / mix-in class for adding DOM-API-like event handling to your classes.
// https://developer.mozilla.org/en-US/docs/Web/API/EventTarget

export class CustomEvent {
  constructor(type: string, init: {}) {
    Object.assign(this, { type }, init);
  }
}

export default class EventTarget<EventClass> {
  listeners = {};

  addEventListener(type: string, callback: (event: EventClass) => void) {
    if (!(type in this.listeners)) {
      this.listeners[type] = [];
    }
    this.listeners[type].push(callback);
  }

  removeEventListener(type: string, callback: (event: EventClass) => void) {
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

  // Example usage:
  //     this.dispatchEvent(new MyEventClass('start', { target: this }));

  dispatchEvent(event: EventClass) {
    // debugger
    if (!(event.type in this.listeners)) {
      return true;
    }
    const stack = this.listeners[event.type];
    stack.forEach(handler => handler.call(this, event));
    return !event.defaultPrevented;
  }
}
