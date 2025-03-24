import { Flex } from "@radix-ui/themes";
import { type Ref, forwardRef } from "react";
import styled from "styled-components";
import { AppStateLink } from "~/components/App/AppStateLink";
import { calculateDefaultPadding } from "~/components/Map/MapOverlapPadding";
import { useMap } from "~/components/Map/useMap";
import type { SearchResult as SearchResultType } from "~/domains/search/types/SearchResult";
import { useAppStateAwareRouter } from "~/lib/util/useAppStateAwareRouter";

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
    result: { extent, lat, lon, title, address, url },
    isHighlighted,
    ...props
  }: Props,
  ref: Ref<HTMLLIElement>,
) {
  const { map } = useMap();
  const { push } = useAppStateAwareRouter();

  url = url || "/";

  const openResult = async (event: MouseEvent, url: string) => {
    if (event.ctrlKey || event.metaKey) {
      return;
    }
    const padding = calculateDefaultPadding();
    event.preventDefault();
    if (extent) {
      map?.fitBounds(
        [
          [extent[0], extent[1]],
          [extent[2], extent[3]],
        ],
        {
          padding,
          maxDuration: 0,
        },
      );
    } else if (lat && lon) {
      map?.flyTo({ center: [lon, lat], zoom: 20, padding });
    }
    await push({ pathname: url, query: { q: "" } });
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
            <h3>{title}</h3>
            {address ? <address>{address}</address> : null}
          </Flex>
        </AppStateLink>
      </Flex>
    </StyledListItem>
  );
});
