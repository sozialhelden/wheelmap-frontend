import { Button } from "@radix-ui/themes";
import { X } from "lucide-react";
import React, { type ReactNode, useEffect, useState } from "react";
import styled from "styled-components";
import ToolBar from "~/app/(app)/(map)/_components/ToolBar";
import { Sheet } from "~/components/sheet/Sheet";
import { Sidebar as SidebarComponent } from "~/components/sidebar/Sidebar";
import { useBreakpoints } from "~/hooks/useBreakpoints";

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

/**
 * This component provides a toolbar and a sidebar/sheet.
 */
export function SidebarLayout({
  children,
  hasTopPadding = true,
  showCloseButton,
  onCloseButtonClick,
  scrollStops = [0, 0.5],
  defaultIsExpanded = false,
  isExpanded: externalIsExpanded,
  onIsExpandedChange,
}: {
  children: ReactNode;
  hasTopPadding?: boolean;
  showCloseButton?: boolean;
  onCloseButtonClick?: () => void;
  scrollStops?: number[];
  defaultIsExpanded?: boolean;
  isExpanded?: boolean;
  onIsExpandedChange?: (value: boolean) => void;
}) {
  const { greaterOrEqual } = useBreakpoints();
  const showSidebar = greaterOrEqual("sm");

  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    setIsExpanded(defaultIsExpanded);
  }, []);
  useEffect(() => {
    if (externalIsExpanded !== undefined) {
      setIsExpanded(externalIsExpanded);
    }
  }, [externalIsExpanded]);
  useEffect(() => {
    onIsExpandedChange?.(isExpanded);
  }, [isExpanded]);

  const sidebarCloseButton = (
    <div>
      <SidebarButton
        size="3"
        variant="surface"
        color="gray"
        highContrast={true}
        $isSidebarOpen={isExpanded}
        onClick={onCloseButtonClick}
        aria-hidden
      >
        <X size={18} />
      </SidebarButton>
    </div>
  );

  return (
    <>
      <ToolBar
        isSearchOnBackground={isExpanded}
        slotAfterSearch={showCloseButton && sidebarCloseButton}
      />
      {showSidebar ? (
        <SidebarComponent
          isExpanded={isExpanded}
          onIsExpandedChange={setIsExpanded}
          hasPadding={hasTopPadding}
        >
          {children}
        </SidebarComponent>
      ) : (
        <Sheet
          isExpanded={isExpanded}
          onIsExpandedChanged={setIsExpanded}
          scrollStops={scrollStops}
        >
          {children}
        </Sheet>
      )}
    </>
  );
}
