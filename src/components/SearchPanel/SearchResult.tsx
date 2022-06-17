import { t } from "ttag";
import * as React from "react";
import classNames from "classnames";

import getAddressString from "../../lib/model/getAddressString";
import { CategoryLookupTables } from "../../lib/model/Categories";
import { SearchResultFeature } from "../../lib/searchPlaces";

import Address from "../NodeToolbar/Address";
import styled from "styled-components";
import colors from "../../lib/colors";
import Link from "next/link";
import Icon from "../shared/Icon";
import { PlaceNameHeader } from "../shared/PlaceName";

type Props = {
  className?: string;
  feature: SearchResultFeature;
  categories: CategoryLookupTables;
  hidden: boolean;
};

const StyledListItem = styled.li`
  padding: 0;

  > button {
    display: block;
    font-size: 16px;
    padding: 10px;
    text-decoration: none;
    border-radius: 4px;
    cursor: pointer;
    background-color: transparent;
    border: none;
    outline: none;
    color: ${colors.linkColor};
    text-align: left;
    overflow: hidden;
    color: rgba(0, 0, 0, 0.8) !important;
    display: block;
    width: 100%;

    @media (hover), (-moz-touch-enabled: 0) {
      &:hover {
        background-color: ${colors.linkBackgroundColorTransparent};
      }
    }

    &:focus&:not(.primary-button) {
      background-color: ${colors.linkBackgroundColorTransparent};
    }

    &:disabled {
      opacity: 0.15;
    }

    &:hover {
      color: rgba(0, 0, 0, 0.8) !important;
    }

    address {
      font-size: 16px !important;
      color: rgba(0, 0, 0, 0.6);
    }
  }

  &.no-result {
    text-align: center;
    font-size: 16px;
    overflow: hidden;
    padding: 20px;
  }

  &.error-result {
    text-align: center;
    font-size: 16px;
    overflow: hidden;
    padding: 20px;
    font-weight: 400;
    background-color: ${colors.negativeBackgroundColorTransparent};
  }

  &.osm-category-place-borough,
  &.osm-category-place-suburb,
  &.osm-category-place-village,
  &.osm-category-place-hamlet,
  &.osm-category-place-town,
  &.osm-category-place-city,
  &.osm-category-place-county,
  &.osm-category-place-state,
  &.osm-category-place-country,
  &.osm-category-boundary-administrative {
    h1 {
      font-weight: 600;
    }
  }
`;

export default function SearchResult(props: Props) {
  const { feature } = props;

  const properties = feature && feature.properties;
  // translator: Place name shown in search results for places with unknown name / category.
  const placeName = properties ? properties.name : t`Unnamed`;
  const address =
    properties &&
    getAddressString({
      countryCode: properties.country,
      street: properties.street,
      house: properties.housenumber,
      postalCode: properties.postcode,
      city: properties.city,
    });

  // TODO: Show category again
  // const shownCategory = category || parentCategory;
  // const shownCategoryId = shownCategory && getCategoryId(shownCategory);
  // const wheelmapFeatureProperties = wheelmapFeature ? wheelmapFeature.properties : null;
  // const accessibility =
  //   wheelmapFeatureProperties && isWheelchairAccessible(wheelmapFeatureProperties);

  let wheelmapFeatureProperties;
  let shownCategoryId;
  let accessibility;

  const className = classNames(
    props.className,
    "search-result"
    // wheelmapFeatureProperties && 'is-on-wheelmap',
    // `osm-category-${feature.properties.osm_key || 'unknown'}-${feature.properties.osm_value ||
    //   'unknown'}`
  );
  return (
    <StyledListItem className={className}>
      <Link
        href={`/${feature.properties.osm_type}/${feature.properties.osm_id}`}
      >
        <button tabIndex={props.hidden ? -1 : 0}>
          <PlaceNameHeader
            className={wheelmapFeatureProperties ? "is-on-wheelmap" : undefined}
          >
            {shownCategoryId ? (
              <Icon
                accessibility={accessibility || null}
                category={shownCategoryId}
                size="medium"
                centered
                ariaHidden={true}
              />
            ) : null}
            {placeName}
          </PlaceNameHeader>
          {address ? <Address role="none">{address}</Address> : null}
        </button>
      </Link>
    </StyledListItem>
  );
}
