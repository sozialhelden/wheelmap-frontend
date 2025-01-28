import { type MutableRefObject, useLayoutEffect, useState } from "react";
import type { Section } from "~/components/TopBar/NeedsPicker/NeedsHighlighter";
import type { SectionRefs } from "~/components/TopBar/NeedsPicker/hooks/useHighlighterRefs";

type HighlightPosition = {
  top: number;
  left: number;
  height: number;
  width: number;
};

export function useHighlighterPosition({
  containerRef,
  highlightedSection,
  sectionRefs,
}: {
  containerRef: MutableRefObject<HTMLElement | undefined>;
  highlightedSection: Section;
  sectionRefs: SectionRefs;
}): {
  isVisible: boolean;
  position: HighlightPosition;
} {
  const [position, setPosition] = useState<HighlightPosition>({
    top: 0,
    height: 0,
    left: 0,
    width: 0,
  });
  const isVisible = position.height === 0 || position.width === 0;

  const recalculate = () => {
    if (!containerRef.current || !sectionRefs[highlightedSection].current) {
      return;
    }
    const { top: topOffset, left: leftOffset } =
      containerRef.current.getBoundingClientRect();
    const { top, left, height, width } =
      sectionRefs[highlightedSection].current.getBoundingClientRect();
    setPosition({
      top: top - topOffset,
      left: left - leftOffset,
      height,
      width,
    });
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies:
  useLayoutEffect(() => {
    const observer = new ResizeObserver(recalculate);

    if (!containerRef.current) return observer.disconnect();
    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, [sectionRefs[highlightedSection], containerRef]);

  return {
    isVisible,
    position,
  };
}
