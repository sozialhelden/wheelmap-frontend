/** Events that only a person at the device produces (no scroll/resize: pages and browsers fire those on their own). */
export const USER_INPUT_EVENTS = ['pointerdown', 'pointermove', 'wheel', 'keydown', 'touchstart'] as const;

/**
 * Runs `callback` once, on the first trusted user input on `target`.
 * Events a script dispatches itself are untrusted and ignored.
 * Returns a function that removes the listeners without running the callback.
 */
export function onFirstUserInput(
  target: EventTarget,
  callback: () => void,
  { isTrusted = (event: Event) => event.isTrusted }: { isTrusted?: (event: Event) => boolean } = {}
): () => void {
  const options = { capture: true, passive: true };
  const cancel = () => USER_INPUT_EVENTS.forEach((type) => target.removeEventListener(type, listener, options));
  function listener(event: Event) {
    if (!isTrusted(event)) return;
    cancel();
    callback();
  }
  USER_INPUT_EVENTS.forEach((type) => target.addEventListener(type, listener, options));
  return cancel;
}
