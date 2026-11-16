import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  getEquipmentStatusLastUpdate,
  isEquipmentStatusOutdated,
  isExistingInformationOutdated,
} from './equipmentStatusFreshness';

const now = new Date('2026-11-16T12:00:00.000Z');
const hoursAgo = (hours: number) => new Date(now.getTime() - hours * 60 * 60 * 1000).toISOString();

describe('isExistingInformationOutdated', () => {
  it('treats missing dates as not outdated', () => {
    assert.equal(isExistingInformationOutdated(null, undefined, now), false);
  });

  it('uses two hours by default', () => {
    assert.equal(isExistingInformationOutdated(new Date(hoursAgo(1.9)), undefined, now), false);
    assert.equal(isExistingInformationOutdated(new Date(hoursAgo(2.1)), undefined, now), true);
  });
});

describe('isEquipmentStatusOutdated', () => {
  it('keeps a two hour window for facilities without a status sensor', () => {
    assert.equal(isEquipmentStatusOutdated({ stateLastUpdate: hoursAgo(3) }, now), true);
  });

  it('allows six hours for facilities whose status comes from a hardware sensor', () => {
    const properties = { statusHardwareSensorId: 'sensor-id' };
    assert.equal(isEquipmentStatusOutdated({ ...properties, stateLastUpdate: hoursAgo(5) }, now), false);
    assert.equal(isEquipmentStatusOutdated({ ...properties, stateLastUpdate: hoursAgo(7) }, now), true);
  });
});

describe('getEquipmentStatusLastUpdate', () => {
  it('prefers the status timestamp over the general update timestamp', () => {
    assert.deepEqual(
      getEquipmentStatusLastUpdate({ stateLastUpdate: hoursAgo(1), lastUpdate: hoursAgo(50) }),
      new Date(hoursAgo(1))
    );
  });

  it('falls back to the last disruption update', () => {
    assert.deepEqual(
      getEquipmentStatusLastUpdate({ lastDisruptionProperties: { lastUpdate: hoursAgo(4) } }),
      new Date(hoursAgo(4))
    );
  });

  it('returns null without any timestamp', () => {
    assert.equal(getEquipmentStatusLastUpdate({}), null);
  });
});
