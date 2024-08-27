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
import { AppContext } from '../lib/context/AppContext'
import CountryContext from '../lib/context/CountryContext'
import EnvContext from '../lib/context/EnvContext'
import { HostnameContext } from '../lib/context/HostnameContext'
import { LanguageTagContext } from '../lib/context/LanguageTagContext'
import { UserAgentContext, parseUserAgentString } from '../lib/context/UserAgentContext'
import composeContexts, { ContextAndValue } from '../lib/context/composeContexts'
import fetchApp from '../lib/fetchers/fetchApp'
import { parseAcceptLanguageString } from '../lib/i18n/parseAcceptLanguageString'
import { IApp } from '../lib/model/ac/App'

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
  environmentVariables: Record<string, string>;
}

let globalEnvironmentVariables

export default function MyApp(props: AppProps<ExtraProps> & AppPropsWithLayout) {
  const { Component, pageProps } = props
  const {
    userAgentString, app, session, languageTags, ipCountryCode, environmentVariables,
  } = pageProps
  if (!globalEnvironmentVariables && Object.keys(environmentVariables).length > 0) {
    globalEnvironmentVariables = environmentVariables
  }

  const contexts: ContextAndValue<any>[] = [
    [UserAgentContext, parseUserAgentString(userAgentString)],
    [AppContext, app],
    [HostnameContext, app.hostname],
    [LanguageTagContext, { languageTags }],
    [CountryContext, ipCountryCode],
    [EnvContext, globalEnvironmentVariables],
  ]

  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => page)

  return (
    <>
      <Head />
      <HotkeysProvider>
        <SessionProvider session={session}>
          {composeContexts(contexts, getLayout(<Component {...pageProps} />))}
        </SessionProvider>
      </HotkeysProvider>
    </>
  )
}

const environmentVariables = pick(
  process.env,
  Object
    .keys(process.env)
    .filter((key) => key.startsWith('NEXT_PUBLIC_')),
)

const getInitialProps: typeof NextApp.getInitialProps = async (appContext) => {
  const appProps = await NextApp.getInitialProps(appContext)
  const { ctx } = appContext
  const { req, res } = ctx
  const url = req ? req.url : location.href
  const userAgentString = req ? req.headers['user-agent'] : navigator.userAgent
  const acceptLanguageHeader = req?.headers?.['accept-language']
  const languageTagStrings = req ? (acceptLanguageHeader && parseAcceptLanguageString(acceptLanguageHeader) || ['en']) : uniq([navigator.language, ...navigator.languages])
  const languageTags = languageTagStrings.map(parseLanguageTag)
  res?.setHeader('Vary', 'X-Lang, Content-Language')
  if (languageTagStrings[0]) {
    res?.setHeader('X-Lang', languageTagStrings[0])
    res?.setHeader('Content-Language', languageTagStrings.join(', '))
  }
  const { query } = queryString.parseUrl(url)
  const ipCountryCode = query.countryCode
    || req?.headers?.['cf-ipcountry']
    || req?.headers?.['x-country-code']
    || languageTags.map((l) => l.region).filter(Boolean)[0]
  const hostnameAndPort = query.appId || (req ? req.headers.host : location.hostname)
  if (typeof hostnameAndPort !== 'string') {
    throw new Error('Please supply only one appId query parameter.')
  }
  const hostname = hostnameAndPort.split(':')[0]
  console.log('Hostname:', query, query.appId, hostname)
  if (typeof hostname !== 'string') {
    throw new Error(`Hostname ${hostname} must be a string.`)
  }
  const centralAppToken = process.env.NEXT_PUBLIC_ACCESSIBILITY_CLOUD_APP_TOKEN
  const app = await fetchApp([hostname, centralAppToken])
  if (!app) {
    throw new Error(`No app found for hostname ${hostname}`)
  }

  const pageProps: ExtraProps = {
    userAgentString, app, languageTags, ipCountryCode, environmentVariables,
  }
  return { ...appProps, pageProps }
}

MyApp.getInitialProps = getInitialProps
