import { t } from "ttag";
import { LocalizedString } from "../../i18n/LocalizedString";
import { getLocalizedStringTranslationWithMultipleLocales } from "../../i18n/getLocalizedStringTranslationWithMultipleLocales";
import { getLocalizableCategoryName } from "../ac/categories/Categories";
import { ACCategory } from "../ac/categories/ACCategory";
import { AnyFeature } from "./AnyFeature";
import getEquipmentInfoDescription from "../../../components/NodeToolbar/Equipment/getEquipmentInfoDescription";
import { getLocalizableStringForOSMKey } from "../osm/getLocalizableStringForOSMKey";

export function placeNameFor(
  feature: AnyFeature,
  category: ACCategory | null,
  requestedLanguageTags: string[]
): string {
  const properties = feature.properties;
  if (!properties) return "";
  let localizedString: LocalizedString | undefined;

  if (feature["@type"] === "a11yjson:EquipmentInfo") {
    localizedString = getEquipmentInfoDescription(feature, "shortDescription");
  } else if (feature["@type"] === "a11yjson:PlaceInfo") {
    localizedString = feature.properties.name;
  } else if (feature["@type"] === "a11yjson:Entrance") {
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
      requestedLanguageTags
    );
  }

  return t`Unnamed place`;
}
