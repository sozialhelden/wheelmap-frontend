// babel-preset-react-app uses useBuiltIn "entry". We therefore need an entry
// polyfill import to be replaced with polyfills we need for our targeted browsers.
import { HotkeysProvider } from '@blueprintjs/core'
import { ILanguageSubtag, parseLanguageTag } from '@sozialhelden/ietf-language-tags'
import { pick, uniq } from 'lodash'
import { NextPage } from 'next'
import { SessionProvider } from 'next-auth/react'
import type { AppProps } from 'next/app'
import { default as NextApp } from 'next/app'
import Head from 'next/head'
import * as queryString from 'query-string'
import * as React from 'react'
import { IncomingMessage, ServerResponse } from 'http'
import { SWRConfig, SWRConfiguration } from 'swr'
import { t } from 'ttag'
import { toast } from 'react-toastify'
import { AppContext } from '../lib/context/AppContext'
import CountryContext from '../lib/context/CountryContext'
import EnvContext, { EnvironmentVariables } from '../lib/context/EnvContext'
import { HostnameContext } from '../lib/context/HostnameContext'
import { LanguageTagContext } from '../lib/context/LanguageTagContext'
import { UserAgentContext, parseUserAgentString } from '../lib/context/UserAgentContext'
import composeContexts, { ContextAndValue } from '../lib/context/composeContexts'
import { parseAcceptLanguageString } from '../lib/i18n/parseAcceptLanguageString'
import { IApp } from '../lib/model/ac/App'
import fetchApp from '../lib/fetchers/ac/fetchApp'
import ResourceError from '../lib/fetchers/ResourceError'
import { patchFetcher } from '../lib/util/patchClientFetch'
import { ErrorMessage } from '../components/SWRError/ErrorMessage'
import { addToEnvironment, getEnvironment } from '../lib/util/globalEnvironment'

export type NextPageWithLayout = NextPage & {
  getLayout?: (page: React.ReactElement) => React.ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

interface ExtraProps {
  userAgentString?: string;
  app: IApp;
  languageTags: ILanguageSubtag[];
  ipCountryCode?: string;
  environmentVariables: Record<string, string | undefined>;
}

const globalSWRConfig: SWRConfiguration<unknown, ResourceError> = {
  onError: (error, key) => {
    const toastId = key
    if (error) {
      const errorElement = <ErrorMessage error={error} />
      toast.error(errorElement, {
        toastId,
        delay: 2000,
        autoClose: false,
        position: 'bottom-right',
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      })
    }
  },
  onLoadingSlow(key, config) {
    toast.warn(t`Loading seems to take a bit longer than usual. Please hold the line…`, {
      toastId: key,
      delay: 2000,
      autoClose: false,
      position: 'bottom-right',
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
    })
  },
  onSuccess(data, key, config) {
    toast.dismiss(key)
  },
}

export default function MyApp(props: AppProps<ExtraProps> & AppPropsWithLayout) {
  const { Component, pageProps } = props
  const {
    userAgentString, app, session, languageTags, ipCountryCode, environmentVariables,
  } = pageProps

  // can be done always, if it's empty, it won't overwrite anything
  addToEnvironment(environmentVariables)
  const environment = getEnvironment()

  const contexts: ContextAndValue<any>[] = [
    [UserAgentContext, parseUserAgentString(userAgentString)],
    [AppContext, app],
    [HostnameContext, app.hostname],
    [LanguageTagContext, { languageTags }],
    [CountryContext, ipCountryCode],
    [EnvContext, environment],
  ]

  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => page)

  return (
    <>
      <Head />
      <HotkeysProvider>
        <SessionProvider session={session}>
          <SWRConfig value={globalSWRConfig}>
            {composeContexts(contexts, getLayout(<Component {...pageProps} />))}
          </SWRConfig>
        </SessionProvider>
      </HotkeysProvider>
    </>
  )
}

const environmentVariables: EnvironmentVariables = pick(
  process.env,
  Object
    .keys(process.env)
    .filter((key) => key.startsWith('NEXT_PUBLIC_')),
)

patchFetcher()

async function retrieveAppByHostname(env: EnvironmentVariables, hostnameAndPort: string, query: queryString.ParsedQuery<string>) {
  const hostname = hostnameAndPort.split(':')[0]
  console.log('Hostname:', query, query.appId, hostname)
  if (typeof hostname !== 'string') {
    throw new Error(`Hostname ${hostname} must be a string.`)
  }
  const {
    NEXT_PUBLIC_ACCESSIBILITY_CLOUD_APP_TOKEN: appToken, NEXT_PUBLIC_ACCESSIBILITY_CLOUD_BASE_URL: baseUrl,
  } = env
  if (!appToken || !baseUrl) {
    throw new Error('Please provide NEXT_PUBLIC_ACCESSIBILITY_CLOUD_APP_TOKEN and NEXT_PUBLIC_ACCESSIBILITY_CLOUD_BASE_URL.')
  }
  const app = await fetchApp({ baseUrl, appToken, hostname })
  if (!app) {
    throw new Error(`No app found for hostname ${hostname}`)
  }
  return app
}

function determinePreferredLanguageTags(req: IncomingMessage, res: ServerResponse): ILanguageSubtag[] {
  const acceptLanguageHeader = req?.headers?.['accept-language']
  const languageTagStrings = req
    ? ((acceptLanguageHeader && parseAcceptLanguageString(acceptLanguageHeader)) || ['en'])
    : uniq([navigator.language, ...navigator.languages])
  const languageTags = languageTagStrings.map(parseLanguageTag)
  res?.setHeader('Vary', 'X-Lang, Content-Language')
  if (languageTagStrings[0]) {
    res?.setHeader('X-Lang', languageTagStrings[0])
    res?.setHeader('Content-Language', languageTagStrings.join(', '))
  }
  return languageTags
}

const getInitialProps: typeof NextApp.getInitialProps = async (appContext) => {
  const appProps = await NextApp.getInitialProps(appContext)
  const { ctx } = appContext
  const { req, res } = ctx
  const url = req?.url ?? window.location.href
  const userAgentString = req?.headers['user-agent'] ?? navigator.userAgent
  const languageTags = (req && res) ? determinePreferredLanguageTags(req, res) : window.navigator.languages.map(parseLanguageTag)
  const { query } = queryString.parseUrl(url ?? '')
  const ipCountryCode = query.countryCode
    || req?.headers?.['cf-ipcountry']
    || req?.headers?.['x-country-code']
    || languageTags.map((l) => l.region).filter(Boolean)[0]
  const hostnameAndPort = query.appId || (req ? req.headers.host : window.location.hostname)
  if (typeof hostnameAndPort !== 'string') {
    throw new Error('Please supply only one appId query parameter.')
  }
  const environment = getEnvironment()
  const app = await retrieveAppByHostname(Object.keys(environment).length > 0 ? environment : environmentVariables, hostnameAndPort, query)
  const pageProps: ExtraProps = {
    userAgentString, app, languageTags, ipCountryCode, environmentVariables,
  }
  return { ...appProps, pageProps }
}

MyApp.getInitialProps = getInitialProps
