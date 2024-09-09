import { HTMLDivProps } from '@blueprintjs/core';
import * as React from 'react';

function getDarkModeSetting(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  return (
    window.matchMedia
    && window.matchMedia('(prefers-color-scheme: dark)').matches
  );
}

/**
 * A React Hook returning a boolean value that is `true` when the user switched on dark mode,
 * `false` otherwise.
 */
export function useDarkMode() {
  const [isDarkMode, setIsDarkMode] = React.useState(getDarkModeSetting());

  const handleChange = React.useCallback(() => {
    setIsDarkMode(getDarkModeSetting());
  }, []);

  React.useEffect(() => {
    if (window.matchMedia === undefined) {
      return;
    }
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', handleChange);
  }, [handleChange]);

  return isDarkMode;
}