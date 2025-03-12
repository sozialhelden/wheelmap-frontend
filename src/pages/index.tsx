import { CaretLeftIcon, CaretRightIcon } from "@radix-ui/react-icons";
import { Button, Flex } from "@radix-ui/themes";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import styled from "styled-components";
import { getLayout } from "~/components/App/MapLayout";
import { useExpandedFeatures, useFeatures } from "~/lib/fetchers/useFeatures";
import { collectExpandedFeaturesResult } from "~/lib/fetchers/useFeatures/collectExpandedFeatures";
import type { FeatureId } from "~/lib/fetchers/useFeatures/types";
import { isFirstStart } from "~/lib/util/savedState";
import { CategoryFilter } from "~/modules/categories/components/CategoryFilter";
import { useCategoryFilter } from "~/modules/categories/contexts/CategoryFilterContext";
import { List } from "~/modules/list/List";
import { ListItem } from "~/modules/list/ListItem";
import { Search } from "~/modules/search/components/Search";
import { useSheetContext } from "~/modules/sheet/SheetContext";
import { Sheet } from "~/modules/sheet/components/Sheet";

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

  const testFeatureIds: FeatureId[] = [
    "osm:amenities/node/1097191894",
    // "osm:amenities/node/4544823443",
    "osm:amenities/way/195086492",
    "osm:amenities/way/38383464",
    "osm:amenities/relation/910651",
    "osm:amenities/node/2840615681",
    "osm:amenities/node/493655311",
    "osm:amenities/node/615027093",
    "ac:PlaceInfo/7hRz9qhHP2adCTLDt",
  ];
  const expandedFeatures = useExpandedFeatures(testFeatureIds);
  const { features } = collectExpandedFeaturesResult(
    testFeatureIds,
    expandedFeatures,
  );

  const { isFilteringActive } = useCategoryFilter();
  const { setIsExpanded } = useSheetContext();

  useEffect(() => {
    if (isFilteringActive) {
      setTimeout(() => setIsExpanded(true), 100);
    }
  }, [isFilteringActive]);

  return (
    <>
      <SearchToolbar>
        <Flex align="stretch" gap="4" px="3">
          <Search />
          {isFilteringActive && (
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
          )}
        </Flex>
        <CategoryFilter />
      </SearchToolbar>
      {isFilteringActive && (
        <Sheet scrollStops={[0.5]}>
          <List />
          {/*{features.map(*/}
          {/*  (feature) =>*/}
          {/*    feature && (*/}
          {/*      <li>*/}
          {/*        <ListItem feature={feature?.requestedFeature} />*/}
          {/*      </li>*/}
          {/*    ),*/}
          {/*)}*/}
        </Sheet>
      )}
    </>
  );
}

Page.getLayout = getLayout;
