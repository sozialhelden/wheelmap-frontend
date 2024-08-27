import React, { PureComponent } from 'react'
import Head from 'next/head'

type Props = {
  productName: string | null,
  title: string | null,
  description: string | null,
  url: string | null,
};

class OpenGraph extends PureComponent<Props> {
  render() {
    const {
      productName, title, description, url,
    } = this.props

    return (
      <Head>
        <meta content={productName} property="og:site_name" key="og:site_name" />
        <meta content={title} property="og:title" key="og:title" />
        <meta content={description} property="og:description" key="og:description" />
        <meta content={url} property="og:url" key="og:url" />
        <meta content="website" property="og:type" key="og:type" />
      </Head>
    )
  }
}

export default OpenGraph
