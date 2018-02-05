// @flow

import * as React from 'react';
import type { EquipmentInfo } from '../../../lib/EquipmentInfo'
import EquipmentItem from './EquipmentItem'
import styled from 'styled-components';

type Props = {
  equipmentInfos: EquipmentInfo[],
  className: string,
};


function EquipmentList(props: Props) {
  return (<ul className={props.className}>
    {Array
      .from(props.equipmentInfos)
      .map(equipmentInfo => <EquipmentItem
        equipmentInfo={equipmentInfo}
        key={equipmentInfo.properties && equipmentInfo.properties._id}
      />)}
  </ul>);
}

export default styled(EquipmentList)`
  margin: 0.25em -1em;
  padding: 0.5em 1em;
`;
