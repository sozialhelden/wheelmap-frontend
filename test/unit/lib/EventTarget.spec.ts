
import EventTarget from '../../../src/lib/EventTarget';
import { expect } from 'chai';
import 'mocha';

class TestEventTarget extends EventTarget<any> {
}

describe('lib > EventTarget', () => {

  // add handler type 1
  // remove handler type 1

  // dispatch event type 1

  // add handler type 1 + 2
  // dispatch event type 2 -> only triggers 2

  it('should dispatch an event to the specified handler', () => {
  });

});