import { Card } from "@radix-ui/themes";
import { t } from "@transifex/native";
import includes from "lodash/includes";
import minBy from "lodash/minBy";
import uniq from "lodash/uniq";
import * as React from "react";
import ResizeObserverPolyfill from "resize-observer-polyfill";
import styled from "styled-components";
import { isOnSmallViewport } from "~/needs-refactoring/lib/util/ViewportSize";
import { useMapOverlapRef } from "~/needs-refactoring/components/Map/GlobalMapContext";
import { useIsomorphicLayoutEffect } from "./useIsomorphicLayoutEffect";

type Props = {
  className?: string;
  children?: React.ReactNode;
  hidden?: boolean;
  inert?: boolean;
  role?: string;
  ariaLabel?: string;
  ariaDescribedBy?: string;
  minimalHeight?: number;
  minimalTopPosition?: number;
  isSwipeable?: boolean;
  isModal?: boolean;
  enableTransitions?: boolean;
};

function getNearestStopForTopOffset(
  topOffset: number,
  stops: number[],
): number {
  return minBy(stops, (stop) => Math.abs(stop - topOffset));
}

function getMaxHeight(
  minimalTopPosition,
  viewportWidth: number,
  viewportHeight: number,
  isModal: boolean,
) {
  if (viewportHeight > 512 && viewportWidth > 512) {
    return `calc(100% - ${minimalTopPosition}px - env(safe-area-inset-top) - 20px)`;
  }
  return `calc(100% - ${minimalTopPosition}px - env(safe-area-inset-top))`;
}

type PositionSample = { pos: number; t: number };
type FlickState = "up" | "down" | "noFlick";

function calculateFlickState(ySamples: PositionSample[]): FlickState {
  const lastSample = ySamples[1];
  const sampleBeforeLastSample = ySamples[0];
  if (lastSample && sampleBeforeLastSample) {
    if (
      lastSample.t - sampleBeforeLastSample.t < 50 &&
      Math.abs(lastSample.pos - sampleBeforeLastSample.pos) > 15
    ) {
      if (lastSample.pos > sampleBeforeLastSample.pos) {
        return "up";
      }
      if (lastSample.pos < sampleBeforeLastSample.pos) {
        return "down";
      }
    }
  }
  return "noFlick";
}

const StyledSection = styled.section`
  position: fixed;
  overscroll-behavior-y: contain;
  touch-action: pan-y;

  /* user-select: none; */
  -webkit-user-drag: none;

  /* Positioning */
  left: 0;
  left: constant(safe-area-inset-left);
  left: env(safe-area-inset-left);
  @media (max-height: 512px), (max-width: 512px) {
    bottom: 0;
  }
  /* Sizing (more sizing for different viewports below) */
  box-sizing: border-box;
  width: 600px;
  max-width: 100%;
  min-width: 320px;

  &.toolbar-is-modal {
    z-index: 1000;
    padding-bottom: calc(constant(safe-area-inset-bottom) + 8px);
    padding-bottom: calc(env(safe-area-inset-bottom) + 8px);

    @media (max-height: 512px), (max-width: 512px) {
      margin-bottom: 0px;
    }

    @media (min-width: 513px) and (min-height: 513px) {
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) !important;
    }
  }

  outline: none;
  overflow: auto;
  overflow-x: hidden;
  -ms-overflow-style: -ms-autohiding-scrollbar;
  /* -webkit-overflow-scrolling: touch; */

  transform: scale3d(1, 1, 1); /* switch on 3D acceleration for the panel */

  .grab-handle {
    display: none;
    border: none;
    outline: none;
  }

  border-radius: 8px;

  @media (max-width: 512px) {
    border-top-left-radius: 24px;
    border-top-right-radius: 24px;
    border-bottom-left-radius: 0px;
    border-bottom-right-radius: 0px;

    width: 100%;
    min-width: 250px;
    margin: 0;
    .grab-handle {
      display: block;
      position: sticky;
      top: 0;
      left: 50%;
      z-index: 3;
      width: 50%;
      height: 10px;
      margin: -10px 0 -20px 0;
      padding: 15px;
      touch-action: none;
      background-color: transparent;

      &:before {
        display: block;
        position: absolute;
        margin: 0 auto;
        top: 0px;
        left: calc(50% - 20px);
        content: "";
        width: 44px;
        height: 5px;
        border-radius: 2.5px;
        background-color: var(--gray-5);
      }
    }
  }

  p {
    line-height: 1.5;
    margin-top: 10px;
    margin-bottom: 10px;
  }

  &.toolbar-hidden {
    opacity: 0;
    pointer-events: none;
  }
`;

