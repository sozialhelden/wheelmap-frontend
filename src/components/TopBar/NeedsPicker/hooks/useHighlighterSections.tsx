import { useMemo } from "react";
import type { Section } from "~/components/TopBar/NeedsPicker/NeedsHighlighter";
import type { NeedCategory, Needs } from "~/config/needs";
import { categories } from "~/lib/useNeeds";

export const sections: Section[] = [...categories, "buttons"];

export function useHighlighterSections({ needs }: { needs: Needs }): {
  highlightedSection: Section;
  isGivenOrNextSectionHighlighted: (section: Section) => boolean;
  sections: Section[];
} {
  const highlightedSection: Section = useMemo(() => {
    const firstSectionWithoutSelection = Object.entries(needs)
      .find(([_, value]) => !value)
      ?.shift() as NeedCategory | undefined;
    return firstSectionWithoutSelection || "buttons";
  }, [needs]);

  const getSectionPosition = (section: Section): number => {
    return sections.findIndex((s) => s === section);
  };
  const isGivenOrNextSectionHighlighted = (section: Section): boolean => {
    const sectionPosition = getSectionPosition(section);
    const highlightedSectionPosition = getSectionPosition(highlightedSection);
    return (
      sectionPosition === highlightedSectionPosition ||
      sectionPosition + 1 === highlightedSectionPosition
    );
  };

  return {
    highlightedSection,
    isGivenOrNextSectionHighlighted,
    sections,
  };
}
