// @flow

import * as React from 'react';
import sortBy from 'lodash/sortBy';
import { t } from '../../../lib/i18n';
import EquipmentList from './EquipmentList'
import type { AccessibilityCloudFeature } from '../../../lib/Feature';
import { equipmentInfoCache } from '../../../lib/cache/EquipmentInfoCache';


type Props = {
  feature: AccessibilityCloudFeature,
};

type State = {
  expanded: boolean,
};

function equipmentInfosForFeatureId(featureId: string): Set<*> {
  return equipmentInfoCache.getIndexedFeatures('properties.placeInfoId', featureId);
}

export default class EquipmentOverview extends React.Component<Props, State> {
  state = {
    expanded: false,
  };

  render() {
    if (!this.props.feature) return null;
    const placeInfoId = this.props.feature._id || this.props.feature.properties._id;
    const equipmentInfoSet = equipmentInfosForFeatureId(placeInfoId);
    if (!equipmentInfoSet) return null;
    const equipmentInfos = sortBy([...equipmentInfoSet.values()], 'properties.description')
      .filter(e => e.properties && (e.properties.category === 'elevator' || e.properties.isWorking === false));
    const brokenEquipmentInfos = equipmentInfos.filter(e => e.properties && e.properties.isWorking === false);

    return <div>
      <EquipmentList equipmentInfos={this.state.expanded ? equipmentInfos : brokenEquipmentInfos} />
      {!this.state.expanded ?
        <button
          className="link-button expand-button full-width-button"
          onClick={() => this.setState({ expanded: true })}
        >
          {brokenEquipmentInfos.length ? t`Show all elevators` : t`Show elevators`}
        </button> : null}
    </div>;
  }
}
