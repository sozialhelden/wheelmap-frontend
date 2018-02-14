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
  equipmentInfos: EquipmentInfo[],
  className: string,
  history: RouterHistory,
  placeInfoId: string,
  isExpanded: boolean,
};

function EquipmentIconWrapper(
  { history, equipmentInfo, count, isCountHidden } :
  { history: RouterHistory, equipmentInfo: EquipmentInfo, count: number, isCountHidden: boolean }
) {
  const properties = equipmentInfo.properties;
  const _id = equipmentInfo._id;
  if (!properties) return null;
  const { isWorking, category } = properties;

  const ariaLabel: { [string]: string } = {
    elevator: t`elevator`,
    escalator: t`escalator`,
  };

  const iconName = `${category || 'elevator'}${isWorking ? 'Working' : 'Broken'}Big`;
  const EquipmentIcon = equipmentIcons[iconName] || (() => null);

  return (<figure className={isWorking ? 'is-working' : 'is-broken'}>
    { !isCountHidden ? <span className="badge">{count}</span> : null }
    <EquipmentIcon
      key={_id}
      className="icon"
      aria-label={category ? (ariaLabel[category] || '') : null}
    />
  </figure>);
}

function EquipmentItem(props: Props) {
  const equipmentInfos = props.equipmentInfos;
  const description = get(equipmentInfos[0], ['properties', 'description']);
  const shortDescription = get(equipmentInfos[0], ['properties', 'shortDescription']);
  const { history, isExpanded } = props;
  const _ids = equipmentInfos.map(e => get(e, '_id')).sort();
  const working = equipmentInfos.filter(e => get(e, ['properties', 'isWorking']) === true);
  const broken = equipmentInfos.filter(e => get(e, ['properties', 'isWorking']) === false);
  const hasBrokenEquipment = broken.length > 0;
  const isCountHidden = working.length + broken.length <= 2;

  const href = (props.placeInfoId && _ids) ? `/beta/nodes/${props.placeInfoId}/equipment/${_ids[0]}` : '#';

  const showOnMap = (event) => {
    const { geometry } = equipmentInfos[0];
    const [lat, lon] = normalizeCoordinates(geometry.coordinates);
    const params = Object.assign({}, getQueryParams(), { zoom: 19, lat, lon });
    history.push(`${href}#?${queryString.stringify(params)}`);
    event.preventDefault();
  };

  // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
  return (<button
    className={`link-button full-width-button ${props.className} ${(isExpanded && hasBrokenEquipment) ? 'has-broken-equipment' : ''}`}
    key={description}
    onKeyPress={(event) => { if (event.keyCode === 13) { showOnMap(event); } }}
    onClick={showOnMap}
  >
    {[working, broken].map((infos, index) => {
      const count = infos.length;
      if (count) {
        const equipmentInfo = infos[0];
        return <EquipmentIconWrapper key={index} {...{ count, isCountHidden, history, equipmentInfo }} />
      }
      return null;
    }).filter(Boolean)}
    <span className="name" aria-label={description}>{shortDescription}</span>
  </button>);
}


const linkColorFunction = props => {
  if (get(props, 'equipmentInfo.properties.isWorking')) return colors.linkColor;
  return colors.negativeColorDarker;
};


const StyledEquipmentItem = styled(EquipmentItem)`
  display: flex !important;
  flex-direction: row;
  align-items: center;

  min-height: 2.5em;
  margin: 0.25em -1em;
  padding: 0 0.5em !important;
  color: ${colors.textColor};
  background-color: transparent;
  &.has-broken-equipment {
    color: ${colors.negativeColorDarker};
    background-color: ${colors.negativeBackgroundColorTransparent};
  }

  a {
    color: ${linkColorFunction} !important;
  }

  list-style-type: none;

  .icon {
    margin: -0.25em;
    height: 2em;
    width: auto;
  }

  figure {
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: row;
    margin-right: 0.25em;
    &:last-of-type {
      margin-right: 0.75em;
    }
    border: 1px solid rgba(0, 0, 0, 0.2);
    background-color: rgba(255, 255, 255, 0.6);
    border-radius: 0.2rem;
    padding: 0.25rem;
    .badge {
      display: inline-block;
      font-size: 1rem;
      line-height: 1rem;
      padding: 0.25rem;
      color: ${colors.textColor};
      opacity: 0.75;
      font-weight: 600;
    }
    &.is-broken {
      .badge {
        /* color: ${colors.negativeColorDarker}; */
      }
    }
  }
`;

export default StyledEquipmentItem;
