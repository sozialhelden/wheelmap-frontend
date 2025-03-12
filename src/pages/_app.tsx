import type { ILanguageSubtag } from "@sozialhelden/ietf-language-tags";
import type { NextPage } from "next";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { default as NextApp } from "next/app";
import Head from "next/head";
import * as React from "react";
import CountryContext from "~/lib/context/CountryContext";
import {
  EnvContextProvider,
  type EnvironmentVariables,
} from "~/lib/context/EnvContext";
import { HostnameContextProvider } from "~/lib/context/HostnameContext";
import { LanguageCodeContextProvider } from "~/lib/context/LanguageTagContext";
import { UserAgentContextProvider } from "~/lib/context/UserAgentContext";
import { patchFetcher } from "~/lib/util/patchClientFetch";
import "@radix-ui/themes/styles.css";

import "~/app/reset.css";
import "~/app/app.css";
import "~/app/inter.css";
import "~/app/pointer-cursor.css";

import { AppStateContext } from "~/context/AppStateContext";
import {
  getRequestCountryCode,
  getRequestHostname,
  getRequestILanguageTags,
  getRequestQuery,
  getRequestUserAgentString,
} from "~/lib/util/request";
import { setResponseLanguageHeaders } from "~/lib/util/response";

export type NextPageWithLayout = NextPage & {
  getLayout?: (page: React.ReactElement) => React.ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

interface ExtraProps {
  userAgentString?: string;
  languageTags: ILanguageSubtag[];
  countryCode?: string;
  environmentVariables: Record<string, string | undefined>;
  hostname: string;
}

export default function MyApp(
  props: AppProps<ExtraProps> & AppPropsWithLayout,
) {
  const { Component, pageProps } = props;
  const {
    userAgentString,
    session,
    languageTags,
    countryCode,
    environmentVariables,
    hostname,
  } = pageProps;

  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <React.StrictMode>
      <Head />
      <SessionProvider session={session}>
        <EnvContextProvider environmentVariables={environmentVariables}>
          <LanguageCodeContextProvider languageTags={languageTags}>
            <HostnameContextProvider hostname={hostname}>
              <UserAgentContextProvider userAgentString={userAgentString}>
                <CountryContext.Provider value={countryCode}>
                  <AppStateContext>{getLayout(<Component />)}</AppStateContext>
                </CountryContext.Provider>
              </UserAgentContextProvider>
            </HostnameContextProvider>
          </LanguageCodeContextProvider>
        </EnvContextProvider>
      </SessionProvider>
    </React.StrictMode>
  );
}

patchFetcher();

const getInitialProps: typeof NextApp.getInitialProps = async (appContext) => {
  const { ctx: httpContext } = appContext;
  const { req: request, res: response } = httpContext;

  const { appId: queriedAppId, countryCode: queriedCountryCode } =
    getRequestQuery(request);

  if (Array.isArray(queriedAppId)) {
    throw new Error("Please supply only one appId query parameter.");
  }
  if (Array.isArray(queriedCountryCode)) {
    throw new Error("Please supply only one countryCode query parameter.");
  }

  const hostname = queriedAppId || getRequestHostname(request);
  const countryCode = queriedCountryCode || getRequestCountryCode(request);
  const userAgentString = getRequestUserAgentString(request);
  const languageTags = getRequestILanguageTags(request);

  // Needs to be server-side to enable runtime client configuration
  const environmentVariables: EnvironmentVariables = Object.fromEntries(
    Object.entries(process.env).filter(([key]) =>
      key.startsWith("NEXT_PUBLIC_"),
    ),
  );

  const pageProps: ExtraProps = {
    userAgentString,
    languageTags,
    countryCode,
    environmentVariables,
    hostname,
  };

  setResponseLanguageHeaders(languageTags, response);

  return { ...(await NextApp.getInitialProps(appContext)), pageProps };
};

MyApp.getInitialProps = getInitialProps;
