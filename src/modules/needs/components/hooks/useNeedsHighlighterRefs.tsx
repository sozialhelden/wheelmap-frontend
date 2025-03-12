import { type MutableRefObject, useRef } from "react";
import type { Section } from "~/modules/needs/components/NeedsDropdownHighlighter";
import { useNeeds } from "~/modules/needs/hooks/useNeeds";

export type SectionRefs = Record<
  Section,
  MutableRefObject<HTMLElement | undefined>
>;
export type SectionRefSetter = (
  section: Section,
  ref: MutableRefObject<HTMLElement | undefined>,
) => void;

export function useNeedsHighlighterRefs(): {
  containerRef: MutableRefObject<HTMLElement | undefined>;
  sectionRefs: SectionRefs;
  setSectionRef: SectionRefSetter;
} {
  const { categories } = useNeeds();
  const sections = [...categories, "buttons"];

  const containerRef = useRef<HTMLElement>();
  const sectionRefs = Object.fromEntries(
    sections.map((category) => [category, useRef()]),
  ) as SectionRefs;

  const setSectionRef = (
    section: Section,
    ref: MutableRefObject<HTMLElement | undefined>,
  ) => {
    sectionRefs[section] = ref;
  };

  return {
    containerRef,
    sectionRefs,
    setSectionRef,
  };
}
