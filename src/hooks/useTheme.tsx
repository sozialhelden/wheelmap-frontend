"use client";

import { Theme as RadixTheme } from "@radix-ui/themes";
import { ThemeProvider as NextThemeProvider } from "next-themes";
import { useTheme as useNextTheme } from "next-themes";
import { useServerInsertedHTML } from "next/navigation";
import type * as React from "react";
import type { ReactNode } from "react";
import { useState } from "react";
import { ServerStyleSheet, StyleSheetManager } from "styled-components";

// global styling
import "@radix-ui/themes/styles.css";
import "~/assets/css/reset.css";
import "~/assets/css/inter.css";
import "~/assets/css/app.css";

// See: https://nextjs.org/docs/app/guides/css-in-js#styled-components
function StyledComponentsRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  // Only create stylesheet once with lazy initial state
  // x-ref: https://reactjs.org/docs/hooks-reference.html#lazy-initial-state
  const [styledComponentsStyleSheet] = useState(() => new ServerStyleSheet());

  useServerInsertedHTML(() => {
    const styles = styledComponentsStyleSheet.getStyleElement();
    styledComponentsStyleSheet.instance.clearTag();
    return styles;
  });

  if (typeof window !== "undefined") return <>{children}</>;

  return (
    <StyleSheetManager sheet={styledComponentsStyleSheet.instance}>
      {children}
    </StyleSheetManager>
  );
}

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
        style={{ display: "grid", gridTemplateRows: "min-content 1fr" }}
      >
        <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
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
