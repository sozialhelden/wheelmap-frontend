import { t } from "@transifex/native";
import { getLocalizableCategoryName } from "~/modules/categories/utils/localization";
import {
    type Translations,
    useTranslations,
} from "~/modules/i18n/hooks/useTranslations";
import useEquipmentInfoDescription from "~/needs-refactoring/lib/useEquipmentInfoDescription";
import { getLocalizableStringForOSMKey } from "../osm/getLocalizableStringForOSMKey";
import type { AnyFeature } from "./AnyFeature";
import {ACCategory} from "~/modules/categories/types/ACCategory";

export function usePlaceNameFor(
    feature: AnyFeature,
    category: ACCategory | null,
): string {
    const { properties } = feature;
    if (!properties) return "";
    let localizedString: Translations | undefined;

    if (feature["@type"] === "a11yjson:EquipmentInfo") {
        localizedString = useEquipmentInfoDescription(feature, "shortDescription");
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
        return useTranslations(localizedString) ?? "";
    }

    return t("Unnamed place");
}
