import { Flex, ScrollArea, Spinner } from "@radix-ui/themes";
import React, { forwardRef, type ReactNode, type Ref } from "react";
import styled from "styled-components";
import { t } from "ttag";

const StyledSearchDropdown = styled.div<{ $visible: boolean }>`
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
const SearchResultList = styled.ul`
  // this keeps the implicit list role in voice-over on macos 
  // changing it to none will remove its list semantics
  list-style-type: "";
  margin: 0;
  padding: 0;
`;
const TrimmedScrollArea = styled(ScrollArea)`
  max-height: min(calc(100vh - 7rem), 400px);
`;

export const SearchDropdown = forwardRef(function SearchDropdown(
  {
    isOpen,
    hasResults,
    isSearching,
    hasError,
    children,
  }: {
    isOpen: boolean;
    hasResults: boolean;
    isSearching: boolean;
    hasError: boolean;
    children: ReactNode;
  },
  ref: Ref<HTMLDivElement>,
) {
  return (
    <StyledSearchDropdown
      $visible={isOpen}
      ref={ref}
      data-testid="search-result-dropdown"
    >
      {isOpen && (
        <>
          {isSearching && (
            <Flex
              justify="center"
              align="center"
              p="4"
              data-testid="is-searching"
            >
              <Spinner size="3" />
            </Flex>
          )}
          {!isSearching && !hasResults && (
            <Flex justify="center" align="center" p="4">
              {t`No results found!`}
            </Flex>
          )}
          {!isSearching && hasError && (
            <Flex justify="center" align="center" p="4">
              {t`An error occurred. Please try again later!`}
            </Flex>
          )}
          {!isSearching && !hasError && hasResults && (
            <TrimmedScrollArea scrollbars="vertical">
              <SearchResultList>{children}</SearchResultList>
            </TrimmedScrollArea>
          )}
        </>
      )}
    </StyledSearchDropdown>
  );
});
