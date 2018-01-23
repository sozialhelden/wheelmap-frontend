// @flow
import type { Point } from 'geojson-flow';
import type { FeatureCollection } from './Feature';
export type CategoryString = 'elevator' | 'escalator' | 'switch' | 'sitemap' | 'vending-machine' | 'intercom' | 'power-outlet';

export type EquipmentInfo = {
  type: 'Feature',
  geometry: Point,
  properties: {
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
    isRaised?: boolean,
    isBraille?: boolean,
    hasSpeech?: boolean,
    isHighContrast?: boolean,
    hasLargePrint?: boolean,
    isVoiceActivated?: boolean,
    hasHeadPhoneJack?: boolean,
    isEasyToUnderstand?: boolean,
    isWorking?: boolean,
  },
};

export type EquipmentInfoFeatureCollection = FeatureCollection<EquipmentInfo>;
