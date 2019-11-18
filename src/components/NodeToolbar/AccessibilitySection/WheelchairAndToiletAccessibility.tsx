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
  normalizedCoordinatesForFeature,
} from '../../../lib/Feature';
import colors from '../../../lib/colors';
import PenIcon from '../../icons/actions/PenIcon';
import { Feature } from '../../../lib/Feature';
import { getCategoryIdFromProperties } from '../../../lib/Categories';
import { YesNoLimitedUnknown, YesNoUnknown } from '../../../lib/Feature';
import ToiletStatusAccessibleIcon from '../../icons/accessibility/ToiletStatusAccessible';
import ToiletStatusNotAccessibleIcon from '../../icons/accessibility/ToiletStatusNotAccessible';
import { geoDistance } from '../../../lib/geoDistance';
import { formatDistance } from '../../../lib/formatDistance';
import { Dots } from 'react-activity';

// Don't incentivize people to add toilet status to places of these categories
const placeCategoriesWithoutExtraToiletEntry = [
  'parking', // because this mostly affects parking lots
  'bus_stop',
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
  toiletsNearby: Feature[] | null,
  isLoadingToiletsNearby: boolean,
  onOpenWheelchairAccessibility: () => void,
  onOpenToiletAccessibility: () => void,
  onOpenToiletNearby: (feature: Feature) => void,
  className?: string,
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

  renderNearbyToilets() {
    const { feature, toiletsNearby, onOpenToiletNearby, isLoadingToiletsNearby } = this.props;
    if (!toiletsNearby) {
      return;
    }

    if (isLoadingToiletsNearby) {
      const caption = t`Searching accessible toilet`;
      return (
        <button className="toilet-nearby" disabled={true}>
          {caption}
          <span className="subtle">
            <Dots size={14} color={'rgba(0, 0, 0, 0.4)'} />
          </span>
        </button>
      );
    }

    const featureCoords = normalizedCoordinatesForFeature(feature);
    // for now render only the closest toilet
    return toiletsNearby.slice(0, 1).map((toiletFeature, i) => {
      const toiletCoords = normalizedCoordinatesForFeature(toiletFeature);
      const distanceInMeters = geoDistance(featureCoords, toiletCoords);
      const formattedDistance = formatDistance(distanceInMeters);
      const { distance, unit } = formattedDistance;
      const caption = t`Show next wheelchair accessible toilet`;
      return (
        <button key={i} onClick={() => onOpenToiletNearby(toiletFeature)} className="toilet-nearby">
          {caption}{' '}
          <span className="subtle">
            {distance}
            {unit}
          </span>
        </button>
      );
    });
  }

  render() {
    const { feature, toiletsNearby, isLoadingToiletsNearby } = this.props;
    const { properties } = feature || {};
    if (!properties) {
      return null;
    }

    const wheelchairAccessibility = isWheelchairAccessible(properties);
    const toiletAccessibility = hasAccessibleToilet(properties);

    const isKnownWheelchairAccessibility = wheelchairAccessibility !== 'unknown';
    const categoryId = getCategoryIdFromProperties(properties);
    const hasBlacklistedCategory = includes(placeCategoriesWithoutExtraToiletEntry, categoryId);
    const canAddToiletStatus =
      isWheelmapFeature(feature) && includes(['yes', 'limited'], wheelchairAccessibility);
    const isToiletButtonShown =
      (isKnownWheelchairAccessibility && !hasBlacklistedCategory && canAddToiletStatus) ||
      (toiletAccessibility === 'yes' && categoryId !== 'toilets');

    const findToiletsNearby =
      toiletAccessibility !== 'yes' &&
      toiletsNearby &&
      (isLoadingToiletsNearby || toiletsNearby.length > 0);
    const hasContent = isKnownWheelchairAccessibility || isToiletButtonShown || findToiletsNearby;
    if (!hasContent) {
      return null;
    }

    return (
      <div className={this.props.className}>
        {isKnownWheelchairAccessibility && this.renderWheelchairButton(wheelchairAccessibility)}
        {isToiletButtonShown && this.renderToiletButton(toiletAccessibility)}
        {findToiletsNearby && this.renderNearbyToilets()}
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
`;

export default StyledBasicPlaceAccessibility;
