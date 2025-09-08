"use client";

import type { LanguageTag } from "@sozialhelden/core";
import { useSearchParams } from "next/navigation";
import type { ReactNode } from "react";
import { BreakpointContextProvider } from "~/hooks/useBreakpoints";
import {
  EnvironmentContextProvider,
  type EnvironmentVariables,
} from "~/hooks/useEnvironment";
import { HostnameContextProvider } from "~/hooks/useHostname";
import { UserAgentContextProvider } from "~/hooks/useUserAgent";
import { WhitelabelContextProvider } from "~/hooks/useWhitelabel";
import { I18nContextProvider } from "~/modules/i18n/hooks/useI18n";
import type { WhitelabelApp } from "~/types/whitelabel";

export type AppContext = {
  environment: EnvironmentVariables;
  languageTag: LanguageTag;
  hostname: string;
  userAgent: string;
  whitelabelConfig: WhitelabelApp;
};

/**
 * This is the root component that wraps the entire application, providing
 * necessary contexts such as environment variables, internationalization,
 * hostname, and user agent information that are needed throughout the entire
 * application, including error pages.
 *
 * The logic needs to live in a separate component because the root layout
 * is by definition a server component and the given contexts use things like
 * useState or useContext which only work in client components.
 *
 * There are additional contexts for the main application functionality, which
 * are provided via the main app-layout `(app)/layout.tsx` to subsequent
 * pages and layouts.
 *
 * TODO: We could think at some point about adding some kind of simple state
 *  management like zustand instead of using a ton of contexts. Or we could
 *  go back to the drawing board and come up with a different architecture
 *  to eliminate all this global "state".
 */
export function App({
  context: { environment, languageTag, hostname, userAgent, whitelabelConfig },
  children,
}: { context: AppContext; children: ReactNode }) {
  const searchParams = useSearchParams();
  const appId = searchParams?.get("appId");

  if (Array.isArray(appId)) {
    throw new Error("Please supply only one appId query parameter.");
  }

  return (
    <EnvironmentContextProvider environmentVariables={environment}>
      <HostnameContextProvider hostname={appId || hostname}>
        <UserAgentContextProvider userAgent={userAgent}>
          <I18nContextProvider languageTag={languageTag}>
            <WhitelabelContextProvider whitelabelConfig={whitelabelConfig}>
              <BreakpointContextProvider>{children}</BreakpointContextProvider>
            </WhitelabelContextProvider>
          </I18nContextProvider>
        </UserAgentContextProvider>
      </HostnameContextProvider>
    </EnvironmentContextProvider>
  );
}
