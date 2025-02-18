import { t } from "ttag";

import styled from "styled-components";

import type React from "react";
import { useCallback } from "react";
import { useCurrentLanguageTagStrings } from "../../lib/context/LanguageTagContext";
import useCategory from "../../lib/fetchers/ac/refactor-this/useCategory";
import { getLocalizedStringTranslationWithMultipleLocales } from "../../lib/i18n/getLocalizedStringTranslationWithMultipleLocales";
import type { ACCategory } from "../../lib/model/ac/categories/ACCategory";
import {
  getLocalizedCategoryName,
  unknownCategory,
} from "../../lib/model/ac/categories/Categories";
import { isWheelchairAccessible } from "../../lib/model/accessibility/isWheelchairAccessible";
import type { AnyFeature } from "../../lib/model/geo/AnyFeature";
import { cx } from "../../lib/util/cx";
import { useAppStateAwareRouter } from "../../lib/util/useAppStateAwareRouter";
import { AppStateLink } from "../App/AppStateLink";
import { calculateDefaultPadding } from "../Map/MapOverlapPadding";
import { useMap } from "../Map/useMap";
import Address from "../NodeToolbar/Address";
import Icon from "../shared/Icon";
import { PlaceNameHeader } from "../shared/PlaceName";
import {
  type EnrichedSearchResult,
  makeStyles,
  mapResultToUrlObject,
} from "./EnrichedSearchResult";

type Props = {
  className?: string;
  feature: EnrichedSearchResult;
  hidden: boolean;
};

const StyledListItem = styled.li`
    padding: 0;

    > a {
        display: block;
        font-size: 16px;
        padding: 10px;
        text-decoration: none;
        border-radius: 4px;
        cursor: pointer;
        background-color: transparent;
        border: none;
        outline: none;
        text-align: left;
        overflow: hidden;
        width: 100%;

        address {
            font-size: 16px !important;
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
        color: var(--danger-10);
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
        header {
            font-weight: 600;
        }
    }
`;

const useFeatureCategoryLabel = (
  placeName: string,
  category: ACCategory | null | undefined,
) => {
  const languageTags = useCurrentLanguageTagStrings();

  if (!category || category === unknownCategory) {
    return undefined;
  }

  const categoryLabel = getLocalizedCategoryName(category, languageTags);

  if (!categoryLabel) {
    return undefined;
  }

  const isCategoryLabelInPlaceName = placeName
    .toLocaleLowerCase(languageTags)
    .includes(categoryLabel.toLocaleLowerCase(languageTags));

  if (isCategoryLabelInPlaceName) {
    return undefined;
  }

  return categoryLabel;
};

export default function SearchResult({ feature, className, hidden }: Props) {
  const { title, address } = feature.displayData;

  const languageTags = useCurrentLanguageTagStrings();
  // translator: Place name shown in search results for places with unknown name / category.
  const unknownPlaceName = t`Unknown place`;
  const placeName =
    (title
      ? getLocalizedStringTranslationWithMultipleLocales(title, languageTags)
      : unknownPlaceName) ?? unknownPlaceName;
  const addressString = address
    ? getLocalizedStringTranslationWithMultipleLocales(address, languageTags)
    : undefined;

  const { category } = useCategory(
    feature.placeInfo,
    feature.osmFeature,
    feature.photonResult,
  );

  const categoryLabel = useFeatureCategoryLabel(placeName, category);
  const shownCategoryId = category?._id;

  const detailedFeature = (feature.placeInfo ||
    feature.osmFeature) as AnyFeature | null;
  const accessibility =
    detailedFeature && isWheelchairAccessible(detailedFeature);

  const { push } = useAppStateAwareRouter();
  const { map } = useMap();
  const clickHandler = useCallback(
    (evt: React.MouseEvent) => {
      if (evt.ctrlKey) {
        return;
      }
      evt.preventDefault();

      const { lat, lon, extent } = feature.displayData;
      const urlObject = mapResultToUrlObject(feature);

      if (extent) {
        map?.fitBounds(
          [
            [extent[0], extent[1]],
            [extent[2], extent[3]],
          ],
          {
            padding: calculateDefaultPadding(),
            maxDuration: 0,
          },
        );
      } else {
        map?.jumpTo({
          center: [lon, lat],
          zoom: 20,
          padding: calculateDefaultPadding(),
        });
      }

      if (urlObject?.pathname) {
        push(urlObject);
      }
    },
    [push, feature, map],
  );

  const classNames = cx(
    className,
    "search-result",
    hidden && "hidden",
    feature.osmFeature && "is-on-wheelmap",
    makeStyles(feature),
  );
  return (
    <StyledListItem className={classNames}>
      <AppStateLink href={mapResultToUrlObject(feature)} onClick={clickHandler}>
        <PlaceNameHeader
          className={detailedFeature ? "is-on-wheelmap" : undefined}
        >
          {shownCategoryId ? (
            <Icon
              accessibility={accessibility || undefined}
              category={shownCategoryId}
              size="medium"
            />
          ) : null}
          {placeName}
          {categoryLabel && (
            <span className="category-label">{categoryLabel}</span>
          )}
        </PlaceNameHeader>
        {addressString ? <Address>{addressString}</Address> : null}
      </AppStateLink>
    </StyledListItem>
  );
}
