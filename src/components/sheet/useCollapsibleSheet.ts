import { type MutableRefObject, useEffect, useState } from "react";

export function useCollapsibleSheet({
  container,
  content,
  isExpanded: externalIsExpanded,
  onIsExpandedChanged,
}: {
  container: MutableRefObject<HTMLDivElement | undefined>;
  content: MutableRefObject<HTMLDivElement | undefined>;
  isExpanded?: boolean;
  onIsExpandedChanged?: (isExpanded: boolean) => void;
}): {
  isExpanded: boolean;
  collapse: () => void;
  expand: () => void;
  toggle: () => void;
} {
  const [isExpanded, setIsExpanded] = useState(false);

  const scrollPositionCloseToZero = () => {
    const position = container.current?.scrollTop ?? 0;
    const height = container.current?.getBoundingClientRect().height ?? 0;
    return position <= height * 0.1;
  };

  const handleScrollEvent = () => {
    if (scrollPositionCloseToZero()) {
      setIsExpanded(false);
    }
    if (!scrollPositionCloseToZero()) {
      setIsExpanded(true);
    }
  };

  useEffect(() => {
    container.current?.addEventListener("scroll", handleScrollEvent);
    return () => {
      container.current?.removeEventListener("scroll", handleScrollEvent);
    };
  }, []);

  const collapse = () => {
    container.current?.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  const expand = () => {
    const containerEl = container.current;
    const contentEl = content.current;
    if (!containerEl || !contentEl) return;

    // Get all ScrollStop elements (children before the content element)
    const children = Array.from(containerEl.children) as HTMLElement[];
    const contentIndex = children.indexOf(contentEl);
    const scrollStopElements = children.slice(0, contentIndex);

    // Calculate the position of the first non-zero height scroll stop
    // This is where we want to snap when expanding (e.g., the 0.5 position)
    let targetScrollTop = 0;

    for (const el of scrollStopElements) {
      const height = el.offsetHeight;
      // Skip 0-height scroll stops (like the one for position 0)
      if (height > 0) {
        targetScrollTop += height;
        break; // Stop after finding the first real scroll stop
      }
    }

    // Fallback to content top if no valid position found
    if (targetScrollTop === 0) {
      targetScrollTop = contentEl.offsetTop;
    }

    containerEl.scrollTo({
      top: targetScrollTop,
      behavior: "smooth",
    });
  };

  const toggle = () => {
    if (isExpanded) {
      collapse();
    } else {
      expand();
    }
  };

  // sync the internal state with the external once and vice versa, so
  // this component can be controlled, but also works on its own.
  useEffect(() => {
    if (externalIsExpanded && !isExpanded) {
      expand();
    }
    if (!externalIsExpanded && isExpanded) {
      collapse();
    }
  }, [externalIsExpanded]);
  useEffect(() => onIsExpandedChanged?.(isExpanded), [isExpanded]);

  return {
    isExpanded,
    collapse,
    expand,
    toggle,
  };
}
