import { EquipmentInfo, PlaceInfo } from '@sozialhelden/a11yjson'
import includes from 'lodash/includes'
import * as React from 'react'
import styled from 'styled-components'
import { t } from 'ttag'
import {
  YesNoLimitedUnknown, YesNoUnknown,
  accessibilityDescription,
  accessibilityName,
  hasAccessibleToilet,
  isWheelchairAccessible,
  normalizedCoordinatesForFeature,
  toiletDescription,
} from '../../../lib/Feature'
import colors from '../../../lib/util/colors'
import { geoDistance } from '../../../lib/util/geoDistance'
import { formatDistance } from '../../../lib/util/strings/formatDistance'
import ToiletStatusAccessibleIcon from '../../icons/accessibility/ToiletStatusAccessible'
import ToiletStatusNotAccessibleIcon from '../../icons/accessibility/ToiletStatusNotAccessible'
import PenIcon from '../../icons/actions/PenIcon'

// Don't incentivize people to add toilet status to places of these categories
const placeCategoriesWithoutExtraToiletEntry = [
  'parking', // because this mostly affects parking lots
  'bus_stop',
  'tram_stop',
  'atm',
  'toilets',
  'elevator',
  'escalator',
  'entrance',
  'subway_entrance',
]

function AccessibilityName(accessibility: YesNoLimitedUnknown) {
  const description = accessibilityName(accessibility)
  switch (accessibility) {
  case 'yes':
  case 'limited':
  case 'no':
    return <span>{description}</span>
  case 'unknown':
  default:
    return null
  }
}

const toiletIcons = {
  yes: <ToiletStatusAccessibleIcon />,
  no: <ToiletStatusNotAccessibleIcon />,
}

function ToiletDescription(accessibility: YesNoUnknown) {
  if (!accessibility) return

  // translator: Button caption, shown in the place toolbar
  const editButtonCaption = t`Mark wheelchair accessibility of WC`
  const description = toiletDescription(accessibility) || editButtonCaption
  const icon = toiletIcons[accessibility] || null
  return (
    <>
      {icon}
      {icon && <>&nbsp;</>}
      <span>{description}</span>
    </>
  )
}

type Props = {
  feature: PlaceInfo | EquipmentInfo;
  toiletsNearby: PlaceInfo[] | null;
  onOpenWheelchairAccessibility: () => void;
  onOpenToiletAccessibility: () => void;
  onOpenToiletNearby: (feature: PlaceInfo) => void;
  className?: string;
  isEditingEnabled: boolean;
};

class WheelchairAndToiletAccessibility extends React.PureComponent<Props> {
  renderWheelchairButton(wheelchairAccessibility) {
    return (
      <button
        className={`accessibility-wheelchair accessibility-${wheelchairAccessibility}`}
        onClick={this.props.onOpenWheelchairAccessibility}
        disabled={!this.props.isEditingEnabled}
      >
        <header>
          <span>{AccessibilityName(wheelchairAccessibility)}</span>
          {this.props.isEditingEnabled && <PenIcon className="pen-icon" />}
        </header>

        <footer className="accessibility-description">
          {accessibilityDescription(wheelchairAccessibility)}
        </footer>
      </button>
    )
  }

  renderToiletButton(toiletAccessibility) {
    return (
      <button
        className={`accessibility-toilet accessibility-${toiletAccessibility}`}
        onClick={this.props.onOpenToiletAccessibility}
        disabled={!this.props.isEditingEnabled}
      >
        <header>
          {ToiletDescription(toiletAccessibility)}
          {/* {this.props.isEditingEnabled && <PenIcon className="pen-icon" />} */}
        </header>
      </button>
    )
  }

  renderNearbyToilets() {
    const { feature, toiletsNearby, onOpenToiletNearby } = this.props
    if (!toiletsNearby) {
      return
    }

    const featureCoords = normalizedCoordinatesForFeature(feature)
    // for now render only the closest toilet
    return toiletsNearby.slice(0, 1).map((toiletFeature, i) => {
      const toiletCoords = normalizedCoordinatesForFeature(toiletFeature)
      const distanceInMeters = geoDistance(featureCoords, toiletCoords)
      const formattedDistance = formatDistance(distanceInMeters)
      const { distance, unit } = formattedDistance
      const caption = t`Show next wheelchair accessible toilet`
      return (
        <button key={i} onClick={() => onOpenToiletNearby(toiletFeature)} className="toilet-nearby">
          {caption}
          <span className="subtle distance">
            &nbsp;
            {distance}
&nbsp;
            {unit}
&nbsp;→
          </span>
        </button>
      )
    })
  }

