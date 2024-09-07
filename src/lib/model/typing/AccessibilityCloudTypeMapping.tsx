import { Entrance, EquipmentInfo, PlaceInfo } from '@sozialhelden/a11yjson'
import { IApp } from '../ac/App'
import ISource from '../ac/ISource'
import { MappingEvent } from '../ac/MappingEvent';

export interface AccessibilityCloudTypeMapping {
  'ac:EquipmentInfo': EquipmentInfo;
  'ac:Entrance': Entrance;
  'ac:PlaceInfo': PlaceInfo;
  'ac:App': IApp;
  'ac:MappingEvent': MappingEvent;
  'ac:Source': ISource;
}

export type AccessibilityCloudRDFType = keyof AccessibilityCloudTypeMapping;
