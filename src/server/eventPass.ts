import { createPrivateKey, KeyObject, randomBytes, sign } from 'crypto';
import type { NextFunction, Request, Response } from 'express';

// Node 22 has a global fetch; our @types/node (12) doesn't declare it.
declare const fetch: (url: string) => Promise<{ ok: boolean, status: number, json(): Promise<any> }>;

/**
 * Event passes let mapping-event participants through wheelmap.org's rate
 * limiting. Many participants often share one company network and the same
 * browser, which would otherwise look like a single heavy client.
 *
 * Opening /events/:id/join for a joinable event sets an ES256-signed JWT cookie.
 * Our edge proxy verifies it against the matching public key and rate-limits
 * pass holders per pass.
 *
 * The cookie expires 5 minutes before the token inside it. An expired token
 * would not break anything (it just counts as "no pass"), but this way
 * browsers stop sending dead passes.
 *
 * Deliberately self-contained: the app's data caches (src/lib/cache) import map
 * components that must not load in the Node server process.
 */

export const EVENT_PASS_COOKIE = 'wm_event_pass';
export const EVENT_PASS_ISSUER = 'https://wheelmap.org/event-pass';

const MAX_LIFETIME_S = 14 * 86400;
const VALID_AFTER_EVENT_END_S = 12 * 3600;
const COOKIE_MARGIN_S = 300;
const LOOKUP_TTL_MS = 60_000;

/** The subset of src/lib/MappingEvent's MappingEvent this needs. */
type JoinableEvent = {
  _id: string,
  status: 'draft' | 'planned' | 'ongoing' | 'completed' | 'canceled',
  endTime?: string | Date,
};

/** Same rule as canMappingEventBeJoined in src/lib/MappingEvent.ts. */
const canBeJoined = (event: JoinableEvent) => event.status === 'ongoing' || event.status === 'planned';

export type EventPassClaims = {
  iss: string,
  sub: string,
  jti: string,
  iat: number,
  exp: number,
};

/** Valid until 12 h after the event ends, at most 14 days. */
export function eventPassExpiry(event: Pick<JoinableEvent, 'endTime'>, nowS: number): number {
  const maxExp = nowS + MAX_LIFETIME_S;
  if (!event.endTime) {
    return maxExp;
  }
  const endS = Math.floor(new Date(event.endTime).getTime() / 1000);
  return Math.min(endS + VALID_AFTER_EVENT_END_S, maxExp);
}

// Buffer's 'base64url' encoding works at runtime but is missing from our @types/node.
export const base64url = (buffer: Buffer): string =>
  buffer.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

export function signEventPass(key: KeyObject, keyId: string | undefined, claims: EventPassClaims): string {
  const header = { alg: 'ES256', typ: 'JWT', ...(keyId ? { kid: keyId } : {}) };
  const encode = (value: object) => base64url(Buffer.from(JSON.stringify(value)));
  const signingInput = `${encode(header)}.${encode(claims)}`;
  // JWS ES256 wants the raw r||s signature, not DER.
  const signature = sign('sha256', Buffer.from(signingInput), { key, dsaEncoding: 'ieee-p1363' });
  return `${signingInput}.${base64url(signature)}`;
}

export function readSigningKey(pem: string | undefined): KeyObject | undefined {
  // Env files often carry the PEM with literal "\n".
  return pem ? createPrivateKey(pem.replace(/\\n/g, '\n')) : undefined;
}

const lookups = new Map<string, { expires: number, value: Promise<any> }>();

/** GET JSON, sharing results for a minute so an event kickoff doesn't hammer the API. */
function getJson(url: string): Promise<any> {
  const cached = lookups.get(url);
  if (cached && cached.expires > Date.now()) {
    return cached.value;
  }
  const value = fetch(url).then(response => {
    if (!response.ok) {
      throw new Error(`HTTP ${response.status} for ${url.replace(/appToken=[^&]+/, 'appToken=…')}`);
    }
    return response.json();
  });
  value.catch(() => lookups.delete(url));
  lookups.set(url, { expires: Date.now() + LOOKUP_TTL_MS, value });
  return value;
}

/** Mirrors AppCache.getApp + MappingEventsCache.getMappingEvent, minus the caches' imports. */
async function fetchMappingEvent(hostName: string, eventId: string): Promise<JoinableEvent> {
  const env = process.env;
  const appHost = hostName.replace(/.*\.wheelmap\.tech$/, 'wheelmap.tech');
  const app = await getJson(
    `${env.REACT_APP_ACCESSIBILITY_CLOUD_UNCACHED_BASE_URL}/apps/${appHost}.json?appToken=${env.REACT_APP_ACCESSIBILITY_CLOUD_APP_TOKEN}`
  );
  return getJson(
    `${env.REACT_APP_ACCESSIBILITY_CLOUD_BASE_URL}/mapping-events/${encodeURIComponent(eventId)}.json?appToken=${app.tokenString}`
  );
}

/**
 * Express middleware for GET /events/:id/join. Sets the pass cookie if the event
 * can be joined, then always continues to the normal page render. Never fails the
 * request: without a key, or if the event can't be loaded, there is just no pass.
 */
export function createEventPassHandler(options: { signingKey?: string, keyId?: string }) {
  const key = readSigningKey(options.signingKey);

  return async (req: Request, res: Response, next: NextFunction) => {
    if (!key) {
      return next();
    }
    try {
      const event = await fetchMappingEvent(req.hostname, req.params.id);
      const nowS = Math.floor(Date.now() / 1000);
      const exp = eventPassExpiry(event, nowS);
      if (canBeJoined(event) && exp - nowS > COOKIE_MARGIN_S) {
        const token = signEventPass(key, options.keyId, {
          iss: EVENT_PASS_ISSUER,
          sub: event._id,
          jti: randomBytes(16).toString('hex'),
          iat: nowS,
          exp,
        });
        res.cookie(EVENT_PASS_COOKIE, token, {
          maxAge: (exp - nowS - COOKIE_MARGIN_S) * 1000,
          httpOnly: true,
          secure: true,
          sameSite: 'lax',
          path: '/',
        });
        res.set('Cache-Control', 'private, no-store');
      }
    } catch (error) {
      console.error('Could not issue event pass:', error);
    }
    next();
  };
}
