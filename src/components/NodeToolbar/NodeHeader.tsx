import intersperse from "intersperse";
import get from "lodash/get";
import * as React from "react";
import styled from "styled-components";
import { EquipmentInfo } from "../../lib/EquipmentInfo";
import { Feature, accessibilityCloudFeatureFrom, isWheelchairAccessible, placeNameFor } from "../../lib/Feature";

import { compact, uniq } from "lodash";
import { t } from "ttag";
import { Category, CategoryLookupTables, categoryNameFor, getCategoryId } from "../../lib/Categories";
import { isEquipmentAccessible } from "../../lib/EquipmentInfo";
import colors from "../../lib/colors";
import { translatedStringFromObject } from "../../lib/i18n";
import ChevronRight from "../ChevronRight";
import Icon from "../Icon";
import { Cluster } from "../Map/Cluster";
import { PlaceNameDiv, PlaceNameH1 } from "../PlaceName";
import BreadCrumbs from "./BreadCrumbs";
import getEquipmentInfoDescription from "./Equipment/getEquipmentInfoDescription";
import { StyledClusterIcon } from "./FeatureClusterPanel";
import PlaceInfoLink from "./PlaceInfoLink";

const StyledChevronRight = styled(ChevronRight)`
  vertical-align: -0.1rem;
  height: 0.9rem;
`;

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
`;

const StyledBreadCrumbs = styled(BreadCrumbs).attrs({ hasPadding: false })`
  margin-left: ${(props) => (props.hasPadding ? "42" : "0")}px;
  font-size: 16px;
  margin-top: 8px;
`;

const PlaceNameDetail = styled.div`
  margin-top: 0.5rem;
  color: ${colors.textMuted};
  font-size: 1rem;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  .link-button {
    padding: 0;
  }
`;

function getRoomNumberString(roomNumber: string) {
  return t`Room ${roomNumber}`;
}

type Props = {
  children?: React.ReactNode;
  feature: Feature | null;
  equipmentInfoId?: string | null;
  equipmentInfo?: EquipmentInfo | null;
  cluster?: Cluster | null;
  category: Category | null;
  categories: CategoryLookupTables;
  parentCategory: Category | null;
  hasIcon: boolean;
  onClickCurrentCluster?: (cluster: Cluster) => void;
  onClickCurrentMarkerIcon?: (feature: Feature) => void;
  showParentLink?: boolean;
  small?: boolean;
  showCategoryName?: boolean;
};

export default class NodeHeader extends React.Component<Props> {
  onClickCurrentMarkerIcon = () => {
    const feature = this.props.feature;
    if (feature && this.props.onClickCurrentMarkerIcon) {
      this.props.onClickCurrentMarkerIcon(feature);
    }
  };

  render() {
    const isEquipment = !!this.props.equipmentInfoId;
    const feature = this.props.feature;
    if (!feature) return null;
    const properties = feature.properties;
    if (!properties) return null;

    const { category, parentCategory, children } = this.props;
    const shownCategory = category || parentCategory;
    let categoryName = shownCategory && categoryNameFor(shownCategory);
    const shownCategoryId = shownCategory && getCategoryId(shownCategory);

    const acFeature = accessibilityCloudFeatureFrom(feature);
    const parentPlaceName = acFeature && translatedStringFromObject(acFeature.properties.parentPlaceInfoName);
    const parentPlaceInfoId = acFeature && acFeature.properties.parentPlaceInfoId;
    const address = acFeature?.properties.address;
    const addressObject = typeof address === "object" ? address : undefined;
    const levelName = addressObject && translatedStringFromObject(addressObject?.level);
    const roomNumber = addressObject && translatedStringFromObject(addressObject?.roomNumber);
    const roomName = addressObject && translatedStringFromObject(addressObject?.room);
    let placeName = placeNameFor(properties, shownCategory) || roomName;
    let ariaLabel = [placeName, categoryName].filter(Boolean).join(", ");
    if (isEquipment) {
      placeName = getEquipmentInfoDescription(this.props.equipmentInfo, "shortDescription") || t`Unnamed facility`;
      ariaLabel = getEquipmentInfoDescription(this.props.equipmentInfo, "longDescription");
    }
    const roomNumberString = (roomNumber !== roomName && roomNumber !== placeName && roomNumber && getRoomNumberString(roomNumber)) || undefined;
    const roomNameAndNumber = placeName === roomName ? roomNumberString : [roomName, roomNumberString && `(${roomNumberString})`].filter(Boolean).join(" ").trim();

    const accessibility = isEquipment ? isEquipmentAccessible(get(this.props, ["equipmentInfo", "properties"])) : isWheelchairAccessible(properties);
    const hasLongName = placeName && placeName.length > 50;
    const icon = <Icon accessibility={accessibility} category={shownCategoryId ? shownCategoryId : "undefined"} size={this.props.small ? "small" : "medium"} ariaHidden={true} centered onClick={this.onClickCurrentMarkerIcon} />;

    const categoryElement = properties.name ? <StyledBreadCrumbs properties={properties} category={this.props.category} categories={this.props.categories} parentCategory={this.props.parentCategory} /> : null;

    const nameElements = uniq(compact([this.props.showParentLink !== false && parentPlaceInfoId ? <PlaceInfoLink _id={parentPlaceInfoId} /> : parentPlaceName, levelName, roomNameAndNumber, placeName]));
    const lastNameElement = nameElements[nameElements.length - 1];

    const parentElements = nameElements.slice(0, nameElements.length - 1);
    const parentElementsWithChevrons = parentElements.length >= 1 ? intersperse(parentElements, <StyledChevronRight />) : parentElements;

    const NameComponent = this.props.small ? PlaceNameDiv : PlaceNameH1;
    const placeNameElement = (
      <NameComponent isSmall={hasLongName || this.props.small} aria-label={ariaLabel}>
        {this.props.hasIcon && icon}
        <div>
          <div>{lastNameElement}</div>
          {this.props.showCategoryName !== false && <div>{categoryElement}</div>}
          <PlaceNameDetail>
            {parentElements.length >= 1 && <>{t`Part of`}&nbsp;</>}
            {parentElementsWithChevrons}
          </PlaceNameDetail>
        </div>
      </NameComponent>
    );

    const { cluster, onClickCurrentCluster } = this.props;

    const clusterElement = cluster && (
      <React.Fragment>
        <StyledClusterIcon cluster={cluster} onSelectClusterIcon={() => onClickCurrentCluster(cluster)} />
        <ChevronRight style={{ marginRight: "4px" }} />
      </React.Fragment>
    );

    return (
      <StyledNodeHeader>
        {clusterElement}
        {placeNameElement}
        {children}
      </StyledNodeHeader>
    );
  }
}
