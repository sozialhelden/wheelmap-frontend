import { Theme as RadixTheme } from "@radix-ui/themes";
import { ThemeProvider as NextThemeProvider } from "next-themes";
import { useTheme as useNextTheme } from "next-themes";
import * as React from "react";
import type { ReactNode } from "react";

// global styling
import "@radix-ui/themes/styles.css";
import "~/assets/css/reset.css";
import "~/assets/css/inter.css";
import "~/assets/css/app.css";

export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemeProvider
      attribute="class"
      enableSystem={true}
      defaultTheme="system"
    >
      <RadixTheme
        accentColor="indigo"
        grayColor="sand"
        radius="small"
        scaling="100%"
        panelBackground="solid"
      >
        {children}
      </RadixTheme>
    </NextThemeProvider>
  );
}

export function useDarkMode() {
  const { theme } = useNextTheme();

  if (theme === "system") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  }

  return theme === "dark";
}

export const useTheme = useNextTheme;
