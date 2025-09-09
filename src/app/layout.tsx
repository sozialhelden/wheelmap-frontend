import type { Metadata } from "next";
import { type ReactNode, StrictMode } from "react";
import { App } from "~/components/App";
import { ThemeProvider } from "~/hooks/useTheme";
import { getDefaultMetadata } from "~/utils/metadata";
import { serverSideSetup } from "~/utils/server-side-setup";

export async function generateMetadata(): Promise<Metadata> {
  return getDefaultMetadata();
}

/**
 * Root layout that only provides the minimal setup required, like theming, i18n,
 * environment variables, etc.
 */
export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const context = await serverSideSetup();

  return (
    // We need to use suppressHydrationWarning here because next/themes requires it:
    // https://github.com/pacocoursey/next-themes?tab=readme-ov-file#with-app
    // The property only applies a single level deep (to the ThemeProvider), so it
    // doesn't affect hydration warnings deeper in the component tree.
    <html lang={context.languageTag} suppressHydrationWarning>
      <body>
        <StrictMode>
          <ThemeProvider>
            <App context={context}>{children}</App>
          </ThemeProvider>
        </StrictMode>
      </body>
    </html>
  );
}
