import { EquipmentInfo } from '@sozialhelden/a11yjson';
import get from 'lodash/get';
import * as React from 'react';
import styled from 'styled-components';
import { msgid, ngettext } from 'ttag';
import colors from '../../../lib/util/colors';
import * as equipmentIcons from '../../icons/equipment';
import getHumanEnumeration from '../../shared/getHumanEnumeration';
import getEquipmentInfoDescription from './getEquipmentInfoDescription';

type Props = {
  equipmentInfos: EquipmentInfo[],
  className?: string,
  onSelected: (placeInfoId: string, equipmentInfo: EquipmentInfo) => void,
  placeInfoId: string,
  isExpanded?: boolean,
};

function EquipmentIconWrapper({
  equipmentInfo,
  count,
  isCountHidden,
}: {
  equipmentInfo: EquipmentInfo,
  count: number,
  isCountHidden: boolean,
}) {
  const { properties } = equipmentInfo;
  if (!properties) return null;
  const { _id } = properties;
  const { isWorking, category } = properties;

  const ariaLabels: { [key: string]: { [key: string]: string } } = {
    true: {
      elevator: ngettext(
        msgid`${count} elevator in service`,
        `${count} elevators in service`,
        count,
      ),
      escalator: ngettext(
        msgid`${count} escalator in service`,
        `${count} escalators in service`,
        count,
      ),
    },
    false: {
      elevator: ngettext(
        msgid`${count} elevator out of service`,
        `${count} elevators out of service`,
        count,
      ),
      escalator: ngettext(
        msgid`${count} escalator out of service`,
        `${count} escalators out of service`,
        count,
      ),
    },
    undefined: {
      elevator: ngettext(
        msgid`${count} elevator with unknown operational status`,
        `${count} elevators with unknown operational status`,
        count,
      ),
      escalator: ngettext(
        msgid`${count} escalator with unknown operational status`,
        `${count} escalators with unknown operational status`,
        count,
      ),
    },
  };
  const ariaLabel = category ? ariaLabels[String(isWorking)][category] || '' : null;

  const workingStringPart = {
    true: 'Working',
    false: 'Broken',
    undefined: 'Unknown',
  }[String(isWorking)];

  const iconName = `${category || 'elevator'}${workingStringPart}Big`;
  const EquipmentIcon = equipmentIcons[iconName] || (() => null);

  return (
    <figure
      className={isWorking ? 'is-working' : 'is-broken'}
      title={ariaLabel}
      aria-label={ariaLabel}
    >
      {!isCountHidden ? <span className="badge">{count}</span> : null}
      <EquipmentIcon key={_id} className="icon" />
    </figure>
  );
}

function EquipmentItem(props: Props) {
  const { equipmentInfos } = props;
  const firstEquipmentInfo = equipmentInfos[0];

  const longDescription = getEquipmentInfoDescription(firstEquipmentInfo, 'longDescription');
  const description = getEquipmentInfoDescription(firstEquipmentInfo, 'description');
  const shortDescription = getEquipmentInfoDescription(firstEquipmentInfo, 'shortDescription');

  const { isExpanded } = props;
  const working = equipmentInfos.filter((e) => get(e, ['properties', 'isWorking']) === true);
  const broken = equipmentInfos.filter((e) => get(e, ['properties', 'isWorking']) === false);
  const unknown = equipmentInfos.filter(
    (e) => typeof get(e, ['properties', 'isWorking']) === 'undefined',
  );
  const hasBrokenEquipment = broken.length > 0;

  const itemSelectedHandler = (
    event: React.KeyboardEvent<HTMLButtonElement> | React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.stopPropagation();
    event.preventDefault();
    props.onSelected(props.placeInfoId, equipmentInfos[0]);
  };

  // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
  return (
    <button
      className={`link-button full-width-button ${props.className || ''} ${
        isExpanded && hasBrokenEquipment ? 'has-broken-equipment' : ''
      }`}
      key={description}
      onKeyPress={(event) => {
        if (event.keyCode === 13) {
          itemSelectedHandler(event);
        }
      }}
      onClick={itemSelectedHandler}
    >
      {getHumanEnumeration(
        [working, broken, unknown]
          .map((infos, index) => {
            const count = infos.length;
            if (count) {
              const equipmentInfo = infos[0];
              return (
                <EquipmentIconWrapper
                  key={index}
                  {...{ count, isCountHidden: equipmentInfos.length === 1, equipmentInfo }}
                />
              );
            }
            return null;
          })
          .filter(Boolean),
        'and',
      )}
      <span className="name" aria-label={longDescription || description}>
        {shortDescription || description}
      </span>
    </button>
  );
}

const linkColorFunction = (props) => {
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

  .conjunction {
    position: absolute;
    top: -9999px;
    left: -9999px;
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
    border: 1px solid ${colors.borderColor || 'gray'};
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