  render() {
    const { feature, toiletsNearby, isEditingEnabled } = this.props
    const { properties } = feature || {}
    if (!properties) {
      return null
    }

    const wheelchairAccessibility = isWheelchairAccessible(properties)
    const toiletAccessibility = hasAccessibleToilet(properties)

    const isKnownWheelchairAccessibility = wheelchairAccessibility !== 'unknown'
    const categoryId = properties.category
    const hasBlacklistedCategory = includes(placeCategoriesWithoutExtraToiletEntry, categoryId)
    const canAddToiletStatus = isEditingEnabled && includes(['yes', 'limited'], wheelchairAccessibility)
    const isToiletButtonShown = (isKnownWheelchairAccessibility && !hasBlacklistedCategory && canAddToiletStatus)
      || (toiletAccessibility === 'yes' && categoryId !== 'toilets')

    const findToiletsNearby = toiletAccessibility !== 'yes' && toiletsNearby && toiletsNearby.length > 0
    const hasContent = isKnownWheelchairAccessibility || isToiletButtonShown /* || findToiletsNearby */
    if (!hasContent) {
      return null
    }

    return (
      <div className={this.props.className}>
        {isKnownWheelchairAccessibility && this.renderWheelchairButton(wheelchairAccessibility)}
        {isToiletButtonShown && this.renderToiletButton(toiletAccessibility)}
        {findToiletsNearby && this.renderNearbyToilets()}
      </div>
    )
  }
}

const StyledBasicPlaceAccessibility = styled(WheelchairAndToiletAccessibility)`
  display: flex;
  flex-direction: column;
  margin: 0.5rem 0;

  > button {
    margin: -10px;
    padding: 10px;
    border: none;
    outline: none;
    appearance: none;
    font-size: 1rem;
    text-align: inherit;
    background-color: transparent;
    /* Avoid jumping layout while loading */
    &.toilet-nearby {
      justify-content: space-between;
    }
    :not(:disabled) {
      cursor: pointer;
      &.toilet-nearby {
        color: ${colors.linkColor};
        font-weight: bold;
      }
      &:hover {
        &.accessibility-yes {
          background-color: ${colors.positiveBackgroundColorTransparent};
        }
        &.accessibility-limited {
          background-color: ${colors.warningBackgroundColorTransparent};
        }
        &.accessibility-no {
          background-color: ${colors.negativeBackgroundColorTransparent};
        }
        &.accessibility-unknown {
          background-color: ${colors.linkBackgroundColorTransparent};
        }
      }
    }
  }

  > button + button {
    margin-top: calc(-5px + 1rem);
  }

  > * {
    margin: 1rem 0;
  }
  > *:last-child {
    margin-bottom: 0;
  }

  header {
    :first-child {
      margin: 0;
    }
    &:not(:first-child) {
      margin: 0.25rem 0 0 0;
    }
  }

  .accessibility-wheelchair {
    header {
      justify-content: space-between;
    }
  }

  .accessibility-wheelchair,
  .accessibility-toilet {
    header {
      font-weight: bold;
      display: flex;
      flex-direction: row;
      align-items: center;
    }
  }

  .accessibility-yes {
    color: ${colors.positiveColorDarker};
    .pen-icon path {
      fill: ${colors.positiveColorDarker};
      stroke: ${colors.positiveColorDarker};
    }
  }
  .accessibility-limited {
    color: ${colors.warningColorDarker};
    .pen-icon path {
      fill: ${colors.warningColorDarker};
      stroke: ${colors.warningColorDarker};
    }
  }
  .accessibility-no {
    color: ${colors.negativeColorDarker};
    .pen-icon path {
      fill: ${colors.negativeColorDarker};
      stroke: ${colors.negativeColorDarker};
    }
  }
  .accessibility-unknown {
    color: ${colors.linkColor};
    .pen-icon path {
      fill: ${colors.linkColor};
      stroke: ${colors.linkColor};
    }
  }

  .accessibility-description {
    margin: 0.25rem 0;
    color: rgba(0, 0, 0, 0.6);
  }

  > header > span {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .toilet-nearby {
    display: flex;
    align-items: center;

    .right-arrow {
      padding: 0 10px;
    }

    &:hover {
      background-color: ${colors.linkBackgroundColorTransparent};
    }
  }
`

export default StyledBasicPlaceAccessibility
