import { ScrollArea } from "@radix-ui/themes";
import type { ReactNode } from "react";
import styled from "styled-components";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
    border: none;
    border-top-right-radius: var(--radius-4);
    border-bottom-right-radius: var(--radius-4);
    display: inline-flex;
    box-shadow: rgba(0,0,0,0.2) .25rem 0 .25rem;
    transition: all 300ms ease;
    cursor: pointer;
    &:hover {
        padding: var(--space-3) var(--space-1);
        &:before {
            background: var(--accent-2);
        }
    }
    & > * {
        z-index: 1;
    }
    &:before {
        content: '';
        position: absolute;
        inset: 0;
        z-index: 0;
        background: var(--color-panel);
        border-top-right-radius: var(--radius-4);
        border-bottom-right-radius: var(--radius-4);
    }
`;
const SidebarToggleButtonHighlight = styled.div`
    position: absolute;
    inset: 0;
    background: var(--accent-a5);
    animation: buttonHighlight 5.5s linear infinite;
    z-index: -1;
    border-top-right-radius: var(--radius-4);
    border-bottom-right-radius: var(--radius-4);
    @keyframes buttonHighlight {
        25 % {
            opacity: 1;
            filter: blur(0);
        }
        30% {
            opacity: 0;
            transform: scaleX(4) scaleY(3);
            filter: blur(.1rem);
        }
        100% {
            opacity: 0;
            transform: scaleX(4) scaleY(3);
            filter: blur(.1rem);
        }
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
        {isExpanded ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        {!isExpanded && (
          <>
            <SidebarToggleButtonHighlight
              style={{ animationDelay: "7000ms" }}
            />
            <SidebarToggleButtonHighlight
              style={{ animationDelay: "7300ms" }}
            />
            <SidebarToggleButtonHighlight
              style={{ animationDelay: "7600ms" }}
            />
            <SidebarToggleButtonHighlight
              style={{ animationDelay: "7900ms" }}
            />
          </>
        )}
      </SidebarToggleButton>
      <ScrollArea>
        <SidebarContainer>{children}</SidebarContainer>
      </ScrollArea>
    </SidebarWrapper>
  );
}
