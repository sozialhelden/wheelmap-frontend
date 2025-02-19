import { type MutableRefObject, useEffect, useState } from "react";

export function useCollapsableSheet({
  container,
  content,
}: {
  container: MutableRefObject<HTMLDivElement | undefined>;
  content: MutableRefObject<HTMLDivElement | undefined>;
}): {
  isExpanded: boolean;
  collapse: () => void;
  expand: () => void;
  toggle: () => void;
} {
  const [isExpanded, setIsExpanded] = useState(false);

  const getScrollPosition = () => container.current?.scrollTop ?? 0;

  const handleScrollEvent = () => {
    if (getScrollPosition() === 0) {
      setIsExpanded(false);
    }
    if (getScrollPosition() > 0 && !isExpanded) {
      setIsExpanded(true);
    }
  };

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

  useEffect(() => {
    container.current?.addEventListener("scroll", handleScrollEvent);
    return () => {
      container.current?.removeEventListener("scroll", handleScrollEvent);
    };
  }, []);

  return {
    isExpanded,
    collapse,
    expand,
    toggle,
  };
}
