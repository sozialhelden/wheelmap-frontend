import { Flex, Text } from "@radix-ui/themes";
import { type Ref, forwardRef } from "react";
import styled from "styled-components";
import { AppStateLink } from "~/components/App/AppStateLink";
import { calculateDefaultPadding } from "~/components/Map/MapOverlapPadding";
import { useMap } from "~/components/Map/useMap";
import { useCategoryString } from "~/domains/categories/hooks/useCategory";
import { useAppStateAwareRouter } from "~/lib/util/useAppStateAwareRouter";
import type { SearchResult as SearchResultType } from "~/modules/search/types/SearchResult";
import { useTranslations } from "~/modules/i18n/hooks/useTranslations";

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
  const { push } = useAppStateAwareRouter();

  const { category: acCategory } = useCategoryString(category);
  const categoryLabel = useTranslations(acCategory?.translations?._id);

  url = url || "/";

  const openResult = async (event: MouseEvent, url: string) => {
    if (event.ctrlKey || event.metaKey) {
      return;
    }
    event.preventDefault();
    await push({ pathname: url, query: { q: "" } });
    const padding = calculateDefaultPadding();

    if (extent) {
      map?.fitBounds(
        [
          [extent[0], extent[1]],
          [extent[2], extent[3]],
        ],
        {
          padding,
          speed: 3,
        },
      );
    } else if (lat && lon) {
      map?.flyTo({ center: [lon, lat], zoom: 20, padding, speed: 3 });
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
        <AppStateLink
          href={url}
          onClick={(event) => openResult(event as unknown as MouseEvent, url)}
        >
          <Flex align="start" direction="column" justify="center">
            <h3>
              {title}
              {categoryLabel && <Text ml="1">({categoryLabel})</Text>}
            </h3>
            {address ? <address>{address}</address> : null}
          </Flex>
        </AppStateLink>
      </Flex>
    </StyledListItem>
  );
});
