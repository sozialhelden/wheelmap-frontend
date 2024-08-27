import classNames from 'classnames';
import get from 'lodash/get';
import sortBy from 'lodash/sortBy';
import * as React from 'react';
import styled from 'styled-components';
import { EquipmentInfo } from '../../../lib/EquipmentInfo';
import colors from '../../../lib/util/colors';
import EquipmentItem from './EquipmentItem';

type Props = {
  equipmentInfoArrays: EquipmentInfo[][],
  onEquipmentSelected: (placeInfoId: string, equipmentInfo: EquipmentInfo) => void,
  outerClassName?: string,
  isExpanded?: boolean,
  placeInfoId: string,
  className?: string,
  children?: React.ReactNode,
};

function EquipmentList(props: Props) {
  return (
    <div className={classNames(props.outerClassName, props.className)} role="region">
      {props.children}
      {Array.from(props.equipmentInfoArrays).map((equipmentInfos) => (
        <EquipmentItem
          equipmentInfos={sortBy(equipmentInfos, 'properties.isWorking')}
          isExpanded={props.isExpanded}
          placeInfoId={props.placeInfoId}
          key={equipmentInfos.map((e) => get(e, 'properties._id')).join(',')}
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
  background-color: ${(props: Props) => (props.isExpanded ? 'transparent' : colors.negativeBackgroundColorTransparent)};
  header {
    font-weight: bold;
    color: ${colors.negativeColorDarker};
    margin: 0.5em 0;
  }
`;

export default StyledEquipmentList;
