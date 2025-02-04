import * as React from "react";
import { t } from "ttag";

import AccessibilityFilterMenu from "./AccessibilityFilterMenu";
import CategoryMenu from "./CategoryMenu";
import SearchIcon from "./SearchIcon";
import SearchInputField from "./SearchInputField";
import SearchResults from "./SearchResults";

import { Cross1Icon } from "@radix-ui/react-icons";
import { Box, IconButton, VisuallyHidden } from "@radix-ui/themes";
import { isAccessibilityFiltered } from "../../lib/model/ac/filterAccessibility";
import { cx } from "../../lib/util/cx";
import { useAppStateAwareRouter } from "../../lib/util/useAppStateAwareRouter";
import Spinner from "../ActivityIndicator/Spinner";
import { useMapOverlapRef } from "../Map/GlobalMapContext";
import ErrorBoundary from "../shared/ErrorBoundary";
import type { PlaceFilter } from "./AccessibilityFilterModel";
import type { EnrichedSearchResult } from "./EnrichedSearchResult";
import { StyledToolbar } from "./StyledToolbar";

export type Props = PlaceFilter & {
  className?: string;
  hidden?: boolean;
  inert?: boolean;
  category?: null | string;
  showCategoryMenu?: boolean;
  searchQuery?: null | string;
  onChangeSearchQuery?: (newSearchQuery: string) => void;
  onSubmit?: (searchQuery: string) => void;
  onClose?: () => void;
  onClick?: () => void;
  isExpanded?: boolean;
  searchResults?: null | EnrichedSearchResult[];
  isSearching?: boolean;
  searchError?: string;
  minimalTopPosition?: number;
};

export default function SearchPanel({
  className,
  hidden,
  inert,
  category,
  showCategoryMenu,
  searchQuery,
  onChangeSearchQuery,
  onSubmit,
  onClose,
  onClick,
  isExpanded,
  searchResults,
  minimalTopPosition,
  isSearching,
  searchError,
}: Props) {
  const { accessibilityFilter, toiletFilter } = useAppStateAwareRouter();
  const searchInputFieldRef = React.createRef<HTMLInputElement>();

  const blur = React.useCallback(() => {
    if (!searchInputFieldRef.current) return;
    searchInputFieldRef.current.blur();
  }, [searchInputFieldRef]);

  const clearSearch = React.useCallback(() => {
    onChangeSearchQuery?.("");
  }, [onChangeSearchQuery]);

  const clearSearchAndFocusSearchField = React.useCallback(() => {
    clearSearch();
    searchInputFieldRef.current?.focus();
  }, [searchInputFieldRef, clearSearch]);

  const searchInputField = (
    <SearchInputField
      ref={searchInputFieldRef}
      searchQuery={searchQuery || ""}
      hidden={hidden}
      autoFocus={!inert}
      onClick={() => {
        window.scrollTo(0, 0);
        onClick?.();
      }}
      onFocus={() => {
        window.scrollTo(0, 0);
      }}
      onChange={onChangeSearchQuery}
      onSubmit={(event: React.SyntheticEvent<HTMLInputElement>) => {
        blur();
        onSubmit?.(event.currentTarget.value);
      }}
      ariaRole="searchbox"
    />
  );

  const categoryMenuOrNothing = (category ||
    isExpanded ||
    showCategoryMenu) && (
    <CategoryMenu
      category={category}
      accessibilityFilter={accessibilityFilter}
    />
  );

  const accessibilityFilterMenu = (isExpanded ||
    isAccessibilityFiltered(accessibilityFilter)) && (
    <AccessibilityFilterMenu
      accessibilityFilter={accessibilityFilter}
      toiletFilter={toiletFilter}
      category={category}
    />
  );

  const closeLink = (
    <IconButton
      variant="ghost"
      aria-label={t`Clear search`}
      onClick={() => {
        clearSearchAndFocusSearchField();
        if (onClose) onClose();
      }}
    >
      <Cross1Icon />
    </IconButton>
  );

  let contentBelowSearchField: React.ReactElement | null;
  if (!searchResults && isSearching) {
    contentBelowSearchField = (
      <div>
        <VisuallyHidden aria-live="assertive">{t`Searching`}</VisuallyHidden>
        <Spinner size={20} />
      </div>
    );
  } else if (searchResults && searchQuery) {
    contentBelowSearchField = (
      <div aria-live="assertive">
        <SearchResults
          searchResults={searchResults}
          hidden={hidden}
          error={searchError}
        />
      </div>
    );
  } else {
    contentBelowSearchField = <Box />;
  }

  const overlayRef = useMapOverlapRef(false);

  return (
    <ErrorBoundary>
      <header>
        <form
          onSubmit={(ev) => {
            ev.preventDefault();
          }}
        >
          <SearchIcon />
          {searchInputField}
          {searchQuery && closeLink}
        </form>
      </header>
      <section onTouchStart={() => blur()}>{contentBelowSearchField}</section>
    </ErrorBoundary>
  );
}
