import assert from 'node:assert/strict';
import { afterEach, describe, it } from 'node:test';

import { getCanonicalOsmPlacePath } from './getCanonicalOsmPlacePath';

const options = {
  acBaseUrl: 'https://ac.test',
  appToken: 'token',
  wheelmapApiBaseUrl: 'https://wheelmap.test',
  wheelmapApiKey: 'key',
};

const originalFetch = globalThis.fetch;
let fetchedUrls: string[] = [];

function mockFetch(responses: Record<string, unknown>) {
  fetchedUrls = [];
  globalThis.fetch = (async (input: string) => {
    const url = String(input);
    fetchedUrls.push(url);
    const path = url.replace(/\?.*$/, '');
    return path in responses
      ? new Response(JSON.stringify(responses[path]), { status: 200 })
      : new Response(null, { status: 404 });
  }) as typeof fetch;
}

describe('getCanonicalOsmPlacePath', () => {
  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it('returns the OSM place path of a place info linked to an OSM element', async () => {
    mockFetch({
      'https://ac.test/place-infos/abc.json': {
        properties: { sameAs: ['https://www.openstreetmap.org/way/175149971'] },
      },
      'https://wheelmap.test/api/way/175149971': { node: {} },
    });
    assert.equal(await getCanonicalOsmPlacePath('abc', options), '/way/175149971');
  });

  it('does not redirect if Wheelmap does not know the OSM element', async () => {
    mockFetch({
      'https://ac.test/place-infos/abc.json': {
        properties: { sameAs: ['https://openstreetmap.org/node/1'] },
      },
    });
    assert.equal(await getCanonicalOsmPlacePath('abc', options), undefined);
  });

  it('does not redirect place infos without OSM reference', async () => {
    mockFetch({ 'https://ac.test/place-infos/abc.json': { properties: {} } });
    assert.equal(await getCanonicalOsmPlacePath('abc', options), undefined);
    assert.equal(fetchedUrls.length, 1);
  });

  it('does not redirect if the place info cannot be loaded', async () => {
    mockFetch({});
    assert.equal(await getCanonicalOsmPlacePath('abc', options), undefined);
  });
});
