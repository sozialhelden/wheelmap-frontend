import { useState } from "react";
import { useIsomorphicLayoutEffect } from "~/needs-refactoring/components/shared/useIsomorphicLayoutEffect";

/**
 * Determine the viewport size depending on the inner sizing of the window, useful
 * for handling layout choices depending on the size of the browser
 */
export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: 1024,
    height: 768,
  } as const);

  const hasWindow = typeof global.window !== "undefined";

  useIsomorphicLayoutEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: global.window?.innerWidth || 1024,
        height: global.window?.innerHeight || 768,
      });
    };

    global.window?.addEventListener("resize", handleResize);
    handleResize();
    return () => {
      global.window?.removeEventListener("resize", handleResize);
    };
  }, []);

  return windowSize;
};
