import { encode } from 'js-base64'
import Head from 'next/head'
import { t } from 'ttag'
import { useCurrentApp } from '../../lib/context/AppContext'
import useHostname from '../../lib/context/HostnameContext'
import { translatedStringFromObject } from '../../lib/i18n/translatedStringFromObject'
import { getProductTitle } from '../../lib/model/ac/ClientSideConfiguration'
import FacebookMeta from './FacebookMeta'
import OpenGraph from './OpenGraph'
import TwitterMeta from './TwitterMeta'

export default function HeadMetaTags() {
  const { clientSideConfiguration } = useCurrentApp()
  const { textContent, meta, branding } = clientSideConfiguration
  const { name: productName, description } = textContent?.product || {
    name: 'Wheelmap',
    description: undefined,
  }
  const { twitter, facebook } = meta || {}
  const translatedDescription = translatedStringFromObject(description)
  const translatedProductName = translatedStringFromObject(productName)
  const pageTitle = translatedProductName
  const facebookMetaData = { ...facebook, imageWidth: 0, imageHeight: 0 }
  const hostName = useHostname()
  const baseUrl = `https://${hostName}`
  const ogUrl = baseUrl
  const iconSvg = branding?.vectorIconSVG?.data
  const faviconDataUrl = iconSvg && `data:image/svg+xml;base64,${encode(iconSvg)}`

  return (
    <Head>
      <title key="title">{getProductTitle(clientSideConfiguration)}</title>
      {/*
        Move viewport meta into Head from next/head to allow deduplication to work. Do not rely on deduplication by key,
        as React.mapChildren will prefix keys with ".$", but the default keys in next are not prefixed. Deduplication by
        name works fine.
       */}
      <meta
        name="viewport"
        content="width=device-width, height=device-height, initial-scale=1.0, maximum-scale=2.0, minimum-scale=1.0, viewport-fit=cover"
      />

      {/* Alternates */}
      {/* {generateLocaleLinks(
    path || (window && window.location.pathname),
    availableLocales
  )} */}

      {/* Relations */}
      <link href="/search" rel="search" title={t`Search`} />
      <link href="/" rel="home" title={t`Homepage`} />

      {/* Misc */}
      <meta
        content={translatedStringFromObject(description)}
        name="description"
        key="description"
      />
      <link rel="shortcut icon" href={faviconDataUrl || '/favicon.ico'} />
      <link rel="icon" href={faviconDataUrl || '/favicon.ico'} />

      {/* iOS app */}
      {productName === 'Wheelmap' && (
        <meta content="app-id=399239476" name="apple-itunes-app" />
      )}
      <OpenGraph
        productName={translatedProductName}
        title={pageTitle}
        description={translatedDescription}
        url={ogUrl}
      />
      {twitter && (
        <TwitterMeta
          shareHost={baseUrl}
          productName={translatedProductName}
          description={translatedDescription}
          twitter={twitter}
        />
      )}
      {facebook && <FacebookMeta facebook={facebookMetaData} />}
    </Head>
  )
}
