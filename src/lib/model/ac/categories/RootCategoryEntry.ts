import { EquipmentProperties, PlaceProperties } from '@sozialhelden/a11yjson';

export type RootCategoryEntry = {
  name: string;
  isSubCategory?: boolean;
  isMetaCategory?: boolean;
  filter?: (
    properties: PlaceProperties | EquipmentProperties | undefined
  ) => boolean;
};
