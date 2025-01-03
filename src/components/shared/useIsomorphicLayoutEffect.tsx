import * as React from "react";

/**
 * React throws a warning when using `useLayoutEffect()` on the server. To get around this, we can
 * conditionally run `useEffect()` on the server (no-op) and `useLayoutEffect()` in the browser.
 */

export const useIsomorphicLayoutEffect =
  typeof global.window !== "undefined"
    ? React.useLayoutEffect
    : React.useEffect;
