import * as React from 'react'
import { compact } from 'lodash'
import { t } from 'ttag'
import { AnyFeature } from '../../../lib/model/geo/AnyFeature'
import useCategory from '../../../lib/fetchers/ac/refactor-this/useCategory'
import { usePlaceInfo } from '../../../lib/fetchers/ac/usePlaceInfo'
import { getCategoryForFeature, getLocalizableCategoryName } from '../../../lib/model/ac/categories/Categories'
import { placeNameFor } from '../../../lib/model/geo/placeNameFor'
import {
  getLocalizedStringTranslationWithMultipleLocales,
} from '../../../lib/i18n/getLocalizedStringTranslationWithMultipleLocales'
import useAccessibilityAttributesIdMap from '../../../lib/fetchers/ac/useAccessibilityAttributesIdMap'
import getGenericCategoryDisplayName from '../../../lib/model/osm/getFeatureCategoryDisplayName'
import getEquipmentInfoDescription from '../../NodeToolbar/Equipment/getEquipmentInfoDescription'
import useWikidataName from '../../../lib/fetchers/wikidata/useWikidataName'

function getRoomNumberString(roomNumber: string) {
  return t`Room ${roomNumber}`
}

export function useFeatureLabel({
  feature,
  languageTags,
}: {
  feature: AnyFeature;
  languageTags: string[];
}) {
  let categoryTagKeys: string[] = []
  const { categorySynonymCache, category } = useCategory(feature)

  const acParentPlaceInfoId = feature['@type'] === 'a11yjson:PlaceInfo' || feature['@type'] === 'ac:PlaceInfo'
    ? feature.properties.parentPlaceInfoId
    : feature['@type'] === 'a11yjson:EquipmentInfo' || feature['@type'] === 'ac:EquipmentInfo'
      ? feature.properties.placeInfoId
      : undefined
  const parentPlaceInfo = usePlaceInfo(acParentPlaceInfoId)

  const parentPlaceInfoCategory = React.useMemo(
    () => categorySynonymCache.data
      && parentPlaceInfo.data
      && getCategoryForFeature(categorySynonymCache.data, parentPlaceInfo.data),
    [categorySynonymCache.data, parentPlaceInfo],
  )

  const acFeature = feature['@type'] === 'a11yjson:PlaceInfo' || feature['@type'] === 'ac:PlaceInfo' ? feature : null
  const osmFeature = feature['@type'] === 'osm:Feature' ? feature : null
  const parentPlaceName = parentPlaceInfo.data
    && placeNameFor(parentPlaceInfo.data, parentPlaceInfoCategory, languageTags)
  acFeature
  && getLocalizedStringTranslationWithMultipleLocales(
    acFeature.properties.parentPlaceInfoName,
    languageTags,
  )
  const address = acFeature?.properties.address
  const addressObject = typeof address === 'object' ? address : undefined
  const levelName = addressObject
    && getLocalizedStringTranslationWithMultipleLocales(
      addressObject?.levelName,
      languageTags,
    )
  const roomNumber = addressObject
    && getLocalizedStringTranslationWithMultipleLocales(
      addressObject?.roomNumber,
      languageTags,
    )
  const roomName = addressObject
    && getLocalizedStringTranslationWithMultipleLocales(
      addressObject?.room,
      languageTags,
    )
  const localizableCategoryName = category && getLocalizableCategoryName(category)
  let categoryName = localizableCategoryName
    && getLocalizedStringTranslationWithMultipleLocales(
      localizableCategoryName,
      languageTags,
    )

  const {
    map: attributesById,
    isValidating,
  } = useAccessibilityAttributesIdMap(languageTags)

  if ((!category || category?._id === 'unknown') && feature['@type'] === 'osm:Feature') {
    const { displayName, tagKeys } = getGenericCategoryDisplayName(feature, attributesById, languageTags)
    categoryName = displayName
    categoryTagKeys = tagKeys
  }

  let placeName: string | undefined
  let ariaLabel = compact([placeName, categoryName]).join(', ')

  if (feature['@type'] === 'a11yjson:EquipmentInfo') {
    placeName = getEquipmentInfoDescription(feature, 'shortDescription')
      || t`Unnamed facility`
    ariaLabel = getEquipmentInfoDescription(feature, 'longDescription')
  } else if (acFeature) {
    placeName = placeNameFor(acFeature, category, languageTags) || roomName
  } else if (osmFeature) {
    placeName = placeNameFor(osmFeature, category, languageTags)
  }
  const wikidataEntityId = osmFeature?.properties?.wikidata
  const localizedNameFromWikidata = useWikidataName(!placeName && wikidataEntityId)
  const nameFromWikidata = getLocalizedStringTranslationWithMultipleLocales(
    localizedNameFromWikidata,
    languageTags,
  )
  placeName ||= nameFromWikidata

  const roomNumberString = (roomNumber !== roomName
      && roomNumber !== placeName
      && roomNumber
      && getRoomNumberString(roomNumber))
    || undefined
  const roomNameAndNumber = placeName === roomName
    ? roomNumberString
    : [roomName, roomNumberString && `(${roomNumberString})`].join(' ')
  const hasLongName = placeName && placeName.length > 50
  return {
    parentPlaceName,
    levelName,
    roomNameAndNumber,
    placeName,
    hasLongName,
    ariaLabel,
    categoryName,
    category,
    categoryTagKeys,
  } as const
}
