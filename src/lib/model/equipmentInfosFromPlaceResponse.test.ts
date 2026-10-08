import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  equipmentInfosFromPlaceResponse,
  getEquipmentInfoId,
  shouldListEquipmentInfos,
} from './equipmentInfosFromPlaceResponse';

const elevator = (id: string) => ({ properties: { _id: id, placeInfoId: 'place', category: 'elevator' } }) as any;

describe('equipmentInfosFromPlaceResponse', () => {
  it('returns related equipment of a place response', () => {
    const response = {
      type: 'Feature',
      properties: { _id: 'place' },
      related: { equipmentInfos: { a: elevator('a'), b: elevator('b') } },
    };
    const ids = equipmentInfosFromPlaceResponse(response).map(getEquipmentInfoId);
    assert.deepEqual(ids, ['a', 'b']);
  });

  it('returns an empty list without related equipment', () => {
    assert.deepEqual(equipmentInfosFromPlaceResponse(null), []);
    assert.deepEqual(equipmentInfosFromPlaceResponse(undefined), []);
    assert.deepEqual(equipmentInfosFromPlaceResponse({}), []);
    assert.deepEqual(equipmentInfosFromPlaceResponse({ related: {} }), []);
    assert.deepEqual(equipmentInfosFromPlaceResponse({ related: { equipmentInfos: null } }), []);
  });
});

describe('getEquipmentInfoId', () => {
  it('reads the id from properties or the top level', () => {
    assert.equal(getEquipmentInfoId(elevator('a')), 'a');
    assert.equal(getEquipmentInfoId({ _id: 'b' }), 'b');
  });
});

describe('shouldListEquipmentInfos', () => {
  it('does not list missing or empty equipment', () => {
    assert.equal(shouldListEquipmentInfos(null, null), false);
    assert.equal(shouldListEquipmentInfos([], null), false);
  });

  it('lists a single equipment on its place page', () => {
    assert.equal(shouldListEquipmentInfos([elevator('a')], null), true);
    assert.equal(shouldListEquipmentInfos([elevator('a')], undefined), true);
  });

  it('lists a single equipment on another equipment page', () => {
    assert.equal(shouldListEquipmentInfos([elevator('a')], 'b'), true);
  });

  it('does not list a single equipment on its own page', () => {
    assert.equal(shouldListEquipmentInfos([elevator('a')], 'a'), false);
  });

  it('lists multiple equipment, also on one of their pages', () => {
    assert.equal(shouldListEquipmentInfos([elevator('a'), elevator('b')], null), true);
    assert.equal(shouldListEquipmentInfos([elevator('a'), elevator('b')], 'a'), true);
  });
});
