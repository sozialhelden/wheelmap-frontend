// @flow

import { t } from 'c-3po';
import { currentLocales } from '../../lib/i18n';
import * as React from 'react';
import styled from 'styled-components';
import colors from '../../lib/colors';
import AccessibilityDetails from './AccessibilityDetails';
import type { EquipmentInfo } from '../../lib/EquipmentInfo';



function equipmentStatusTitle(isWorking: ?boolean, isOutdated: boolean) {
  return {
    // Translators: An equipment or facility status. The facility might be an elevator, escalator, switch, sitemap, …
    true: t`in operation`,
    // Translators: An equipment or facility status. This does not mean the facility is broken: It might just be in maintenance! The facility might be an elevator, escalator, switch, sitemap, …
    false: t`out of order`,
    // Translators: An equipment or facility status. The facility might be an elevator, escalator, switch, sitemap, …
    undefined: t`unknown status`,
  }[String(isOutdated ? undefined : isWorking)];
}

function isExistingInformationOutdated(lastUpdate: ?Date) {
  if (!lastUpdate) return false;
  const oneDayInMilliseconds = 1000 * 60 * 60 * 24;
  return new Date() - lastUpdate > oneDayInMilliseconds;
}

function lastUpdateString(
  { lastUpdate, isWorking, category, isOutdated }:
  { lastUpdate: ?Date, isWorking: ?boolean, category: ?string, isOutdated: boolean }
) {
  if (!lastUpdate) {
    // Translators: Shown next to equipment status when the system does not know a last update.
    return `Unfortunately there is no information when this status was last updated.`;
  }

  const translatedEquipmentCategory = {
    escalator: t`escalator`,
    elevator: t`elevator`,
    // Translators: An equipment or facility whose category we don't know. It might be an elevator, escalator, switch, sitemap, …
    undefined: t`facility`,
  }[String(category)];

  const now = new Date();
  const today = t`today`;
  const yesterday = t`yesterday`;
  const twoDaysInMilliseconds = 2 * 24 * 60 * 60 * 1000;
  const isShortAgo = (now - lastUpdate) < twoDaysInMilliseconds;
  const isToday = isShortAgo && lastUpdate.getDay() === now.getDay();
  const fullDateOptions = { weekday: 'long', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };

  let dateString = lastUpdate.toLocaleDateString(currentLocales, fullDateOptions);
  if (isExistingInformationOutdated(lastUpdate)) {
    const lastStatus = equipmentStatusTitle(isWorking, false);
    // Translators: Shown for equipment when the last known status information is too old.
    return t`The last thing we know is that this ${translatedEquipmentCategory} was ${lastStatus} on ${dateString}.`;
  } else {
    if (isShortAgo) {
      const timeOptions = { hour: '2-digit', minute: '2-digit' };
      dateString = `${isToday ? today : yesterday}, ${lastUpdate.toLocaleTimeString(currentLocales, timeOptions)}`;
    }
    // Translators: Shown next to equipment status.
    return t`Last update ${dateString}.`;
  }
}


function capitalizeFirstLetter(string): string {
  return string.charAt(0).toLocaleUpperCase() + string.slice(1);
}


type Props = {
  equipmentInfo: EquipmentInfo,
  className: string,
};


function EquipmentAccessibility(props: Props) {
  if (!props.equipmentInfo) return null;
  if (!props.equipmentInfo.properties) return null;

  const properties = props.equipmentInfo.properties;
  const lastUpdate = properties.lastUpdate ? new Date(properties.lastUpdate) : null;
  const isOutdated = isExistingInformationOutdated(lastUpdate);
  const category = properties.category;
  const isWorking = properties.isWorking;
  const accessibility = properties.accessibility;

  return (<summary className={`equipment-accessibility ${props.className}`}>
    <header className={`working-status working-status-${String(properties.isWorking)}`}>
      {capitalizeFirstLetter(equipmentStatusTitle(properties.isWorking, isOutdated))}
    </header>
    <footer>{lastUpdateString({ lastUpdate, isWorking, category, isOutdated })}</footer>
    {accessibility ? <AccessibilityDetails details={accessibility} /> : null}
  </summary>);
}

const StyledEquipmentAccessibility = styled(EquipmentAccessibility)`
  padding-bottom: 10px;

  > * {
    margin: 1em 0em;
  }
  > *:last-child {
    margin-bottom: inherit;
  }

  header {
    &.working-status {
      font-weight: bold;
    }
    &.working-status-true {
      color: ${colors.positiveColorDarker};
    }
    &.working-status-undefined {
      color: ${colors.warningColorDarker};
    }
    &.working-status-false {
      color: ${colors.negativeColorDarker};
    }
  }

  footer {
    color: rgba(0, 0, 0, 0.6);
  }

  > header > span {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`;

export default StyledEquipmentAccessibility;
