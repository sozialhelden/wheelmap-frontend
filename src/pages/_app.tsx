import { HotkeysProvider } from "@blueprintjs/core";
import type { NextPage } from "next";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { default as NextApp } from "next/app";
import Head from "next/head";
import type * as React from "react";
import { NeedsContextProvider } from "~/modules/needs/hooks/useNeeds";
import { AppContextProvider } from "~/lib/context/AppContext";
import StyledComponentsRegistry from "~/lib/context/StyledComponentsRegistry";
import SWRConfigProvider from "~/lib/fetchers/SWRConfigProvider";
import { ExpertModeContextProvider } from "~/lib/useExpertMode";
import {
  getRequestHostname,
  getRequestUserAgent,
} from "~/lib/util/request";
import { App } from "~/modules/app/components/App";
import { CategoryFilterContextProvider } from "~/modules/categories/contexts/CategoryFilterContext";
import { getEnvironmentVariables } from "~/modules/app/utils/environment";
import type { LanguageTag } from "~/modules/i18n/i18n";

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
      <Head />
      <StyledComponentsRegistry>
        <HotkeysProvider>
          <SessionProvider session={session}>
            <ExpertModeContextProvider>
              <SWRConfigProvider>
                <NeedsContextProvider>
                  <CategoryFilterContextProvider>
                    <AppContextProvider>
                      {getLayout(<Component />)}
                    </AppContextProvider>
                  </CategoryFilterContextProvider>
                </NeedsContextProvider>
              </SWRConfigProvider>
            </ExpertModeContextProvider>
          </SessionProvider>
        </HotkeysProvider>
      </StyledComponentsRegistry>
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
