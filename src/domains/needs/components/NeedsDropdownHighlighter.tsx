import { type ReactNode, type RefObject, createContext } from "react";
import styled from "styled-components";
import { useNeedsHighlighterPosition } from "~/domains/needs/components/hooks/useNeedsHighlighterPosition";
import {
  type SectionRefSetter,
  useNeedsHighlighterRefs,
} from "~/domains/needs/components/hooks/useNeedsHighlighterRefs";
import type { NeedCategory } from "~/domains/needs/needs";

const HighlighterContainer = styled.div`
  position: relative;
  overflow: hidden;
`;
const Highlight = styled.div<{ $transition: boolean }>`
  outline: 2px solid var(--accent-11);
  outline-offset: -2px;
  background: var(--accent-a2);
  position: absolute;
  width: 100%;
  z-index: -1;
  transition: ${({ $transition }) => $transition && "all 300ms ease-in-out"};
  border-radius: var(--radius-5);

  @media (max-width: 768px) {
    border-radius: var(--radius-3);
  }
`;

export type Section = NeedCategory | "buttons";

type HighlighterContext = {
  setSectionRef: SectionRefSetter;
};
export const HighlighterContext = createContext<HighlighterContext>({
  setSectionRef() {},
});

export function NeedsDropdownHighlighter({
  highlightedSection,
  showHighlightTransition,
  children,
}: {
  highlightedSection: Section;
  showHighlightTransition?: boolean;
  children: ReactNode;
}) {
  const { containerRef, sectionRefs, setSectionRef } =
    useNeedsHighlighterRefs();
  const { position, isVisible } = useNeedsHighlighterPosition({
    containerRef,
    sectionRefs,
    highlightedSection,
  });

  return (
    <HighlighterContainer ref={containerRef as RefObject<HTMLDivElement>}>
      <Highlight
        $transition={Boolean(showHighlightTransition)}
        style={{
          left: `${position.left}px`,
          top: `${position.top}px`,
          height: `${position.height}px`,
          width: `${position.width}px`,
          opacity: isVisible ? "0" : "1",
        }}
      />
      <HighlighterContext.Provider value={{ setSectionRef }}>
        {children}
      </HighlighterContext.Provider>
    </HighlighterContainer>
  );
}
