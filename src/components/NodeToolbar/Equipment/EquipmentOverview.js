// @flow

import get from 'lodash/get';
import * as React from 'react';
import sortBy from 'lodash/sortBy';
import groupBy from 'lodash/groupBy';
import styled from 'styled-components';
import { t } from 'ttag';
import type { RouterHistory } from 'react-router-dom';
import EquipmentList from './EquipmentList';
import type { AccessibilityCloudFeature } from '../../../lib/Feature';
import { equipmentInfoCache } from '../../../lib/cache/EquipmentInfoCache';

type Props = {
  feature: AccessibilityCloudFeature;
  history: RouterHistory;
  className: string;
  equipmentInfoId: ?string;
};

type State = {
  expanded: boolean
};

function equipmentInfosForFeatureId(featureId: string): Set<*> {
  return equipmentInfoCache.getIndexedFeatures('properties.placeInfoId', featureId);
}

function groupEquipmentByName(equipmentInfos) {
  const groupedEquipmentInfos = groupBy(equipmentInfos, 'properties.description');
  return Object.keys(groupedEquipmentInfos).map(description => groupedEquipmentInfos[description]);
}

class EquipmentOverview extends React.Component<Props, State> {
  state = {
    expanded: false
  };

  componentWillReceiveProps(newProps: Props) {
    if (this.props.feature !== newProps.feature || newProps.equipmentInfoId !== this.props.equipmentInfoId) {
      this.setState({ expanded: false });
    }
  }

  render() {
    if (!this.props.feature) return null;
    const placeInfoId = this.props.feature._id || this.props.feature.properties._id;
    const equipmentInfoSet = equipmentInfosForFeatureId(placeInfoId);
    if (!equipmentInfoSet) return null;
    const equipmentInfos = sortBy([...equipmentInfoSet.values()], ['properties.category', 'properties.description']).filter(equipmentInfo => equipmentInfo._id !== this.props.equipmentInfoId);
    const equipmentInfoArrays = groupEquipmentByName(equipmentInfos);

    const brokenEquipmentInfoArrays = equipmentInfoArrays.filter(equipmentInfos => equipmentInfos.find(equipmentInfo => get(equipmentInfo, 'properties.isWorking') === false));
    const workingEquipmentInfoArrays = equipmentInfoArrays.filter(equipmentInfos => !equipmentInfos.find(equipmentInfo => get(equipmentInfo, 'properties.isWorking') === false));
    if (equipmentInfos.length === 0) return null;

    const hasBrokenEquipment = brokenEquipmentInfoArrays.length;
    const hasWorkingEquipment = workingEquipmentInfoArrays.length > brokenEquipmentInfoArrays.length;
    const shouldBeExpandable = equipmentInfos.length > 2 && hasWorkingEquipment && !this.state.expanded;
    const isExpanded = this.state.expanded || equipmentInfos.length <= 2;

    return <div className={this.props.className}>
      {hasBrokenEquipment ? <EquipmentList equipmentInfoArrays={brokenEquipmentInfoArrays} history={this.props.history} placeInfoId={placeInfoId}>
        <header>{t`Disruptions at this location`}</header>
      </EquipmentList> : null}

      {isExpanded ? <EquipmentList isExpanded={isExpanded} equipmentInfoArrays={workingEquipmentInfoArrays} history={this.props.history} placeInfoId={placeInfoId} /> : null}

      {shouldBeExpandable ? <button className="link-button expand-button full-width-button" onClick={() => this.setState({ expanded: true })}>
          {t`All elevators and escalators`}
        </button> : null}
    </div>;
  }
}

const StyledEquipmentOverview = styled(EquipmentOverview)`
`;

export default StyledEquipmentOverview;