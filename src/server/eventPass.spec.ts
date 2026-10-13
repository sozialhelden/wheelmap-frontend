import { createPublicKey, generateKeyPairSync, verify } from 'crypto';
import {
  createEventPassHandler,
  EVENT_PASS_COOKIE,
  eventPassExpiry,
  EVENT_PASS_ISSUER,
  readSigningKey,
  signEventPass,
} from './eventPass';

const nowS = Date.UTC(2026, 9, 13, 12) / 1000;

const fromBase64url = (value: string) =>
  Buffer.from(value.replace(/-/g, '+').replace(/_/g, '/'), 'base64');

describe('eventPassExpiry', () => {
  it('lasts until 12 hours after the event ends', () => {
    const endTime = new Date(Date.UTC(2026, 9, 14, 18));
    expect(eventPassExpiry({ endTime }, nowS)).toBe(Date.UTC(2026, 9, 15, 6) / 1000);
  });

  it('never lasts longer than 14 days', () => {
    const endTime = new Date(Date.UTC(2027, 0, 1));
    expect(eventPassExpiry({ endTime }, nowS)).toBe(nowS + 14 * 86400);
  });

  it('lasts 14 days for events without an end time', () => {
    expect(eventPassExpiry({}, nowS)).toBe(nowS + 14 * 86400);
  });

  it('is already over for events that ended long ago', () => {
    const endTime = new Date(Date.UTC(2026, 9, 1));
    expect(eventPassExpiry({ endTime }, nowS)).toBeLessThan(nowS);
  });
});

describe('signEventPass', () => {
  const { privateKey } = generateKeyPairSync('ec', { namedCurve: 'P-256' });
  const pem = privateKey.export({ type: 'pkcs8', format: 'pem' }).toString();
  const claims = { iss: EVENT_PASS_ISSUER, sub: 'evt1', jti: 'pass-1', iat: nowS, exp: nowS + 3600 };

  it('produces a compact ES256 JWS that verifies with the public key', () => {
    const key = readSigningKey(pem.replace(/\n/g, '\\n'))!;
    const token = signEventPass(key, 'event-pass-test', claims);
    const [header, payload, signature] = token.split('.');

    expect(JSON.parse(fromBase64url(header).toString())).toEqual({
      alg: 'ES256',
      typ: 'JWT',
      kid: 'event-pass-test',
    });
    expect(JSON.parse(fromBase64url(payload).toString())).toEqual(claims);
    expect(fromBase64url(signature).length).toBe(64); // raw r||s, not DER
    expect(
      verify(
        'sha256',
        Buffer.from(`${header}.${payload}`),
        // dsaEncoding is missing from our @types/node, but Node 22 supports it.
        { key: createPublicKey(key), dsaEncoding: 'ieee-p1363' } as any,
        fromBase64url(signature)
      )
    ).toBe(true);
  });

  it('works without a key id', () => {
    const token = signEventPass(readSigningKey(pem)!, undefined, claims);
    expect(JSON.parse(fromBase64url(token.split('.')[0]).toString())).toEqual({
      alg: 'ES256',
      typ: 'JWT',
    });
  });
});

describe('createEventPassHandler', () => {
  const { privateKey } = generateKeyPairSync('ec', { namedCurve: 'P-256' });
  const signingKey = privateKey.export({ type: 'pkcs8', format: 'pem' }).toString();

  const mockApi = (event: object | Error) => {
    (global as any).fetch = jest.fn(async (url: string) => {
      if (url.includes('/apps/')) {
        return { ok: true, status: 200, json: async () => ({ tokenString: 'app-token' }) };
      }
      if (event instanceof Error) {
        throw event;
      }
      return { ok: true, status: 200, json: async () => event };
    });
  };

  const run = async (eventId: string) => {
    const res = { cookie: jest.fn(), set: jest.fn() };
    const next = jest.fn();
    await createEventPassHandler({ signingKey })({ hostname: 'wheelmap.org', params: { id: eventId } } as any, res as any, next);
    return { res, next };
  };

  it('sets an HttpOnly pass cookie for a joinable event, then renders the page', async () => {
    const endTime = new Date(Date.now() + 2 * 86400 * 1000).toISOString();
    mockApi({ _id: 'evt-ongoing', status: 'ongoing', endTime });
    const { res, next } = await run('evt-ongoing');

    expect(res.cookie).toHaveBeenCalledTimes(1);
    const [name, token, options] = res.cookie.mock.calls[0];
    expect(name).toBe(EVENT_PASS_COOKIE);
    expect(JSON.parse(fromBase64url(token.split('.')[1]).toString())).toMatchObject({
      iss: EVENT_PASS_ISSUER,
      sub: 'evt-ongoing',
    });
    expect(options).toMatchObject({ httpOnly: true, secure: true, sameSite: 'lax', path: '/' });
    expect(res.set).toHaveBeenCalledWith('Cache-Control', 'private, no-store');
    expect(next).toHaveBeenCalledWith();
  });

  it('issues no pass for events that are over', async () => {
    mockApi({ _id: 'evt-done', status: 'completed' });
    const { res, next } = await run('evt-done');
    expect(res.cookie).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith();
  });

  it('still renders the join page when the API fails', async () => {
    mockApi(new Error('network down'));
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
    const { res, next } = await run('evt-unreachable');
    expect(res.cookie).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith();
  });

  it('does nothing without a signing key', async () => {
    const next = jest.fn();
    await createEventPassHandler({})({} as any, {} as any, next);
    expect(next).toHaveBeenCalledWith();
  });
});
