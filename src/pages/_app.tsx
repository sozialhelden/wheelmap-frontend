import { HotkeysProvider } from "@blueprintjs/core";
import type { NextPage } from "next";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { default as NextApp } from "next/app";
import Head from "next/head";
import type * as React from "react";
import { App } from "~/components/App";
import { SheetMountedContextProvider } from "~/components/sheet/useSheetMounted";
import { BreakpointContextProvider } from "~/hooks/useBreakpoints";
import { AppStateContextProvider } from "~/modules/app-state/hooks/useAppState";
import { CategoryFilterContextProvider } from "~/modules/categories/contexts/CategoryFilterContext";
import type { LanguageTag } from "~/modules/i18n/i18n";
import { NeedsContextProvider } from "~/modules/needs/contexts/NeedsContext";
import { GlobalMapContextProvider } from "~/needs-refactoring/components/Map/GlobalMapContext";
import { MapFilterContextProvider } from "~/needs-refactoring/components/Map/filter/MapFilterContext";
import { AppContextProvider } from "~/needs-refactoring/lib/context/AppContext";
import StyledComponentsRegistry from "~/needs-refactoring/lib/context/StyledComponentsRegistry";
import SWRConfigProvider from "~/needs-refactoring/lib/fetchers/SWRConfigProvider";
import { ExpertModeContextProvider } from "~/needs-refactoring/lib/useExpertMode";
import {
  getRequestHostname,
  getRequestUserAgent,
} from "~/needs-refactoring/lib/util/request";
import { getEnvironmentVariables } from "~/utils/environment";

export type NextPageWithLayout = NextPage & {
  getLayout?: (page: React.ReactElement) => React.ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export interface PageProps {
  userAgentString?: string;
  languageTag: LanguageTag;
  environment: Record<string, string | undefined>;
  hostname: string;
}

export default function MyApp(props: AppProps<PageProps> & AppPropsWithLayout) {
  const { Component, pageProps } = props;
  const { userAgent, session, languageTag, environment, hostname } = pageProps;

  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <App context={{ languageTag, environment, hostname, userAgent }}>
      <AppStateContextProvider>
        <Head />
        <StyledComponentsRegistry>
          <HotkeysProvider>
            <SessionProvider session={session}>
              <ExpertModeContextProvider>
                <SWRConfigProvider>
                  <GlobalMapContextProvider>
                    <NeedsContextProvider>
                      <CategoryFilterContextProvider>
                        <AppContextProvider>
                          <MapFilterContextProvider>
                            <BreakpointContextProvider>
                              <SheetMountedContextProvider>
                                {getLayout(<Component />)}
                              </SheetMountedContextProvider>
                            </BreakpointContextProvider>
                          </MapFilterContextProvider>
                        </AppContextProvider>
                      </CategoryFilterContextProvider>
                    </NeedsContextProvider>
                  </GlobalMapContextProvider>
                </SWRConfigProvider>
              </ExpertModeContextProvider>
            </SessionProvider>
          </HotkeysProvider>
        </StyledComponentsRegistry>
      </AppStateContextProvider>
    </App>
  );
}

const getInitialProps: typeof NextApp.getInitialProps = async (appContext) => {
  const request = appContext.ctx.req;

  const hostname = getRequestHostname(request);
  const userAgent = getRequestUserAgent(request);

  // Needs to be server-side to enable runtime client configuration
  const environment = getEnvironmentVariables();

  // this is set by a custom middleware that handles language headers
  const languageTag = request?.headers[
    "x-preferred-language-tag"
  ] as LanguageTag;

  const pageProps = {
    userAgent,
    languageTag,
    environment,
    hostname,
  };

  return {
    ...(await NextApp.getInitialProps(appContext)),
    pageProps,
  };
};

MyApp.getInitialProps = getInitialProps;
