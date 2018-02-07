// @flow

import * as React from 'react';
import sortBy from 'lodash/sortBy';
import { t } from 'c-3po';
import type { RouterHistory } from 'react-router-dom';
import EquipmentList from './EquipmentList'
import type { AccessibilityCloudFeature } from '../../../lib/Feature';
import { equipmentInfoCache } from '../../../lib/cache/EquipmentInfoCache';


type Props = {
  feature: AccessibilityCloudFeature,
  history: RouterHistory,
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

    if (equipmentInfos.length === 0) return null;

    return <div>
      <EquipmentList
        isExpanded={this.state.expanded}
        equipmentInfos={this.state.expanded ? equipmentInfos : brokenEquipmentInfos}
        history={this.props.history}
      />

      {!this.state.expanded ?
        <button
          className="link-button expand-button full-width-button"
          onClick={() => this.setState({ expanded: true })}
        >
          {t`All elevators and escalators`}
        </button> : null}
    </div>;
  }
}
