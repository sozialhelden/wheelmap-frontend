import { ChevronUp, ChevronDown } from "lucide-react";
import { IconButton } from "@radix-ui/themes";
import { type ReactNode, type Ref, useEffect, useMemo, useRef } from "react";
import styled from "styled-components";
import { useCollapsableSheet } from "~/components/sheet/useCollapsableSheet";
import { useSheetMounted } from "~/components/sheet/useSheetMounted";

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

const SheetCollapsedControlArea = styled.div`
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

// The available vertical space is the viewport height minus the top bar height
// and the space the sheet should still be visible when completely collapsed.
const availableSpace =
  "calc(calc(100dvh - var(--topbar-height)) - var(--sheet-height-collapsed))";

export function Sheet({
  children,
  scrollStops: scrollStopPositions = [],
  isExpanded: externalIsExpanded,
  onIsExpandedChanged,
}: {
  children: ReactNode;
  scrollStops?: number[];
  isExpanded?: boolean;
  onIsExpandedChanged?: (isExpanded: boolean) => void;
}) {
  // This component uses css scroll stops to create a visible sheet that snaps to the
  // given percentage positions. This is done using invisible (and non-interactive)
  // div containers inside the scroll area that the browser snaps to while scrolling.
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

  const container = useRef<HTMLDivElement>();
  const content = useRef<HTMLDivElement>();

  const { isExpanded, toggle } = useCollapsableSheet({
    container,
    content,
    isExpanded: externalIsExpanded,
    onIsExpandedChanged,
  });

  const { setIsSheetMounted } = useSheetMounted();

  useEffect(() => {
    setIsSheetMounted(true);
    return () => {
      setIsSheetMounted(false);
    };
  }, []);

  return (
    <SheetContainer
      $isExpanded={isExpanded}
      ref={container as Ref<HTMLDivElement>}
    >
      {scrollStops.map((height, index) => (
        <ScrollStop key={index + height} style={{ height }} />
      ))}
      <SheetContent ref={content as Ref<HTMLDivElement>}>
        <SheetCollapsedControlArea>
          <DragHandle />
          <ExpandButton variant="ghost" size="2" onClick={toggle}>
            {!isExpanded && <ChevronUp width="1.5rem" height="1.5rem" />}
            {isExpanded && <ChevronDown width="1.5rem" height="1.5rem" />}
          </ExpandButton>
        </SheetCollapsedControlArea>
        {children}
      </SheetContent>
    </SheetContainer>
  );
}
