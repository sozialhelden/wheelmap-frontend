// Base / mix-in class for adding DOM-API-like event handling to your classes.
// https://developer.mozilla.org/en-US/docs/Web/API/EventTarget

export class CustomEvent {
  public readonly type: string;
  public readonly defaultPrevented: boolean = false;

  constructor(type: string, init: any) {
    Object.assign(this, { type }, init);
  }
}

export interface EventClassProps {
  type: string
  defaultPrevented: boolean
}

export type EventHandler<A> = (event: A) => void

export default class EventTarget<EventClass extends EventClassProps> {
  listeners: {[type: string]: EventHandler<EventClass>[]} = {};

  addEventListener(type: string, callback: EventHandler<EventClass>) {
    if (!(type in this.listeners)) {
      this.listeners[type] = [];
    }
    this.listeners[type].push(callback);
  }

  removeEventListener(type: string, callback: EventHandler<EventClass>) {
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

  dispatchEvent(event: EventClass): boolean {
    if (!(event.type in this.listeners)) {
      return true;
    }
    const stack = this.listeners[event.type];
    stack.forEach(handler => handler.call(this, event));
    return !event.defaultPrevented;
  }

}
