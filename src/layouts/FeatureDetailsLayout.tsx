import { Button } from "@radix-ui/themes";
import { X } from "lucide-react";
import React, { type ReactNode, useEffect, useState } from "react";
import styled from "styled-components";
import ToolBar from "~/components/layout/ToolBar";
import { Sheet } from "~/components/sheet/Sheet";
import { Sidebar as SidebarComponent } from "~/components/sidebar/Sidebar";
import { useBreakpoints } from "~/hooks/useBreakpoints";
import { getLayout as getBaseMapLayout } from "~/layouts/BaseMapLayout";
import { FeaturePanelContextProvider } from "~/needs-refactoring/components/CombinedFeaturePanel/FeaturePanelContext";
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

export const FeatureDetailsLayout = ({ children }: { children: ReactNode }) => {
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
        <X size={18} />
      </SidebarButton>
    </div>
  );

  return (
    <FeaturePanelContextProvider>
      <ToolBar
        isSearchOnBackground={isExpanded}
        slotAfterSearch={sidebarCloseButton}
      />
      {showSidebar ? (
        <SidebarComponent
          isExpanded={isExpanded}
          onIsExpandedChange={setIsExpanded}
          hasPadding={false}
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

export default FeatureDetailsLayout;

export const getLayout = (page: ReactNode) =>
  getBaseMapLayout(<FeatureDetailsLayout>{page}</FeatureDetailsLayout>);
