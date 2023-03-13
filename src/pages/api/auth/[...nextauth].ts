import NextAuth from "next-auth";
import { OAuthConfig } from "next-auth/providers/oauth";

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
};

const OSMProvider: OAuthConfig<IOSMProfile> = {
  id: "osm",
  name: "OpenStreetMap",
  type: "oauth",
  token: "https://www.openstreetmap.org/oauth2/token",
  userinfo: "https://api.openstreetmap.org/api/0.6/user/details.json",
  clientId: process.env.OSM_OAUTH2_CLIENT_ID,
  clientSecret: process.env.OSM_OAUTH2_CLIENT_SECRET,
  authorization: {
    url: "https://www.openstreetmap.org/oauth2/authorize",
    params: { scope: "read_prefs write_api write_notes" }
  },
  profile(profile) {
    return {
      id: profile.user.id.toString(),
      name: profile.user.display_name,
      email: profile.user.display_name,
      image: profile.user.img.href,
    }
  },
};

export default NextAuth({
  providers: [OSMProvider],
});
