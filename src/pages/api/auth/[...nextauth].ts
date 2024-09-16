import NextAuth, { NextAuthOptions } from 'next-auth'
import { OAuthConfig } from 'next-auth/providers/oauth'
import { log } from '../../../lib/util/logger'

interface IOSMProfile {
  version: '0.6',
  generator: string,
  copyright: string,
  attribution: string,
  license: string,
  user: {
    id: number,
    display_name: string,
    account_created: string,
    description: string,
    contributor_terms: { agreed: boolean, pd: boolean },
    img: { href: string },
    roles: [],
    changesets: { count: number },
    traces: { count: number },
    blocks: { received: { count: number, active: number } },
    home: { lat: number, lon: number, zoom: number },
    languages: string[],
    messages: { received: { count: number, unread: number }, sent: { count: number } },
  },
}

const baseUrl = process.env.NEXTAUTH_BASE_URL || 'https://www.openstreetmap.org'
const apiBaseUrl = process.env.NEXTAUTH_API_BASE_URL || 'https://api.openstreetmap.org'
const OSMProvider: OAuthConfig<IOSMProfile> = {
  id: 'osm',
  name: 'OpenStreetMap',
  type: 'oauth',
  token: `${baseUrl}/oauth2/token`,
  userinfo: `${apiBaseUrl}/api/0.6/user/details.json`,
  clientId: process.env.OSM_OAUTH2_CLIENT_ID,
  clientSecret: process.env.OSM_OAUTH2_CLIENT_SECRET,
  authorization: {
    url: `${baseUrl}/oauth2/authorize`,
    params: { scope: 'read_prefs write_api write_notes' },
  },
  profile(profile) {
    return {
      id: profile.user.id.toString(),
      name: profile.user.display_name,
      email: profile.user.display_name,
      image: profile.user.img?.href,
    }
  },
}

export const authOptions: NextAuthOptions = {
  providers: [OSMProvider],
  callbacks: {
    async session({ session, token, user }) {
      // Send properties to the client, like an access_token and user id from a provider.
      return {
        ...session,
        accessToken: token.accessToken,
      }
    },
    async jwt({
      token, user, account, profile, isNewUser,
    }) {
      log.log('JWT callback', {
        token, user, account, profile, isNewUser,
      })
      // Persist the OAuth access_token and or the user id to the token right after signin
      if (account) {
        token.accessToken = account.access_token
        token.tokenType = account.token_type
      }
      return token
    },
  },
}

export default NextAuth(authOptions)
