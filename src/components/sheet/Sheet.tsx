import { IconButton } from "@radix-ui/themes";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
  type ComponentPropsWithoutRef,
  type ReactNode,
  type Ref,
  useEffect,
  useMemo,
  useRef,
} from "react";
import styled from "styled-components";
import { useCollapsibleSheet } from "~/components/sheet/useCollapsibleSheet";
import { useUserAgent } from "~/hooks/useUserAgent";

const SheetContainer = styled.aside<{ $isExpanded: boolean }>`
    position: fixed;
    top: var(--topbar-height);
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 30;
    pointer-events: none;
    overflow-y: scroll;
    overflow-x: hidden;
    scroll-snap-type: y mandatory;
    -webkit-overflow-scrolling: touch;
    overscroll-behavior: contain;

    // when over-scrolling, this prevents the underlying content from shining 
    // through the gap between the bottom of the page and the sheet
    &:after {
        position: fixed;
        z-index: 10;
        content: "";
        background: var(--color-panel);
        left: 0;
        bottom: 0;
        width: 100%;
        height: 6rem;
        pointer-events: none;
        opacity: ${({ $isExpanded }) => ($isExpanded ? 1 : 0)};
    }
`;
const SheetContent = styled.div<{ $isSafari?: boolean }>`
    z-index: 20;
    position: relative;
    pointer-events: auto;
    scroll-snap-align: start;
    scroll-snap-stop: always;
    background: var(--color-panel);
    backdrop-filter: var(--backdrop-filter-panel);
    padding: 0 var(--space-3) var(--space-3) var(--space-3);
    border-radius: 3rem 3rem 0 0;
    box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.15);
    
    overflow-x: ${({ $isSafari }) => ($isSafari ? "scroll" : "hidden")};
    overscroll-behavior: none;
`;
const SheetSpacer = styled.div`
  height: 1px;
  margin: 0 calc(-1 * calc(var(--space-3) + 0.5px));
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
  ...props
}: {
  children: ReactNode;
  scrollStops?: number[];
  isExpanded?: boolean;
  onIsExpandedChanged?: (isExpanded: boolean) => void;
} & ComponentPropsWithoutRef<"aside">) {
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

  // Set initial scroll position to 0 (collapsed state) on mount.
  // This prevents the sheet from appearing fully expanded initially on mobile Safari,
  // where the browser would otherwise show the content from the top and then scroll
  // down to the first snap point.
  useEffect(() => {
    if (container.current) {
      container.current.scrollTop = 0;
    }
  }, []);

  // There's a bug on Safari where a scrolling container is not recognized as such
  // when it's pointer-events are set to none. This means, that the whole container
  // is not scrollable and thus the Sheet doesn't work. Also see this bugticket:
  // https://bugs.webkit.org/show_bug.cgi?id=183870
  //
  // There's a workaround though. When a child is scrollable in the other dimension
  // in this case horizontally, Safari recognizes the parent as a scrollable. This
  // is why we added overflow-x: scroll to the content container and removed the
  // overscroll-behavior to hide the fact that it is horizontally scrollable. In
  // order to actually be scrollable, there's a spacer element that is exactly 1px
  // wider than the content container, so it becomes a scrollable element.
  // This breaks scrolling in all other Browsers though, so we need to activate
  // this behavior only for Safari. As Safari on Desktop doesn't experience this
  // bug, we only apply this workaround for iOS devices. As other Browsers on iOS
  // devices also use the Safari/Webkit engine behind the scenes, this should fix
  // it for them as well.
  const isSafari = useUserAgent().userAgent?.engine.name === "WebKit";

  const { isExpanded, toggle } = useCollapsibleSheet({
    container,
    content,
    isExpanded: externalIsExpanded,
    onIsExpandedChanged,
  });

  return (
    <SheetContainer
      $isExpanded={isExpanded}
      ref={container as Ref<HTMLDivElement>}
      {...props}
    >
      {scrollStops.map((height, index) => (
        <ScrollStop key={index + height} style={{ height }} />
      ))}
      <SheetContent ref={content as Ref<HTMLDivElement>} $isSafari={isSafari}>
        {isSafari && <SheetSpacer />}

        <SheetCollapsedControlArea
          // We don't want to collapse the sheet on screen-readers. Collapsing is supposed to
          // grant the map more space, which is a purely visual effect.
          aria-hidden
        >
          <DragHandle />
          <ExpandButton variant="ghost" size="2" onClick={toggle}>
            {!isExpanded && <ChevronUp width="1.5rem" height="1.5rem" />}
            {isExpanded && <ChevronDown width="1.5rem" height="1.5rem" />}
          </ExpandButton>
        </SheetCollapsedControlArea>
        {children}
      </SheetContent>
      {/* We need this last scroll stop, otherwise it will scroll back
       to the top once the bottom was reached */}
      <ScrollStop key="last" style={{ height: "0px" }} />
    </SheetContainer>
  );
}
