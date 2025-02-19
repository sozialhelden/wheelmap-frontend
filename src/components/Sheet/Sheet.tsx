import { CaretDownIcon, CaretUpIcon } from "@radix-ui/react-icons";
import { IconButton, ScrollArea } from "@radix-ui/themes";
import React, {
  type ReactNode,
  type Ref,
  useEffect,
  useMemo,
  useRef,
} from "react";
import styled from "styled-components";
import { useCollapsableSheet } from "~/components/Sheet/useCollapsableSheet";

const SheetContainer = styled.aside<{ $isExpanded: boolean }>`
    position: fixed;
    top: var(--topbar-height);
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 30;
    pointer-events: none;
    overflow-y: scroll;
    scroll-snap-type: y mandatory;
    @media (min-width: 769px) {
        display: none;
    }
`;
const SheetContent = styled.div`
    pointer-events: all;
    scroll-snap-align: start;
    scroll-snap-stop: always;
    background: var(--color-panel);
    backdrop-filter: var(--backdrop-filter-panel);
    padding: 0 var(--space-3) var(--space-3) var(--space-3);
`;
const ScrollStop = styled.div`
    pointer-events: none;
    scroll-snap-align: start;
    scroll-snap-stop: always;
`;
const ExpandArea = styled.div`
  height: var(--sheet-height-collapsed);
  justify-content: center;
  align-items: center;
  display: flex;
`;
const DragHandle = styled.div`
    content: "";
    height: .25rem;
    width: 5rem;
    background: var(--gray-8);
    border-radius: max(var(--radius-3), var(--radius-full));
    display: none;
    @media (hover: none) {
        display: block;
    }
`;
const ExpandButton = styled(IconButton)`
  @media (hover: none) {
    display: none;
  }
`;

const SidebarWrapper = styled.aside<{ $isExpanded: boolean }>`
    --sidebar-width: calc(calc(var(--search-bar-width) + calc(var(--space-4) * 2)) + 4rem);

    position: fixed;
    top: var(--topbar-height);
    left: ${({ $isExpanded }) => ($isExpanded ? "0" : "calc(var(--sidebar-width) * -1)")};
    width: var(--sidebar-width);
    z-index: 10;
    box-sizing: border-box;
    display: none;
    background: var(--color-panel);
    backdrop-filter: var(--backdrop-filter-panel);
    transition: left 400ms ease;
    height: calc(100dvh - var(--topbar-height));
    padding-top: 4.25rem;
    @media (min-width: 769px) {
        display: block;
    }
`;
const SidebarContainer = styled.div`
  padding: 0 var(--space-3) var(--space-3) var(--space-3);
`;

// The available vertical space is the viewport height minus the top bar height
// and the space the sheet should still be visible when completely collapsed
const availableSpace =
  "calc(calc(100dvh - var(--topbar-height)) - var(--sheet-height-collapsed))";

export function Sheet({
  children,
  scrollStops: scrollStopPositions = [],
  isExpanded: givenIsExpanded = false,
  onIsExpandedChanged,
}: {
  children: ReactNode;
  scrollStops?: number[];
  isExpanded?: boolean;
  onIsExpandedChanged?: (isExpanded: boolean) => void;
}) {
  const container = useRef<HTMLDivElement>();
  const content = useRef<HTMLDivElement>();

  const { isExpanded, toggle, expand, collapse } = useCollapsableSheet({
    container,
    content,
  });

  const scrollStops: string[] = useMemo(() => {
    const stops = scrollStopPositions.map((position, index) => {
      // All the scroll-stop containers need to add up to a 100% of the available
      // space, so the resulting height of each container should be the difference
      // between the current and the previous stop position
      const fraction = position - (scrollStopPositions[index - 1] || 0);
      return `calc(${fraction} * ${availableSpace})`;
    });
    const rest = 1 - ([...scrollStopPositions].pop() || 0);
    stops.push(`calc(${rest} * ${availableSpace})`);
    return stops;
  }, [scrollStopPositions]);

  useEffect(() => {
    if (givenIsExpanded && !isExpanded) {
      expand();
    }
    if (!givenIsExpanded && isExpanded) {
      collapse();
    }
  }, [givenIsExpanded]);

  useEffect(() => onIsExpandedChanged?.(isExpanded), [isExpanded]);

  return (
    <>
      <SheetContainer
        ref={container as Ref<HTMLDivElement>}
        $isExpanded={isExpanded}
      >
        {scrollStops.map((height, index) => (
          <ScrollStop key={index} style={{ height }} />
        ))}
        <SheetContent ref={content as Ref<HTMLDivElement>}>
          <ExpandArea>
            <DragHandle />
            <ExpandButton variant="ghost" size="2" onClick={toggle}>
              {!isExpanded && <CaretUpIcon width="1.5rem" height="1.5rem" />}
              {isExpanded && <CaretDownIcon width="1.5rem" height="1.5rem" />}
            </ExpandButton>
          </ExpandArea>
          {children}
        </SheetContent>
      </SheetContainer>
      <SidebarWrapper $isExpanded={isExpanded}>
        <ScrollArea>
          <SidebarContainer>{children}</SidebarContainer>
        </ScrollArea>
      </SidebarWrapper>
    </>
  );
}
