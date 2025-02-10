import { Cross1Icon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { Flex, IconButton, ScrollArea, Spinner, Theme } from "@radix-ui/themes";
import React, {
  type KeyboardEventHandler,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import styled from "styled-components";
import { t } from "ttag";
import { useMap } from "~/components/Map/useMap";
import { makeFeatureId } from "~/components/SearchPanel/EnrichedSearchResult";
import { SearchResult } from "~/components/SearchPanel/SearchResult";
import { useEnrichedSearchResults } from "~/components/SearchPanel/useEnrichedSearchResults";
import { useAppStateAwareRouter } from "~/lib/util/useAppStateAwareRouter";

const SearchWrapper = styled.div`
    position: relative;
    margin: 0 .5rem;
    flex-shrink: 0;
    @media (max-width: 1024px) {
        margin-bottom: .5rem;
    }
    @media (min-width: 1025px) {
        width: 350px;
    }
`;
const SearchFormField = styled.div<{ $isDropdownOpen: boolean }>`
  background: var(--color-panel-solid);
  border: 1px solid var(--gray-7);
  box-shadow: rgba(0,0,0,0.2) 0 .025rem .2rem;
  border-radius: var(--radius-4);
  border-bottom-right-radius: ${({ $isDropdownOpen }) => ($isDropdownOpen ? "0" : "var(--radius-4)")};
  border-bottom-left-radius: ${({ $isDropdownOpen }) => ($isDropdownOpen ? "0" : "var(--radius-4)")};
  display: flex;
  justify-content: space-between;
  align-items: center;
  outline-offset: .05rem;
  overflow: hidden;
  transition: all 300ms ease;
  outline: 2px solid transparent;
  &:hover {
    border-color: var(--gray-8);
  }
  &:focus-within {
    outline: ${({ $isDropdownOpen }) => ($isDropdownOpen ? "2px solid transparent" : "2px solid var(--accent-8)")};
  }
`;
const SearchInput = styled.input`
  border: 0;
  outline: 0;
  padding: .7rem .8rem;
  flex-basis: 100%;
  background: transparent;
`;
const IconOverlay = styled.div`
  position: absolute;
  pointer-events: none;
  top: 0;
  right: 0;
  bottom: 0;
  width: 32px;
  display: flex;
  align-items: center;
`;
const SearchDropdown = styled.div<{ $visible: boolean }>`
  position: absolute;
  background: var(--color-panel-solid);
  top: 100%;
  left: 0;
  right: 0;
  opacity: ${({ $visible }) => ($visible ? "100%" : "0%")};
  border: 1px solid var(--gray-7);
  border-top: 0;
  border-bottom-left-radius: var(--radius-4);
  border-bottom-right-radius: var(--radius-4);
  box-shadow: rgba(0,0,0,0.2) 0 .025rem .2rem;
  z-index: 20;
`;
const TrimmedScrollArea = styled(ScrollArea)`
  max-height: min(calc(100vh - 7rem), 400px);
`;
const SearchResultList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

export function SearchBar() {
  const router = useAppStateAwareRouter();

  const [input, setInput] = useState<string>();
  const [searchTerm, setSearchTerm] = useState<string>();
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout>();
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);

  const searchResultsContainer = useRef<HTMLUListElement | undefined>();

  const { map } = useMap();
  const { searchResults, searchError, isSearching } = useEnrichedSearchResults(
    searchTerm,
    map?.getCenter().lat || router.searchParams.lat,
    map?.getCenter().lng || router.searchParams.lon,
  );

  const isDropdownOpen = Boolean(input);

  const getHighlightedDomElement = () => {
    return searchResultsContainer.current?.querySelector(
      `[data-highlight-index="${highlightedIndex}"]`,
    );
  };
  const reset = () => {
    setInput("");
  };
  const highlightNext = () => {
    if (!searchResults?.length) return;
    const newIndex = Math.min(highlightedIndex + 1, searchResults.length - 1);
    setHighlightedIndex(newIndex);
  };
  const highlightPrevious = () => {
    if (!searchResults?.length) return;
    const newIndex = Math.max(highlightedIndex - 1, 0);
    setHighlightedIndex(newIndex);
  };

  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key === "ArrowDown") {
      highlightNext();
      event.preventDefault();
      return;
    }
    if (event.key === "ArrowUp") {
      highlightPrevious();
      event.preventDefault();
      return;
    }
    if (event.key === "Enter" && highlightedIndex !== -1) {
      // TODO: this is bad, please refactor
      getHighlightedDomElement()?.querySelector("a")?.click();
      return;
    }
    if (event.key === "Escape") {
      reset();
    }
  };

  useEffect(() => {
    if (debounceTimeout) clearTimeout(debounceTimeout);
    setDebounceTimeout(setTimeout(() => setSearchTerm(input), 250));
  }, [input]);

  useEffect(() => {
    setHighlightedIndex(-1);
  }, [searchTerm]);

  useEffect(() => {
    getHighlightedDomElement()?.scrollIntoView({
      block: "nearest",
    });
  }, [highlightedIndex]);

  return (
    <SearchWrapper>
      <Theme radius="medium" asChild>
        <SearchFormField $isDropdownOpen={isDropdownOpen}>
          <SearchInput
            value={input}
            onChange={(event) => setInput(event.target.value)}
            type="search"
            placeholder={t`Search for place or address`}
            onKeyDown={handleKeyDown}
          />
          {input ? (
            <Flex width="32px">
              <IconButton variant="ghost" size="3" color="gray" onClick={reset}>
                <Cross1Icon height="16" width="16" />
              </IconButton>
            </Flex>
          ) : (
            <IconOverlay>
              <MagnifyingGlassIcon height="16" width="16" />
            </IconOverlay>
          )}
        </SearchFormField>
      </Theme>
      <SearchDropdown $visible={isDropdownOpen}>
        {isSearching && (
          <Flex justify="center" align="center" p="4">
            <Spinner size="3" />
          </Flex>
        )}
        {!isSearching && !!searchResults?.length && (
          <TrimmedScrollArea scrollbars="vertical">
            <SearchResultList ref={searchResultsContainer}>
              {searchResults.map((result, index) => (
                <SearchResult
                  key={makeFeatureId(result)}
                  feature={result}
                  isHighlighted={index === highlightedIndex}
                  data-highlight-index={index}
                />
              ))}
            </SearchResultList>
          </TrimmedScrollArea>
        )}
        {!isSearching && searchResults?.length === 0 && (
          <Flex justify="center" align="center" p="4">
            {t`No results found!`}
          </Flex>
        )}
        {!isSearching && searchError && (
          <Flex justify="center" align="center" p="4">
            {t`An error occurred. Please try again later!`}
          </Flex>
        )}
      </SearchDropdown>
    </SearchWrapper>
  );
}
