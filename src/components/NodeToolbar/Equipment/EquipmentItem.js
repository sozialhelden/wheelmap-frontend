// @flow

import styled from 'styled-components';
import * as React from 'react';
import type { EquipmentInfo } from '../../../lib/EquipmentInfo'
import * as equipmentIcons from '../../icons/equipment';
import colors from '../../../lib/colors';
import get from 'lodash/get';
import { t } from '../../../lib/i18n';


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
  const ariaLabel = {
    elevator: t`elevator`,
    escalator: t`escalator`,
  };

  return (<li className={props.className}>
    <EquipmentIcon className="icon" aria-label={ariaLabel} />
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
  margin: 0.25em -1em;
  padding: 0.25em 1em;
  color: ${props => get(props, 'equipmentInfo.properties.isWorking') ? colors.textColor : colors.negativeColorDarker};
  background-color: ${props => get(props, 'equipmentInfo.properties.isWorking') ? 'transparent' : 'rgba(246, 75, 74, 0.08)'};

  list-style-type: none;

  .icon {
    margin-right: 1em;
    height: 2em;
    width: auto;
  }
`;