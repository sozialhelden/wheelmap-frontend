import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { onFirstUserInput, USER_INPUT_EVENTS } from './onFirstUserInput';

// Node marks every dispatched event as untrusted, so the tests decide trust
// through a flag instead of `event.isTrusted`.
const trusted = (type: string) => Object.assign(new Event(type), { fakeTrusted: true });
const isTrusted = (event: Event) => (event as Event & { fakeTrusted?: boolean }).fakeTrusted === true;

describe('onFirstUserInput', () => {
  it('runs the callback on the first trusted input, and only once', () => {
    const target = new EventTarget();
    let calls = 0;
    onFirstUserInput(target, () => calls++, { isTrusted });

    target.dispatchEvent(trusted('pointermove'));
    target.dispatchEvent(trusted('keydown'));
    target.dispatchEvent(trusted('pointerdown'));

    assert.equal(calls, 1);
  });

  it('reacts to every kind of user input', () => {
    for (const type of USER_INPUT_EVENTS) {
      const target = new EventTarget();
      let calls = 0;
      onFirstUserInput(target, () => calls++, { isTrusted });
      target.dispatchEvent(trusted(type));
      assert.equal(calls, 1, type);
    }
  });

  it('ignores events a script dispatched itself', () => {
    const target = new EventTarget();
    let calls = 0;
    onFirstUserInput(target, () => calls++, { isTrusted });

    target.dispatchEvent(new Event('pointerdown'));
    assert.equal(calls, 0);

    target.dispatchEvent(trusted('pointerdown'));
    assert.equal(calls, 1);
  });

  it('ignores events that are not user input', () => {
    const target = new EventTarget();
    let calls = 0;
    onFirstUserInput(target, () => calls++, { isTrusted });

    for (const type of ['load', 'scroll', 'resize', 'visibilitychange']) target.dispatchEvent(trusted(type));
    assert.equal(calls, 0);
  });

  it('never runs once cancelled', () => {
    const target = new EventTarget();
    let calls = 0;
    const cancel = onFirstUserInput(target, () => calls++, { isTrusted });

    cancel();
    target.dispatchEvent(trusted('pointerdown'));
    assert.equal(calls, 0);
  });
});
