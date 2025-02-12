import { t } from 'ttag'
import getEquipmentInfoDescription from '../../../components/NodeToolbar/Equipment/getEquipmentInfoDescription'
import type { LocalizedString } from '../../i18n/LocalizedString'
import { getLocalizedStringTranslationWithMultipleLocales } from '../../i18n/getLocalizedStringTranslationWithMultipleLocales'
import type { ACCategory } from '../../../domains/categories/types/ACCategory'
import { getLocalizableStringForOSMKey } from '../osm/getLocalizableStringForOSMKey'
import type { AnyFeature } from './AnyFeature'
import {getLocalizableCategoryName} from "~/domains/categories/functions/localization";

export function placeNameFor(
  feature: AnyFeature,
  category: ACCategory | null,
  requestedLanguageTags: string[],
): string {
  const { properties } = feature;
  if (!properties) return "";
  let localizedString: LocalizedString | undefined;

  if (feature["@type"] === "a11yjson:EquipmentInfo") {
    localizedString = getEquipmentInfoDescription(feature, "shortDescription");
  } else if (
    feature["@type"] === "a11yjson:PlaceInfo" ||
    feature["@type"] === "ac:PlaceInfo"
  ) {
    localizedString = feature.properties.name;
  } else if (
    feature["@type"] === "a11yjson:Entrance" ||
    feature["@type"] === "ac:Entrance"
  ) {
    localizedString = feature.properties.name;
  } else if (feature["@type"] === "osm:Feature") {
    localizedString = getLocalizableStringForOSMKey(feature, "name");
  }

  if (!localizedString && category) {
    localizedString = getLocalizableCategoryName(category);
  }

  if (localizedString) {
    return getLocalizedStringTranslationWithMultipleLocales(
      localizedString,
      requestedLanguageTags,
    );
  }

  return t`Unnamed place`;
}
