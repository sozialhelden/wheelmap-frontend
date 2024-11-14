import intersperse from 'intersperse'
import { compact, uniq } from 'lodash'
import * as React from 'react'
import styled from 'styled-components'
import { useCurrentLanguageTagStrings } from '../../../lib/context/LanguageTagContext'
import { unknownCategory } from '../../../lib/model/ac/categories/Categories'
import { isWheelchairAccessible } from '../../../lib/model/accessibility/isWheelchairAccessible'
import { AnyFeature } from '../../../lib/model/geo/AnyFeature'
import colors from '../../../lib/util/colors'
import ChevronRight from '../../shared/ChevronRight'
import Icon from '../../shared/Icon'
import { PlaceNameH1, PlaceNameH2 } from '../../shared/PlaceName'
import { useFeatureLabel } from '../utils/useFeatureLabel'

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

type Props = {
  feature: AnyFeature;
  onClickCurrentMarkerIcon?: (feature: AnyFeature) => void;
  onHeaderClicked?: () => void;
  children?: React.ReactNode;
  size?: 'small' | 'medium' | 'big';
}

const StyledHeader = styled.header`
  line-height: 1;
  display: flex;
  gap: 1rem;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 1;
  color: rgba(0, 0, 0, 0.8);
  background-color:  ${colors.colorizedBackgroundColor};
  width: 100%;
  padding: 0 0 10px 0;

  ${PlaceNameH1} {
    flex-grow: 2;
  }
`

export default function FeatureNameHeader(props: Props) {
  const {
    feature, children, onClickCurrentMarkerIcon, onHeaderClicked,
  } = props

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
      category={((category && category !== unknownCategory) ? category._id : categoryTagKeys[0]) || 'undefined'}
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
    <StyledHeader onClick={onHeaderClicked}>
      {placeNameElement}
      {children}
    </StyledHeader>
  )
}
