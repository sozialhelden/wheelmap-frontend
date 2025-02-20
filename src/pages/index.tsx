import { CaretLeftIcon, CaretRightIcon } from "@radix-ui/react-icons";
import { Button, Flex } from "@radix-ui/themes";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import styled from "styled-components";
import { getLayout } from "~/components/App/MapLayout";
import { useFeatureLabel } from "~/components/CombinedFeaturePanel/utils/useFeatureLabel";
import { CategoryFilter } from "~/domains/categories/components/CategoryFilter";
import useCategory from "~/domains/categories/hooks/useCategory";
import { ListItem } from "~/domains/list/ListItem";
import { Search } from "~/domains/search/components/Search";
import { useSheetContext } from "~/domains/sheet/SheetContext.tsx";
import { Sheet } from "~/domains/sheet/components/Sheet";
import { useCurrentLanguageTagStrings } from "~/lib/context/LanguageTagContext";
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

  const testFeature = {
    "@type": "osm:Feature",
    type: "Feature",
    _id: "node/1097191894",
    geometry: { type: "Point", coordinates: [13.350111, 52.514507] },
    centroid: { type: "Point", coordinates: [13.350111, 52.514507] },
    properties: {
      fee: "yes",
      icon: "viewpoint",
      name: "Siegessäule",
      image: "https://photos.app.goo.gl/5NQPGfqqGtigyk517",
      charge: "4 EUR",
      height: 58.6,
      noname: "yes",
      tourism: "viewpoint",
      direction: "0-360",
      wheelchair: "no",
      opening_hours:
        "Nov-Mar: Mo-Fr 10:00-17:00; Nov-Mar: Sa,Su 10:00-17:30; Apr-Oct: Mo-Fr 09:30-18:30; Apr-Oct: Sa,Su 09:30-19:00",
    },
  };

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
        <ListItem feature={testFeature} />
      </Sheet>
    </>
  );
}

Page.getLayout = getLayout;
