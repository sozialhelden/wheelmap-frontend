import {
  Button,
  Flex,
  Grid,
  ScrollArea,
  Theme,
  VisuallyHidden,
} from "@radix-ui/themes";
import useResizeObserver from "@react-hook/resize-observer";
import { Dialog as DialogPrimitive } from "radix-ui";
import {
  type MutableRefObject,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import styled from "styled-components";
import { t } from "ttag";
import NeedsSection from "~/components/TopBar/NeedsPicker/NeedsSection";
import NeedsIcon from "~/components/icons/actions/Needs";
import { type NeedCategory, type Needs, useNeeds } from "~/lib/useNeeds";

const NeedsButton = styled(Button)`
  max-width: 100%;
  line-height: 1.1;
`;
const NeedsIconWrapper = styled.span`
  background: var(--accent-9);
  width: 2rem;
  height: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 9999px;
  // --space-4 is the spacing used by the parent Button in size 3
  margin-right: calc((var(--space-4) - .4rem) * -1);
  flex-shrink: 0;
`;

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
  background: #fff;
  box-shadow: var(--black-a4) 0 .2rem .4rem;
  width: calc(100% - (var(--space-8) * 2));
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
const NeedsDialogContentContainer = styled.div`
  position: relative;
  overflow: hidden;
`;
const NeedsHighlight = styled.div<{ $transition: boolean }>`
  outline: 2px solid var(--accent-11);
  outline-offset: -2px;
  background: var(--accent-a2);
  position: absolute;
  width: 100%;
  z-index: -1;
  transition: ${({ $transition }) => $transition && "all 200ms ease-in-out"};
  border-radius: var(--radius-5);

  @media (max-width: 768px) {
    border-radius: var(--radius-3);
  }
`;

type Section = NeedCategory | "buttons";
type SectionRefs = Record<NeedCategory, MutableRefObject<HTMLElement>>;
type SectionHighlightPosition = {
  top: number;
  left: number;
  height: number;
  width: number;
};

export default function NeedsPicker() {
  const {
    needs: globalNeeds,
    setNeeds: setGlobalNeeds,
    categories,
  } = useNeeds();
  const [needs, setNeeds] = useState<Needs>(globalNeeds);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [shouldHighlightTransition, setShouldHighlightTransition] =
    useState(false);

  const save = () => {
    setGlobalNeeds(needs);
    setIsOpen(false);
  };
  const reset = () => {
    setNeeds(globalNeeds);
    setIsOpen(false);
  };

  const dialogContentRef = useRef<HTMLElement>();
  const buttonSectionRef = useRef<HTMLElement>();
  const sectionRefs = Object.fromEntries(
    categories.map((category) => [category, useRef()]),
  ) as SectionRefs;

  const highlightedSection: Section = useMemo(() => {
    return (
      (Object.entries(needs)
        .find(([_, value]) => !value)
        ?.shift() as NeedCategory | undefined) || "buttons"
    );
  }, [needs]);
  const highlightedSectionRef: MutableRefObject<HTMLElement | undefined> =
    useMemo(() => {
      return highlightedSection === "buttons"
        ? buttonSectionRef
        : sectionRefs[highlightedSection];
    }, [highlightedSection, sectionRefs, buttonSectionRef]);

  const [highlightPosition, setHighlightPosition] =
    useState<SectionHighlightPosition>({
      top: 0,
      height: 0,
      left: 0,
      width: 0,
    });
  const calculateHighlightPosition = () => {
    if (!isOpen || !highlightedSectionRef.current || !dialogContentRef.current)
      return;
    const { top: topOffset, left: leftOffset } =
      dialogContentRef.current.getBoundingClientRect();
    console.debug("dialog", dialogContentRef.current.getBoundingClientRect());
    const { top, left, height, width } =
      highlightedSectionRef.current.getBoundingClientRect();
    console.debug(
      "section",
      highlightedSectionRef.current,
      highlightedSectionRef.current.getBoundingClientRect(),
    );
    setHighlightPosition({
      top: top - topOffset,
      left: left - leftOffset,
      height,
      width,
    });
  };

  const sections: Section[] = [...categories, "buttons"];
  const getSectionPosition = (section: Section): number => {
    return sections.findIndex((s) => s === section);
  };
  const givenOrNextSectionIsHighlighted = (section: Section): boolean => {
    const sectionPosition = getSectionPosition(section);
    const highlightedSectionPosition = getSectionPosition(highlightedSection);
    return (
      sectionPosition === highlightedSectionPosition ||
      sectionPosition + 1 === highlightedSectionPosition
    );
  };

  useEffect(() => {
    setShouldHighlightTransition(true);
    setTimeout(() => setShouldHighlightTransition(false), 400);
    calculateHighlightPosition();
  }, [needs]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(calculateHighlightPosition, 50);
    }
  }, [isOpen]);

  useLayoutEffect(() => {
    const observer = new ResizeObserver(calculateHighlightPosition);

    if (!dialogContentRef.current) return observer.disconnect();
    observer.observe(dialogContentRef.current);

    return () => observer.disconnect();
  }, [highlightedSectionRef.current, dialogContentRef.current]);

  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={setIsOpen}>
      <DialogPrimitive.Trigger asChild>
        <NeedsButton variant="soft" size="3">
          {t`What do you need?`}
          <NeedsIconWrapper>
            <NeedsIcon />
          </NeedsIconWrapper>
        </NeedsButton>
      </DialogPrimitive.Trigger>

      <DialogPrimitive.Portal>
        <Theme>
          <NeedsDialogOverlay />
          <NeedsDialogContent>
            <ScrollArea type="auto" scrollbars="vertical">
              <NeedsDialogContentContainer ref={dialogContentRef}>
                <VisuallyHidden>
                  <DialogPrimitive.Description>
                    TODO: Description for screen readers
                  </DialogPrimitive.Description>
                </VisuallyHidden>

                <NeedsHighlight
                  $transition={shouldHighlightTransition}
                  style={{
                    left: `${highlightPosition.left}px`,
                    top: `${highlightPosition.top}px`,
                    height: `${highlightPosition.height}px`,
                    width: `${highlightPosition.width}px`,
                    opacity:
                      highlightPosition.height === 0 ||
                      highlightPosition.width === 0
                        ? "0"
                        : "1",
                  }}
                />

                <Grid columns={{ initial: "1fr", sm: "1fr 1fr max-content" }}>
                  {sections.map(
                    (section) =>
                      section !== "buttons" && (
                        <NeedsSection
                          showDivider={
                            !givenOrNextSectionIsHighlighted(section)
                          }
                          key={section}
                          category={section}
                          domRef={sectionRefs[section]}
                          value={needs[section]}
                          onValueChange={(value: string) =>
                            setNeeds({ ...needs, [section]: value })
                          }
                        />
                      ),
                  )}

                  <Theme asChild radius="medium">
                    <Flex
                      p="6"
                      gap="4"
                      align="center"
                      justify={{ initial: "between", sm: "center" }}
                      direction={{ initial: "row-reverse", sm: "column" }}
                      ref={buttonSectionRef}
                    >
                      <Button size="3" onClick={save}>
                        {t`Save`}
                      </Button>
                      <Button
                        size="2"
                        variant="soft"
                        color="gray"
                        onClick={reset}
                      >
                        {t`Cancel`}
                      </Button>
                    </Flex>
                  </Theme>
                </Grid>
              </NeedsDialogContentContainer>
            </ScrollArea>
          </NeedsDialogContent>
        </Theme>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
