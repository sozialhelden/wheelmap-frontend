import { t } from "@transifex/native";

import styled from "styled-components";

import { Flex } from "@radix-ui/themes";
import type { MouseEvent, Ref } from "react";
import { forwardRef } from "react";
import { useCallback } from "react";
import { unknownCategory } from "~/domains/categories/functions/cache";
import { getLocalizedCategoryName } from "~/domains/categories/functions/localization";
import useCategory from "~/domains/categories/hooks/useCategory";
import type { ACCategory } from "~/domains/categories/types/ACCategory";
import type { EnrichedSearchResult } from "~/domains/search/types/EnrichedSearchResult";
import { isWheelchairAccessible } from "~/lib/model/accessibility/isWheelchairAccessible";
import type { AnyFeature } from "~/lib/model/geo/AnyFeature";
import { useAppStateAwareRouter } from "~/lib/util/useAppStateAwareRouter";
import { useI18nContext } from "~/modules/i18n/context/I18nContext";
import { useTranslations } from "~/modules/i18n/hooks/useTranslations";
import { AppStateLink } from "../../../components/App/AppStateLink";
import { calculateDefaultPadding } from "../../../components/Map/MapOverlapPadding";
import { useMap } from "../../../components/Map/useMap";
import Icon from "../../../components/shared/Icon";
import { mapResultToUrlObject } from "../functions/data-mapping";

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
  const { languageTag } = useI18nContext();

  if (!category || category === unknownCategory) {
    return undefined;
  }

  const categoryLabel = getLocalizedCategoryName(category);

  if (!categoryLabel) {
    return undefined;
  }

  const isCategoryLabelInPlaceName = placeName
    .toLocaleLowerCase(languageTag)
    .includes(categoryLabel.toLocaleLowerCase(languageTag));

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

  // translator: Place name shown in search results for places with unknown name / category.
  const unknownPlaceName = t("Unknown place");
  const placeName =
    (title ? useTranslations(title) : unknownPlaceName) ?? unknownPlaceName;
  const addressString = address ? useTranslations(address) : undefined;

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
    (evt: MouseEvent) => {
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

  return (
    <StyledListItem
      $isHighlighted={isHighlighted}
      ref={ref}
      {...props}
      data-testid={isHighlighted && "highlighted-search-result"}
    >
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
                <span className="category-label"> {categoryLabel}</span>
              )}
            </h3>
            {addressString ? <address>{addressString}</address> : null}
          </Flex>
        </AppStateLink>
      </Flex>
    </StyledListItem>
  );
});
