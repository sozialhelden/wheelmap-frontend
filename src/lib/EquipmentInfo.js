// @flow
import type { Point } from 'geojson-flow';
import type { FeatureCollection } from './Feature';
import { translatedStringFromObject } from './i18n';
import { categoryNameFor } from './Categories';

export type CategoryString = 'elevator' | 'escalator' | 'switch' | 'sitemap' | 'vending-machine' | 'intercom' | 'power-outlet';

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
