import { useEffect, useRef, useState } from "react";
import type { EnrichedSearchResult } from "~/modules/search/types/EnrichedSearchResult";

export function useHighlightSearchResults({
  searchResults,
  searchTerm,
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
}: { searchTerm: string; searchResults?: any[] }) {
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const searchResultsContainer = useRef<HTMLElement | undefined>();

  const getHighlightedDomElement = () => {
    // TODO: refactor this to use refs instead of querySelector
    return searchResultsContainer.current?.querySelector(
      `[data-highlight-index="${highlightedIndex}"]`,
    );
  };
  const highlightNext = () => {
    if (!searchResults?.length) {
      return;
    }
    const newIndex = Math.min(highlightedIndex + 1, searchResults.length - 1);
    setHighlightedIndex(newIndex);
  };
  const highlightPrevious = () => {
    if (!searchResults?.length) {
      return;
    }
    const newIndex = Math.max(highlightedIndex - 1, 0);
    setHighlightedIndex(newIndex);
  };
  const openHighlighted = () => {
    if (highlightedIndex === -1) {
      return;
    }
    /* TODO: this is bad, please refactor. it should not use query-selector
        and it should not trigger a click on an element. the function to
        open it on the map should be called directly. */
    getHighlightedDomElement()?.querySelector("a")?.click();
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    getHighlightedDomElement()?.scrollIntoView({
      block: "nearest",
    });
  }, [highlightedIndex]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    setHighlightedIndex(-1);
  }, [searchTerm]);

  return {
    highlightedIndex,
    highlightNext,
    highlightPrevious,
    openHighlighted,
    searchResultsContainer,
  };
}
