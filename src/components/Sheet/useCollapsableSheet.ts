import { type MutableRefObject, useEffect, useState } from "react";

export function useCollapsableSheet({
  container,
  content,
  isExpanded: givenIsExpanded,
  onIsExpandedChanged,
}: {
  container: MutableRefObject<HTMLDivElement | undefined>;
  content: MutableRefObject<HTMLDivElement | undefined>;
  isExpanded: boolean;
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
    setIsExpanded(false);
    container.current?.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  const expand = () => {
    setIsExpanded(true);
    container.current?.scrollTo({
      top: content.current?.offsetTop,
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
    if (givenIsExpanded && !isExpanded) {
      expand();
    }
    if (!givenIsExpanded && isExpanded) {
      collapse();
    }
  }, [givenIsExpanded]);
  useEffect(() => onIsExpandedChanged?.(isExpanded), [isExpanded]);

  return {
    isExpanded,
    collapse,
    expand,
    toggle,
  };
}
