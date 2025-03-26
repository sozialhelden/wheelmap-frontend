import React, { type Ref, useEffect, useState } from "react";
import styled from "styled-components";
import { useAppStateAwareRouter } from "~/lib/util/useAppStateAwareRouter";
import { useCategoryFilter } from "~/modules/categories/contexts/CategoryFilterContext";
import { SearchDropdown } from "~/modules/search/components/SearchDropdown";
import { SearchFormField } from "~/modules/search/components/SearchFormField";
import { SearchResult } from "~/modules/search/components/SearchResult";
import { useHighlightSearchResults } from "~/modules/search/components/hooks/useHighlightSearchResults";
import { makeFeatureId } from "~/modules/search/functions/data-mapping";
import { useEnrichedSearchResults } from "~/modules/search/hooks/useEnrichedSearchResults";

const SearchWrapper = styled.div`
    position: relative;
    flex-shrink: 0;
    width: 100%;
    @media (max-width: 768px) {
        margin-bottom: var(--space-2);
    }
    @media (min-width: 769px) {
        width: var(--search-bar-width);
    }
`;

export function Search() {
  const router = useAppStateAwareRouter();
  const { categoryProperties, reset } = useCategoryFilter();
  const categoryLabel = categoryProperties?.name();

  const searchTermFromQueryParameter = Array.isArray(router.query.q)
    ? router.query.q[0]
    : router.query.q;

  const [searchTerm, setSearchTerm] = useState<string>(
    // make sure that if both category label and search query parameters are
    // present, the category label wins
    categoryLabel ? "" : searchTermFromQueryParameter,
  );

  const { searchResults, searchError, isSearching } =
    useEnrichedSearchResults(searchTerm);

  const {
    highlightNext,
    highlightPrevious,
    openHighlighted,
    searchResultsContainer,
    highlightedIndex,
  } = useHighlightSearchResults({ searchTerm, searchResults });

  const isDropdownOpen = Boolean(searchTerm);

  const handleInputChange = async (value: string) => {
    if (categoryLabel && value !== categoryLabel) {
      await reset();
      setSearchTerm(value);
      return;
    }
    setSearchTerm(value);
  };

  useEffect(() => {
    if (!categoryLabel) {
      return;
    }
    setSearchTerm("");
  }, [categoryLabel]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    router.replace({ query: { q: searchTerm } });
  }, [searchTerm]);

  return (
    <SearchWrapper>
      <SearchFormField
        isDropdownOpen={isDropdownOpen}
        value={categoryLabel || searchTerm}
        onChange={handleInputChange}
        onReset={reset}
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
            key={makeFeatureId(result)}
            feature={result}
            isHighlighted={index === highlightedIndex}
            data-highlight-index={index}
          />
        ))}
      </SearchDropdown>
    </SearchWrapper>
  );
}
