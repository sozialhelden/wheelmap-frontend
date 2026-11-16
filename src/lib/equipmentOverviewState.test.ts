import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { getEquipmentOverviewState } from './equipmentOverviewState';

describe('getEquipmentOverviewState', () => {
  it('lists two facilities right away, without an expand button', () => {
    assert.deepEqual(
      getEquipmentOverviewState({ equipmentCount: 2, workingGroupCount: 2, isExpandedByUser: false }),
      { isExpanded: true, showsAllEquipmentButton: false }
    );
  });

  it('collapses longer lists behind the expand button', () => {
    assert.deepEqual(
      getEquipmentOverviewState({ equipmentCount: 3, workingGroupCount: 3, isExpandedByUser: false }),
      { isExpanded: false, showsAllEquipmentButton: true }
    );
  });

  it('hides the expand button once the user expanded the list', () => {
    assert.deepEqual(
      getEquipmentOverviewState({ equipmentCount: 5, workingGroupCount: 5, isExpandedByUser: true }),
      { isExpanded: true, showsAllEquipmentButton: false }
    );
  });

  it('hides the expand button when every facility is already listed as disrupted', () => {
    assert.deepEqual(
      getEquipmentOverviewState({ equipmentCount: 3, workingGroupCount: 0, isExpandedByUser: false }),
      { isExpanded: false, showsAllEquipmentButton: false }
    );
  });
});
