import React, { type Ref, useEffect, useState } from "react";
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

  const { categoryProperties, reset } = useCategoryFilter();
  const category = categoryProperties?.name();

  const [searchTerm, setSearchTerm] = useState<string | undefined>(
    // make sure that if both category and search query parameters are
    // present, the category wins
    category ? "" : appState.search,
  );

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

  const resetCategoryFilter = async () => {
    if (!category) {
      return;
    }
    await reset();
  };

  const handleInputChange = async (value: string) => {
    if (category && value !== category) {
      await resetCategoryFilter();
      setSearchTerm(value);
      return;
    }
    setSearchTerm(value);
  };

  useEffect(() => {
    if (!category) {
      return;
    }
    setSearchTerm("");
  }, [category]);

  useEffect(() => {
    setAppState({ search: searchTerm });
  }, [searchTerm]);

  useEffect(() => {
    setSearchTerm(appState.search);
  }, [appState.search]);

  return (
    <SearchWrapper>
      <SearchFormField
        isDropdownOpen={isDropdownOpen}
        isOnBackground={isOnBackground}
        value={String(category || searchTerm || "")}
        onChange={handleInputChange}
        onReset={resetCategoryFilter}
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
