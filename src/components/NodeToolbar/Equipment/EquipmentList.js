// @flow

import * as React from 'react';
import type { EquipmentInfo } from '../../../lib/EquipmentInfo'
import EquipmentIcon from './EquipmentIcon'
import styled from 'styled-components';

type Props = {
  equipmentInfos: EquipmentInfo[],
};


function EquipmentList(props: Props) {
  return (<ul>
    {Array
      .from(props.equipmentInfos)
      .map(equipmentInfo => <EquipmentIcon
        equipmentInfo={equipmentInfo}
        key={equipmentInfo.properties && equipmentInfo.properties._id}
      />)}
  </ul>);
}

export default styled(EquipmentList)`
`;
