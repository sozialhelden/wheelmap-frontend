import { ScrollArea } from "@radix-ui/themes";
import type { ReactNode } from "react";
import styled from "styled-components";

const SidebarWrapper = styled.aside<{ $isExpanded: boolean }>`
    --sidebar-width: calc(calc(var(--search-bar-width) + calc(var(--space-4) * 2)) + 3.65rem);

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
    padding-top: 4.25rem;
    box-shadow: ${({ $isExpanded }) => ($isExpanded ? "rgba(0,0,0,0.2) .25rem 0 .25rem" : "none")};
`;
const SidebarContainer = styled.div`
  padding: 0 var(--space-3) var(--space-3) var(--space-3);
`;

export function DesktopSidebar({
  children,
  isExpanded,
}: { children: ReactNode; isExpanded: boolean }) {
  return (
    <SidebarWrapper $isExpanded={isExpanded}>
      <ScrollArea>
        <SidebarContainer>{children}</SidebarContainer>
      </ScrollArea>
    </SidebarWrapper>
  );
}
