// @flow

import styled from 'styled-components';
import * as React from 'react';
import queryString from 'query-string';
import type { EquipmentInfo } from '../../../lib/EquipmentInfo';
import type { RouterHistory } from 'react-router-dom';
import { getQueryParams } from '../../../lib/queryParams';
import * as equipmentIcons from '../../icons/equipment';
import colors from '../../../lib/colors';
import get from 'lodash/get';
import { t } from 'c-3po';
import { normalizeCoordinates } from '../../../lib/normalizeCoordinates';

type Props = {
  equipmentInfo: EquipmentInfo,
  className: string,
  history: RouterHistory,
};


function EquipmentItem(props: Props) {
  const equipmentInfo = props.equipmentInfo;
  const properties = equipmentInfo.properties;
  if (!properties) return null;
  const { isWorking, category, _id, placeInfoId } = properties;
  const iconName = `${category || 'elevator'}${isWorking ? 'Working' : 'Broken'}Big`;
  const EquipmentIcon = equipmentIcons[iconName] || (() => null);
  const ariaLabel = {
    elevator: t`elevator`,
    escalator: t`escalator`,
  };
  const href = (placeInfoId && _id) ? `/beta/nodes/${placeInfoId}/equipment/${_id}` : '#';

  const showOnMap = (event) => {
    const { geometry } = equipmentInfo;
    const [lat, lon] = normalizeCoordinates(geometry.coordinates);
    const params = Object.assign({}, getQueryParams(), { zoom: 19, lat, lon });
    props.history.push(`${href}#?${queryString.stringify(params)}`);
    event.preventDefault();
  };

  // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
  return (<button
    className={`link-button full-width-button ${props.className}`}
    onKeyPress={(event) => { if (event.keyCode === 13) { showOnMap(event); } }}
    onClick={showOnMap}>
    <EquipmentIcon className="icon" aria-label={ariaLabel[category] || ''} />
    <span className="name">
      {properties.description}
    </span>
  </button>);
}

const colorFunction = props => get(props, 'equipmentInfo.properties.isWorking') ? colors.textColor : colors.negativeColorDarker;
const linkColorFunction = props => get(props, 'equipmentInfo.properties.isWorking') ? colors.linkColor : colors.negativeColorDarker;
const backgroundColorFunction = props => (!props.isExpanded || get(props, 'equipmentInfo.properties.isWorking')) ? 'transparent' : colors.negativeBackgroundColorTransparent;

export default styled(EquipmentItem)`
  display: flex !important;
  flex-direction: row;
  align-items: center;

  height: 2.5em;
  margin: 0.25em -1em;
  padding: 0 1em !important;
  color: ${colorFunction};
  background-color: ${backgroundColorFunction};

  a {
    color: ${linkColorFunction} !important;
  }

  list-style-type: none;

  .icon {
    margin: -0.25em;
    margin-right: 1em;
    height: 2em;
    width: auto;
  }
`;