import { useHotkeys } from "@blueprintjs/core";
import { useTheme } from "next-themes";
import * as React from "react";

/**
 * A React Hook returning a boolean value that is `true` when the user switched on dark mode,
 * `false` otherwise.
 */
export function useDarkMode() {
  const { theme, setTheme } = useTheme();

  const hotkeys = React.useMemo(
    () => [
      {
        combo: "d",
        global: true,
        label: "Toggle Dark Mode",
        onKeyDown: () => setTheme(theme === "dark" ? "light" : "dark"),
      },
    ],
    [theme, setTheme],
  );

  useHotkeys(hotkeys);

  if (theme === "system") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  }

  return theme === "dark";
}
