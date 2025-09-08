import {
  getILanguageTagsFromAcceptLanguageHeader,
  getMostPreferableLanguageTag,
} from "@sozialhelden/core";
import { headers } from "next/headers";
import { type ReactNode, StrictMode } from "react";
import { App } from "~/components/App";
import type { EnvironmentVariables } from "~/hooks/useEnvironment";
import { ThemeProvider } from "~/hooks/useTheme";
import { getPublicEnvironmentVariables } from "~/utils/environment";
import { getWhitelabelConfig } from "~/utils/whitelabel";

/**
 * Root layout that only provides the minimal setup required, like theming, i18n,
 * environment variables, etc.
 */
export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  // The root layout is a server component, so we can access runtime environment
  // variables and provide them to the rest of the application, effectively allowing
  // runtime configuration instead of build-time configuration.
  const environment = getPublicEnvironmentVariables() as EnvironmentVariables;

  const hostname = headers().get("host")?.split(":").shift() as string;
  const userAgent = headers().get("user-agent") as string;

  const languageTag = getMostPreferableLanguageTag(
    getILanguageTagsFromAcceptLanguageHeader(
      String(headers().get("accept-language")),
    ),
  );

  const whitelabelConfig = await getWhitelabelConfig(hostname);

  return (
    // We need to use suppressHydrationWarning here because next/themes requires it:
    // https://github.com/pacocoursey/next-themes?tab=readme-ov-file#with-app
    // The property only applies a single level deep (to the ThemeProvider), so it
    // doesn't affect hydration warnings deeper in the component tree.
    <html lang={languageTag} suppressHydrationWarning>
      <body>
        <StrictMode>
          <ThemeProvider>
            <App
              context={{
                environment,
                languageTag,
                hostname,
                userAgent,
                whitelabelConfig,
              }}
            >
              {children}
            </App>
          </ThemeProvider>
        </StrictMode>
      </body>
    </html>
  );
}