/**
 * A toolbar that shows as a card that you can swipe up and down on small viewports,
 * and that has a fixed position on bigger viewports.
 *
 * Automatically becomes scrollable when fully visible.
 *
 * When dragged with a swipe gesture, it transitions smoothly between expanding/collapsing
 * and scrolling its content.
 *
 * Can be modal and is not swipeable then.
 */

export default function Toolbar({
  hidden = false,
  minimalHeight = 90,
  isSwipeable = true,
  isModal = false,
  role = "",
  minimalTopPosition = 60,
  enableTransitions = true,
  children,
  inert,
  className,
  ariaLabel,
  ariaDescribedBy,
}: Props) {
  const scrollElementRef = React.useRef<HTMLElement | null>(null);
  const [topOffset, setTopOffset] = React.useState(0);
  const [scrollTop, setScrollTop] = React.useState(0);
  const [isSwiping, setIsSwiping] = React.useState(false);
  const [viewportWidth, setViewportWidth] = React.useState(0);
  const [viewportHeight, setViewportHeight] = React.useState(0);
  const [toolbarHeight, setToolbarHeight] = React.useState(0);
  const [deltaY, setDeltaY] = React.useState(0);
  const [touchStartY, setTouchStartY] = React.useState(0);
  const [scrollTopStartY, setScrollTopStartY] = React.useState(0);
  const [ySamples, setYSamples] = React.useState<{ pos: number; t: number }[]>(
    [],
  );

  const isLandscapePhone = React.useMemo(
    () => isOnSmallViewport() && viewportWidth > viewportHeight,
    [viewportWidth, viewportHeight],
  );

  /** An array of top position offsets that the toolbar is allowed to stop on. */
  const stops: number[] = React.useMemo(() => {
    // On landscape phones, the toolbar is fixed on the left side.
    if (isLandscapePhone) {
      return [0];
    }
    // The toolbar needs a minimal height be draggable from the bottom when minimized
    const absoluteMinimalHeight = Math.max(minimalHeight, 90);
    const bottomPosition = Math.max(0, toolbarHeight - absoluteMinimalHeight);
    let middleStop = toolbarHeight - 0.5 * viewportHeight;
    if (middleStop < 80) {
      middleStop = 0;
    }
    const defaultStops = uniq([0, middleStop, bottomPosition]);
    return defaultStops;
  }, [isLandscapePhone, minimalHeight, toolbarHeight, viewportHeight]);

  const isAtTopmostPosition = React.useMemo(() => topOffset <= 0, [topOffset]);

  // Enable these for debugging.
  // logStateValueChange('deltaY', deltaY);
  // logStateValueChange('touchStartY', touchStartY);
  // logStateValueChange('scrollTopStartY', scrollTopStartY);
  // logStateValueChange('scrollTop', scrollTop);
  // logStateValueChange('topOffset', topOffset);
  // logStateValueChange('isAtTopmostPosition', isAtTopmostPosition);

  const touchAction = React.useMemo(
    () => (isAtTopmostPosition ? "inherit" : "none"),
    [isAtTopmostPosition],
  );

  const transition = React.useMemo(() => {
    if (!enableTransitions) {
      return "";
    }
    const defaultTransitions = "opacity 0.3s ease-out";
    if (!isSwiping) {
      return `${defaultTransitions}, transform 0.3s ease-out`;
    }
    return defaultTransitions;
  }, [enableTransitions, isSwiping]);

  const transformY = React.useMemo(() => {
    const isToolbarFittingOnScreenCompletely =
      viewportHeight - toolbarHeight - stops[0] > 0;
    const isBigViewport = viewportWidth > 512 && viewportHeight > 512;
    const transformY =
      isBigViewport && isToolbarFittingOnScreenCompletely
        ? 0
        : Math.max(
            topOffset + (scrollTop <= 0 ? -scrollTopStartY - deltaY : 0),
            0,
          );
    return transformY;
  }, [
    viewportHeight,
    toolbarHeight,
    stops,
    viewportWidth,
    topOffset,
    deltaY,
    scrollTop,
    scrollTopStartY,
  ]);

  const onWindowResize = React.useCallback(() => {
    setViewportWidth(typeof window === "undefined" ? 1024 : window.innerWidth);
    setViewportHeight(typeof window === "undefined" ? 768 : window.innerHeight);
    const newTopOffset = getNearestStopForTopOffset(topOffset, stops);
    setTopOffset(newTopOffset);
  }, [topOffset, stops]);

  // Register window resize observer
  useIsomorphicLayoutEffect(() => {
    const resize = onWindowResize;
    resize();
    if (typeof window !== "undefined") {
      window.addEventListener("resize", resize);
    }
    return () => window.removeEventListener("resize", resize);
  }, [onWindowResize]);

  const onToolbarResize = React.useCallback(() => {
    const ref = scrollElementRef.current;
    if (!ref) {
      return;
    }
    if (typeof window !== "undefined") {
      // @ts-ignore
      window.scrollElement = ref;
    }
    const rects = ref.getClientRects();
    if (rects.length === 0) {
      return;
    }

    const previousClientTop = rects[0].top;
    const newTopOffset = previousClientTop + toolbarHeight - viewportHeight;
    // log.log(
    //   'Setting height',
    //   ref.clientHeight,
    //   'prev top',
    //   previousClientTop,
    //   'new offset',
    //   newTopOffset
    // );
    setToolbarHeight(ref.clientHeight);
    setTopOffset(newTopOffset);
  }, [toolbarHeight, viewportHeight]);

  // Register toolbar resize observer
  useIsomorphicLayoutEffect(() => {
    const ref = scrollElementRef.current;
    if (!ref) {
      return;
    }
    // @ts-ignore
    const resizeObserver = new (
      typeof ResizeObserver === "undefined"
        ? ResizeObserverPolyfill
        : // @ts-ignore
          ResizeObserver
    )(onToolbarResize);
    onToolbarResize();
    resizeObserver.observe(ref);
    return () => {
      resizeObserver.disconnect();
    };
  }, [onToolbarResize, scrollElementRef]);

  const ensureFullVisibility = React.useCallback(() => {
    if (isSwiping) {
      return;
    }
    // Move the toolbar to show as much of its content as possible.
    setTopOffset(0);
  }, [isSwiping]);

  useIsomorphicLayoutEffect(() => {
    if (isModal) {
      ensureFullVisibility();
    }
  }, [isModal, ensureFullVisibility]);

  const onScroll = React.useCallback(() => {
    if (scrollElementRef.current) {
      setScrollTop(scrollElementRef.current.scrollTop);
    }
  }, []);

  const handleTouchStart = React.useCallback(
    (event: React.TouchEvent<HTMLElement>) => {
      if (isModal) {
        return;
      }
      if (topOffset > 0) {
        event.preventDefault();
      }
      setTouchStartY(event.touches[0].clientY);
      if (scrollElementRef.current) {
        setScrollTopStartY(scrollElementRef.current.scrollTop);
      }
      setYSamples([]);
    },
    [isModal, topOffset],
  );

  const handleTouchEnd = React.useCallback(
    (e: React.TouchEvent<HTMLElement>) => {
      if (!isSwipeable || isModal) {
        return;
      }
      setDeltaY(0);
      setScrollTopStartY(0);
      setIsSwiping(false);
      // log.log('Touch ended at', transformY);
      const flickState = calculateFlickState(ySamples);
      if (flickState !== "noFlick" && scrollTop <= 0) {
        const newIndex = flickState === "up" ? 0 : stops.length - 1;
        setTopOffset(stops[newIndex]);
      } else {
        const newStop = getNearestStopForTopOffset(transformY, stops);
        setTopOffset(newStop);
      }
    },
    [isModal, isSwipeable, scrollTop, stops, transformY, ySamples],
  );

  const handleTouchMove = React.useCallback(
    (event: React.TouchEvent<HTMLElement>) => {
      if (isModal) {
        return;
      }
      event.stopPropagation();
      setDeltaY(touchStartY - event.touches[0].clientY);
      ySamples.unshift({ pos: event.touches[0].clientY, t: Date.now() });
      ySamples.splice(3);
      setIsSwiping(true);
      if (topOffset > 0) {
        event.preventDefault();
      }
    },
    [isModal, touchStartY, ySamples, topOffset],
  );

  const toolbarIsScrollable = React.useMemo(() => {
    if (!scrollElementRef.current) {
      return;
    }
    const scrollElementHasMoreContentThanShown =
      scrollElementRef.current.scrollHeight >
      scrollElementRef.current.clientHeight;
    const isScrollable =
      isAtTopmostPosition && scrollElementHasMoreContentThanShown;
    return isScrollable && scrollTop > 0;
  }, [isAtTopmostPosition, scrollTop]);

  const xModels = ["iPhone10,3", "iPhone10,6", "x86_64"];
  const isIphoneX =
    typeof window !== "undefined" &&
    // @ts-ignore
    window.device &&
    // @ts-ignore
    window.device.model &&
    // @ts-ignore
    includes(xModels, window.device.model);
  const classNames = [
    "toolbar",
    isIphoneX && "toolbar-iphone-x",
    hidden && "toolbar-hidden",
    isModal && "toolbar-is-modal",
    toolbarIsScrollable && "toolbar-is-scrollable",
    className,
  ];
  const filteredClassNames = classNames.filter(Boolean).join(" ");

  const mapOverlayRef = useMapOverlapRef(!hidden);
  const grabHandleButton = (
    <button
      type="button"
      style={{ transform: "translate3d(-50%, 0px, 0)" }}
      className="grab-handle"
      aria-label={
        isAtTopmostPosition ? t("Collapse details") : t("Expand details")
      }
      onClick={() => {
        if (isAtTopmostPosition) {
          const offset = stops[stops.length - 1];
          // reset scroll position
          if (scrollElementRef.current) {
            scrollElementRef.current.scrollTop = 0;
          }
          setTopOffset(offset);
        } else {
          ensureFullVisibility();
        }
      }}
    />
  );

  return (
    <Card asChild={true} size="1" variant="ghost">
      <StyledSection
        className={filteredClassNames}
        style={{
          touchAction,
          transition,
          overflowY: topOffset > 0 ? "hidden" : "auto",
          transform: `translate3d(0, ${transformY}px, 0)`,
          top:
            isModal || viewportHeight <= 512 || viewportWidth <= 512
              ? undefined
              : `calc(${minimalTopPosition || 0}px + env(safe-area-inset-top))`,
          maxHeight: getMaxHeight(
            minimalTopPosition,
            viewportWidth,
            viewportHeight,
            isModal || false,
          ),
          backgroundColor: "var(--card-background-color)",
          backdropFilter: "var(--backdrop-filter-panel)",
        }}
        ref={scrollElementRef}
        aria-hidden={inert || hidden}
        role={role}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        data-minimal-top-position={minimalTopPosition}
        data-top-offset={topOffset}
        data-dimensions-viewport-height={viewportHeight}
        data-dimensions-height={toolbarHeight}
        data-stops={stops.toString()}
        onTouchMoveCapture={handleTouchMove}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onScroll={onScroll}
      >
        <div
          style={{
            transform: `translateY(${scrollTop < 0 ? scrollTop : 0}px)`,
          }}
        >
          {isSwipeable && !isModal ? grabHandleButton : null}
          {children}
        </div>
      </StyledSection>
    </Card>
  );
}
