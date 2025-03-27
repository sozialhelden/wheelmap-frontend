import { ScrollArea } from "@radix-ui/themes";
import type { ReactNode } from "react";
import styled from "styled-components";
import { CaretLeftIcon, CaretRightIcon } from "@radix-ui/react-icons";

const SidebarWrapper = styled.aside<{
  $isExpanded: boolean;
  $hasPadding: boolean;
}>`
    position: fixed;
    top: var(--topbar-height);
    left: ${({ $isExpanded }) => ($isExpanded ? "0" : "calc(var(--sidebar-width) * -1)")};
    width: var(--sidebar-width);
    z-index: 10;
    box-sizing: border-box;
    display: block;
    background: var(--color-panel);
    backdrop-filter: var(--backdrop-filter-panel);
    transition: left 400ms ease;
    height: calc(100dvh - var(--topbar-height));
    padding-top: ${({ $hasPadding }) => ($hasPadding ? "calc(var(--search-bar-height) + calc(var(--space-3) * 2))" : "0")};
    box-shadow: ${({ $isExpanded }) => ($isExpanded ? "rgba(0,0,0,0.2) .25rem 0 .25rem" : "none")};
`;
const SidebarContainer = styled.div`
  padding: 0 var(--space-3) var(--space-3) var(--space-3);
    max-width: 100%;
`;
const SidebarToggleButton = styled.button`
    position: absolute;
    top: 50%;
    left: 100%;
    transform: translateY(-100%);
    padding: var(--space-3) var(--space-1) var(--space-3) 0;
    background: var(--color-panel);
    border: none;
    border-top-right-radius: var(--radius-4);
    border-bottom-right-radius: var(--radius-4);
    display: inline-flex;
    box-shadow: rgba(0,0,0,0.2) .25rem 0 .25rem;
    transition: all 300ms ease;
    cursor: pointer;
    &:hover {
        background: var(--accent-2);
        padding: var(--space-3) var(--space-1);
    }
`;

export function Sidebar({
  children,
  isExpanded,
  onIsExpandedChange,
  hasPadding = true,
}: {
  children: ReactNode;
  isExpanded: boolean;
  hasPadding?: boolean;
  onIsExpandedChange: (value: boolean) => void;
}) {
  return (
    <SidebarWrapper $isExpanded={isExpanded} $hasPadding={hasPadding}>
      <SidebarToggleButton onClick={() => onIsExpandedChange(!isExpanded)}>
        {isExpanded ? <CaretLeftIcon /> : <CaretRightIcon />}
      </SidebarToggleButton>
      <ScrollArea>
        <SidebarContainer>{children}</SidebarContainer>
      </ScrollArea>
    </SidebarWrapper>
  );
}
