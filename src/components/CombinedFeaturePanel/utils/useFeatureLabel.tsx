import { t } from "@transifex/native";
import { compact } from "lodash";
import * as React from "react";
import { getCategoryForFeature } from "~/modules/categories/utils/cache";
import { getLocalizableCategoryName } from "~/modules/categories/utils/localization";
import { useTranslations } from "~/modules/i18n/hooks/useTranslations";
import useCategory from "../../../modules/categories/hooks/useCategory";
import useAccessibilityAttributesIdMap from "../../../lib/fetchers/ac/useAccessibilityAttributesIdMap";
import { usePlaceInfo } from "../../../lib/fetchers/ac/usePlaceInfo";
import useWikidataName from "../../../lib/fetchers/wikidata/useWikidataName";
import type { AnyFeature } from "../../../lib/model/geo/AnyFeature";
import { usePlaceNameFor } from "../../../lib/model/geo/usePlaceNameFor";
import getGenericCategoryDisplayName from "../../../lib/model/osm/getFeatureCategoryDisplayName";
import useEquipmentInfoDescription from "../../NodeToolbar/Equipment/useEquipmentInfoDescription";

function getRoomNumberString(roomNumber: string) {
  return t("Room {roomNumber}", { roomNumber });
}

function getAcParentPlaceId(feature: AnyFeature) {
  if (
    feature["@type"] === "a11yjson:PlaceInfo" ||
    feature["@type"] === "ac:PlaceInfo"
  ) {
    return feature.properties.parentPlaceInfoId;
  }
  if (
    feature["@type"] === "a11yjson:EquipmentInfo" ||
    feature["@type"] === "ac:EquipmentInfo"
  ) {
    return feature.properties?.placeInfoId;
  }
  return undefined;
}

export function useFeatureLabel({
  feature,
}: {
  feature: AnyFeature;
}) {
  let categoryTagKeys: string[] = [];
  const { categorySynonymCache, category } = useCategory(feature);

  const acParentPlaceInfoId = getAcParentPlaceId(feature);
  const parentPlaceInfo = usePlaceInfo(acParentPlaceInfoId);

  const parentPlaceInfoCategory = React.useMemo(
    () =>
      categorySynonymCache.data &&
      parentPlaceInfo.data &&
      getCategoryForFeature(categorySynonymCache.data, parentPlaceInfo.data),
    [categorySynonymCache.data, parentPlaceInfo],
  );

  const acFeature =
    feature["@type"] === "a11yjson:PlaceInfo" ||
    feature["@type"] === "ac:PlaceInfo"
      ? feature
      : null;
  const osmFeature = feature["@type"] === "osm:Feature" ? feature : null;
  const parentPlaceName =
    parentPlaceInfo.data &&
    usePlaceNameFor(parentPlaceInfo.data, parentPlaceInfoCategory);

  const address = acFeature?.properties.address;
  const addressObject = typeof address === "object" ? address : undefined;
  const levelName = addressObject && useTranslations(addressObject?.levelName);
  const roomNumber =
    addressObject && useTranslations(addressObject?.roomNumber);
  const roomName = addressObject && useTranslations(addressObject?.room);
  const localizableCategoryName =
    category && getLocalizableCategoryName(category);
  let categoryName =
    localizableCategoryName && useTranslations(localizableCategoryName);

  const { map: attributesById } = useAccessibilityAttributesIdMap();

  if (
    (!category || category?._id === "unknown") &&
    feature["@type"] === "osm:Feature"
  ) {
    const { displayName, tagKeys } = getGenericCategoryDisplayName(
      feature,
      attributesById,
    );
    categoryName = displayName;
    categoryTagKeys = tagKeys;
  }

  let placeName: string | undefined;
  let ref: string | undefined;
  let localRef: string | undefined;
  let buildingName: string | undefined;
  let buildingNumber: string | undefined;
  let ariaLabel: string | undefined;

  if (
    feature["@type"] === "a11yjson:EquipmentInfo" ||
    feature["@type"] === "ac:EquipmentInfo"
  ) {
    placeName =
      useEquipmentInfoDescription(feature, "shortDescription") ||
      t("Unnamed facility");
    ariaLabel = useEquipmentInfoDescription(feature, "longDescription");
  } else if (acFeature) {
    placeName = usePlaceNameFor(acFeature, category) || roomName;
    ariaLabel = compact([placeName, categoryName]).join(", ");
  } else if (osmFeature) {
    placeName = usePlaceNameFor(osmFeature, category);
    buildingNumber = osmFeature?.properties?.["building:number"]
      ? String(osmFeature?.properties?.["building:number"])
      : undefined;
    buildingName = osmFeature?.properties?.["building:name"]
      ? String(osmFeature?.properties?.["building:name"])
      : undefined;
    ref = osmFeature?.properties?.ref
      ? String(osmFeature?.properties?.ref)
      : undefined;
    localRef = osmFeature?.properties?.local_ref
      ? String(osmFeature?.properties?.local_ref)
      : undefined;
    ariaLabel = compact([placeName, categoryName]).join(", ");
  }
  const wikidataEntityId = osmFeature?.properties?.wikidata;
  const localizedNameFromWikidata = useWikidataName(
    !placeName && wikidataEntityId,
  );
  const nameFromWikidata = useTranslations(localizedNameFromWikidata);
  placeName ||= nameFromWikidata;

  const roomNumberString =
    (roomNumber !== roomName &&
      roomNumber !== placeName &&
      roomNumber &&
      getRoomNumberString(roomNumber)) ||
    undefined;
  const roomNameAndNumber =
    placeName === roomName
      ? roomNumberString
      : [roomName, roomNumberString && `(${roomNumberString})`].join(" ");
  const hasLongName = placeName ? placeName.length > 50 : false;
  return {
    parentPlaceName,
    levelName,
    roomNameAndNumber,
    placeName,
    ref,
    localRef,
    buildingNumber,
    buildingName,
    hasLongName,
    ariaLabel,
    categoryName,
    category,
    categoryTagKeys,
  } as const;
}
