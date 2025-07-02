import React, { type Ref, useEffect } from "react";
import styled from "styled-components";
import { useAppState } from "~/modules/app-state/hooks/useAppState";
import { useCategoryFilter } from "~/modules/categories/contexts/CategoryFilterContext";
import { SearchDropdown } from "~/modules/search/components/SearchDropdown";
import { SearchFormField } from "~/modules/search/components/SearchFormField";
import { SearchResult } from "~/modules/search/components/SearchResult";
import { useHighlightSearchResults } from "~/modules/search/components/hooks/useHighlightSearchResults";
import { useSearchResults } from "~/modules/search/hooks/useSearchResults";

const SearchWrapper = styled.div`
    flex-basis: 100%;
    position: relative;
`;

export function Search({ isOnBackground }: { isOnBackground?: boolean }) {
  const { appState, setAppState } = useAppState();

  const { categoryProperties } = useCategoryFilter();
  const category = categoryProperties?.name();

  // make sure that if both category and search query parameters are
  // present, the category wins
  const searchTerm = category ? "" : appState.search;

  const { searchResults, searchError, isSearching } =
    useSearchResults(searchTerm);

  const {
    highlightNext,
    highlightPrevious,
    openHighlighted,
    searchResultsContainer,
    highlightedIndex,
  } = useHighlightSearchResults({ searchTerm, searchResults });

  const isDropdownOpen = Boolean(searchTerm);

  const handleInputChange = async (value: string) => {
    if (category && value !== category) {
      await setAppState({ category: "", search: value });
    } else {
      await setAppState({ search: value });
    }
  };

  useEffect(() => {
    if (category) {
      setAppState({ search: "" });
    }
  }, [category]);

  return (
    <SearchWrapper>
      <SearchFormField
        isDropdownOpen={isDropdownOpen}
        isOnBackground={isOnBackground}
        value={String(category || searchTerm || "")}
        onChange={handleInputChange}
        onHighlightNext={highlightNext}
        onHighlightPrevious={highlightPrevious}
        onOpenHighlighted={openHighlighted}
      />
      <SearchDropdown
        isOpen={isDropdownOpen}
        isSearching={isSearching}
        hasResults={Boolean(searchResults?.length)}
        hasError={Boolean(searchError)}
        ref={searchResultsContainer as Ref<HTMLDivElement>}
      >
        {searchResults?.map((result, index) => (
          <SearchResult
            key={result.id}
            result={result}
            isHighlighted={index === highlightedIndex}
            data-highlight-index={index}
          />
        ))}
      </SearchDropdown>
    </SearchWrapper>
  );
}
