import { type MutableRefObject, useEffect, useMemo, useRef } from "react";
import type { Section } from "~/components/TopBar/NeedsPicker/NeedsHighlighter";
import { useNeeds } from "~/lib/useNeeds";

export type SectionRefs = Record<
  Section,
  MutableRefObject<HTMLElement | undefined>
>;
export type SectionRefSetter = (
  section: Section,
  ref: MutableRefObject<HTMLElement | undefined>,
) => void;

export function useHighlighterRefs(): {
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
