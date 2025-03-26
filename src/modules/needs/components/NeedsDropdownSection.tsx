import { QuestionMarkIcon } from "@radix-ui/react-icons";
import {
  Flex,
  IconButton,
  RadioGroup,
  Text,
  VisuallyHidden,
} from "@radix-ui/themes";
import { t } from "@transifex/native";
import { type RefObject, forwardRef, useState } from "react";
import styled from "styled-components";
import { useNeeds } from "~/modules/needs/hooks/useNeeds";
import type { NeedCategory, NeedProperties } from "~/modules/needs/needs";

const Wrapper = styled.section<{ $showDivider: boolean }>`
  padding: var(--space-5) var(--space-5) var(--space-5) var(--space-6);
  transition: border-color 400ms ease-in-out;
  @media (min-width: 769px) {
    border-right: ${({ $showDivider }) => `2px solid ${$showDivider ? "var(--gray-4)" : "transparent"};`}
  }
  @media (max-width: 768px) {
    border-bottom: ${({ $showDivider }) => `2px solid ${$showDivider ? "var(--gray-4)" : "transparent"};`}
  }
`;
const Heading = styled.h3`
  font-weight: 500;
  font-size: .95rem;
`;
const HelpText = styled(Text)<{ $isVisible: boolean }>`
  opacity: ${({ $isVisible }) => ($isVisible ? "1" : "0")};
  max-height: ${({ $isVisible }) => ($isVisible ? "10rem" : "0")};
  margin: ${({ $isVisible }) => ($isVisible ? ".25rem 0 .75rem" : "0")};
  transition: all 300ms ease;
`;

export const NeedsDropdownSection = forwardRef(function NeedsDropdownSection(
  {
    category,
    onValueChange,
    showDivider,
    value,
  }: {
    category: NeedCategory;
    onValueChange: (value: string) => void;
    showDivider?: boolean;
    value?: string;
  },
  ref,
) {
  const [isHelpExpanded, setIsHelpExpanded] = useState(false);
  const { title, needs } = useNeeds().settings[category];

  const helpTextBaseId = `needs-help-text-${category}`;
  const headingId = `needs-heading-${category}`;

  const toggleHelp = () => {
    setIsHelpExpanded(!isHelpExpanded);
  };
  const needsWithHelpText = Object.entries(needs).filter(
    ([_, { help }]: [string, NeedProperties]) => Boolean(help),
  );
  const hasHelpText = Boolean(needsWithHelpText.length);

  return (
    <Wrapper
      ref={ref as RefObject<HTMLElement>}
      $showDivider={Boolean(showDivider)}
    >
      <Flex justify="between" align="center" mb="2">
        <Heading id={headingId}>{title()}</Heading>
        {hasHelpText && (
          <Flex as="span" justify="center" width="40px" aria-hidden>
            <IconButton
              aria-label={t("Show more information about {title}", {
                title: title(),
              })}
              variant="soft"
              highContrast={true}
              color="gray"
              onClick={toggleHelp}
            >
              <QuestionMarkIcon />
            </IconButton>
          </Flex>
        )}
      </Flex>
      <Flex asChild direction="column" gap="2">
        <RadioGroup.Root
          size="3"
          onValueChange={onValueChange}
          value={value}
          aria-labelledby={headingId}
        >
          {Object.entries(needs).map(
            ([key, { label, help, icon: Icon }]: [string, NeedProperties]) => {
              return (
                <Flex direction="column" key={`${category}-${key}`}>
                  <Flex asChild gap="2" align="center">
                    <Text as="label" size="3">
                      <RadioGroup.Item
                        value={key}
                        aria-describedby={`${helpTextBaseId}-${key}`}
                      />
                      <Flex
                        as="span"
                        flexBasis="100%"
                        justify="between"
                        align="center"
                        gap="4"
                      >
                        {label()}
                        <Flex
                          as="span"
                          justify="center"
                          width="40px"
                          aria-hidden
                        >
                          {Icon && <Icon />}
                        </Flex>
                      </Flex>
                    </Text>
                  </Flex>
                  {help && (
                    <HelpText
                      size="1"
                      $isVisible={isHelpExpanded}
                      id={`${helpTextBaseId}-${key}`}
                    >
                      {help()}
                    </HelpText>
                  )}
                </Flex>
              );
            },
          )}
        </RadioGroup.Root>
      </Flex>
    </Wrapper>
  );
});
