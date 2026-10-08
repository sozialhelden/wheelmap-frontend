import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { hasOsmSameAsURI, isHiddenSameAsOsmFeature } from './isHiddenSameAsOsmFeature';

const osmSameAs = { sameAs: ['https://openstreetmap.org/node/1743391754'] };

describe('hasOsmSameAsURI', () => {
  it('detects OSM node, way and relation URIs', () => {
    assert.equal(hasOsmSameAsURI(osmSameAs), true);
    assert.equal(hasOsmSameAsURI({ sameAs: ['https://www.openstreetmap.org/way/1'] }), true);
    assert.equal(hasOsmSameAsURI({ sameAs: ['https://example.com', 'https://openstreetmap.org/relation/2'] }), true);
  });

  it('ignores other URIs and missing values', () => {
    assert.equal(hasOsmSameAsURI({ sameAs: ['https://example.com/node/1'] }), false);
    assert.equal(hasOsmSameAsURI({ sameAs: [] }), false);
    assert.equal(hasOsmSameAsURI({}), false);
    assert.equal(hasOsmSameAsURI(undefined), false);
  });
});

describe('isHiddenSameAsOsmFeature', () => {
  it('shows places without an OSM sameAs URI', () => {
    assert.equal(isHiddenSameAsOsmFeature({}, 'place', null, true), false);
    assert.equal(isHiddenSameAsOsmFeature(undefined, 'place', null, true), false);
  });

  it('hides places that reference an OSM feature', () => {
    assert.equal(isHiddenSameAsOsmFeature(osmSameAs, 'place', null, true), true);
    assert.equal(isHiddenSameAsOsmFeature(osmSameAs, 'place', '1743391754', true), true);
  });

  it('shows a place that references an OSM feature when it is selected', () => {
    assert.equal(isHiddenSameAsOsmFeature(osmSameAs, 'place', 'place', true), false);
  });

  it('shows places that reference an OSM feature when OSM features are not shown', () => {
    assert.equal(isHiddenSameAsOsmFeature(osmSameAs, 'place', null, false), false);
  });
});
