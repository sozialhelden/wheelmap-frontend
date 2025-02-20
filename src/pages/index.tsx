import { CaretLeftIcon, CaretRightIcon } from "@radix-ui/react-icons";
import { Button, Flex } from "@radix-ui/themes";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import styled from "styled-components";
import { getLayout } from "~/components/App/MapLayout";
import { CategoryFilter } from "~/domains/categories/components/CategoryFilter";
import { Search } from "~/domains/search/components/Search";
import { useSheetContext } from "~/domains/sheet/SheetContext.tsx";
import { Sheet } from "~/domains/sheet/components/Sheet";
import { isFirstStart } from "~/lib/util/savedState";

const SearchToolbar = styled.div`
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
const SidebarToggleButton = styled(Button)<{ $isSidebarOpen: boolean }>`
    height: 100%;
    background: var(--color-panel-solid);
    border: 1px solid var(--gray-7);
    box-shadow: ${({ $isSidebarOpen }) => ($isSidebarOpen ? "none" : "rgba(0,0,0,0.2) 0 .025rem .2rem")};
    display: none;
    &:hover {
        border-color: var(--gray-8);
    }
    @media (min-width: 769px) {
        display: inline-flex;
    }
`;

export default function Page() {
  const router = useRouter();
  const { toggle, isExpanded } = useSheetContext();

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (isFirstStart()) {
      router.replace("/onboarding");
    }
  }, []);

  return (
    <>
      <SearchToolbar>
        <Flex align="stretch" gap="4" px="3">
          <Search />
          <div>
            <SidebarToggleButton
              size="3"
              variant="surface"
              color="gray"
              highContrast={true}
              onClick={toggle}
              $isSidebarOpen={isExpanded}
            >
              {isExpanded && <CaretLeftIcon />}
              {!isExpanded && <CaretRightIcon />}
            </SidebarToggleButton>
          </div>
        </Flex>
        <CategoryFilter />
      </SearchToolbar>
      <Sheet scrollStops={[0.5]}>
        {[...Array(10).keys()].map((i) => (
          <Flex key={i} style={{ margin: "0 0 1rem 0" }}>
            <img
              src="https://shop.joinmastodon.org/cdn/shop/files/IMG_0145.jpg?v=1726292615&width=1100"
              style={{ maxWidth: "100%" }}
            />
          </Flex>
        ))}
      </Sheet>
    </>
  );
}

Page.getLayout = getLayout;
