import { Slot } from "radix-ui";
import { type ReactNode, type RefObject, useContext, useRef } from "react";
import { HighlighterContext, type Section } from "./NeedsDropdownHighlighter";

export function NeedsDropdownHighlighterSectionContainer({
  section,
  children,
  ...props
}: { section: Section; children: ReactNode }) {
  const { setSectionRef } = useContext(HighlighterContext);

  const ref = useRef<HTMLElement>();
  setSectionRef(section, ref);

  return (
    <Slot.Root {...props} ref={ref as RefObject<HTMLElement>}>
      {children}
    </Slot.Root>
  );
}
