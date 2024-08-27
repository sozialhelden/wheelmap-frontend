import { Entrance, EquipmentInfo, PlaceInfo } from '@sozialhelden/a11yjson';
import { IApp } from '../ac/App';
import ISource from '../ac/ISource';

export interface AccessibilityCloudTypeMapping {
  'a11yjson:EquipmentInfo': EquipmentInfo;
  'a11yjson:Entrance': Entrance;
  'a11yjson:PlaceInfo': PlaceInfo;
  'accessibilitycloud:App': IApp;
  'accessibilitycloud:Source': ISource;
}
