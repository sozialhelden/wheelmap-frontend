import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { getKnownOperationalStatus } from './getKnownOperationalStatus';

const now = new Date('2026-11-16T12:00:00.000Z');
const fresh = '2026-11-16T11:00:00.000Z';
const outdated = '2026-11-15T11:00:00.000Z';

describe('getKnownOperationalStatus', () => {
  it('is working when all facilities are known to be working', () => {
    assert.equal(
      getKnownOperationalStatus(
        [
          { isWorking: true, stateLastUpdate: fresh },
          { isWorking: true, stateLastUpdate: fresh },
        ],
        now
      ),
      true
    );
  });

  it('is not working as soon as one facility is known to be out of order', () => {
    assert.equal(
      getKnownOperationalStatus(
        [
          { isWorking: true, stateLastUpdate: fresh },
          { isWorking: false, stateLastUpdate: fresh },
        ],
        now
      ),
      false
    );
  });

  it('is unknown when one facility has no current status', () => {
    assert.equal(
      getKnownOperationalStatus(
        [
          { isWorking: true, stateLastUpdate: fresh },
          { isWorking: true, stateLastUpdate: outdated },
        ],
        now
      ),
      undefined
    );
    assert.equal(
      getKnownOperationalStatus([{ isWorking: true, stateLastUpdate: fresh }, {}], now),
      undefined
    );
  });

  it('ignores an outdated disruption', () => {
    assert.equal(
      getKnownOperationalStatus([{ isWorking: false, stateLastUpdate: outdated }], now),
      undefined
    );
  });

  it('is unknown without facilities', () => {
    assert.equal(getKnownOperationalStatus([], now), undefined);
  });
});
