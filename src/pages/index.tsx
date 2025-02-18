import { CaretLeftIcon, CaretRightIcon } from "@radix-ui/react-icons";
import { Button, Flex } from "@radix-ui/themes";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import styled from "styled-components";
import { getLayout } from "~/components/App/MapLayout";
import Toolbar from "~/components/shared/Toolbar";
import { CategoryFilter } from "~/domains/categories/components/CategoryFilter";
import { Search } from "~/domains/search/components/Search";
import { useSidebarContext } from "~/domains/sidebar/SidebarContext.ts";
import { isFirstStart } from "~/lib/util/savedState";

const SearchToolbar = styled.div`
  position: fixed;
  top: calc(var(--topbar-height) + var(--space-3));
  left: 0;
  right: 0;
  z-index: 20;
  @media (min-width: 1025px) {
    display: flex;  
    gap: var(--space-1);
    justify-content: start;
    align-items: center;
  }
`;
const CategoryFilterContainer = styled.div`
    margin-left: 1rem;
`;
const SidebarToggleButton = styled(Button)<{ $isSidebarOpen: boolean }>`
    height: 100%;
    background: var(--color-panel-solid);
    border: 1px solid var(--gray-7);
    box-shadow: ${({ $isSidebarOpen }) => ($isSidebarOpen ? "none" : "rgba(0,0,0,0.2) 0 .025rem .2rem")};
    display: none;
    &:hover {
        border-color: var(--gray-8);
    }
    @media (min-width: 1025px) {
        display: inline-flex;
    }
`;

export default function Page() {
  const router = useRouter();
  const { toggle, isOpen } = useSidebarContext();

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (isFirstStart()) {
      router.replace("/onboarding");
    }
  }, []);

  return (
    <>
      <SearchToolbar>
        <Flex align="stretch" gap="4" mx="4">
          <Search />
          <div>
            <SidebarToggleButton
              size="3"
              variant="surface"
              color="gray"
              highContrast={true}
              onClick={toggle}
              $isSidebarOpen={isOpen}
            >
              {isOpen && <CaretLeftIcon />}
              {!isOpen && <CaretRightIcon />}
            </SidebarToggleButton>
          </div>
        </Flex>
        <CategoryFilterContainer>
          <CategoryFilter />
        </CategoryFilterContainer>
      </SearchToolbar>
      <Toolbar>asdf</Toolbar>
    </>
  );
}

Page.getLayout = getLayout;
