// @flow

import sortBy from 'lodash/sortBy';
import * as React from 'react';
import EquipmentList from './EquipmentList'
import type { AccessibilityCloudFeature } from '../../../lib/Feature';
import { equipmentInfoCache } from '../../../lib/cache/EquipmentInfoCache';


type Props = {
  feature: AccessibilityCloudFeature,
};

function equipmentInfosForFeatureId(featureId: string): Set<*> {
  return equipmentInfoCache.getIndexedFeatures('properties.placeInfoId', featureId);
}

export default class EquipmentOverview extends React.Component<Props> {
  render() {
    if (!this.props.feature) return null;
    const placeInfoId = this.props.feature._id || this.props.feature.properties._id;
    const equipmentInfoSet = equipmentInfosForFeatureId(placeInfoId);
    if (!equipmentInfoSet) return null;
    const brokenEquipment = sortBy([...equipmentInfoSet.values()], 'properties.description')
      .filter(e => e.properties && e.properties.isWorking === false);
    return (<EquipmentList equipmentInfos={brokenEquipment} />);
  }
}
