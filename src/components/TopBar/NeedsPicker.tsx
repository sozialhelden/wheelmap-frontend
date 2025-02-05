import { Grid, ScrollArea, Theme, VisuallyHidden } from "@radix-ui/themes";
import { Dialog as DialogPrimitive } from "radix-ui";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { NeedsButtonSection } from "~/components/TopBar/NeedsPicker/NeedsButtonSection";
import type { NeedSelection } from "~/config/needs";
import { useNeeds } from "~/hooks/useNeeds";
import { NeedsButton } from "./NeedsPicker/NeedsButton";
import { NeedsHighlighter } from "./NeedsPicker/NeedsHighlighter";
import { NeedsHighlighterSectionContainer } from "./NeedsPicker/NeedsHighlighterSectionContainer";
import { NeedsSection } from "./NeedsPicker/NeedsSection";
import { useNeedsHighlighterSections } from "./NeedsPicker/hooks/useNeedsHighlighterSections";

const NeedsDialogOverlay = styled(DialogPrimitive.Overlay)`
  animation: showOverlay 400ms ease-out;
  background-color: var(--black-a4);
  backdrop-filter: blur(.1rem);
  position: fixed;
  inset: 0;
  @keyframes showOverlay {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;
const NeedsDialogContent = styled(DialogPrimitive.Content)`
  box-sizing: border-box;
  animation: showContent 400ms ease-out;
  position: fixed;
  top: var(--space-2);
  left: 50%;
  transform: translate(-50%, 0);
  background: var(--color-panel);
  box-shadow: var(--black-a4) 0 .2rem .4rem;
  width: calc(100% - (var(--space-8) * 2));
  max-width: 940px;
  max-height: calc(100% - (var(--space-2) * 2));
  display: flex;
  overflow: hidden;
  border-radius: var(--radius-5);
  
  @media (max-width: 768px) {
    border-radius: var(--radius-3);
  }
  @media (max-width: 1024px) {
    width: calc(100% - (var(--space-2) * 2));
  }
  @keyframes showContent {
    from {
      transform: translate(-50%, -100%);
    }
    to {
      transform: translate(-50%, 0);
    }
  }
`;

export default function NeedsPicker() {
  const { selection: globalSelection, setSelection: setGlobalSelection } =
    useNeeds();
  const [selection, setSelection] = useState<NeedSelection>(globalSelection);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { sections, highlightedSection, isGivenOrNextSectionHighlighted } =
    useNeedsHighlighterSections({ needs: selection });

  const save = () => {
    setGlobalSelection(selection);
    setIsOpen(false);
  };
  const reset = () => {
    setSelection(globalSelection);
    setIsOpen(false);
  };

  // this shows the highlight transition only shown when the needs
  // get changed
  const [showHighlightTransition, setShowHighlightTransition] =
    useState<boolean>(false);
  // biome-ignore lint/correctness/useExhaustiveDependencies:
  useEffect(() => {
    setShowHighlightTransition(true);
    setTimeout(() => setShowHighlightTransition(false), 400);
  }, [selection]);

  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={setIsOpen}>
      <DialogPrimitive.Trigger asChild>
        <NeedsButton />
      </DialogPrimitive.Trigger>

      <DialogPrimitive.Portal>
        <Theme>
          <NeedsDialogOverlay />
          <NeedsDialogContent>
            <VisuallyHidden>
              <DialogPrimitive.Title />
              <DialogPrimitive.Description>{}</DialogPrimitive.Description>
            </VisuallyHidden>

            <ScrollArea
              type="auto"
              scrollbars="vertical"
              style={{ height: "auto" }}
            >
              <NeedsHighlighter
                highlightedSection={highlightedSection}
                showHighlightTransition={showHighlightTransition}
              >
                <Grid columns={{ initial: "1fr", sm: "1fr 1fr max-content" }}>
                  {sections.map((section) => (
                    <NeedsHighlighterSectionContainer
                      section={section}
                      key={section}
                    >
                      {section === "buttons" ? (
                        <NeedsButtonSection
                          onSaveButtonClick={save}
                          onResetButtonClick={reset}
                        />
                      ) : (
                        <NeedsSection
                          category={section}
                          value={selection[section]}
                          onValueChange={(value) =>
                            setSelection({ ...selection, [section]: value })
                          }
                          showDivider={
                            !isGivenOrNextSectionHighlighted(section)
                          }
                        />
                      )}
                    </NeedsHighlighterSectionContainer>
                  ))}
                </Grid>
              </NeedsHighlighter>
            </ScrollArea>
          </NeedsDialogContent>
        </Theme>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
