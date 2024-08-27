import { EquipmentInfo, PlaceInfo } from '@sozialhelden/a11yjson'
import intersperse from 'intersperse'
import { compact, uniq } from 'lodash'
import get from 'lodash/get'
import * as React from 'react'
import styled from 'styled-components'
import { t } from 'ttag'
import { translatedStringFromObject } from '../../lib/i18n/translatedStringFromObject'
import { isEquipmentAccessible } from '../../lib/model/ac/EquipmentInfo'
import {
  CategoryLookupTables,
} from '../../lib/model/ac/categories/Categories'
import { isWheelchairAccessible } from '../../lib/model/accessibility/isWheelchairAccessible'
import { placeNameFor } from '../../lib/model/geo/placeNameFor'
import colors from '../../lib/util/colors'
import { Cluster } from '../MapLegacy/Cluster'
import ChevronRight from '../shared/ChevronRight'
import Icon from '../shared/Icon'
import { PlaceNameH1 } from '../shared/PlaceName'
import getEquipmentInfoDescription from './Equipment/getEquipmentInfoDescription'

const StyledChevronRight = styled(ChevronRight)`
  vertical-align: -.1rem;
  height: .9rem;
`

export const StyledNodeHeader = styled.header`
  /**
    This is necessary to make the sticky header get a shadow that extends from the whole panel's
    margin.
  */
  margin: -8px -16px 8px -16px;
  padding: 8px 16px;
  display: flex;
  align-items: flex-start;
  position: sticky;
  top: 0;
  z-index: 1;
  color: rgba(0, 0, 0, 0.8);
  background-color: ${colors.colorizedBackgroundColor};

  ${PlaceNameH1} {
    flex-grow: 2;
  }
`

const StyledBreadCrumbs = styled(BreadCrumbs).attrs({ hasPadding: false })`
  margin-left: ${(props) => (props.hasPadding ? '42' : '0')}px;
  font-size: 16px;
  margin-top: 8px;
`

const PlaceNameDetail = styled.div`
  margin-top: 0.5rem;
  color: ${colors.textMuted};
  font-size: 1rem;
`

function getRoomNumberString(roomNumber: string) {
  return t`Room ${roomNumber}`
}

type Props = {
  children?: React.ReactNode,
  feature: PlaceInfo | EquipmentInfo | null,
  equipmentInfoId?: string | null,
  equipmentInfo?: EquipmentInfo | null,
  cluster?: Cluster | null,
  category: Category | null,
  categories: CategoryLookupTables,
  parentCategory: Category | null,
  hasIcon: boolean,
  onClickCurrentCluster?: (cluster: Cluster) => void,
  onClickCurrentMarkerIcon?: (feature: PlaceInfo | EquipmentInfo) => void,
};

export default class NodeHeader extends React.Component<Props> {
  onClickCurrentMarkerIcon = () => {
    const { feature } = this.props
    if (feature && this.props.onClickCurrentMarkerIcon) {
      this.props.onClickCurrentMarkerIcon(feature)
    }
  }

  render() {
    const isEquipment = !!this.props.equipmentInfoId
    const { feature } = this.props
    if (!feature) return null
    const { properties } = feature
    if (!properties) return null

    const { category, parentCategory, children } = this.props
    const shownCategory = category || parentCategory
    const categoryName = shownCategory && getTranslatedCategoryNameFor(shownCategory)
    const shownCategoryId = shownCategory && getCategoryId(shownCategory)

    const acFeature = feature
    const parentPlaceName = acFeature && translatedStringFromObject(acFeature.properties.parentPlaceInfoName)
    const address = acFeature?.properties.address
    const addressObject = typeof address === 'object' ? address : undefined
    const levelName = addressObject && translatedStringFromObject(addressObject?.level)
    const roomNumber = addressObject && translatedStringFromObject(addressObject?.roomNumber)
    const roomName = addressObject && translatedStringFromObject(addressObject?.room)
    let placeName = placeNameFor(properties, shownCategory) || roomName
    let ariaLabel = [placeName, categoryName].filter(Boolean).join(', ')
    if (isEquipment) {
      placeName = getEquipmentInfoDescription(this.props.equipmentInfo, 'shortDescription')
      || t`Unnamed facility`
      ariaLabel = getEquipmentInfoDescription(this.props.equipmentInfo, 'longDescription')
    }
    const roomNumberString = roomNumber !== roomName && roomNumber !== placeName && roomNumber && getRoomNumberString(roomNumber) || undefined
    const roomNameAndNumber = placeName === roomName ? roomNumberString : [roomName, roomNumberString && `(${roomNumberString})`].join(' ')

    const accessibility = isEquipment
      ? isEquipmentAccessible(get(this.props, ['equipmentInfo', 'properties']))
      : isWheelchairAccessible(properties)
    const hasLongName = placeName && placeName.length > 50
    const icon = (
      <Icon
        accessibility={accessibility}
        category={shownCategoryId || 'undefined'}
        size="medium"
        ariaHidden
        centered
        onClick={this.onClickCurrentMarkerIcon}
      />
    )

    const categoryElement = properties.name ? (
      <StyledBreadCrumbs
        properties={properties}
        category={this.props.category}
        categories={this.props.categories}
        parentCategory={this.props.parentCategory}
      />
    ) : null

    const nameElements = uniq(compact([parentPlaceName, levelName, roomNameAndNumber, placeName]))
    const lastNameElement = nameElements[nameElements.length - 1]

    const parentElements = intersperse(
      nameElements.slice(0, nameElements.length - 1),
      <StyledChevronRight />,
    )

    const placeNameElement = (
      <PlaceNameH1 isSmall={hasLongName} aria-label={ariaLabel}>
        {this.props.hasIcon && icon}
        <div>
          <div>{lastNameElement}</div>
          <div>{categoryElement}</div>
          <PlaceNameDetail>{parentElements}</PlaceNameDetail>
        </div>
      </PlaceNameH1>
    )

    return (
      <StyledNodeHeader>
        {placeNameElement}
        {children}
      </StyledNodeHeader>
    )
  }
}
