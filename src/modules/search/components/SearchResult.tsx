import { Flex, Text } from "@radix-ui/themes";
import { findCategoryBySynonym } from "@sozialhelden/core";
import { forwardRef, type Ref } from "react";
import styled from "styled-components";
import { useMap } from "~/modules/map/hooks/useMap";
import type { SearchResult as SearchResultType } from "~/modules/search/types/SearchResult";

import { AppStateAwareLink } from "~/modules/app-state/components/AppStateAwareLink";
import { focusMapOnFeature, type LatLon } from "~/utils/focus-map-on-feature";

type Props = {
  result: SearchResultType;
  isHighlighted: boolean;
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

export const SearchResult = forwardRef(function SearchResult(
  {
    result: { extent, lat, lon, title, address, url, category },
    isHighlighted,
    ...props
  }: Props,
  ref: Ref<HTMLLIElement>,
) {
  const { map } = useMap();

  const categoryProperties = findCategoryBySynonym(category);
  const categoryLabel =
    category &&
    categoryProperties.id !== "unknown" &&
    categoryProperties.name();

  const openResult = async (event: MouseEvent) => {
    if (event.ctrlKey || event.metaKey) {
      return;
    }

    if (
      // making sure this runs only on the client side: `typeof document !== "undefined"`
      typeof document !== "undefined" &&
      document.activeElement instanceof HTMLElement
    ) {
      // removing the foucs from the search input when a search result is clicked. this ensures voice over reads the new
      // document title instead of repeating the search input again
      document.activeElement.blur();
    }

    // TODO: should be implemented on the place detail page level
    if (extent) {
      focusMapOnFeature(map, { extent });
    }
    if (extent) {
      focusMapOnFeature(map, { extent });
    }

    if (lat && lon) {
      focusMapOnFeature(map, { latLon: { lat, lon } as LatLon });
    }
  };

  return (
    <StyledListItem
      $isHighlighted={isHighlighted}
      ref={ref}
      {...props}
      data-testid={isHighlighted && "highlighted-search-result"}
    >
      <Flex asChild gap="2">
        <AppStateAwareLink
          href={url || "/"}
          newAppState={{ search: "" }}
          onClick={(event) => openResult(event as unknown as MouseEvent)}
        >
          <Flex align="start" direction="column" justify="center">
            <h3>
              {title}
              {categoryLabel && <Text ml="1">({categoryLabel})</Text>}
            </h3>
            {address ? <address>{address}</address> : null}
          </Flex>
        </AppStateAwareLink>
      </Flex>
    </StyledListItem>
  );
});
