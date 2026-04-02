"use client";

import { Button } from "@radix-ui/themes";
import { X } from "lucide-react";
import React, { type ReactNode, useState } from "react";
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
 * Supports both controlled and uncontrolled modes:
 * - Controlled: Pass both `isExpanded` and `onToggle`
 * - Uncontrolled: Use `defaultIsExpanded` and internal state
 */
export function SidebarLayout({
  children,
  hasTopPadding = true,
  showCloseButton,
  onCloseButtonClick,
  scrollStops = [0, 0.5],
  defaultIsExpanded = false,
  isExpanded: controlledIsExpanded,
  onToggle,
}: {
  children: ReactNode;
  hasTopPadding?: boolean;
  showCloseButton?: boolean;
  onCloseButtonClick?: () => void;
  scrollStops?: number[];
  defaultIsExpanded?: boolean;
  isExpanded?: boolean;
  onToggle?: (value: boolean) => void;
}) {
  const { greaterOrEqual } = useBreakpoints();
  const showSidebar = greaterOrEqual("sm");

  // Use controlled state if provided, otherwise use internal state
  const [internalIsExpanded, setInternalIsExpanded] =
    useState(defaultIsExpanded);
  const isExpanded = controlledIsExpanded ?? internalIsExpanded;

  const handleToggle = (value: boolean) => {
    if (onToggle) {
      onToggle(value);
    } else {
      setInternalIsExpanded(value);
    }
  };

  const handleCloseButtonClick = () => {
    handleToggle(false);
    onCloseButtonClick?.();
  };

  const sidebarCloseButton = (
    <div>
      <SidebarButton
        size="3"
        variant="surface"
        color="gray"
        highContrast={true}
        $isSidebarOpen={isExpanded}
        onClick={handleCloseButtonClick}
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
          onIsExpandedChange={handleToggle}
          hasPadding={hasTopPadding}
        >
          {children}
        </SidebarComponent>
      ) : (
        <Sheet
          isExpanded={isExpanded}
          onIsExpandedChanged={handleToggle}
          scrollStops={scrollStops}
        >
          {children}
        </Sheet>
      )}
    </>
  );
}
