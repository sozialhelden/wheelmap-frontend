import React, { PureComponent } from 'react'
import Head from 'next/head'
import { TwitterConfiguration } from '../../lib/model/ac/ClientSideConfiguration'

type Props = {
  shareHost: string;
  productName: string | null;
  description: string | null;
  twitter: TwitterConfiguration;
};

class TwitterMeta extends PureComponent<Props> {
  render() {
    const {
      shareHost, productName, description, twitter,
    } = this.props
    const { creatorHandle, siteHandle, imageURL } = twitter

    if (!creatorHandle && !siteHandle) {
      return null
    }

    return (
      <Head>
        <meta content="summary" property="twitter:card" key="twitter:card" />
        <meta
          content={shareHost}
          property="twitter:domain"
          key="twitter:domain"
        />
        {siteHandle && (
          <meta
            content={siteHandle}
            property="twitter:site"
            key="twitter:site"
          />
        )}
        {creatorHandle && (
          <meta
            content={creatorHandle}
            property="twitter:creator"
            key="twitter:creator"
          />
        )}
        <meta
          content={description}
          property="twitter:description"
          key="twitter:description"
        />
        <meta
          content={productName}
          property="twitter:title"
          key="twitter:title"
        />
        {imageURL && (
          <meta
            content={imageURL}
            property="twitter:image"
            key="twitter:image"
          />
        )}
      </Head>
    )
  }
}

export default TwitterMeta
