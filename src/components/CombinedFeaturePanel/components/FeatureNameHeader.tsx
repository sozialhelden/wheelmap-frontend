import intersperse from 'intersperse'
import { compact, uniq } from 'lodash'
import * as React from 'react'
import styled from 'styled-components'
import { t } from 'ttag'
import { useCurrentAppToken } from '../../../lib/context/AppContext'
import { useCurrentLanguageTagStrings } from '../../../lib/context/LanguageTagContext'
import { useAccessibilityAttributesIdMap } from '../../../lib/fetchers/fetchAccessibilityAttributes'
import { usePlaceInfo } from '../../../lib/fetchers/fetchOnePlaceInfo'
import useCategory from '../../../lib/fetchers/useCategory'
import { getLocalizedStringTranslationWithMultipleLocales } from '../../../lib/i18n/getLocalizedStringTranslationWithMultipleLocales'
import {
  getCategoryForFeature,
  getLocalizableCategoryName,
  unknownCategory,
} from '../../../lib/model/ac/categories/Categories'
import { isWheelchairAccessible } from '../../../lib/model/accessibility/isWheelchairAccessible'
import { AnyFeature } from '../../../lib/model/geo/AnyFeature'
import { placeNameFor } from '../../../lib/model/geo/placeNameFor'
import getGenericCategoryDisplayName from '../../../lib/model/osm/getFeatureCategoryDisplayName'
import colors from '../../../lib/util/colors'
import getEquipmentInfoDescription from '../../NodeToolbar/Equipment/getEquipmentInfoDescription'
import ChevronRight from '../../shared/ChevronRight'
import Icon from '../../shared/Icon'
import { PlaceNameH1, PlaceNameH2 } from '../../shared/PlaceName'

const StyledChevronRight = styled(ChevronRight)`
  vertical-align: -0.1rem;
  height: 0.9rem;
`

const PlaceNameDetail = styled.div`
  &:not(:first-child) {
    margin-top: 0.5rem;
  }
  color: ${colors.textMuted};
`

function getRoomNumberString(roomNumber: string) {
  return t`Room ${roomNumber}`
}

type Props = {
  feature: AnyFeature;
  onClickCurrentMarkerIcon?: (feature: AnyFeature) => void;
  children?: React.ReactNode;
  size?: 'small' | 'medium' | 'big';
};

const StyledHeader = styled.header`
  /**
    This is necessary to make the sticky header get a shadow that extends from the whole panel's
    margin.
  */
  margin: -.5rem -1rem 1rem -1rem;
  padding: .5rem 1rem;
  line-height: 1;
  display: flex;
  gap: 1rem;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 1;
  color: rgba(0, 0, 0, 0.8);

  ${PlaceNameH1} {
    flex-grow: 2;
  }
`

export default function FeatureNameHeader(props: Props) {
  const { feature, children, onClickCurrentMarkerIcon } = props

  const handleMarkerClick = React.useCallback(() => {
    if (feature && onClickCurrentMarkerIcon) {
      onClickCurrentMarkerIcon(feature)
    }
  }, [feature, onClickCurrentMarkerIcon])

  const languageTags = useCurrentLanguageTagStrings()

  const {
    parentPlaceName,
    levelName,
    roomNameAndNumber,
    placeName,
    hasLongName,
    ariaLabel,
    categoryName,
    category,
    categoryTagKeys,
  } = useFeatureLabel({
    feature,
    languageTags,
  })

  if (!feature) return null
  const { properties } = feature
  if (!properties) return null

  const icon = (
    <Icon
      accessibility={isWheelchairAccessible(feature)}
      category={(category !== unknownCategory) && category?._id || categoryTagKeys[0] || 'undefined'}
      size={props.size || 'medium'}
      ariaHidden
      centered
      onClick={handleMarkerClick}
    />
  )

  const nameElements = uniq(
    compact([parentPlaceName?.trim(), levelName?.trim(), roomNameAndNumber?.trim(), placeName?.trim()]),
  )

  const lastNameElement = nameElements[nameElements.length - 1]
  const parentElements = intersperse(
    nameElements.slice(0, nameElements.length - 1),
    <StyledChevronRight />,
  )

  const HeaderElement = props.size === 'small' ? PlaceNameH2 : PlaceNameH1
  const detailFontSize = (props.size === 'small' || lastNameElement) ? '0.9em' : '1em'
  const categoryElement = !lastNameElement?.toLocaleLowerCase().startsWith(categoryName?.toLocaleLowerCase())
    && !lastNameElement?.toLocaleLowerCase().endsWith(categoryName?.toLocaleLowerCase())
    && (<PlaceNameDetail style={{ fontSize: detailFontSize }}>{categoryName}</PlaceNameDetail>)
  const placeNameElement = (
    <HeaderElement isSmall={hasLongName} aria-label={ariaLabel}>
      {icon}
      <div>
        {lastNameElement && <div>{lastNameElement}</div>}
        {categoryElement}
        {nameElements.length > 1 && <PlaceNameDetail style={{ fontSize: detailFontSize }}>{parentElements}</PlaceNameDetail>}
      </div>
    </HeaderElement>
  )

  return (
    <StyledHeader>
      {placeNameElement}
      {children}
    </StyledHeader>
  )
}

function useFeatureLabel({
  feature,
  languageTags,
}: {
  feature: AnyFeature;
  languageTags: string[];
}) {
  let categoryTagKeys
  const appToken = useCurrentAppToken()
  const { categorySynonymCache, category } = useCategory(feature)

  const acParentPlaceInfoId = feature['@type'] === 'a11yjson:PlaceInfo'
    ? feature.properties.parentPlaceInfoId
    : feature['@type'] === 'a11yjson:EquipmentInfo'
      ? feature.properties.placeInfoId
      : undefined
  const parentPlaceInfo = usePlaceInfo(acParentPlaceInfoId)

  const parentPlaceInfoCategory = React.useMemo(
    () => categorySynonymCache.data
      && parentPlaceInfo.data
      && getCategoryForFeature(categorySynonymCache.data, parentPlaceInfo.data),
    [categorySynonymCache.data, parentPlaceInfo],
  )

  const acFeature = feature['@type'] === 'a11yjson:PlaceInfo' ? feature : null
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
    data: attributesById,
    isValidating,
  } = useAccessibilityAttributesIdMap(languageTags, appToken)

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
  } else if (feature['@type'] === 'a11yjson:PlaceInfo') {
    placeName = placeNameFor(feature, category, languageTags) || roomName
  } else if (feature['@type'] === 'osm:Feature') {
    placeName = placeNameFor(feature, category, languageTags)
  } else {
    placeName = t`Unknown feature`
  }

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
  }
}
