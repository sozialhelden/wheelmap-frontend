// @flow

import * as React from 'react';
import type { EquipmentInfo } from '../../../lib/EquipmentInfo'


type Props = {
  equipmentInfo: EquipmentInfo,
};


export default function EquipmentIcon(props: Props) {
  return (<li>
    {JSON.stringify(props.equipmentInfo)}
  </li>);
}
