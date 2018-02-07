// @flow

import * as React from 'react';
import type { EquipmentInfo } from '../../../lib/EquipmentInfo'
import EquipmentItem from './EquipmentItem'
import type { RouterHistory } from 'react-router-dom';
import styled from 'styled-components';
import colors from '../../../lib/colors';

type Props = {
  equipmentInfos: EquipmentInfo[],
  className: string,
  isExpanded: boolean,
  history: RouterHistory,
};


function EquipmentList(props: Props) {
  return (<div className={props.className} role="region">
    {Array
      .from(props.equipmentInfos)
      .map(equipmentInfo => <EquipmentItem
        equipmentInfo={equipmentInfo}
        isExpanded={props.isExpanded}
        key={equipmentInfo.properties && equipmentInfo.properties._id}
        history={props.history}
      />)}
  </div>);
}

export default styled(EquipmentList)`
  margin: 0.25em -1em;
  padding: 0.5em 1em;
  transition: background-color 0.3s ease-out;
  background-color: ${props => props.isExpanded ? 'transparent' : colors.negativeBackgroundColorTransparent};
`;
