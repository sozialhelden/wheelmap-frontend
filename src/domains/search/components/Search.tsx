import React, { type Ref, useEffect, useState } from "react";
import styled from "styled-components";
import { type Category, categories } from "~/domains/categories/categories";
import { SearchDropdown } from "~/domains/search/components/SearchDropdown";
import { SearchFormField } from "~/domains/search/components/SearchFormField";
import { SearchResult } from "~/domains/search/components/SearchResult";
import { useHighlightSearchResults } from "~/domains/search/components/hooks/useHighlightSearchResults";
import { makeFeatureId } from "~/domains/search/functions/data-mapping";
import { useEnrichedSearchResults } from "~/domains/search/hooks/useEnrichedSearchResults";
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

export function Search() {
  const router = useAppStateAwareRouter();
  const category = categories[router.query.category as Category]?.name();

  const searchTermFromQueryParameter = Array.isArray(router.query.q)
    ? router.query.q[0]
    : router.query.q;

  const [searchTerm, setSearchTerm] = useState<string>(
    // make sure that if both category and search query parameters are
    // present, the category wins
    category ? "" : searchTermFromQueryParameter,
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

  const resetCategoryFilter = async () => {
    if (!category) {
      return;
    }
    await router.replace({ query: { category: "" } });
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

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    router.replace({ query: { q: searchTerm } });
  }, [searchTerm]);

  return (
    <SearchWrapper>
      <SearchFormField
        isDropdownOpen={isDropdownOpen}
        value={category || searchTerm}
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
