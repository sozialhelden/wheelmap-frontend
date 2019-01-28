// @flow

import * as React from 'react';
import includes from 'lodash/includes';
import styled from 'styled-components';
import { t } from 'ttag';
import {
  isWheelchairAccessible,
  hasAccessibleToilet,
  accessibilityName,
  accessibilityDescription,
  toiletDescription,
  isWheelmapFeature,
} from '../../../lib/Feature';
import colors from '../../../lib/colors';
import PenIcon from '../../icons/actions/PenIcon';
import type { Feature } from '../../../lib/Feature';
import { getCategoryIdFromProperties } from '../../../lib/Categories';
import type { YesNoLimitedUnknown, YesNoUnknown } from '../../../lib/Feature';
import ToiletStatusAccessibleIcon from '../../icons/accessibility/ToiletStatusAccessible';
import ToiletStatusNotAccessibleIcon from '../../icons/accessibility/ToiletStatusNotAccessible';

// Don't incentivize people to add toilet status to places of these categories
const placeCategoriesWithoutExtraToiletEntry = [
  'parking', // because this mostly affects parking lots
  'tram_stop',
  'atm',
  'toilets',
  'elevator',
  'escalator',
];

function AccessibilityName(accessibility: YesNoLimitedUnknown) {
  const description = accessibilityName(accessibility);
  switch (accessibility) {
    case 'yes':
    case 'limited':
    case 'no':
      return <span>{description}</span>;
    case 'unknown':
    default:
      return null;
  }
}

const toiletIcons = {
  yes: <ToiletStatusAccessibleIcon />,
  no: <ToiletStatusNotAccessibleIcon />,
};

function ToiletDescription(accessibility: YesNoUnknown) {
  if (!accessibility) return;

  // translator: Button caption, shown in the place toolbar
  const editButtonCaption = t`Mark wheelchair accessibility of WC`;
  const description = toiletDescription(accessibility) || editButtonCaption;
  const icon = toiletIcons[accessibility] || null;
  return (
    <React.Fragment>
      {icon}
      <span>{description}</span>
    </React.Fragment>
  );
}

type Props = {
  feature: Feature,
  onOpenWheelchairAccessibility: () => void,
  onOpenToiletAccessibility: () => void,
  className: string,
  isEditingEnabled: boolean,
};

class WheelchairAndToiletAccessibility extends React.Component<Props> {
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
    );
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
          {this.props.isEditingEnabled && <PenIcon className="pen-icon" />}
        </header>
      </button>
    );
  }

  render() {
    const { feature } = this.props;
    const { properties } = feature || {};
    if (!properties) {
      return null;
    }

    const wheelchairAccessibility = isWheelchairAccessible(properties);
    const toiletAccessibility = hasAccessibleToilet(properties);
    if (wheelchairAccessibility === 'unknown' && toiletAccessibility === 'unknown') {
      return null;
    }

    const categoryId = getCategoryIdFromProperties(properties);
    const hasBlacklistedCategory = includes(placeCategoriesWithoutExtraToiletEntry, categoryId);
    const canAddToiletStatus =
      isWheelmapFeature(feature) && includes(['yes', 'limited'], wheelchairAccessibility);
    const isToiletButtonShown = !hasBlacklistedCategory && canAddToiletStatus;

    return (
      <div className={this.props.className}>
        {this.renderWheelchairButton(wheelchairAccessibility)}
        {isToiletButtonShown && this.renderToiletButton(toiletAccessibility)}
      </div>
    );
  }
}

const StyledBasicPlaceAccessibility = styled(WheelchairAndToiletAccessibility)`
  display: flex;
  flex-direction: column;
  margin: 0;

  > button {
    margin: -10px;
    padding: 10px;
    border: none;
    outline: none;
    appearance: none;
    font-size: 1rem;
    text-align: inherit;
    background-color: transparent;
    :not(:disabled) {
      cursor: pointer;

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

  .accessibility-wheelchair,
  .accessibility-toilet {
    header {
      font-weight: bold;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
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

  .accessibility-toilet {
    svg {
      margin-right: 0.5rem;
    }
  }

  > header > span {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`;

export default StyledBasicPlaceAccessibility;
