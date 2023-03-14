import * as React from "react";
import includes from "lodash/includes";
import styled from "styled-components";
import { t } from "ttag";
import { EquipmentInfo, PlaceInfo } from "@sozialhelden/a11yjson";
import colors from "../../../../lib/colors";
import {
  YesNoUnknown,
  hasAccessibleToilet,
  YesNoLimitedUnknown,
} from "../../../../lib/model/ac/Feature";
import { normalizedCoordinatesForFeature } from "../../../../lib/model/ac/normalizedCoordinatesForFeature";
import {
  toiletDescription,
  accessibilityName,
  accessibilityDescription,
} from "../../../../lib/model/accessibilityStrings";
import { formatDistance } from "../../../../lib/model/formatDistance";
import { geoDistance } from "../../../../lib/model/geoDistance";
import { isWheelchairAccessible } from "../../../../lib/model/shared/isWheelchairAccessible";
import ToiletStatusNotAccessibleIcon from "../../../icons/accessibility/ToiletStatusNotAccessible";
import { PenIcon } from "../../../icons/actions";
import ToiletStatuAccessibleIcon from "../../../icons/accessibility/ToiletStatusAccessible";
import { Button, ButtonGroup, Callout, ControlGroup } from "@blueprintjs/core";
import FeatureContext from "../FeatureContext";
import {
  isOSMFeature,
  isPlaceInfo,
} from "../../../../lib/model/shared/AnyFeature";
import PanelButton from "../../PanelButton";
import { OSMTags } from "./OSMTags";

// Don't incentivize people to add toilet status to places of these categories
const placeCategoriesWithoutExtraToiletEntry = [
  "parking", // because this mostly affects parking lots
  "bus_stop",
  "tram_stop",
  "atm",
  "toilets",
  "elevator",
  "escalator",
];

const toiletIcons = {
  yes: <ToiletStatuAccessibleIcon style={{ verticalAlign: 'middle' }} />,
  no: <ToiletStatusNotAccessibleIcon style={{ verticalAlign: 'middle' }} />,
};

function ToiletDescription(accessibility: YesNoUnknown) {
  if (!accessibility) return;

  // translator: Button caption, shown in the place toolbar
  const editButtonCaption = t`Mark wheelchair accessibility of WC`;
  const description = toiletDescription(accessibility) || editButtonCaption;
  const icon = toiletIcons[accessibility] || null;
  return (
    <>
      {icon}
      {icon && <>&nbsp;</>}
      {description}
    </>
  );
}

type Props = {
  showToiletAccessibility?: boolean;
};

function NearbyToiletButton() {
  // const { feature, toiletsNearby, onOpenToiletNearby } = this.props;
  //   if (!toiletsNearby) {
  //     return;
  //   }

  //   const featureCoords = normalizedCoordinatesForFeature(feature);
  //   // for now render only the closest toilet
  //   return toiletsNearby.slice(0, 1).map((toiletFeature, i) => {
  //     const toiletCoords = normalizedCoordinatesForFeature(toiletFeature);
  //     const distanceInMeters = geoDistance(featureCoords, toiletCoords);
  //     const formattedDistance = formatDistance(distanceInMeters);
  //     const { distance, unit } = formattedDistance;
  //     const caption = t`Show next wheelchair accessible toilet`;
  //     return (
  //       <button key={i} onClick={() => onOpenToiletNearby(toiletFeature)} className="toilet-nearby">
  //         {caption}
  //         <span className="subtle distance">
  //           &nbsp;{distance}&nbsp;
  //           {unit}&nbsp;→
  //         </span>
  //       </button>
  //     );
  //   });

  return <Callout intent="warning">Nearby toilets go here.</Callout>;
}

const StyledSection = styled.section`
  display: flex;
  flex-direction: column;
  margin: 0;

  > button {
    margin: -10px;
    padding: 10px;
    border: none;
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
    svg path {
      fill: ${colors.positiveColorDarker};
      stroke: ${colors.positiveColorDarker};
    }
  }
  .accessibility-limited {
    color: ${colors.warningColorDarker};
    svg path {
      fill: ${colors.warningColorDarker};
      stroke: ${colors.warningColorDarker};
    }
  }
  .accessibility-no {
    color: ${colors.negativeColorDarker};
    svg path {
      fill: ${colors.negativeColorDarker};
      stroke: ${colors.negativeColorDarker};
    }
  }
  .accessibility-unknown {
    color: ${colors.linkColor};
    svg path {
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
`;

export default function PlaceWheelchairAndToiletAccessibilitySection(
  props: Props
) {
  const isEditingEnabled = true;
  const { showToiletAccessibility } = props;
  const feature = React.useContext(FeatureContext);
  if (!isOSMFeature(feature) && !isPlaceInfo(feature)) {
    return null;
  }
  const { properties } = feature || {};
  if (!properties) {
    return null;
  }

  const wheelchairAccessibility = isWheelchairAccessible(feature);
  const toiletAccessibility = hasAccessibleToilet(feature);

  const isKnownWheelchairAccessibility = wheelchairAccessibility !== "unknown";
  const categoryId = properties.category;
  const hasBlacklistedCategory = includes(
    placeCategoriesWithoutExtraToiletEntry,
    categoryId
  );
  const canAddToiletStatus =
    isEditingEnabled && includes(["yes", "limited"], wheelchairAccessibility);
  const isToiletButtonShown =
    (showToiletAccessibility !== false &&
      (isKnownWheelchairAccessibility &&
        !hasBlacklistedCategory &&
        canAddToiletStatus)) ||
    (toiletAccessibility === "yes" && categoryId !== "toilets");

  let osmTags: React.ReactNode | undefined = isOSMFeature(feature) && <OSMTags feature={feature} />;

  // const findToiletsNearby =
  //   toiletAccessibility !== 'yes' && toiletsNearby && toiletsNearby.length > 0;
  const hasContent =
    osmTags ||
    isKnownWheelchairAccessibility ||
    isToiletButtonShown; /*|| findToiletsNearby*/
  if (!hasContent) {
    return null;
  }

  return (
    <StyledSection>
      {isKnownWheelchairAccessibility && (
        <ControlGroup vertical>
          <ButtonGroup minimal large className={`accessibility-${toiletAccessibility}`}>
            <Button fill style={{ justifyContent: 'start' }} text={accessibilityName(wheelchairAccessibility)} />
            <Button icon="edit" />
          </ButtonGroup>
          <footer className="accessibility-description">
            {accessibilityDescription(wheelchairAccessibility)}
          </footer>
        </ControlGroup>
      )}
      {isToiletButtonShown && (
        <ButtonGroup minimal large className={`accessibility-${toiletAccessibility}`}>
          <Button fill style={{ justifyContent: 'start' }} text={ToiletDescription(toiletAccessibility)} />
          <Button icon="edit" />
        </ButtonGroup>
      )}
      {/* {findToiletsNearby && <NearbyToiletButton {...{ toiletsNearby }} />} */}
      {osmTags}
    </StyledSection>
  );
}
