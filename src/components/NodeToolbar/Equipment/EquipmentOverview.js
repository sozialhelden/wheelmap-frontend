// @flow

import get from 'lodash/get';
import * as React from 'react';
import sortBy from 'lodash/sortBy';
import groupBy from 'lodash/groupBy';
import styled from 'styled-components';
import { t } from 'ttag';

import EquipmentList from './EquipmentList';
import type { EquipmentInfo } from '../../../lib/EquipmentInfo';

type Props = {
  equipmentInfos: { [key: string]: EquipmentInfo },
  onEquipmentSelected: (placeInfoId: string, equipmentInfo: EquipmentInfo) => void,
  placeInfoId: string,
  className: string,
  equipmentInfoId: ?string,
};

type State = {
  expanded: boolean,
};

function groupEquipmentByName(equipmentInfos) {
  const groupedEquipmentInfos = groupBy(equipmentInfos, 'properties.description');
  return Object.keys(groupedEquipmentInfos).map(description => groupedEquipmentInfos[description]);
}

class EquipmentOverview extends React.Component<Props, State> {
  state = {
    expanded: false,
  };

  render() {
    const { equipmentInfos, placeInfoId } = this.props;

    const filteredEquipmentInfos = sortBy(Object.values(equipmentInfos), [
      'properties.category',
      'properties.description',
    ]).filter(equipmentInfo => equipmentInfo._id !== this.props.equipmentInfoId);

    const equipmentInfoArrays = groupEquipmentByName(filteredEquipmentInfos);

    const brokenEquipmentInfoArrays = equipmentInfoArrays.filter(equipmentInfos =>
      equipmentInfos.find(equipmentInfo => get(equipmentInfo, 'properties.isWorking') === false)
    );
    const workingEquipmentInfoArrays = equipmentInfoArrays.filter(
      equipmentInfos =>
        !equipmentInfos.find(equipmentInfo => get(equipmentInfo, 'properties.isWorking') === false)
    );

    if (filteredEquipmentInfos.length === 0) return null;

    const hasBrokenEquipment = brokenEquipmentInfoArrays.length;
    const hasWorkingEquipment =
      workingEquipmentInfoArrays.length > brokenEquipmentInfoArrays.length;
    const shouldBeExpandable =
      filteredEquipmentInfos.length > 2 && hasWorkingEquipment && !this.state.expanded;
    const isExpanded = this.state.expanded || filteredEquipmentInfos.length <= 2;

    return (
      <div className={this.props.className}>
        {hasBrokenEquipment ? (
          <EquipmentList
            equipmentInfoArrays={brokenEquipmentInfoArrays}
            onEquipmentSelected={this.props.onEquipmentSelected}
            placeInfoId={placeInfoId}
          >
            <header>{t`Disruptions at this location`}</header>
          </EquipmentList>
        ) : null}

        {isExpanded ? (
          <EquipmentList
            isExpanded={isExpanded}
            equipmentInfoArrays={workingEquipmentInfoArrays}
            onEquipmentSelected={this.props.onEquipmentSelected}
            placeInfoId={placeInfoId}
          />
        ) : null}

        {shouldBeExpandable ? (
          <button
            className="link-button expand-button full-width-button"
            onClick={() => this.setState({ expanded: true })}
          >
            {t`All elevators and escalators`}
          </button>
        ) : null}
      </div>
    );
  }
}

const StyledEquipmentOverview = styled(EquipmentOverview)``;

export default StyledEquipmentOverview;
