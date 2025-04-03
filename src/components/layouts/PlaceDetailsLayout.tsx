import { FeaturePanelContextProvider } from "~/needs-refactoring/components/CombinedFeaturePanel/FeaturePanelContext";
import React, { type ReactNode, useEffect, useState } from "react";
import { Button } from "@radix-ui/themes";
import { getLayout as getBaseMapLayout } from "~/components/layouts/BaseMapLayout";
import SearchAndFilterBar from "~/components/header/SearchAndFilterBar";
import { Sidebar as SidebarComponent } from "~/components/sidebar/Sidebar";
import { Sheet } from "~/components/sheet/Sheet";
import { useBreakpoints } from "~/hooks/useBreakpoints";
import styled from "styled-components";
import { Cross1Icon } from "@radix-ui/react-icons";
import { useAppStateAwareRouter } from "~/needs-refactoring/lib/util/useAppStateAwareRouter";

const SidebarButton = styled(Button)<{ $isSidebarOpen: boolean }>`
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

export const PlaceDetailsLayout = ({ children }: { children: ReactNode }) => {
  const { greaterOrEqual } = useBreakpoints();
  const showSidebar = greaterOrEqual("sm");

  const [isExpanded, setIsExpanded] = useState(false);

  const { push } = useAppStateAwareRouter();

  useEffect(() => {
    setIsExpanded(true);
  }, []);

  const sidebarCloseButton = (
    <div>
      <SidebarButton
        size="3"
        variant="surface"
        color="gray"
        highContrast={true}
        $isSidebarOpen={isExpanded}
        onClick={() => push("/")}
      >
        <Cross1Icon />
      </SidebarButton>
    </div>
  );

  return (
    <FeaturePanelContextProvider>
      <SearchAndFilterBar
        isSearchOnBackground={isExpanded}
        slotAfterSearch={sidebarCloseButton}
      />
      {showSidebar ? (
        <SidebarComponent
          isExpanded={isExpanded}
          onIsExpandedChange={setIsExpanded}
          hasPadding={true}
        >
          {children}
        </SidebarComponent>
      ) : (
        <Sheet
          isExpanded={isExpanded}
          onIsExpandedChanged={setIsExpanded}
          scrollStops={[0, 0.5]}
        >
          {children}
        </Sheet>
      )}
    </FeaturePanelContextProvider>
  );
};

export default PlaceDetailsLayout;

export const getLayout = (page: ReactNode) =>
  getBaseMapLayout(<PlaceDetailsLayout>{page}</PlaceDetailsLayout>);
