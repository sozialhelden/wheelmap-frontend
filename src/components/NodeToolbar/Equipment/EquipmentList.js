// @flow

import get from 'lodash/get';
import sortBy from 'lodash/sortBy';
import * as React from 'react';
import type { AnyReactElement } from 'react-flow-types';
import type { EquipmentInfo } from '../../../lib/EquipmentInfo';
import EquipmentItem from './EquipmentItem';
import styled from 'styled-components';
import colors from '../../../lib/colors';

type Props = {
  equipmentInfoArrays: EquipmentInfo[][],
  onEquipmentSelected: (placeInfoId: string, equipmentInfo: EquipmentInfo) => void,
  className: string,
  outerClassName: string,
  isExpanded: boolean,
  placeInfoId: string,
  children: AnyReactElement,
};

function EquipmentList(props: Props) {
  return (
    <div className={`${props.outerClassName} ${props.className}`} role="region">
      {props.children}
      {Array.from(props.equipmentInfoArrays).map(equipmentInfos => (
        <EquipmentItem
          equipmentInfos={sortBy(equipmentInfos, 'properties.isWorking')}
          isExpanded={props.isExpanded}
          placeInfoId={props.placeInfoId}
          key={equipmentInfos.map(e => get(e, '_id')).join(',')}
          onSelected={props.onEquipmentSelected}
        />
      ))}
    </div>
  );
}

const StyledEquipmentList = styled(EquipmentList)`
  margin: 0.25em -1em;
  padding: 0.5em 1em;
  transition: background-color 0.3s ease-out;
  background-color: ${props =>
    props.isExpanded ? 'transparent' : colors.negativeBackgroundColorTransparent};
  header {
    font-weight: bold;
    color: ${colors.negativeColorDarker};
    margin: 0.5em 0;
  }
`;

export default StyledEquipmentList;
