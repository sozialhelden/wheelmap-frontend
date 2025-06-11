import React, { type ReactNode } from "react";
import styled from "styled-components";
import { CategoryFilter } from "~/modules/categories/components/CategoryFilter";
import { Search } from "~/modules/search/components/Search";

const StyledToolBar = styled.div`
  position: fixed;
  top: calc(var(--topbar-height) + var(--space-3));
  left: 0;
  right: 0;
  z-index: 20;
  @media (min-width: 769px) {
    display: flex;  
    gap: var(--space-1);
    justify-content: start;
    align-items: center;
  }
`;
const SearchContainer = styled.div`
    display: flex;
    gap: var(--space-3);
    padding: 0 var(--space-3);
    width: 100%;
    box-sizing: border-box;
    flex-grow: 0;
    flex-shrink: 0;
    @media (max-width: 768px) {
        margin-bottom: var(--space-2);
    }
    @media (min-width: 769px) {
        width: var(--sidebar-width);
    }
`;

export default function ToolBar({
  slotAfterSearch,
  isSearchOnBackground,
}: { slotAfterSearch?: ReactNode; isSearchOnBackground?: boolean }) {
  return (
    <StyledToolBar>
      <SearchContainer>
        <Search isOnBackground={isSearchOnBackground} />
        {slotAfterSearch}
      </SearchContainer>
      <CategoryFilter />
    </StyledToolBar>
  );
}
