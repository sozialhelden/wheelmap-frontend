import { t } from "ttag";

import styled from "styled-components";

import { Flex } from "@radix-ui/themes";
import type React, {Ref} from "react";
import { forwardRef } from "react";
import { useCallback } from "react";
import { useCurrentLanguageTagStrings } from "~/lib/context/LanguageTagContext";
import useCategory from "~/lib/fetchers/ac/refactor-this/useCategory";
import { getLocalizedStringTranslationWithMultipleLocales } from "~/lib/i18n/getLocalizedStringTranslationWithMultipleLocales";
import type { ACCategory } from "~/lib/model/ac/categories/ACCategory";
import {
  getLocalizedCategoryName,
  unknownCategory,
} from "~/lib/model/ac/categories/Categories";
import { isWheelchairAccessible } from "~/lib/model/accessibility/isWheelchairAccessible";
import type { AnyFeature } from "~/lib/model/geo/AnyFeature";
import { useAppStateAwareRouter } from "~/lib/util/useAppStateAwareRouter";
import { AppStateLink } from "../App/AppStateLink";
import { calculateDefaultPadding } from "../Map/MapOverlapPadding";
import { useMap } from "../Map/useMap";
import Icon from "../shared/Icon";
import {
  type EnrichedSearchResult,
  mapResultToUrlObject,
} from "./EnrichedSearchResult";

type Props = {
  className?: string;
  feature: EnrichedSearchResult;
  isHighlighted?: boolean;
};

const StyledListItem = styled.li<{ $isHighlighted?: boolean }>`
  padding: 0;

  > a {
    padding: .5rem .75rem;
    text-decoration: none;
    background-color: transparent;
    color: var(--gray-12);
    border: 2px solid ${({ $isHighlighted }) => ($isHighlighted ? "var(--accent-10)" : "transparent")};

    &:hover {
      background-color: var(--accent-3);
    }

    address {
      font-size: 0.8rem;
      color: var(--gray-10);
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

export const SearchResult = forwardRef(function SearchResult(
  { feature, isHighlighted, ...props }: Props,
  ref: Ref<HTMLLIElement>,
) {
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
  const shownCategoryId = category && category._id;

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

      if (urlObject && urlObject.pathname) {
        push(urlObject);
      }
    },
    [push, feature, map],
  );

  return (
    <StyledListItem $isHighlighted={isHighlighted} ref={ref} {...props}>
      <Flex asChild gap="2">
        <AppStateLink
          href={mapResultToUrlObject(feature)}
          onClick={clickHandler}
        >
          {shownCategoryId ? (
            <Icon
              accessibility={accessibility || undefined}
              category={shownCategoryId}
              size="medium"
            />
          ) : null}
          <Flex align="start" direction="column" justify="center">
            <h3 className={detailedFeature ? "is-on-wheelmap" : undefined}>
              {placeName}
              {categoryLabel && (
                <span className="category-label">{categoryLabel}</span>
              )}
            </h3>
            {addressString ? <address>{addressString}</address> : null}
          </Flex>
        </AppStateLink>
      </Flex>
    </StyledListItem>
  );
});
