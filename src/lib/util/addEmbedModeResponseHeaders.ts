import { ServerResponse } from 'http'
import { IApp } from '../model/ac/App'
import { EmbedToken } from '../model/ac/ClientSideConfiguration'

function isEmbedTokenValid(
  embedToken: string | undefined,
  appEmbedTokens: EmbedToken[] | undefined,
) {
  if (!embedToken || !appEmbedTokens) {
    return false
  }

  const matchingToken = appEmbedTokens.find(
    (token) => token.token === embedToken,
  )

  if (matchingToken) {
    const now = new Date()
    const expiryDate = new Date(matchingToken.expiresOn)
    return expiryDate > now
  }

  return false
}

export default function addEmbedModeResponseHeaders(
  app: IApp,
  res: ServerResponse,
  embedToken?: string,
) {
  let embedModeDenied = false

  if (embedToken) {
    const { embedTokens, allowedBaseUrls = [] } = app.clientSideConfiguration
    const validEmbedTokenProvided = isEmbedTokenValid(embedToken, embedTokens)
    embedModeDenied = !validEmbedTokenProvided

    res.setHeader(
      'Content-Security-Policy',
      `frame-ancestors file://* ${allowedBaseUrls.join(' ')}`,
    )
  } else {
    res.setHeader('X-Frame-Options', 'deny')
  }

  return embedModeDenied
}
