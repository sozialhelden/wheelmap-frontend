// @flow
import { t } from 'c-3po';
import type { Point } from 'geojson-flow';
import type { FeatureCollection, YesNoLimitedUnknown } from './Feature';
import { categoryNameFor } from './Categories';
import { currentLocales, translatedStringFromObject } from './i18n';

export type CategoryString = 'elevator' | 'escalator' | 'switch' | 'sitemap' | 'vending-machine' | 'intercom' | 'power-outlet';
export const CategoryStrings: CategoryString[] = [
  'elevator',
  'escalator',
  'switch',
  'sitemap',
  'vending-machine',
  'intercom',
  'power-outlet',
];

export type DisruptionProperties = {
  originalId?: string,
  originalEquipmentInfoId?: string,
  originalEquipmentInfoIdField?: string,
  equipmentInfoId?: string,
  originalPlaceInfoId?: string,
  originalPlaceInfoIdField?: string,
  placeInfoId?: string,
  sourceId?: string,
  sourceImportId?: string,
  category?: 'elevator' | 'escalator' | 'switch' | 'sitemap' | 'vending-machine' | 'intercom' | 'power-outlet',
  isEquipmentWorking?: boolean,
  stateExplanation?: string,
  outOfOrderReason?: string,
  alternativeRouteInstructions?: string,
  startDate?: string,
  plannedCompletionDate?: string,
  lastUpdate?: string,
};

export type EquipmentInfoProperties = {
  _id?: string,
  originalId?: string,
  originalPlaceInfoId?: string,
  disruptionSourceImportId?: string,
  originalData?: string,
  placeInfoId?: string,
  sourceId?: string,
  sourceImportId?: string,
  category?: CategoryString,
  description?: string,
  shortDescription?: string,
  longDescription?: string,
  accessibility: {
    hasRaisedText?: boolean,
    isBraille?: boolean,
    hasSpeech?: boolean,
    isHighContrast?: boolean,
    hasLargePrint?: boolean,
    isVoiceActivated?: boolean,
    hasHeadPhoneJack?: boolean,
    isEasyToUnderstand?: boolean,
    hasDoorsInBothDirections?: boolean,
    heightOfControls?: number,
    doorWidth?: number,
    cabinWidth?: number,
    cabinLength?: number,
  },
  isWorking?: boolean,
  lastUpdate?: string,
  lastDisruptionProperties?: DisruptionProperties,
};

export type EquipmentInfo = {
  type: 'Feature',
  geometry: Point,
  _id?: string,
  properties: EquipmentInfoProperties,
};

export type EquipmentInfoFeatureCollection = FeatureCollection<EquipmentInfo>;

export function equipmentInfoNameFor(properties: EquipmentProperties, isAriaLabel: boolean): string {
  const unknownName = t`Unnamed facility`;
  if (!properties) return unknownName;
  let description = properties.description;
  if (isAriaLabel) {
    description = properties.longDescription || description;
  } else {
    description = properties.shortDescription || description;
  }
  return (translatedStringFromObject(description)) || categoryNameFor(properties.category) || unknownName;
}


export function equipmentStatusTitle(isWorking: ?boolean, isOutdated: boolean) {
  return {
    // Translators: An equipment or facility status. The facility might be an elevator, escalator, switch, sitemap, …
    true: t`in operation`,
    // Translators: An equipment or facility status. This does not mean the facility is broken: It might just be in maintenance! The facility might be an elevator, escalator, switch, sitemap, …
    false: t`out of order`,
    // Translators: An equipment or facility status. The facility might be an elevator, escalator, switch, sitemap, …
    undefined: t`unknown status`,
  }[String(isOutdated ? undefined : isWorking)];
}

export function isExistingInformationOutdated(lastUpdate: ?Date) {
  if (!lastUpdate) return false;
  const twoHoursInMilliseconds = 1000 * 60 * 60 * 2;
  return new Date() - lastUpdate > twoHoursInMilliseconds;
}

export function isEquipmentAccessible(properties: ?EquipmentInfoProperties): ?YesNoLimitedUnknown {
  if (!properties) {
    return null;
  }

  const lastUpdate = properties.lastUpdate ? new Date(properties.lastUpdate) : null;
  const isOutdated = isExistingInformationOutdated(lastUpdate);
  return {
    true: 'yes',
    false: 'no',
    undefined: 'unknown',
  }[String(isOutdated ? undefined : properties.isWorking)];
}


export function lastUpdateString(
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
  if (isExistingInformationOutdated(lastUpdate) && typeof isWorking !== 'undefined') {
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