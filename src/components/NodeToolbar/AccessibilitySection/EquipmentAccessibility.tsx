import * as React from 'react'
import styled from 'styled-components'

import { EquipmentInfo } from '../../../lib/EquipmentInfo'
import {
  equipmentStatusTitle,
  isEquipmentAccessible, isExistingInformationOutdated, lastUpdateString,
} from '../../../lib/model/ac/EquipmentInfo'
import colors from '../../../lib/util/colors'

import AppContext from '../../../AppContext'
import { useAccessibilityAttributes } from '../../../lib/data-fetching/useAccessibilityAttributes'
import AccessibilityDetailsTree from '../../CombinedFeaturePanel/components/AccessibilitySection/PlaceAccessibility/AccessibilityDetailsTree'

function capitalizeFirstLetter(string): string {
  return string.charAt(0).toLocaleUpperCase() + string.slice(1)
}

type Props = {
  equipmentInfo: EquipmentInfo | null;
  className?: string;
};

function EquipmentAccessibility(props: Props) {
  const { properties } = props.equipmentInfo
  const lastUpdate = properties.lastUpdate
    ? new Date(properties.lastUpdate)
    : null
  const isOutdated = isExistingInformationOutdated(lastUpdate)
  const { category } = properties
  const { isWorking } = properties
  const { accessibility } = properties
  const appContext = React.useContext(AppContext)

  const { data: accessibilityAttributes, error } = useAccessibilityAttributes([
    appContext.preferredLanguage,
  ])
  if (error) {
    throw error
  }
  if (!accessibilityAttributes) {
    return null
  }

  if (!props.equipmentInfo) return null
  if (!props.equipmentInfo.properties) return null

  return (
    <div className={`equipment-accessibility ${props.className || ''}`}>
      <header
        className={`working-status working-status-${String(
          isEquipmentAccessible(properties),
        )}`}
      >
        {capitalizeFirstLetter(
          equipmentStatusTitle(properties.isWorking, isOutdated),
        )}
      </header>
      <footer>
        {lastUpdateString({
          lastUpdate, isWorking, category, isOutdated,
        })}
      </footer>
      {accessibility ? (
        <AccessibilityDetailsTree
          details={accessibility}
          accessibilityAttributes={accessibilityAttributes}
        />
      ) : null}
    </div>
  )
}

const StyledEquipmentAccessibility = styled(EquipmentAccessibility)`
  padding-bottom: 10px;

  > * {
    margin: 1em 0em;
  }
  > *:last-child {
    margin-bottom: inherit;
  }

  header {
    &.working-status {
      font-weight: bold;
    }
    &.working-status-yes {
      color: ${colors.positiveColorDarker};
    }
    &.working-status-unknown {
      color: ${colors.neutralColor};
    }
    &.working-status-no {
      color: ${colors.negativeColorDarker};
    }
  }

  footer {
    color: rgba(0, 0, 0, 0.6);
  }

  > header > span {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`

export default StyledEquipmentAccessibility
