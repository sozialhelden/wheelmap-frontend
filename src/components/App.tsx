"use client";

import { useSearchParams } from "next/navigation";
import { type ReactNode, StrictMode } from "react";
import {
  EnvironmentContextProvider,
  type EnvironmentVariables,
} from "~/hooks/useEnvironment";
import { HostnameContextProvider } from "~/hooks/useHostname";
import { ThemeProvider } from "~/hooks/useTheme";
import { UserAgentContextProvider } from "~/hooks/useUserAgent";
import { I18nContextProvider } from "~/modules/i18n/context/I18nContext";
import type { LanguageTag } from "~/modules/i18n/i18n";

export type AppContext = {
  environment: EnvironmentVariables;
  languageTag: LanguageTag;
  hostname: string;
  userAgent: string;
};

/**
 * Main component that wraps the entire application and includes global
 * styles (see ThemeProvider) as well as global contexts that are used
 * throughout the app.
 */
export function App({
  context: { environment, languageTag, hostname, userAgent },
  children,
}: { context: AppContext; children: ReactNode }) {
  const searchParams = useSearchParams();
  const appId = searchParams?.get("appId");

  if (Array.isArray(appId)) {
    throw new Error("Please supply only one appId query parameter.");
  }

  return (
    <StrictMode>
      <ThemeProvider>
        <EnvironmentContextProvider environmentVariables={environment}>
          <HostnameContextProvider hostname={appId || hostname}>
            <UserAgentContextProvider userAgent={userAgent}>
              <I18nContextProvider languageTag={languageTag}>
                {children}
              </I18nContextProvider>
            </UserAgentContextProvider>
          </HostnameContextProvider>
        </EnvironmentContextProvider>
      </ThemeProvider>
    </StrictMode>
  );
}
