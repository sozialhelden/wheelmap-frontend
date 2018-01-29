// @flow

import styled from 'styled-components';
import * as React from 'react';
import type { EquipmentInfo } from '../../../lib/EquipmentInfo'
import * as equipmentIcons from '../../icons/equipment';
import colors from '../../../lib/colors';

type Props = {
  equipmentInfo: EquipmentInfo,
  className: string,
};


function EquipmentItem(props: Props) {
  const equipmentInfo = props.equipmentInfo;
  const properties = equipmentInfo.properties;
  if (!properties) return null;
  const { isWorking, category } = properties;
  const iconName = `${category || 'elevator'}${isWorking ? 'Working' : 'Broken'}Big`;
  const EquipmentIcon = equipmentIcons[iconName] || (() => null);

  return (<li className={props.className}>
    <EquipmentIcon className="icon" ariaLabel="" />
    <span className="name">
      {properties.description}
    </span>
  </li>);
}

export default styled(EquipmentItem)`
  display: flex;
  flex-direction: row;
  align-items: center;

  height: 2em;
  margin: 0.25em 0;
  color: ${colors.negativeColorDarker};

  list-style-type: none;

  .icon {
    margin-right: 1em;
    height: 2em;
    width: auto;
  }
`;