import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isHiddenChildFeature } from './isHiddenChildFeature';

describe('isHiddenChildFeature', () => {
  it('shows normal places', () => {
    assert.equal(isHiddenChildFeature({}, 'place', null), false);
    assert.equal(isHiddenChildFeature(undefined, 'place', null), false);
  });

  it('hides places inside another place', () => {
    const properties = { parentPlaceInfoId: 'parent' };
    assert.equal(isHiddenChildFeature(properties, 'child', null), true);
    assert.equal(isHiddenChildFeature(properties, 'child', 'parent'), true);
  });

  it('shows a place inside another place when it is selected', () => {
    const properties = { parentPlaceInfoId: 'parent' };
    assert.equal(isHiddenChildFeature(properties, 'child', 'child'), false);
  });

  it('shows equipment belonging to a place', () => {
    const properties = { placeInfoId: 'place' } as any;
    assert.equal(isHiddenChildFeature(properties, 'elevator', 'place'), false);
    assert.equal(isHiddenChildFeature(properties, 'elevator', null), false);
  });
});
