import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  findOsmElementInSameAs,
  getOsmUriVariants,
  groupPlaceInfosByOsmURI,
  parseOsmUri,
} from './osmUri';

describe('parseOsmUri', () => {
  it('parses node, way and relation URIs in all spellings', () => {
    assert.deepEqual(parseOsmUri('https://openstreetmap.org/way/175149971'), { element: 'way', id: '175149971' });
    assert.deepEqual(parseOsmUri('https://www.openstreetmap.org/node/1'), { element: 'node', id: '1' });
    assert.deepEqual(parseOsmUri('http://openstreetmap.org/relation/42/'), { element: 'relation', id: '42' });
  });

  it('ignores other URIs', () => {
    assert.equal(parseOsmUri('https://example.com/node/1'), undefined);
    assert.equal(parseOsmUri('https://openstreetmap.org/changeset/1'), undefined);
    assert.equal(parseOsmUri('https://openstreetmap.org/#map=19/52.5/13.4'), undefined);
  });
});

describe('findOsmElementInSameAs', () => {
  it('returns the first referenced OSM element', () => {
    assert.deepEqual(
      findOsmElementInSameAs(['https://example.com/1', 'https://openstreetmap.org/way/2', 'https://openstreetmap.org/node/3']),
      { element: 'way', id: '2' }
    );
  });

  it('handles missing values', () => {
    assert.equal(findOsmElementInSameAs(undefined), undefined);
    assert.equal(findOsmElementInSameAs(null), undefined);
    assert.equal(findOsmElementInSameAs(['https://example.com/']), undefined);
  });
});

describe('getOsmUriVariants', () => {
  it('returns every spelling a place info might use in sameAs', () => {
    assert.deepEqual(getOsmUriVariants({ element: 'node', id: '1' }), [
      'https://openstreetmap.org/node/1',
      'https://www.openstreetmap.org/node/1',
    ]);
  });
});

describe('groupPlaceInfosByOsmURI', () => {
  it('groups place infos by the OSM URIs in their sameAs, in the non-www spelling', () => {
    const a = { properties: { sameAs: ['https://example.com/a', 'https://www.openstreetmap.org/node/1'] } };
    const b = { properties: { sameAs: ['https://openstreetmap.org/node/1', 'https://openstreetmap.org/way/2'] } };
    const c = { properties: {} };
    assert.deepEqual(groupPlaceInfosByOsmURI([a, b, c]), {
      'https://openstreetmap.org/node/1': [a, b],
      'https://openstreetmap.org/way/2': [b],
    });
  });
});
